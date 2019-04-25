var jcf = require("jcf");
var ec2i = 
var st = 
var sg = 
var rp = 
var awssdk = 
var cfscr = 
var dns = 
var uuid = require('uuid');
var fs = require('fs');
var cfg = require( '../project.json');
const args = require('yargs').argv;
var path = require('path');
var m = require("moment");
var c = {};
if( args.uat )
  c = require('./constants')('uat','TransferTravelUAT','transfertravel');
else if( args.dev )
{
  if( args.dns )
    c = require('./constants')('dev','TransferTravelDev',args.dns);
  else
    c = require('./constants')('dev','TransferTravelDev','transfertraveldev');
}
var ud = require('./user-data')(c);
const appEnv = require('./env.js')(c);
const git = require('./git')(c);

console.log( JSON.stringify(ud,null,2) );
var cfs = st.stack();
st.description( cfs, "A Cloud Formation script to create a Transfer travel development server" );

var tt_ec2 = ec2i.instance(c.instanceName);

//configure the security for the server
var tt_sg = sg.newSG("transferTravelSG");
sg.addSshIngress( tt_sg, "0.0.0.0/0");	
sg.addHttpIngress( tt_sg, "0.0.0.0/0");	
sg.addTcpProto( tt_sg, '8000','8000', "0.0.0.0/0" ); // api server runs on port 8000!
sg.addTcpProto( tt_sg, '4200','4200', "0.0.0.0/0" ); // web server runs on port 4200!

//configure roles and policies (mostly default stuff)
var tt_role = rp.defaultRole( "TransferTravelRole");
var tt_instp = rp.instanceProfile( "TransferTravelInstanceProfile", tt_role);
var tt_policy = rp.defaultPolicy("TransferTravelPolicies", tt_role);

//.configure stack parameters
st.addParam( cfs, c.itype );
st.addParam( cfs, c.uemail );
st.addParam( cfs, c.kname);
st.addParam( cfs, c.dnsName);
st.addParam( cfs, c.apibranch );
st.addParam( cfs, c.webbranch );

var composerCFG = cfscr.quoteTextFile( './composer.json');
var sWeb = cfscr.quoteTextFile( './start_web.sh');
var sServer = cfscr.quoteTextFile( './start_server.sh');

//configure the ec2 instance we use a server
ec2i
	.addTag( tt_ec2, "Type", "UAT")
	.addTag( tt_ec2, "Name", c.instanceName)
	.addInitFile( tt_ec2, '/tmp/composer.json', composerCFG, '000644','ec2-user','ec2-user' )
	.addInitFile( tt_ec2, '/tmp/uat.env', appEnv.LaravelEnv(), '000644','ec2-user','ec2-user' )
	.addInitFile( tt_ec2, '/tmp/environment.ts', appEnv.AngularEnv(), '000644','ec2-user','ec2-user' )
	.setImage( tt_ec2, c.ami_id )
	.setKeyName(tt_ec2, c.kname)
	.setInstanceType( tt_ec2,c.itype )
	.addSecurityGroup( tt_ec2, tt_sg)
	.setInstanceProfile( tt_ec2, tt_instp)
	.setUserData( tt_ec2, ud); 

if( args.dev)
{
  ec2i.addInitFile( tt_ec2, '/home/ec2-user/start_web.sh',sWeb,'00755','ec2-user','ec2-user')
      .addInitFile( tt_ec2, '/home/ec2-user/start_api.sh',sServer,'00755','ec2-user','ec2-user')
}

var uatDns = dns.aRecord("ServerDNS",c.hzName);
dns.setName(uatDns, cfscr.joinAll('.', c.dnsName.ref, c.hzName ))
  .attachResource(uatDns, tt_ec2.attrib('PublicIp'));

var rdsSG = sg.updateSG( "TransferTravelRDS", c.rds_sg, "3306", "3306", tt_sg.attrib('GroupId'));

//configure the reesources for the stack
st.addResource( cfs, tt_ec2 )
  .addResource( cfs, tt_sg )
  .addResource( cfs, tt_role)
  .addResource( cfs, tt_instp)
  .addResource( cfs, tt_policy )
  .addResource( cfs, uatDns)
  .addResource( cfs, rdsSG );

if( args.delete)
{
  console.log( "deleteing stack");

  if( cfg.stacks[ c.stackName])
  {
    console.log( `deleting ${cfg.stacks[ c.stackName].name}`);
    awssdk.deleteStack( c.stackName, uuid.v4())
    .then( function(data)
    {
	console.log( "delete coplete");
	console.log(data);
	delete cfg.stacks[c.stackName];
        fs.writeFileSync( path.join( cfg.root,"project.json"), JSON.stringify(cfg, null, 2));
    });
  }
}
else
{
  awssdk.validate(JSON.stringify( cfs))
  .then( function(resp)
  {
    console.log( "stack validated - creating stack now");
    
    if( !args.dryRun)
    {
      var targetStack = awssdk.configureStack(JSON.stringify( cfs) , c.stackName, uuid.v4()); 
      console.log( "target stack built");
      return awssdk.build
      ( 
	targetStack, c.uatParams()
      );
    }
    else
    {
	return new Promise( function( done, fail)
	{
	  done({type:"dry-run", msg:"This was a dry un"});
	});
    }
  })
  .then( function(cfBuildData)
  {
    console.log("stack created successfully");
    console.log(cfBuildData);
    if( cfBuildData.type === "dry-run")
    {
	console.log( JSON.stringify(cfs, null, 2));
    }
    else
    {	
      console.log( "waiting for stack creted event");
      return awssdk.completed( c.stackName );
    }
  })
  .then( function( data )
  {	
	  console.log( "creation completed");
	  cfg.stacks[c.stackName] = {
	    name: c.stackName,
	    at: m(),
	    request:data,
	    git:git
	  };
	  fs.writeFileSync( path.join( cfg.root,"project.json"), JSON.stringify(cfg, null, 2));
  })
  .catch(function( err )
  {
    console.log( JSON.stringify(cfs, null, 2));
    console.log( "Stack validation failed");
    console.log( err, err.stack );
  });
}


