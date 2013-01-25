var url = require('url');
var events = require('events');
var crypto = require('crypto');
var defaults = require(__dirname + "/defaults");

//compatibility for old nodes
if(typeof events.EventEmitter.prototype.once !== 'function') {
  events.EventEmitter.prototype.once = function (type, listener) {
    var self = this;
    self.on(type, function g () {
      self.removeListener(type, g);
      listener.apply(this, arguments);
    });
  };
}

//converts values from javascript types
//to their 'raw' counterparts for use as a postgres parameter
//note: you can override this function to provide your own conversion mechanism
//for complex types, etc...
var prepareValue = function(val) {
  if(val instanceof Date) {
    return JSON.stringify(val);
  }
  if(typeof val === 'undefined') {
    return null;
  }
  return val === null ? null : val.toString();
};

function normalizeQueryConfig (config, values, callback) {
  //can take in strings or config objects
  config = (typeof(config) == 'string') ? { text: config } : config;
  if(values) {
    if(typeof values === 'function') {
      config.callback = values;
    } else {
      config.values = values;
    }
  }
  if (callback) {
    config.callback = callback;
  }
  return config;
}

var md5 = function(string) {
  return crypto.createHash('md5').update(string).digest('hex');
};

module.exports = {
  prepareValue: prepareValue,
  normalizeQueryConfig: normalizeQueryConfig,
  md5: md5
};
