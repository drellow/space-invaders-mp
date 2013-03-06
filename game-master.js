(function () {
  var gameMasterSocket = new WebSocket("ws://localhost:8080");

  gameMasterSocket.onopen = function() {
    console.log("Master opened socket");
    gameMasterSocket.send("Master joined");
  }

  gameMasterSocket.onmessage = function (event) {
    console.log(event.data);
  };

})();

// https://developer.mozilla.org/en-US/docs/WebSockets/Writing_WebSocket_client_applications
// https://developer.mozilla.org/en-US/docs/WebSockets/WebSockets_reference



