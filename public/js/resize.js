$(window).resize(function(evt) {
  $('canvas').attr('width', innerWidth);
  $('canvas').attr('height', innerHeight);
  console.log(innerWidth + " " + innerHeight);
});