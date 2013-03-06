(function () {
  var gameSlaveSocket = new WebSocket("ws://localhost:8080");

  gameSlaveSocket.onopen = function(event) {
    console.log("Slave opened socket");
    gameSlaveSocket.send("Slave joined");
  };

  gameSlaveSocket.onmessage = function(event) {
    console.log(event.data);
    var gameState = JSON.parse(event.data);
  };

})();