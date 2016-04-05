var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var server = [];

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);
//app.use('/play', require('./routes/play'));
app.get('/', function(req, res, next) {
  res.render('index');
});

app.get('/play', function(req, res, next) {
  var id;
  for (i = 0; i < server.length; i++) {
    if (server[i].players < 2) {
      id = server[i].id;
      res.redirect('/game/' + id);
    }
  }
  id = Math.floor(Math.random()*90000) + 10000;
  server.push({id:id, players:0, private:false});
  res.redirect('/game/' + id);
});

app.get('/game/:id', function(req, res) {
  var id = parseInt(req.params.id);
  for (i = 0; i < server.length; i++) {
    if (server[i].id == id) {
      if (server[i].players < 2) {
        server[i].players++;
        res.render('game', { id: id });
      }
    }
  }
  res.redirect('/');
});

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