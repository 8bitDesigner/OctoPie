var assert = require("assert")
  , sinon = require("sinon")
  , server = require("../lib/server")
  , emitter = server.emit

describe("Octopie's server", function() {
  beforeEach(function() { sinon.spy(server, 'emit') })
  afterEach(function() { server.emit = emitter })

  it("should cheerfully report that it's up", function () {
    var getHome = server.routes.get[0].callbacks[0] // TODO - Find a better way to do this
      , req = {}
      , res = {send: sinon.spy()}
      , next = sinon.spy()

    getHome(req, res, next)

    assert(res.send.calledWith('is all good'))
    assert(server.emit.notCalled)
    assert(next.notCalled)
  })

  it("should trigger a pair of events when it gets a GitHub hook", function () {
    var postHome = server.routes.post[0].callbacks[0] // TODO - Find a better way to do this
      , req = {
          header: function() { return 'push' },
          body: {foo: true, bar: false}
        }
      , res = {send: sinon.spy()}
      , next = sinon.spy()

    postHome(req, res, next)

    assert(res.send.calledWith('OK'))
    assert(next.notCalled)
    assert(server.emit.calledWith('push', {foo: true, bar: false}))
    assert(server.emit.calledWith('*', 'push', {foo: true, bar: false}))
  })

  it("should emit an error when a callback throws", function () {
    var postHome = server.routes.post[0].callbacks[0] // TODO - Find a better way to do this
      , req = {
          header: function() { return 'push' },
          body: {}
        }
      , res = {send: sinon.spy()}
      , next = sinon.spy()
      , errorSpy = sinon.spy()
      , pushSpy = sinon.spy()

    server.on('push', function() { throw new Error() })
    server.on('error', errorSpy)

    postHome(req, res, next)

    assert.equal(errorSpy.callCount, 1)
    assert(errorSpy.firstCall.args[0].recoverable)
    assert(res.send.calledWith('OK'))
    assert(next.notCalled)
  })
})
