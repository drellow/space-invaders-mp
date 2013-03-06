(function () {
  var gameSlaveSocket = new WebSocket("ws://localhost:8080");
  var canvas = document.getElementById('invaders');
  var ctx = canvas.getContext('2d');

  gameSlaveSocket.onopen = function(event) {
    console.log("Slave opened socket");
    gameSlaveSocket.send("Slave joined");
  };

  gameSlaveSocket.onmessage = function(event) {
    // console.log(event.data);
    // console.log(JSON.parse(event.data));
    var gameStateData = JSON.parse(event.data);
    var gameState = new InvadersGame.GameStateConstr(gameStateData);
    console.log(gameState.stars);
    var game = new InvadersGame.Game(ctx, gameState);
    game.draw();
  };

})();
