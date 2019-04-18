var cfs = require('cf-scripting.js');
const path = require('path');

var serverRepo = {};

module.exports = function(c)
{
  if( c.deployType === 'dev')
  {
    return  {
      api:
      {
	  repo:"https://github.com/dave84604/jcf-test-api.git",
	  branch: "dev",
	  path: c.apiInstallDir
      },
      web:
      {
	  repo:"https://github.com/dave84604/jcf-test-web.git",
	  branch: "dev",
	  path: c.webInstallDir
      }
    }
  }
  else if( c.deploytype === 'uat')
  {
    return  {
      api:
      {
	  repo:"https://github.com/dave84604/jcf-test-api.git",
	  branch: "uat",
	  path: c.apiinstalldir
      },
      web:
      {
	  repo:"https://github.com/dave84604/jcf-test-web.git",
	  branch: "uat",
	  path: c.webinstalldir
      }
    }
  }
  else if( c.deploytype === 'prod')
  {
    return  {
      api:
      {
	  repo:"https://github.com/dave84604/jcf-test-api.git",
	  branch: "master",
	  path: c.apiinstalldir
      },
      web:
      {
	  repo:"https://github.com/dave84604/jcf-test-web.git",
	  branch: "master",
	  path: c.webinstalldir
      }
    }
  }
}
