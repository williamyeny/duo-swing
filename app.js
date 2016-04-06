var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();


//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

var servers = [];
var players = [];

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
  for (i = 0; i < servers.length; i++) {
    if (servers[i].players < 2) {
      id = servers[i].id;
      res.redirect('/game/' + id);
    }
  }
  id = Math.floor(Math.random()*90000) + 10000;
  servers.push({id:id, players:0, private:false});
  res.redirect('/game/' + id);
});

app.get('/game/:id', function(req, res) {
  var id = parseInt(req.params.id);
  for (i = 0; i < servers.length; i++) {
    if (servers[i].id == id) {
      if (servers[i].players < 2) {
        servers[i].players++;
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

var http = require('http').createServer(app);  
var io = require('socket.io')(http);

io.on('connection', function(client) {
  console.log('Client connected...');
  
  client.on('join', function(gameId) {
    players.push({id: client.id, gameId: gameId})
    client.broadcast.emit('join', gameId);
  });
  
  client.on('update', function(data) {
    client.broadcast.emit('update', data);
  });
  
  client.on('add existing', function(id) {
    for (i = 0; i < servers.length; i++) {
      if (servers[i].id == id) {
        if (servers[i].players == 2) {
          client.emit('add existing', true);
        }
        break;
      }
    }
  });
  
  client.on('disconnect', function(data) {
    for (i = 0; i < players.length; i++) {
      if (players[i].id == client.id) {
        //remove player
        var gameId = players[i].gameId;
        players.slice(i, 1);
        
        console.log('player disconnected, game ID: ' + gameId);
        //alert other player of disconnect
        client.broadcast.emit('player disconnect', gameId);
        break;
        
      }
      
    }
  });

});

http.listen(3000); 
console.log('Listening...');

module.exports = app;