var socket = io();
var player, player2;
var angle;
var gameId;
var playState = {
  create: function() {
    gameId = $('#overlay').html().slice(9);
    socket.emit('join', gameId);
    player = game.add.sprite(100, 100, 'player1');
    game.stage.backgroundColor = "#FFFFFF";
    player.anchor.setTo(0.114285714, 0.5);
    angle = -5;
    socket.emit('add existing', gameId);
    game.stage.disableVisibilityChange = true;
    game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
  },
  
  update: function() {
    console.log('updating');
    game.input.onDown.add(click, this);
    player.angle += angle;
    socket.emit('update', [gameId, player.x, player.y, player.angle, player.anchor.x]);
  }
}

//when game starts check if player is already in the server
socket.on('add existing', function(add) {
  if (add) {
    player2 = game.add.sprite(100, 100, 'player2');
  }
});

//checks if another player joins, if so create a new one
socket.on('join', function(id) {
  console.log(id);
  if (id == gameId) {
    player2 = game.add.sprite(100, 100, 'player2');
  }
});

socket.on('update', function(data) {
  if (data[0] == gameId) {
    player2.x = data[1];
    player2.y = data[2];
    player2.angle = data[3];
    player2.anchor.setTo(data[4], 0.5);
  }
});

socket.on('player disconnect', function(id) {
  if (gameId == id) {
    player2.destroy();
    $('#overlay').html('other player has disconnected.');
  }
});

function click() {
  

  
  angle *= -1;
  console.log(player.angle);
  if (angle < 0) {
    
    player.x -= Math.cos(player.angle * Math.PI / 180) * 54;
    player.y -= Math.sin(player.angle * Math.PI / 180) * 54;
    player.anchor.setTo(8/70, 0.5);
  } else {
    player.x += Math.cos(player.angle * Math.PI / 180) * 54;
    player.y += Math.sin(player.angle * Math.PI / 180) * 54;
    player.anchor.setTo(1-8/70, 0.5);
  }
  
}