
var assert = require("assert")
var Octopie = require('../index.js');


describe('Octopie', function() {
  var octopie;
  it('should require a name', function () {
    assert.throws(function () {
      octopie = new Octopie();
    });
    assert.throws(function () {
      octopie = new Octopie({ name:'foo' });
    });
  });
  it('should require an auth token', function () {
    assert.doesNotThrow(function () {
      octopie = new Octopie({ name:'foo', authToken:'bar' });
    });
  });
});
