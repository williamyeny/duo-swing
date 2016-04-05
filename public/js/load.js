var loadState = {
  preload: function() {
    game.add.text(80, 150, 'loading...', {font:'24px Arial', fill: '#FFFFFF'});
    
    //load all assets here
  },
  
  create: function(){
    game.state.start('play');
  }
}