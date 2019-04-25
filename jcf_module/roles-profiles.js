var defRole = {
            "Type": "AWS::IAM::Role",
            "Properties": {
                "AssumeRolePolicyDocument": {
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": {
                                "Service": [
                                    "ec2.amazonaws.com"
                                ]
                            },
                            "Action": [
                                "sts:AssumeRole"
                            ]
                        }
                    ]
                },
                "Path": "/"
            }
};

var defPolicy = {
            "Type": "AWS::IAM::Policy",
            "Properties": {
                "PolicyName": "root",
                "PolicyDocument":
                {
                    "Statement":
                    [{
                        "Effect": "Allow",
                        "Action": [
                                "cloudformation:DescribeStacks",
                                "cloudformation:DescribeStackEvents",
                                "cloudformation:DescribeStackResource",
                                "cloudformation:DescribeStackResources",
                                "cloudformation:GetTemplate",
                                "cloudformation:List*"
                        ],
                        "Resource": "*"
                    }]
                },
                "Roles": [
                ]
            }
};

var defInstanceProfile = {
            "Type": "AWS::IAM::InstanceProfile",
            "Properties": {
                "Path": "/",
                "Roles": [
                ]
            }
};

module.exports = 
{
  instanceProfile: function( name, role )
  {
        var r = JSON.parse( JSON.stringify( defInstanceProfile ));
	r.Properties.Roles.push( role.ref );
	var resource  = {};
	resource[name] = r;
	return {
	  val: r,
	  res: resource,
	  ref: {"Ref": name }
	};
	return this;
  },

  defaultPolicy: function( name,role )
  {
        var r = JSON.parse( JSON.stringify( defPolicy ));
	r.Properties.Roles.push( role.ref );
	var resource  = {};
	resource[name] = r;
	return {
	  val: r,
	  res: resource,
	  ref: {"Ref": name }
	};
	return this;
  },

  defaultRole : function(name)
  {
        var r = JSON.parse( JSON.stringify( defRole ));
	var resource  = {};
	resource[name] = r;
	return {
	  val: r,
	  res: resource,
	  ref: {"Ref": name }
	};
	
  }
};

