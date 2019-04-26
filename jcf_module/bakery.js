var AWS = require("aws-sdk");
var m = require('moment');
const uuid = require('uuid');
var fs = require("fs");
var path = require("path");
const ssh = require("ssh");

AWS.config.update({region:'eu-west-2'});

var cloudFormation = new AWS.CloudFormation();
var ec2 = new AWS.EC2();

//assumption is that we already have an AMI that exists, probably
//from an instances that was made and configured by hand with libraries
//etc baked in
var instanceParams = {
   ImageId: 'AMI_ID', 
   InstanceType: 't2.medium',
   MinCount: 1,
   MaxCount: 1
};

function createImage()
{
  console.log( "creating image");
}

module.exports = {
  bake : function( ami, cmds )
  {
    var pBake = JSON.parse( JSON.stringify( instanceParams ));
    pBake.ImageId = ami;
    var pr = ec2.runInstances(pBake).promise();
    pr.then( function(data)
    {
	if( !data )
	{
	  console.log( "error starting instance for bakery")
	  console.log( err );
	  process.exit();
	}
	console.log( data.Instances );
	return ec2.waitFor
	( 
		'instanceRunning',
		{'InstanceIds':[data.Instances[0].InstanceId]}
	).promise();
    })
    .then( function( data )
    {
	//instance is now started so run commands
	console.log( "waited for instance to start");
	console.log( data );
	console.log( "stopping instance");
	return ec2.stopInstances
	( 
		{'InstanceIds':[data.Reservations[0].Instances[0].InstanceId], 'DryRun':false}
	).promise();
    })
    .then( function( data )
    {
	console.log( "waited for instance to stop");
	console.log( data );
	return ec2.waitFor
	( 
		'instanceStopped',
		{'instance-id':data.StoppingInstance[0].InstanceId}
	).promise();
    })
    .then( function(data )
    {
	console.log( "instance is stopped");
	console.log( data );
	console.log( "ALL DONE");
    });
  },  
}

