var AWS = require("aws-sdk");
var m = require('moment');

AWS.config.update({region:'eu-west-2'});
var rds = new AWS.RDS();

var params = {
  DBInstanceIdentifier: 'jcftestdb',
  MaxRecords: 100
};

rds.describeDBInstances(params).promise()
.then( function (data )
{
  console.log( JSON.stringify(data,null,2 ) );
  console.log( " ------------------------------------");
});


