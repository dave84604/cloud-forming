var AWS = require("aws-sdk");
var m = require('moment');
const uuid = require('uuid');
var fs = require("fs");
var path = require("path");

AWS.config.update({region:'eu-west-2'});

var cloudFormation = new AWS.CloudFormation();

var defaultStackParams = {
  StackName: '', 
  Capabilities: [
    "CAPABILITY_IAM",
  ],
  ClientRequestToken: '',
  EnableTerminationProtection: false ,
  NotificationARNs: [
  ],
  OnFailure: "DELETE",
  Parameters: [
  ],
  StackPolicyBody: '{"Statement" : [{"Effect" : "Allow","Action" : "Update:Modify","Principal": "*","Resource" : "*"}]}',
  Tags: [
    {
      Key: 'CREATED_ON', /* required */
      Value: m()
    },
  ],
  TemplateBody: '',
  TimeoutInMinutes: 10
};

module.exports = function( args, stackCFG, stackVals )
{
    return {
	validate: function( jsonCF)
	{	
	      var params = {
		      TemplateBody: jsonCF
	      };
	      return cloudFormation.validateTemplate(params).promise();
	},

	configureStack: function( jsonCF, name, requestToken )
	{
	      var sp = JSON.parse( JSON.stringify( defaultStackParams ));
	      sp.StackName = name;
	      sp.ClientRequestToken = requestToken;
	      sp.TemplateBody = jsonCF;
	      return sp;
	},

	build: function( stackCFG, paramVals)
	{
	      console.log( JSON.stringify(paramVals));
	      stackCFG.Parameters = paramVals;
	      return cloudFormation.createStack( stackCFG).promise();
	},

	completed: function(name)
	{
	    return cloudFormation.waitFor('stackCreateComplete', {'StackName':name}).promise();
	}
    };
}

