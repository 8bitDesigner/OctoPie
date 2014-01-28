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
