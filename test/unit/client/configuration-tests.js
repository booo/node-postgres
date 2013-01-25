require(__dirname+'/test-helper');

test('client settings', function() {

  test('defaults', function() {
    var client = new Client();
    assert.equal(client.connectionParameters.user, process.env['PGUSER'] || process.env.USER);
    assert.equal(client.connectionParameters.database, process.env['PGDATABASE'] || process.env.USER);
    assert.equal(client.connectionParameters.port, 5432);
  });

  test('custom', function() {
    var user = 'brian';
    var database = 'pgjstest';
    var password = 'boom';
    var client = new Client({
      user: user,
      database: database,
      port: 321,
      password: password
    });

    assert.equal(client.connectionParameters.user, user);
    assert.equal(client.connectionParameters.database, database);
    assert.equal(client.connectionParameters.port, 321);
    assert.equal(client.connectionParameters.password, password);
  });

});

test('initializing from a config string', function() {

  test('uses the correct values from the config string', function() {
    var client = new Client("pg://brian:pass@host1:333/databasename")
    assert.equal(client.connectionParameters.user, 'brian')
    assert.equal(client.connectionParameters.password, "pass")
    assert.equal(client.connectionParameters.host, "host1")
    assert.equal(client.connectionParameters.port, 333)
    assert.equal(client.connectionParameters.database, "databasename")
  })

  test('uses the correct values from the config string with space in password', function() {
    var client = new Client("pg://brian:pass word@host1:333/databasename")
    assert.equal(client.connectionParameters.user, 'brian')
    assert.equal(client.connectionParameters.password, "pass word")
    assert.equal(client.connectionParameters.host, "host1")
    assert.equal(client.connectionParameters.port, 333)
    assert.equal(client.connectionParameters.database, "databasename")
  })

  test('when not including all values the defaults are used', function() {
    var client = new Client("pg://host1")
    assert.equal(client.connectionParameters.user, process.env['PGUSER'] || process.env.USER)
    assert.equal(client.connectionParameters.password, process.env['PGPASSWORD'] || null)
    assert.equal(client.connectionParameters.host, "host1")
    assert.equal(client.connectionParameters.port, process.env['PGPORT'] || 5432)
    assert.equal(client.connectionParameters.database, process.env['PGDATABASE'] || process.env.USER)
  })


})

test('calls connect correctly on connection', function() {
  var client = new Client("/tmp");
  var usedPort = "";
  var usedHost = "";
  client.connection.stream.connect = function(port, host) {
    usedPort = port;
    usedHost = host;
  };
  client.connect();
  assert.equal(usedPort, "/tmp/.s.PGSQL.5432");
  assert.strictEqual(usedHost, undefined)
})

