var pms = require("stack-params.js");

var commonCFG = 
{
  apiInstallDir : "/var/transfer_travel/api",
  webInstallDir : "/var/transfer_travel/web",
  phpComposer : function()
  {
 	return `${this.apiInstallDir}/composer.json`
  },
  apiEnvConfig : function()
  {
 	return `${this.apiInstallDir}/.env`
  },
  ami_id : "ami-049fa56b43e1089d8",
  rds_sg : 'sg-0fb42cbfb824c61dd',
  hzName: "globaluat.co.uk",
  instanceName : "TransferTravelServer",
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
		this.kname.input('transfertravel'),
		this.uemail.input('ezhumalai.ranga@globalizeme.com'),
		this.apibranch.input('feature/affiliate-tracking'),
		this.webbranch.input('feature/globalizeme-sprint-1'),
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
		this.kname.input('transfertravel'),
		this.uemail.input('david.frost@globalizeme.com'),
		this.apibranch.input('feature/affiliate-tracking'),
		this.webbranch.input('feature/globalizeme-sprint-1'),
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
		this.kname.input('transfertravel'),
		this.uemail.input('david.frost@globalizeme.com'),
		this.apibranch.input('master'),
		this.webbranch.input('master'),
		this.dnsName.input(dns)
	      ];
	    }
	}
    );
  }
}

