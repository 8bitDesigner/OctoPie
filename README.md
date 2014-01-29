# What is this?

Octopie is allows you to automate your GitHub workflow by binding into [GitHub hooks](http://developer.github.com/v3/repos/hooks/)

## How do I use this?

First off, require Octopie into your project and boot up an instance:

``` javascript
var Octopie = require('octopie')
var myServer = new Octopie({
  url: 'https://path.to/my/server'
  authToken: '...'
})
```

Next, define repositiories you'd like to watch:

``` javascript
myServer.add('8bitDesigner/cool-new-repo')
        .add('8bitDesigner/another-repo')
```

Define events you want to receive, and your callbacks to them:

``` javascript
myServer.on('pull_request', function(event) {
  console.log('New pull request + event.action + ': ' +event.pull_request.title)
  // Logs out "New pull request opened: Name of Pull Request"
})
```

And lastly, start listening for new events:

``` javascript
myServer.listen(80, function() {
  console.log('listening on port 80')
})
```

Documentation on which GitHub events are available and what they're fired in response to can be found here: http://developer.github.com/v3/repos/hooks/

### Ocotpie options

The Octopie constructor takes an object with two properties as its only argument, eg: `new Octopie({ url: '...', token: '...' })`

#### `url`

This should be the URL of the Octopie server. The server needs to be publically accessible, as GitHub will need to reach it with its event requests.

#### `token`

This should be a GitHub auth token which will be used to log into GitHub and register hook events. Keep this secret, safe, and out of source control, as auth tokens are effectively passwords. 

You can generate an auth token for the current GitHub user here: https://github.com/settings/tokens/new

### Octopie methods

Each instance of the Octopie server has the following methods:

#### `Octopie#add('user/repo')`
Adds a repo to the list of repositiories to watch.

Usage:
``` javascript
server = new Octopie({ })
server.add('my/repository')
```

#### `Octopie#on('event', callback)`
Registers an callback to be run every time GitHub pings our server with the requested event. The callback will be run with one argument, a the JSON payload from GitHub

Usage:
``` javascript
server = new Octopie({ })
server.on('push', function(data) {
  console.log('Commits pushed!', data.commits)
})
```

#### `Octopie#listen(80)`
This causes the server to register all requested hooks with GitHub, and when the hooks are in place, starts listening for events on the given port.

Usage:
``` javascript
server = new Octopie({ })
server.listen(80)
```
