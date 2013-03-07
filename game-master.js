(function () {
  var gameMasterSocket = new WebSocket("ws://173.255.243.230:8080");
  var canvas = document.getElementById('invaders');
  var ctx = canvas.getContext('2d');
  var gameState = new InvadersGame.GameState();
  var game = new InvadersGame.Game(ctx, gameState);
  $('.reset-button').click(function() {
    var hiscore = game.hiscore;
    game.stop();
    game = new InvadersGame.Game(ctx);
    game.hiscore = hiscore
    game.start(gameMasterSocket);
  })

  gameMasterSocket.onopen = function() {
    console.log("Master opened socket");
    gameMasterSocket.send("Master joined");
  }

  // Master must receive keystrokes, eventually!
  gameMasterSocket.onmessage = function(input) {
    game.p2Input.push(input.data);
  };

  game.start(gameMasterSocket);
})();


