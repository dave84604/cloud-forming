var pms = require("stack-params.js");

var commonCFG = 
{
  apiInstallDir : "/var/dave84604/api",
  webInstallDir : "/var/dave84604/web",
  apiEnvConfig : function()
  {
 	return `${this.apiInstallDir}/package.json`
  },
  ami_id : "ami-049fa56b43e1089d8",
  rds_sg : 'sg-0fb42cbfb824c61dd',
  hzName: "dave84604.co.uk",
  instanceName : "MainServer",
  itype : pms.param("InstanceType"),
  kname : pms.param("KeyName"),
  uemail : pms.param("UserEmail"),
  dnsName : pms.param('DNSName'),
  apibranch : pms.newParam( "APIBranch", "The git branch to checkout", "String"),
  webbranch : pms.newParam( "WEBBranch", "The git branch to checkout", "String"),


}

module.exports = function( type, sn, dns )
{
  if( type === 'dev' )
  {
    return Object.assign
    (
	commonCFG,
	{
	    deployType: type,
	    stackName : sn,
	    //configure the parameters
	    uatParams : function() 
	    {
	      return [
		this.itype.input('t2.large'),
		this.kname.input('dave84606'),
		this.uemail.input('dave84606@gmail.com'),
		this.apibranch.input('feature/uat'),
		this.webbranch.input('feature/uat'),
		this.dnsName.input(dns)
	      ];
	    }
	}
    );
  }
  else if( type === 'uat' )
  {
    return Object.assign
    (
	commonCFG,
	{
	    stackName : sn,
	    deployType: type,
	    //configure the parameters
	    uatParams : function() 
	    {
	      return [
		this.itype.input('t2.xlarge'),
		this.kname.input('dave84606'),
		this.uemail.input('david.frost@globalizeme.com'),
		this.apibranch.input('feature/uat'),
		this.webbranch.input('feature/uat'),
		this.dnsName.input(dns)
	      ];
	    }
	}
    );
  }
  else if( type === 'prod' )
  {
    return Object.assign
    (
	commonCFG,
	{
	    stackName : sn,
	    //configure the parameters
	    uatParams : function() 
	    {
	      return [
		this.itype.input('t2.xlarge'),
		this.kname.input('dave84606'),
		this.uemail.input('dave84604@gmail.com'),
		this.apibranch.input('master'),
		this.webbranch.input('master'),
		this.dnsName.input(dns)
	      ];
	    }
	}
    );
  }
}

