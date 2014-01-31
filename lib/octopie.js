var _ = require('underscore')
  , syncHooks = require('sync-hooks')
  , server = require('./server')

function Octopie(opts) {
  if (!(this instanceof Octopie)) {
    return new Octopie(opts)
  }

  // Require our auth token
  if (opts.authToken) {
    this.authToken = opts.authToken
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

  // And we need a server to listen to
  this.server = server
}

Octopie.prototype.allEvents = [
  'payload', 'push', 'commit_comment', 'create', 'delete', 'deployment',
  'deployment_status', 'download', 'follow', 'fork', 'fork_apply', 'gist',
  'gollum', 'issue_comment', 'issues', 'member', 'public', 'pull_request',
  'pull_request_review_comment', 'release', 'status', 'team_add',
  'watch'
];

Octopie.prototype.add = function(name) {
  this.repos.push(name)
  this.repos = _(this.repos).chain().sort().uniq().value()

  return this
}

Octopie.prototype.on = function(name, cb) {
  if (!_(this.allEvents).contains(name)) {
    return new Error('Not a valid event type. See `http://developer.github.com/v3/activity/events/types/` for a list of valid event types.');
  }

  // Update our internal list of events to listen to
  // and make sure that it's sorted and uniqued
  this.events.push(name)
  this.events = _.chain(this.events).concat([name]).sort().uniq().value()

  // Bind our CB to the server's GitHub event name
  this.server.on(name, cb)

  return this
}

Octopie.prototype.listen = function(port, cb) {
  if (!port) { throw new Error("Can't start listening without a port!") }

  var self = this

  function combineEvents(obj, repo) {
    obj[repo] = self.events
    return obj
  }

  syncHooks({
    // Interpolate our repos and events into a repo: [events] hash
    eventsHash: this.repos.reduce(combineEvents, {}),
    auth: { type: 'oauth', token: this.authToken },
    url: this.url
  }, function(err, results) {
    self.server.listen(port, function() {
      if (typeof cb === 'function') { cb.apply(null, arguments) }
    })
  })
}

module.exports = Octopie
