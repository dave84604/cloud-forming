var scr = require("./cf-scripting");

var skeleton = {
  "Type" : "AWS::EC2::Instance",
  "Metadata" : 
  {
    "AWS::CloudFormation::Init" : {
        "config" : {
          "packages" : {
          },
          "groups" : {
          },
          "users" : {
          },
          "sources" : {
          },
          "files" : {
          },
          "commands" : {
          },
          "services" : {
          }
        }
      }
  },
  "Properties": {
        "SecurityGroups" : [],
        "IamInstanceProfile": {},
        "KeyName" : {},
        "InstanceType" : {},
        "Tags" : [],
        "ImageId" :  "",
	"UserData": {}
  }
}

module.exports = {

  instance: function(name) {
   	var skel = JSON.parse( JSON.stringify( skeleton ));
	var resource  = {};
	resource[name] = skel;
	return {
	  val: skel,
	  res: resource,
	  ref: {"Ref": name },
	  attrib: function( attName )
	  {
		return {"Fn::GetAtt":[name, attName]};
	  }
	};
  },

  addTag: function( instance, tname, tval) {
	instance.val.Properties.Tags.push({"Key":tname, "Value": tval})
	return this;
  },
 
  addSecurityGroup( instance, sg) {
  	instance.val.Properties.SecurityGroups.push( sg.ref );
	return this;
  },
  
  setInstanceProfile( instance, p) {
  	instance.val.Properties.IamInstanceProfile = p.ref;
	return this;
  },
  
  setImage: function( instance, iid ) {	
	instance.val.Properties.ImageId = iid;
	return this;
  },

  setKeyName: function( instance, kn) {	
	instance.val.Properties.KeyName = kn.ref;
	return this;
  },

  setInstanceType: function( instance, itype) {	
	instance.val.Properties.InstanceType = itype.ref;
	return this;
  },

  setUserData: function( instance, ud) {	
	instance.val.Properties.UserData = scr.base64(scr.joinAll("", ...ud));
	return this;
  },

  addInitFile: function( instance, fName, fData, mode, owner, group )
  {
	var initFileData = scr.joinAll("", ...fData)	
	var initFile = {};

	initFile[fName] = { "content": initFileData, 'mode':mode, 'owner':owner,'group':group};

	Object.assign
	(
		instance.val.Metadata["AWS::CloudFormation::Init"].config.files,
	  	initFile
	);
	return this;
  }
}



