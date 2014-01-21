
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
    assert.doesNotThrow(function () {
      var octopie = new Octopie({ name:'foo', authToken:'bar' });
    });
  })
});