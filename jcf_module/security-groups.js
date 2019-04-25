var defaultSG = {
      "Type" : "AWS::EC2::SecurityGroup",
      "Properties" : {
        "GroupDescription" : "Enable SSH access and HTTP access on the inbound port",
        "SecurityGroupIngress" : []
      }
};
var existingSG = {
    "Type": "AWS::EC2::SecurityGroupIngress",
    "Properties" : {   
        "GroupId": "",
        "IpProtocol": "tcp",
        "FromPort": "",
        "ToPort": "",
      	"SourceSecurityGroupId": "",
    }
}

var sgProto = 
{
          "IpProtocol" : "",
          "FromPort" : "",
          "ToPort" : "",
          "CidrIp" :""
};

module.exports = 
{
	newSG: function (name) 
	{
   	  var skel = JSON.parse( JSON.stringify( defaultSG ));
	  var resource  = {};
	  resource[name] = skel;
	  return {
	    val: skel,
	    res: resource,
	    ref: {"Ref": name },
	    attrib: function( attName )
	    {
		return {"Fn::GetAtt":[name, attName]};
	    }
	  };
	},

	updateSG( name, sgId, from_port, to_port, sourceSG )
	{
   	  var skel = JSON.parse( JSON.stringify( existingSG ));
	  skel.Properties.GroupId = sgId
	  skel.Properties.FromPort = from_port;
	  skel.Properties.ToPort = to_port;
	  skel.Properties.SourceSecurityGroupId = sourceSG;
	  var resource  = {};
	  resource[name] = skel;
	  return {
	    val: skel,
	    res: resource,
	    ref: {"Ref": name }
	  };
	},

	addSshIngress: function( sg, from_cidr )
	{
	  sg.val.Properties.SecurityGroupIngress.push
	  (
	    {
              "IpProtocol" : "tcp",
              "FromPort" : "22",
              "ToPort" : "22",
              "CidrIp" : from_cidr
	    }
	  ); 
	  return this;
	},

	addHttpIngress: function( sg, from_cidr )
	{
	  sg.val.Properties.SecurityGroupIngress.push
	  (
	    {
              "IpProtocol" : "tcp",
              "FromPort" : "80",
              "ToPort" : "80",
              "CidrIp" : from_cidr
	    }
	  ); 
	  return this;
	},

	addTcpProto: function( sg, from_port, to_port, from_cidr)
	{
	  sg.val.Properties.SecurityGroupIngress.push
	  (
	    {
              "IpProtocol" : "tcp",
              "FromPort" : from_port,
              "ToPort" : to_port,
              "CidrIp" : from_cidr
	    }
	  ); 
	  return this;
	},


}

