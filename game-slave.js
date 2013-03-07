(function () {
  var gameSlaveSocket = new WebSocket("ws://localhost:8080");
  var canvas = document.getElementById('invaders');
  var ctx = canvas.getContext('2d');
  var gameBG = new InvadersGame.Black(ctx);
  var updateBG = function() {
    gameBG.draw(ctx);
  }

  gameSlaveSocket.onopen = function(event) {
    console.log("Slave opened socket");
    gameSlaveSocket.send("Slave joined");
  };

  gameSlaveSocket.onmessage = function(event) {
    var gameStateData = JSON.parse(event.data);
    var gameState = new InvadersGame.GameState(gameStateData);
    var game = new InvadersGame.Game(ctx, gameState);
    updateBG();
    game.draw();
  };


  key('left', function () {
    gameSlaveSocket.send('left');
  });
  key('right', function () {
    gameSlaveSocket.send('right');
  });
  key('up', function () {
    gameSlaveSocket.send('up');
  });
  key('down', function () {
    gameSlaveSocket.send('down');
  });
  key('space', function () {
    gameSlaveSocket.send('space');
  });

})();
