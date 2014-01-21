var assert = require("assert")
var Octopie = require('../index.js');

function octoFactory(name, token, url) {
  // For easy testing - preconfigured objects
  if (!name && !token && !url) {
    name = 'foo'
    token = 'bar'
    url = 'http://google.com'
  }

  return new Octopie({ name: name, authToken: token, url: url })
}

describe('Octopie', function() {
  it('should require a name, authToken, and URL', function () {
    assert.throws(function () { new Octopie(); });
    assert.throws(function () { new Octopie({ name:'foo' }); });
    assert.throws(function () { new Octopie({ name:'foo', authToken: 'bar' }); });
    assert.throws(function () { new Octopie({ authToken: 'bar', url: 'google.com' }); });

    assert.doesNotThrow(function () {
      new Octopie({ name: 'foo', authToken: 'bar', url: 'google.com' });
    });
  });

  it('should add repositories', function () {
    var octopie = octoFactory()
    octopie.add('fullscreeninc/bacon');
    assert.deepEqual(octopie.repos, ["fullscreeninc/bacon"]);
  });

  it("shouldn't allow you to add the same repo twice", function() {
    var octopie = octoFactory()
    octopie.add('fullscreeninc/bacon');
    octopie.add('fullscreeninc/bacon');
    assert.deepEqual(octopie.repos, ["fullscreeninc/bacon"]);
  })
});
