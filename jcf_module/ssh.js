var aws = require('aws-sdk');
var path = require('path');
var fs   = require('fs');
const args = require('yargs').argv;
const guid = require('uuid');
const cp = require('child_process');
const m = require("moment");
aws.config.update({region:'eu-west-2'});


module.exports = 
{
  yumCheckUpdate: function( serverKey, pubIP )
  {
    var yumUpdates = cp.execSync
    (
		/*
		  check-update uses its return code to show updates are pending this loks like an error to
		  some libraries like this one
		*/
		`ssh -tt -i ${serverKey} ec2-user@${pubIP} "yum check-update > /dev/null;if [ $? -eq 100 ]; then echo \"YES\"; else echo \"NO\"; fi"`
    ).toString().trim();
    console.log( "YUM output:"+yumUpdates+":");

    if( yumUpdates == "YES" )
	return true;
    else
	return false;
  },

  yumUpdate: function( serverKey, pubIP )
  {
    var yumUpdates = cp.execSync
    (
		`ssh -tt -i ${serverKey} ec2-user@${pubIP} "sudo yum update -y"`
    ).toString().trim();
    console.log( "YUM output:"+yumUpdates+":");
  }
}

