var http = require('http')
  , server = http.createServer(requestHandler)
  , routes = {
      'GET /': function(req, res) {
        var payload = JSON.parse(req.body.payload)

        this.app.events.forEach(function(event) {
          if (event.name === payload.name) {
            event.callbacks.forEach(function(cb) {
              cb(payload)
            })
          }
        })
      },

      'GET /test': function(req, res) {
        res.end('got /test')
      },

      'POST /': function(req, res) {
        console.log(req, res)
      }
    }


function requestHandler(req, res) {
  var key = req.method.toUpperCase() + ' ' + req.url
    , handler = routes[key]

  if (handler) {
    handler(req, res)
  } else {
    res.writeHead(404);
    res.end('No route matches ' + key, 'utf8')
  }
}

module.exports = server
