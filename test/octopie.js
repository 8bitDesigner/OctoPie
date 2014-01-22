var assert = require("assert")
var Octopie = require('../lib/octopie');

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

  it('should be callable without using the new operator', function() {
    var withNew = new Octopie({ name: 'foo', authToken: 'bar', url: 'baz' })
    var withoutNew = Octopie({ name: 'foo', authToken: 'bar', url: 'baz' })

    assert(withNew instanceof Octopie)
    assert(withoutNew instanceof Octopie)
  })

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

  it("should allow you to create event listeners", function() {
    var octopie = octoFactory()
    fooCb = function fooCb() {}
    barCb1 = function barCb1() {}
    barCb2 = function barCb2() {}

    octopie.on('foo', fooCb);
    octopie.on('bar', barCb1);
    octopie.on('bar', barCb2);

    assert.equal(octopie.events.length, 2)
    assert.deepEqual(octopie.events[0].callbacks, [fooCb])
    assert.deepEqual(octopie.events[1].callbacks, [barCb1, barCb2])
  })
});
