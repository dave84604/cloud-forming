var fs = require('fs');
var rl = require('readline')
var cfn = require( './cfn-functions.js');

module.exports = {
  joinAll : function( delim, ...joinArgs )
  {
    return cfn.Join( delim, ...joinArgs );
  },

  base64 : function( obj )
  {
    return cfn.Base64(obj);
  },

  bashScript: function() 
  {
    return "#!/bin/bash\n";
  },

  setLoginPrompt: function( p )
  {
     return cfn.Join
     ( 
	"",
	"echo \"PS1=\\\"\\u@",
	p,
	" (\\d) \\w $ \\\" \" >> /home/ec2-user/.bashrc \n"
     );
  },

  cfnInit: function(serverName)
  {
    return cfn.Join
    ( 
	"",
	" /opt/aws/bin/cfn-init -v --stack ", 
	{ "Ref" : "AWS::StackId" }, 
	` --resource ${serverName}`,
	" --region ", { "Ref" : "AWS::Region" }, 
	"\n"
    );
  },

  mkdir: function( dname )
  {
    return cfn.Join
    (
	" ",
	"mkdir -p", dname,';\n'
    );
  },

  chownDir: function( dName, uName )
  {
    return cfn.Join
    (
	"",
	"chown -R ",uName,":",uName, " ", dName,';\n'
    );
  },
  gitClone: function( gitUrl, dest )
  {
    return cfn.Join
    (
    	" ",
	"git clone",
	gitUrl,
	dest,';\n'
    )
  },

  gitCheckout: function( repoDir, gitBranch )
  {
    return cfn.Join
    (
	"",
	"cd ",repoDir,"; git checkout ", gitBranch,';\n'
    );
  },

  gitUser: function( repoDir, uName )
  {
    return cfn.Join
    (
	"",
	"cd ",repoDir, ";git config --global user.name ", uName,';\n'
    );
  },

  gitEmail: function( repoDir, uEmail )
  {
    return cfn.Join
    (
	"",
	"cd ",repoDir, ";git config --global user.email ", uEmail,';\n'
    );
  },

  appendTextFiles: function( src, dest )
  {
    return cfn.Join
    (
	" ",
	"cat",src, ">>", dest,';\n'
    );
  },

  mv: function( src, dest )
  {
    return cfn.Join
    (
	" ",
	"mv",src, dest,';\n'
    );
  },
  rm: function( fname )
  {
	return `rm -f ${fname};\n`;
  },
  rmdir: function( dname )
  {
	return `rm -rf ${dname};\n`;
  },
  ln: function( src, dest )
  {
	return `ln -s ${src} ${dest};\n`;
  },


  ngServe: function(dir)
  {
  	return cfn.Join
	(
	  "",
	  "sudo -u ec2-user bash << DONE\n",
	  "source /home/ec2-user/.bashrc\n",
	  "echo $PATH >> /home/ec2-user/startup.log\n",
	  "cd ",dir,";\\\n",
	  "nohup ng serve --disable-host-check --host $(ip -4 -o addr show dev eth0 |grep -Pom1 '(?<= inet )[0-9.]*') > /tmp/ngserve.log &\n",
	  "DONE\n"
	);
  },
  npmInstall: function( dir)
  {
  	return cfn.Join
	(
	  "",
	  "sudo -u ec2-user bash << DONE\n",
	  "source /home/ec2-user/.bashrc\n",
	  "cd ",dir,";\\\n",
	  "npm install\n",
	  "DONE\n"
	);
  },

  artisanServe: function(dir)
  {
  	return cfn.Join
	(
	  "",
	  "sudo -u ec2-user bash << DONE\n",
	  "source /home/ec2-user/.bashrc\n",
	  "echo $PATH >> /home/ec2-user/startup.log\n",
	  "cd ",dir,";\\\n",
	  "nohup ./artisan serve --host  $(ip -4 -o addr show dev eth0 |grep -Pom1 '(?<= inet )[0-9.]*') > /tmp/artisanserve.log &\n",
	  "DONE\n"
	);
  },
  logPath:function()
  {
	return "echo $PATH >> /var/log/startup.log";
  },

  quoteTextFile: function( fname )
  {
    var ret = [];
    var fdata = fs.readFileSync( fname,{'encoding':'utf8'});
    var dataArr = cfn.splitLines( fdata);
    for( var line of dataArr )
    {
 	if( line !== "")
      	  ret.push( `${line}\n`);
    }
    return ret;
  },

  resolveRefs( data, paramArr)
  {	
	var relist = [];
  	for( var param of paramArr)
	{
	  var re = {exp:new RegExp( `{{${param.name}}}`, "g"), newVal:param.replace};
	  relist.push(re);
	}
	for( var pos=0;pos < data.length;pos++ )
	{
	  var line = data[pos];
	  for( var reg of relist )
	  {
		if( reg.exp.test(line))
		{
		  var splitLine = line.split(reg.exp);
		  splitLine.splice(1,0,reg.newVal);
		  data.splice(pos,1, ...splitLine);
		}
	  }
	}
	return data;
  }
}

