var cfs = require('cf-scripting.js');
var pf = require('php-functions.js');
const path = require('path');


module.exports = function(c )
{
  const git = require('./git')(c);

  if( c.deployType === 'uat')
  {
    return [
	cfs.bashScript(),
	cfs.mkdir(c.apiInstallDir),
	cfs.mkdir(c.webInstallDir),
	cfs.cfnInit(  "TransferTravelServer"),
	cfs.gitClone( git.api.repo, git.api.path),
	cfs.gitCheckout(git.api.path, c.apibranch.ref),
	cfs.mv( '/tmp/composer.json', c.phpComposer() ),
	cfs.mv( '/tmp/uat.env', c.apiEnvConfig() ),
	pf.ComposerUpdate( c.apiInstallDir),
	cfs.mkdir( path.join(c.apiInstallDir,'storage/app')),
	cfs.ln( "/usr/local/storage", path.join(c.apiInstallDir,'storage/app/public')),
	cfs.gitClone( git.web.repo , git.web.path),
	cfs.gitCheckout(git.web.path, c.webbranch.ref),
	cfs.mv( '/tmp/environment.ts', path.join(c.webInstallDir,'/src/environments/environment.ts' )),
	cfs.chownDir(c.apiInstallDir, 'ec2-user'),
	cfs.chownDir(c.webInstallDir, 'ec2-user'),
	cfs.npmInstall(c.webInstallDir),
	cfs.ngServe(c.webInstallDir),
	cfs.artisanServe( c.apiInstallDir),
	cfs.setLoginPrompt("TransferTravel[UAT]"),
	cfs.rm( '/tmp/composer.json'),
      ]
  }
  else if( c.deployType === 'dev')
  {
    return [
	cfs.bashScript(),
	cfs.mkdir(c.apiInstallDir),
	cfs.mkdir(c.webInstallDir),
	cfs.cfnInit(  "TransferTravelServer"),
	cfs.gitClone( git.api.repo, git.api.path),
	cfs.gitCheckout(git.api.path, c.apibranch.ref),
	cfs.mv( '/tmp/composer.json', c.phpComposer() ),
	cfs.mv( '/tmp/uat.env', c.apiEnvConfig() ),
	pf.ComposerUpdate( c.apiInstallDir),
	cfs.mkdir( path.join(c.apiInstallDir,'storage/app')),
	cfs.ln( "/usr/local/storage", path.join(c.apiInstallDir,'storage/app/public')),
	cfs.gitClone( git.web.repo , git.web.path),
	cfs.gitCheckout(git.web.path, c.webbranch.ref),
	cfs.mv( '/tmp/environment.ts', path.join(c.webInstallDir,'/src/environments/environment.ts' )),
	cfs.chownDir(c.apiInstallDir, 'ec2-user'),
	cfs.chownDir(c.webInstallDir, 'ec2-user'),
	cfs.npmInstall(c.webInstallDir),
	cfs.setLoginPrompt("TransferTravel[DEV]"),
      ]
  }
  else
    console.log( "ERROR: deploy type not known: "+c.deployType);
}
