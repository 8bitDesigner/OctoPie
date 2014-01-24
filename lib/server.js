var express = require('express')
  , app = express()

app.use(express.bodyParser());

app.post('/', function(req, res) {
  try {
    var payload = JSON.parse(req.body.payload)
      , event = req.header('x-github-event')

    console.log('Received event', event, payload)
    app.emit(event, payload)
    res.send('OK')
  } catch(e) {
    console.error(e)
    req.status(422).send('Malformed payload')
  }
})

app.get('/', function(req, res) {
  res.send('is all good')
})

module.exports = app
