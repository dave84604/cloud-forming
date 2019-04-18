var AWS = require("aws-sdk");
var m = require('moment');

AWS.config.update({region:'eu-west-2'});

var cloudFormation = new AWS.CloudFormation();

var defaultStackParams = {
  StackName: '', /* required */
  Capabilities: [
    "CAPABILITY_IAM",
  ],
  ClientRequestToken: '',
  EnableTerminationProtection: false ,
  NotificationARNs: [
  ],
  OnFailure: "DELETE",
  Parameters: [
/*
    {
      ParameterKey: 'STRING_VALUE',
      ParameterValue: 'STRING_VALUE',
      ResolvedValue: 'STRING_VALUE',
      UsePreviousValue: true || false
    },
*/
    /* more items */
  ],
//  ResourceTypes: [
//    "AWS::EC2::*"
//  ],
//  RoleARN: '',
/*
  RollbackConfiguration: {
    MonitoringTimeInMinutes: 0,
    RollbackTriggers: [
      {
        Arn: '', // required 
        Type: 'E' // required
      },
    ]
  },
*/
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

module.exports = 
{
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

  deleteStack: function(name, requestToken)
  {
	var params = {
  	  StackName: name,
  	  ClientRequestToken: requestToken,
  	  RetainResources: []
	};
	return cloudFormation.deleteStack(params).promise();
  },

  completed: function(name)
  {
      return cloudFormation.waitFor('stackCreateComplete', {'StackName':name}).promise();
  }
}

