require 'em-websocket'

ALL_CLIENTS = []

EM.run do
  EM::WebSocket.run(:host => "localhost", :port => 8080) do |ws|
    ws.onopen do |handshake|
      ws.send("Connected to chat server");

      ALL_CLIENTS << ws
    end

    ws.onclose { ALL_CLIENTS.delete(ws) }

    ws.onmessage do |msg|
      ALL_CLIENTS.each { |ws| ws.send msg }
    end
  end
end