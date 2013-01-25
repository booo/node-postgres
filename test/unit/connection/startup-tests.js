require(__dirname+'/test-helper');
var ConnectionParameters = require(__dirname + '/../../../lib/connection-parameters');
var Connection = require(__dirname + '/../../../lib/connection');

var params = new ConnectionParameters({ host: 'bang', port: 1234});

test('connection can take existing stream', function() {
  var stream = new MemoryStream();
  var con = new Connection(params, stream);
  assert.equal(con.stream, stream);
});

test('using closed stream', function() {
  var stream = new MemoryStream();
  stream.readyState = 'closed';
  stream.connect = function(port, host) {
    this.connectCalled = true;
    this.port = port;
    this.host = host;
  };

  var con = new Connection(params, stream);

  con.connect();

  test('makes stream connect', function() {
    assert.equal(stream.connectCalled, true);
  });

  test('uses configured port', function() {
    assert.equal(stream.port, 1234);
  });

  test('uses configured host', function() {
    assert.equal(stream.host, 'bang');
  });

  test('after stream connects client emits connected event', function() {

    var hit = false;

    con.once('connect', function() {
      hit = true;
    });

    assert.ok(stream.emit('connect'));
    assert.ok(hit);

  });
});

test('using opened stream', function() {
  var stream = new MemoryStream();
  stream.readyState = 'open';
  stream.connect = function() {
    assert.ok(false, "Should not call open");
  };
  var con = new Connection(params, stream);
  test('does not call open', function() {
    var hit = false;
    con.once('connect', function() {
      hit = true;
    });
    con.connect();
    assert.ok(hit);
  });

});
