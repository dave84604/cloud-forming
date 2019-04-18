
var defaultDNS = 
{
  "Type" : "AWS::Route53::RecordSet",
  "Properties" :
  {
      "HostedZoneName" : "",
      "Comment" : "",
      "Name" : "",
      "Type" : "",
      "TTL" : "900",
      "ResourceRecords" :
      [
      ]
  }
}

module.exports = 
{
  aRecord: function(rName, hZone)
  {
    var ret = JSON.parse(JSON.stringify(defaultDNS));
    ret.Properties.Type = 'A';
    ret.Properties.HostedZoneName = `${hZone}.`;
    var resource = {};
    resource[rName] = ret;
    return {
  	val: ret,
	ref: {"Ref":rName},
	res: resource
    };
  },
  cNameRecord: function(hZone)
  {
    var ret = JSON.parse(JSON.stringify(defaultDNS));
    ret.Properties.Type = 'CNAME';
    ret.Properties.HostedZoneName = `${hZone}.`;
    var resource = {};
    resource[rName] = ret;
    return {
  	val: ret,
	ref: {"Ref":rName},
	res: resource
    };
  },
  setName( r53, name)
  {
    r53.val.Properties.Name = name;
    return this;
  },  
  attachResource(r53, res)
  {
    r53.val.Properties.ResourceRecords.push( res);
    return this;
  }
}

