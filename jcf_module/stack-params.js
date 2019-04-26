var defaultParams = 
{
    "InstanceType" : {
      "Description" : "EC2 instance type",
      "Type" : "String",
      "Default" : "t2.medium",
      "AllowedValues" : [       "t2.nano", "t2.micro", "t2.small",
                                "t2.medium", "t2.large", "t2.xlarge","m1.small", "m1.medium",
                                "m3.large"
      ],
      "ConstraintDescription" : "must be a valid EC2 instance type."
    },
    "UserName" : {
      "Description" : "Name used to configure git",
      "Type" : "String"
    },
    "UserEmail" : {
      "Description" : "Email used to configure git",
      "Type" : "String"
    },
    "KeyName" : {
      "Description" : "Name of an existing EC2 KeyPair to enable SSH access to the instances",
      "Type" : "AWS::EC2::KeyPair::KeyName",
      "ConstraintDescription" : "must be the name of an existing EC2 KeyPair."
    },
    "DNSName": {
        "Description": "The subdomain this instance will be associated with",
        "Type": "String"
   },
    "GITBranch": {
        "Description": "The GIT branch to checkout during startup",
        "Type": "String"
   },
    "GITServer": {
        "Description": "The GIT server to pull code from during startup",
        "Type": "String"
   }
}

module.exports =  {

	newParam: function( name, desc, type ) 
	{
	  var newParam = {};
	  newParam[name] = { "Description": desc, "Type": type };
	  return {
		param : newParam,
		val: { "Description": desc, "Type": type },
		ref: {"Ref" : name },
		input: function(val) 
		{
			return {"ParameterKey":name, "ParameterValue":val, "UsePreviousValue":false}
		}
	  }
	},
  	param : function(name ) {
	  if(defaultParams.hasOwnProperty(name)) {
	    var p = defaultParams[name];
	    var resource  = {};
	    resource[name] = p;
	    
	    return {
		param : resource,
		val: p,
		ref   : {"Ref":name},
		input: function(val) 
		{
			return {"ParameterKey":name, "ParameterValue":val, "UsePreviousValue":false}
		}
	    };
          } else {
	    console.log( 'pre defined parameter ${name} doesnt exist');
	    return null;
	  }
	}
}


