var io = require('bin/www');

io.on('connection', function(client) {
  console.log('Client connected...');

  client.on('join', function(data) {
      console.log(data);
  });

});

console.log('test')