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
	  repo:"ssh://gm-dave-frost@bitbucket:/transfer-travel/transfer-travel-api.git",
	  branch: "feature/affiliate-tracking",
	  path: c.apiInstallDir
      },
      web:
      {
	  repo:"ssh://gm-dave-frost@bitbucket:/transfer-travel/transfer-travel-web.git",
	  branch: "feature/globalizeme-sprint-1",
	  path: c.webInstallDir
      }
    }
  }
  else if( c.deployType === 'uat')
  {
    return  {
      api:
      {
	  repo:"ssh://gm-dave-frost@bitbucket:/transfer-travel/transfer-travel-api.git",
	  branch: "feature/affiliate-tracking",
	  path: c.apiInstallDir
      },
      web:
      {
	  repo:"ssh://gm-dave-frost@bitbucket:/transfer-travel/transfer-travel-web.git",
	  branch: "feature/globalizeme-sprint-1",
	  path: c.webInstallDir
      }
    }
  }
}
