var GitHub = require('node-github')
  , underscore = require('underscore')
  , Event = require('./event')
  , _ = underscore

function Octopie(opts) {
  // Require a name for the hooks we'll be installing
  if (opts.name) { this.name = opts.name }
  else { throw new Error('No hook name specified - we need this') }

  // Require our auth token
  if (opts.authToken) {
    this.gh = new GitHub({ version: "3.0.0" })
    this.gh.authenticate({
      type: 'oauth',
      token: opts.authToken
    })
  } else {
    throw new Error('No auth token specified')
  }

  // Require our publicly accessible URL
  if (opts.url) {
    this.url = opts.url
  } else {
    throw new Error('No public URL was specified, and we kinda need that')
  }

  // Init our list of repos and events we'll be listening to
  this.repos = []
  this.events = []
}

Octopie.prototype.add = function(name) {
  this.repos.push(name)
  this.repos = _(this.repos).chain().sort().uniq().value()

  return this
}

Octopie.prototype.on = function(name, cb) {
  var found = _(this.events).findWhere({ name: name })

  // Either reconfigure the existing event or create a new one
  if (found) { found.add(cb) }
  else { this.events.push(new Event(name, cb)) }

  return this
}

Octopie.prototype._configureHooks = function() {
  this.repos.forEach(function(repo) {
    this.events.forEach(function(event) {
      // implement this
      // this.gh.getHooks({ repo: repo }, function(err, hooks) {
      //   if (!hooks.events.includes(event.name)) {
      //     this.gh.updateHook({}, cb)
      //   } else {
      //     this.gh.createHook({}, cb)
      //   }
      // })
    })
  })
}

Octopie.prototype.listen = function(port) {
  this._configureHooks()
  this.server.listen(port)
}

module.exports = Octopie
