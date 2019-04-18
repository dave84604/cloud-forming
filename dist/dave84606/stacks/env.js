var cfs = require('cf-scripting.js');
var fs = require('fs');

module.exports = function( c )
{
  return  {
    AngularEnv: function() 
    {
      var source = cfs.quoteTextFile('./environment.ts');
      return cfs.resolveRefs
      (
	source, 
	[
	  {
	      name:'APIBase', 
	      replace: cfs.joinAll("", "http://",c.dnsName.ref,'.',c.hzName,":8000/api/v1")
	  }
	]
      );
    },
    LaravelEnv: function() 
    {
      var source = cfs.quoteTextFile('./uat.env');
      return cfs.resolveRefs
      (
	source, 
	[
	  {
	      name:'AppUrl', 
	      replace: cfs.joinAll("", "http://",c.dnsName.ref,'.',c.hzName,":4200")
	  }
	]
      );
    }
  }
}
