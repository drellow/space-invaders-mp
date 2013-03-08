Space Invaders Multiplayer
=================

Multiplayer Space Invaders w/ Canvas/HTML5/WebSockets

This Javascript implementation of a space shooter (or 'shmup', if you like) uses the following technologies:

* WebSockets for server implementation. The host user sends JSON over a WebSocket each game tic. The client receives
the JSON and uses it to update the canvas. 
* Each time the client enters their control input, it is sent to the host via WebSocket. The host then interprets the
input and updates the gameState accordingly
* HTML5's Canvas for drawing the game.
* Javascript for game engine implementation
* jQuery for scoreboard and Canvas overlay.
