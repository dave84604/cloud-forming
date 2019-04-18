var cfn = require( './cfn-functions.js');

module.exports = 
{
  ComposerUpdate: function( instDir)
  {
    return cfn.Join
    (
	" ",
	"cd",instDir,";export HOME=\"/root\";export COMPOSER_HOME=\"/root/.composer\";composer update --no-scripts;\n"
    );
  },
}

