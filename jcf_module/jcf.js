
module.exports = function(params )
{
  return {
    aws: require('./aws.js'),
    scr: require('./cf-scripting.js'),
    prof: require('./roles-profiles.js'), 
    domain: require('./domains.js'), 
    fn: require('./cfn-functions.js'), 
    stack: require('./cf-stack.js'), 
    ec2: require('./ec2-instance.js'), 
    php: require('./php-functions.js'), 
    sg: require('./security-groups.js') 
  };
}

