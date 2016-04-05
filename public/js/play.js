var socket;

var playState = {
  create: function() {
    console.log('making it gooo');
    socket = io();
  },
  
  update: function() {
    console.log('updating');
  }
}