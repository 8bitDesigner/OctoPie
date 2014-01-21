
var assert = require("assert")
var Octopie = require('../index.js');


describe('Octopie', function() {
  it('should require a name', function () {
    assert.throws(function () {
      var octopie = new Octopie();
    });
    assert.throws(function () {
      var octopie = new Octopie({ name:'foo' });
    });
  });
  it('should require an auth token', function () {
    assert.doesNotThrow(function () {
      var octopie = new Octopie({ name:'foo', authToken:'bar' });
    });
  });
  it('should add repositories', function () {
    var octopie = new Octopie({ name:'foo', authToken:'bar' });
    octopie.add('fullscreeninc/bacon');
    assert.deepEqual(octopie.repos, [{ "name":"fullscreeninc/bacon" }]);
  });
  // it('should add ')
});
