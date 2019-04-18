module.exports = 
{
  uat : function() {    
    //configure the parameters
    var itype = pms.param("InstanceType");
    var kname = pms.param("KeyName");
    var uemail = pms.param("UserEmail");
    var apibranch = pms.newParam( "APIBranch", "The git branch to checkout", "String");
    var webbranch = pms.newParam( "WEBBranch", "The git branch to checkout", "String");

    return {
      stackParams: function( stack )
      {
      },

      stackInputs: function ( stack ) {
      }
    }
  }
}
