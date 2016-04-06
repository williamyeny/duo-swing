var game = new Phaser.Game(window.innerWidth,window.innerHeight, Phaser.AUTO, 'canvas-container');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('play', playState);

game.state.start('boot');