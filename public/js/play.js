var socket;
var player;
var angle;
var playState = {
  create: function() {
    console.log('making it gooo');
    socket = io();
    player = game.add.sprite(100, 100, 'player1');
    game.stage.backgroundColor = "#FFFFFF";
    player.anchor.setTo(0.114285714, 0.5);
    angle = 5;
  },
  
  
  update: function() {
    console.log('updating');
    game.input.onDown.add(click, this);
    player.angle += angle;  
  }
}

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