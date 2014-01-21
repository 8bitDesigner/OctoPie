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
    var cb1 = function() {}
    var foo = new Event('foo', cb1)

    console.log('my callbacks', foo.callbacks)
    assert.equal(foo.callbacks[0], cb1)
  })
})
