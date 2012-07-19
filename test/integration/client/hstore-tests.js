var helper = require(__dirname + "/test-helper");
var pg = helper.pg;

test('parsing hstore results', function() {
  pg.connect(helper.config, assert.calls(function(err, client){
    assert.isNull(err);

    test('no escape characters and single hstore', function() {
      var statement = "SELECT * FROM hstore('key', 'value')";
      client.query(statement, assert.success(function(result){
        assert.deepEqual(result.rows[0].hstore, {'key': 'value'});
      }));
    });

    test('no escape characters and multiple hstores', function() {
      var statement = "SELECT * FROM " +
        "hstore(ARRAY['key', 'value', 'key1', 'value1', 'key2', 'value2'])";
      client.query(statement, assert.success(function(result){
        var expected = {
          key: 'value',
          key1: 'value1',
          key2: 'value2'
        };
        assert.deepEqual(result.rows[0].hstore, expected);
      }));
    });

    test('escape characters and multiple hstores', function() {
      var statement = "SELECT * FROM " +
        "hstore(ARRAY['\"', '\\', '\"\\', 'fakekey\"=>\"fakevalue', " +
        "'\'\'', 'fo o'])";
      client.query(statement, assert.success(function(result){
        var expected = {
          '"': '\\',
          '"\\': 'fakekey\"=>\"fakevalue',
          '\'': 'fo o'
        };
        assert.deepEqual(result.rows[0].hstore, expected);
      }));
    });

    pg.end();


  }));
});
