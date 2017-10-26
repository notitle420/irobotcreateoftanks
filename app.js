var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var $ = require('jquery');

var app = express();
const exec = require('child_process').exec;
exec('sudo /home/pi/mjpg-streamer/mjpg-streamer-experimental/mjpg_streamer -b -i "/home/pi/mjpg-streamer/mjpg-streamer-experimental/input_uvc.so -f 5 -r 320×240 -d /dev/video0 -q 50" -o "/home/pi/mjpg-streamer/mjpg-streamer-experimental/output_http.so -w /home/pi/mjpg-streamer/mjpg-streamer-experimental/www -p 15000"', (err, stdout, stderr) => {

    if (err) { console.log(err); }

    console.log(stdout);

});

//mjpg-streamerの起動

exec('sudo /home/pi/mjpg-streamer/mjpg-streamer-experimental/mjpg_streamer -b -i "/home/pi/mjpg-streamer/mjpg-streamer-experimental/input_uvc.so -f 5 -r 320×240 -d /dev/video1 -q 50" -o "/home/pi/mjpg-streamer/mjpg-streamer-experimental/output_http.so -w /home/pi/mjpg-streamer/mjpg-streamer-experimental/www -p 15001"', (err, stdout, stderr) => {

    if (err) { console.log(err); }

    console.log(stdout);

});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
