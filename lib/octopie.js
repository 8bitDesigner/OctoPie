var GitHub = require('node-github')
  , underscore = require('underscore')
  , Event = require('./event')
  , server = require('./server')
  , _ = underscore
  , async = require('async')

function Octopie(opts) {
  if (!(this instanceof Octopie)) {
    return new Octopie(opts)
  }

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

  // And we need a server to listen to
  this.server = server
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
  var _this = this;

  // Each repo at `this.repos` specifies a user name and repo name we must configure.
  // Each event at `this.events` specifies an event type that should be attached to each hook.
  
  // To configure our hooks, we must get the hooks for each repo.
  // If there are no hooks for a repo, we must create them.
  // Filter the hooks by `this.url` to get our hook.
  // If there are events in `this.events` that are not on our hook, 
  // then we must update our hook with the missing events.

  async.map(_this.repos, function(repo, cb) {
    console.log('each repo:\n', repo);
    strs = repo.split('/');

    var options = {
      user: strs[0]
      , repo: strs[1]
    };
    console.log('marker: options:\n', options);
    _this.gh.repos.getHooks(options, function(err, hooks) {
      console.error('error:', err);
      if (err)
        return cb(err);

      var ourHook = hooks.filter(function (hook) {
        return (hook.config.url === this.url);
      }).pop();

      var ourHookEvents = ourHook.events;
      if (!_(this.events).isEqual(ourHookEvents)) {
        var msg = {
          user:
          , repo: repo
          , id: ourHook.id
          , name: ourHook.web
          , config: ourHook.config
          , events: this.events
        }
        this.gh.updateHook(msg, function(err, res) {
          if (err)
            return cb(err);

          console.log('updateHook events: res:\n', res);
        });
      }

      console.log('hooks:', hooks);
      cb(null, hooks);
    });
  }, function(err, results) {
    console.log('done: arguments:\n', JSON.stringify(arguments, null, 2));
  });
}

Octopie.prototype._registerListeners = function() {
  var all = [] // List of every possible event hook

  this.events.forEach(function(event) {
    var eventName = (event.name === '*') ? all.join(' ') : event.name
    event.callbacks.forEach(function(cb) { self.server.on(eventName, cb) })
  })
}

Octopie.prototype.listen = function(port) {
  if (!port) { throw new Error("Can't start listening without a port!") }

  var self = this

  this._configureHooks()
  // this._registerListeners()

  this.server.listen(port)
  console.log('Now listening on port', port)
}

module.exports = Octopie
