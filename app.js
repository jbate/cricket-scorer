
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var fs = require('fs');
var mongoose = require('mongoose');

var app = express();
app.locals.moment = require('moment');

// express settings
require('./config/express')(app);

// Bootstrap db connection
// Connect to mongodb
var connect = function () {
  var location = 'mongodb://localhost:27017/cricket-scorer';
  var options = { server: { socketOptions: { keepAlive: 1 } } }
  mongoose.connect(location, options);
}
connect();

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err);
})

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  connect();
})

// Bootstrap models
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
});


// Bootstrap routes
require('./routes/teams')(app);
require('./routes/scorecard')(app);
require('./routes/admin')(app);
require('./routes/player')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// expose app
exports = module.exports = app;
