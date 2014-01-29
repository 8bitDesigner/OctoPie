var express = require('express')
  , app = express()

app.use(express.bodyParser());

app.post('/', function(req, res) {
  var event = req.header('x-github-event')
  app.emit(event, req.body)
  app.emit('*', event, req.body) // Synthetic event to catch all GH hooks
  res.send('OK')
})

app.get('/', function(req, res) {
  res.send('is all good')
})

module.exports = app
