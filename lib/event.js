var underscore = require('underscore')
  , _ = underscore

function Event(name, callbacks) {
  this.name = name
  this.callbacks = []
  if (callbacks) { this.add(callbacks) }
}

Event.prototype.add = function(callbacks) {
  // Coerce to array
  var cbs = _(callbacks).isArray() ? callbacks : [callbacks]

  // Strip out things that aren't functions
  cbs = cbs.filter(function(fn) { return _(fn).isFunction() })

  // Reassign the combined list of arrays
  this.callbacks = this.callbacks.concat(cbs)
}


module.exports = Event
