var ec2i = require("../../lib/ec2-instance.js");
var pms = require("../../lib/stack-params.js");
var st = require("../../lib/cf-stack.js");
var sg = require("../../lib/security-groups.js");
var rp = require("../../lib/roles-profiles.js");
var awssdk = require('../../lib/aws.js');
var uuid = require('uuid');
var fs = require('fs');
var fh = require('../../lib/cf-scripting.js');

var params = process.argv;

var ami_id = "ami-087a01f9fea74819b";

var cfs = st.stack();
st.description( cfs, "A Cloud Formation script to create a Transfer travel development server" );

var tt_ec2 = ec2i.instance("TransferTravelServer");

//create user data
var userData = [];

userData.push
(
  fh.bashScript(),
  fh.setLoginPrompt("TransferTravel[dev]"),
  fh.cfnInit(  "TransferTravelServer")
);

console.log( JSON.stringify( userData, null,2)); 

//configure the parameters
var itype = pms.param("InstanceType");
var kname = pms.param("KeyName");
var uemail = pms.param("UserEmail");
var webrepo = pms.newParam( "BucketWeb", "The bitbucket repo containing the transfer travel web app", "String");
var apirepo = pms.newParam( "BucketAPI", "The bitbucket repo containing the transfer travel API server", "String");

//configure the security for the server
var tt_sg = sg.newSG("transferTravelSG");
sg.addSshIngress( tt_sg, "0.0.0.0/0");	
sg.addHttpIngress( tt_sg, "0.0.0.0/0");	

//configure roles and policies (mostly default stuff)
var tt_role = rp.defaultRole( "TransferTravelRole");
var tt_instp = rp.instanceProfile( "TransferTravelInstanceProfile", tt_role);
var tt_policy = rp.defaultPolicy("TransferTravelPolicies", tt_role);

//.configure stack parameters
st.addParam( cfs, itype );
st.addParam( cfs, uemail );
st.addParam( cfs, kname);
st.addParam( cfs, webrepo );
st.addParam( cfs, apirepo );

//configure the ec2 instance we use a server
ec2i
	.addTag( tt_ec2, "Name", "TramsferTravel")
	.addTag( tt_ec2, "Type", "Development")
	.setImage( tt_ec2, ami_id )
	.setKeyName(tt_ec2, kname)
	.setInstanceType( tt_ec2,itype )
	.addSecurityGroup( tt_ec2, tt_sg)
	.setInstanceProfile( tt_ec2, tt_instp)
	.setUserData( tt_ec2, userData); 

console.log( JSON.stringify(ec2i,null,2));
//configure the reesources for the stack
st.addResource( cfs, tt_ec2 )
  .addResource( cfs, tt_sg )
  .addResource( cfs, tt_role)
  .addResource( cfs, tt_instp)
  .addResource( cfs, tt_policy );


awssdk.validate
(
  JSON.stringify( cfs),
  function( err )
  {
    console.log( "Stack validation failed");
    console.log( err, err.stack );
	console.log( JSON.stringify( cfs, null, 2 ));
  },
  function( data, stackBody )
  {
    console.log( "stack validated - creating stack now");
    console.log(data);
	
	console.log( JSON.stringify( cfs, null, 2 ));
    
    var targetStack = awssdk.configureStack( stackBody, "TransferTravelDevStack", uuid.v4()); 
    awssdk.build
    ( 
	targetStack, 
	[
		itype.input('t2.micro'),
		kname.input('transfertravel'),
		uemail.input('david.frost@globalizeme.com'),
		webrepo.input('this is a test'),
		apirepo.input('this is a test')
	]
    );
  }
);

