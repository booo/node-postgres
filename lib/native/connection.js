var EventEmitter = require('events').EventEmitter;
var util = require('util');

var NativeConnection = require('../../build/Release/binding').Connection;

for(var k in EventEmitter.prototype) {
 NativeConnection.prototype[k] = EventEmitter.prototype[k];
}

var Connection = function Connection(config) {
  EventEmitter.call(this);

  this.stream = config.stream;
  this.ssl = config.ssl;

  this.native = new NativeConnection();

};

util.inherits(Connection, EventEmitter);

var p = Connection.prototype;

p.connect = function connect(port, host) {
  var self = this;
  //TODO create usefull connection string
  this.native.connect('postgresql://postgres:testing@localhost:5432/postgres');

  //connect event

  this.native.on('connect', function() {
    self.emit('connect');
    //once connected we are also ready for queries as native binding
    self.emit('readyForQuery');
  });

  //error events

  this.native.on('_error', function(err) {
    error = new Error(err.message || "Unknown native driver error");
    for(var key in err) {
      error[key] = err[key];
    }

    self.emit('error', error);
  });


  //row events
  this.native.on('_row', function(row) {
    var rowDescription = { fields: [] };
    var newRow = { fields: [] };
    for(var i = 0; i < row.length; i++) {
      var col = row[i];
      rowDescription.fields.push({
        name: col.name,
        format: 'text',
        dataTypeID: col.type
      });
      newRow.fields.push(col.value);
    }
    self.emit('rowDescription', rowDescription);
    self.emit('dataRow', newRow);
    console.info('Row:',  row);
  });

  this.native.on('_cmdStatus', function(status) {
    console.info('cmdStatus:', status);
    self.emit('commandComplete', status);
  });

  this.native.on('_readyForQuery', function(){
    self.emit('readyForQuery');
  });

};

p.startup = function startup(config) {};

p.query = function query(text) {
  this.native._sendQuery(text);
};

p.end = function end() {
  this.native.end();
};

module.exports = Connection;
