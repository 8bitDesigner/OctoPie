var assert = require("assert")
  , sinon = require("sinon")

var Octopie = require('../lib/octopie');

function octoFactory(token, url) {
  // For easy testing - preconfigured objects
  if (!token && !url) {
    token = 'bar'
    url = 'http://google.com'
  }

  return new Octopie({ authToken: token, url: url })
}

describe('Octopie', function() {
  it('should require an authToken, and URL', function () {
    assert.throws(function() { new Octopie(); });
    assert.throws(function() { new Octopie({url: 'foo'}); });
    assert.throws(function() { new Octopie({authToken: 'foo'}); });

    assert.doesNotThrow(function() { new Octopie({url: 'foo', authToken: 'bar'}) })
  });

  it('should be callable without using the new operator', function() {
    var withNew = new Octopie({ authToken: 'bar', url: 'baz' })
    var withoutNew = Octopie({ authToken: 'bar', url: 'baz' })

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

  it("should keep track of the names of bound events", function() {
    var octopie = octoFactory()

    octopie.on('bar', function() {});
    octopie.on('baz', function() {});
    octopie.on('foo', function() {});

    assert.deepEqual(octopie.events, ['bar', 'baz', 'foo'])
  })

  it("shouldn't allow you to add the same event twice", function() {
    var octopie = octoFactory()

    octopie.on('bar', function() {});
    octopie.on('bar', function() {});
    octopie.on('foo', function() {});

    assert.deepEqual(octopie.events, ['bar', 'foo'])
  })

  it("should keep the events array sorted alphabetically", function() {
    var octopie = octoFactory()

    octopie.on('bar', function() {});
    octopie.on('foo', function() {});
    octopie.on('baz', function() {});

    assert.deepEqual(octopie.events, ['bar', 'baz', 'foo'])
  })

  it("should bind callbacks onto the underlying server instance", function() {
    var octopie = octoFactory()
      , fn1 = function() {}
      , fn2 = function() {}
      , fn3 = function() {}

    sinon.spy(octopie.server, 'on')

    octopie.on('bar', fn1);
    octopie.on('foo', fn2);
    octopie.on('baz', fn3);

    assert(octopie.server.on.calledWith('bar', fn1))
    assert(octopie.server.on.calledWith('foo', fn2))
    assert(octopie.server.on.calledWith('baz', fn3))
  })

  it('should configure hooks', function () {
    var octopie = octoFactory();
    octopie.add('fullscreeninc/bacon');
    octopie._configureHooks();
  });
});
