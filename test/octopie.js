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

    octopie.on('pull_request', function() {});
    octopie.on('push', function() {});
    octopie.on('issues', function() {});

    assert.deepEqual(octopie.events, ["issues", "pull_request", "push"])
  })

  it("shouldn't allow you to add the same event twice", function() {
    var octopie = octoFactory()

    octopie.on('pull_request', function() {});
    octopie.on('pull_request', function() {});
    octopie.on('issues', function() {});

    assert.deepEqual(octopie.events, ['issues', 'pull_request'])
  })

  it("should keep the events array sorted alphabetically", function() {
    var octopie = octoFactory()

    octopie.on('pull_request', function() {});
    octopie.on('issues', function() {});
    octopie.on('push', function() {});

    assert.deepEqual(octopie.events, ["issues", "pull_request", "push"])
  })

  it("should bind callbacks onto the underlying server instance", function() {
    var octopie = octoFactory()
      , fn1 = function() {}
      , fn2 = function() {}
      , fn3 = function() {}

    sinon.spy(octopie.server, 'on')

    octopie.on('pull_request', fn1);
    octopie.on('issues', fn2);
    octopie.on('push', fn3);

    assert(octopie.server.on.calledWith('pull_request', fn1))
    assert(octopie.server.on.calledWith('issues', fn2))
    assert(octopie.server.on.calledWith('push', fn3))
  })
});
