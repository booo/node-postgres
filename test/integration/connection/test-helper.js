var net = require('net');
var helper = require(__dirname + '/../test-helper');
var Connection = require(__dirname + '/../../../lib/connection');
var ConnectionParameters = require(__dirname + '/../../../lib/connection-parameters');
var md5 = require(__dirname + '/../../../lib/utils').md5;
var connect = function(callback) {
  var params = new ConnectionParameters(helper.config);
  var con = new Connection(params);
  con.on('error', function(error){
    console.log(error);
    throw new Error("Connection error");
  });
  con.connect();
  con.once('connect', function() {
    con.once('readyForQuery', function() {
      con.query('create temp table ids(id integer)');
      con.once('readyForQuery', function() {
        con.query('insert into ids(id) values(1); insert into ids(id) values(2);');
        con.once('readyForQuery', function() {
          callback(con);
        });
      });
    });
  });
};

module.exports = {
  connect: connect
};
