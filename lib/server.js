var express = require('express')
  , app = express()
  , Warning = require('./warning')

app.use(express.bodyParser());

app.post('/', function(req, res) {
  var event = req.header('x-github-event')

  try {
    app.emit(event, req.body)
    app.emit('*', event, req.body) // Synthetic event to catch all GH hooks
  } catch(e) {
    e.recoverable = true
    app.emit('error', e)
  }

  res.send('OK')
})

app.get('/', function(req, res) {
  res.send('is all good')
})

module.exports = app
