var GitHub = require('github')
  , underscore = require('underscore')
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
  var repo = { name: name }
    , found = this._find('repo', name)

  if (!found) { this.repos.push(repo) }

  return this
}

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
