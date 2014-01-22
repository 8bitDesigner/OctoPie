var http = require('http')
  , server = http.createServer(requestHandler)

module.exports = server

var routes = {
  'GET /': function(req, res) {
    res.end('got /')
  },

  'GET /test': function(req, res) {
    res.end('got /test')
  }
}

function requestHandler(req, res) {
  var key = req.method.toUpperCase() + ' ' + req.url
    , handler = routes[key]

  if (handler) {
    handler(req, res)
  } else {
    res.writeHead(404);
    res.end('No route matches', key)
  }
}
