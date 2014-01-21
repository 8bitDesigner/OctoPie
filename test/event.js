var Event = require('../lib/event')
  , assert = require('assert')

describe('Our event object', function() {
  it('should have a name', function() {
    var foo = new Event('foo')
    assert.equal(foo.name, 'foo')

    var bar = new Event('bar')
    assert.equal(bar.name, 'bar')
  })

  it('should have a list of callbacks', function() {
    var foo = new Event('foo')
    assert.deepEqual(foo.callbacks, [])
  })

  it('should accept single callbacks and arrays of callbacks', function() {
    var cb = function() {}
    var foo = new Event('foo', cb)
    assert.equal(foo.callbacks[0], cb)

    var cbs = [function() {}, function() {}]
    var bar = new Event('bar', cbs)
    assert.equal(bar.callbacks[0], cbs[0])
    assert.equal(bar.callbacks[1], cbs[1])
  })

  it("should strip out non-functioney things", function() {
    var cbs = ['bacon', function() {}]
    var foo = new Event('foo', cbs)

    assert.equal(foo.callbacks[0], cbs[1])
    assert.equal(foo.callbacks[1], undefined)
  })
})
