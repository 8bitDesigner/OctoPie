var GitHub = require('node-github')
  , underscore = require('underscore')
  , server = require('./server')
  , _ = underscore
  , async = require('async')

function Octopie(opts) {
  if (!(this instanceof Octopie)) {
    return new Octopie(opts)
  }

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

Octopie.prototype.allEvents = [
  'payload',
  'push',
  'commit_comment',
  'create',
  'delete',
  'deployment',
  'deployment_status',
  'download',
  'follow',
  'fork',
  'fork_apply',
  'gist',
  'gollum',
  'issue_comment',
  'issues',
  'member',
  'public',
  'pull_request',
  'pull_request_review_comment',
  'push',
  'release',
  'status',
  'team_add',
  'watch'
];

Octopie.prototype.add = function(name) {
  this.repos.push(name)
  this.repos = _(this.repos).chain().sort().uniq().value()

  return this
}

Octopie.prototype.on = function(name, cb) {
  // Update our internal list of events to listen to
  // and make sure that it's sorted and uniqued
  this.events.push = name
  this.events = _.chain(this.events).concat([name]).sort().uniq().value()

  // Bind our CB to the server's GitHub event name
  this.server.on(name, cb)

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

      console.log('hooks: hooks:\n', hooks);

      var ourHook = hooks.filter(function (hook) {
        return (hook.config.url === _this.url);
      }).pop();

      var mustUpdateHook = false;
      var doneUpdatingHook = function doneUpdatingHook (hook) {
        console.log('doneUpdatingHook: hook:\n', hook);
        cb(null, hook);
      };

      if (ourHook) {
        // We have a hook already.
        var ourHookEvents = ourHook.events;
        if (!_(_this.events).isEqual(ourHookEvents)) {
          // We must update our hook's events.
          mustUpdateHook = true;
          var events = _(_this.events).pluck('name');
          console.log(': events:\n', events);
          var msg = {
            user: strs[0]
            , repo: strs[1]
            , id: ourHook.id
            , name: ourHook.name
            , config: ourHook.config
            , events: events
          };
          console.log('updating hook with msg: msg:\n', msg);
          _this.gh.repos.updateHook(msg, function(err, hook) {
            if (err)
              console.error(err);

            console.log('updateHook: hook:\n', hook);
            doneUpdatingHook(hook);
          });
        }
      }
      else {
        // If we don't have a hook of our own,
        // we should create it.
        mustUpdateHook = true;
        var events = _(_this.events).pluck('name');
        _this.gh.repos.createHook({
          user: strs[0],
          repo: strs[1],
          name: 'web',
          events: events,
          config: {
            url: _this.url,
            content_type: 'json',
            insecure_ssl: '1'
          }
        }, function(err, hook) {
          if (err)
            console.error(err);

          console.log('createHook: hook:\n', hook);
          doneUpdatingHook(hook);
        });
      }

      if (!mustUpdateHook) {
        // We don't have to update our hook.
        // Call back immediately.
        console.log('ourHook:', ourHook);
        cb(null, ourHook);
      }
    });
  }, function(err, results) {
    console.log('done iterating over repos: arguments:\n', JSON.stringify(arguments, null, 2));
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
