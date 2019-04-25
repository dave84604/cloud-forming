var m = require("moment");

var skeleton = {
	"Description" : "",
	"Parameters" : {
  	},
	"Resources":{
	},
	"Outputs" : {
	}
}

module.exports = 
{
  stack: function(desc) 
  {
    return JSON.parse( JSON.stringify( skeleton ));
  },

  addParam: function( s, p) 
  {
	Object.assign(s.Parameters, p.param);
	return this;
  },
 
  description( s, d) 
  {
	s.Description = d;
	return this;
  },
 
  addResource: function(s, r ) 
  {
	Object.assign(s.Resources,r.res );
	return this;
  },
}



