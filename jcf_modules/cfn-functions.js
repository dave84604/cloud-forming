
function Attribute(target, attrib)
{
    return {"Fn::GetAtt": [target, attrib ]}
}


module.exports = 
{
  Join: function( delim, ...joinArgs )
  {
    return {
	  "Fn::Join" : 
	  [
	    delim, joinArgs
	  ]
    };
  },

  Base64: function( data )
  {
    return {
	  "Fn::Base64" : data
    };
  },

  instancePublicIP: function( iName )
  {
    return Attribute(iName, "PublicIp");
  },

  instancePrivateIP: function( iName )
  {
    return Attribute(iName, "PrivateIp");
  },

  instancePublicDNS: function( iName )
  {
    return Attribute(iName, "PublicDnsName");
  },

  instancePrivateDNS: function( iName )
  {
    return Attribute(iName, "PrivateDnsName");
  },

  escapeDoubleQuotes: function(str) 
  {
	return str.replace(/\\([\s\S])|(")/g,"\\$1$2");
  },

  regExpEscape: function(literal_string) {
    return literal_string.replace(/\//,"\\/");
  },

  splitLines: function(t) 
  {    
	return t.split(/\r\n|\r|\n/); 
  }
}

