#!/usr/bin/env node
var aws = require('aws-sdk');
var path = require('path');
var fs   = require('fs');
const args = require('yargs').argv;
const guid = require('uuid');
const jcf = require( "./jcf");
const cp = require('child_process');
const m = require("moment");
aws.config.update({region:'eu-west-2'});
const cf = new aws.CloudFormation();
const ec2 = new aws.EC2();

module.exports = 
{
  instance: function( stackName, instanceName, cb )
  {
    var p = cf.describeStackResources({'StackName':stackName}).promise();
    p.then( function(data)
    {
      var ids = [];
      for( var res of data.StackResources )
      {
	if( res.ResourceType == 'AWS::EC2::Instance')
	{
	    console.log(res.PhysicalResourceId);
	    ids.push( res.PhysicalResourceId );
	}
      }
      return ec2.describeInstances( {'InstanceIds':ids} ).promise();
    })
    .then( function( data)
    {
      for( var inst of data.Reservations[0].Instances)
      {
	var idTag = inst.Tags.find( (tag) => tag.Key === 'aws:cloudformation:logical-id');
	var stackTag = inst.Tags.find( (tag) => tag.Key === 'aws:cloudformation:stack-name');
	console.log( JSON.stringify(inst, null, 2 ));
	if( idTag.Value == instanceName )
	  cb( inst, idTag.Value, stackTag.value );
      }
    });
  },
  each: function(stackName, cb )
  {
    var p = cf.describeStackResources({'StackName':stackName}).promise();
    p.then( function(data)
    {
      var ids = [];
      for( var res of data.StackResources )
      {
	if( res.ResourceType == 'AWS::EC2::Instance')
	{
	    console.log(res.PhysicalResourceId);
	    ids.push( res.PhysicalResourceId );
	}
      }
      return ec2.describeInstances( {'InstanceIds':ids} ).promise();
    })
    .then( function( data)
    {
      for( var inst of data.Reservations[0].Instances)
      {
	var idTag = inst.Tags.find( (tag) => tag.Key === 'aws:cloudformation:logical-id');
	var stackTag = inst.Tags.find( (tag) => tag.Key === 'aws:cloudformation:stack-name');
	return cb(inst, idTag.Value, stackTag.Value);
      }
    });
  }
}


