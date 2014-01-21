var GitHub = require('node-github')
  , underscore = require('underscore')
  , Event = require('./lib/event')
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

Octopie.prototype._find = function(type, name) {
  if (typeof this[type] !== 'undefined') {
    return _(this[type]).findWhere({name: name})
  }
}

Octopie.prototype.add = function(name) {
  this.repos.push(name)
  this.repos = _(this.repos).chain().sort().uniq()

  return this
}

Octopie.prototype.on = function(name, cb) {
  var found = this._find('event', name)

  // If found, add our events to the callback queue
  if (found) { event.add(cb) }
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
}

module.exports = Octopie

/*
server = require('octopod')({
  name: 'Octopod',
  auth: {
    type: 'basic',
    username: '',
    password: ''
    // or
    type: 'authtoken',
    token: '....'
  }
})

server.add('user/repo')    // Add a project to install hooks on
server.on('eventname', callback) // Add a hook to install on
server.on('pull_request', function(event) {
  tp(...).addComment('in pull request, url: ', event.url)
  tp(event.branch.name).markAs('pullRequest')
})
server.listen(port)

server._find(thing, search) {
  return _(this[thing]).findWhere(search)
}

server._findRepo(repo) {
  return this._find('repo', {name: repo})
}

server.findEvent(event) {
  return this._find('event', {name: event})
}

server.add = function(name) {
  var repo = this._findRepo(name)
  if (!repo) {
    this._repos.push({name: repo, events: []})
  }
}

server.on = function(event, callback) {
  var event = this._findEvent(event)
  if (event) {
    event.hooks.push(callback)
  } else {
    this._events.push({name: event, hooks: [callback]})
  }
}

server.post('/hooks', function(req, res) {

})

server.get('/hooks/test', function(req, res) {

})

*/
