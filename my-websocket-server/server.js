const WebSocket = require('ws');
const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', function connection(ws) {
  console.log('A new client connected!');
  ws.send('Welcome New Client!');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.on('close', () => {
    console.log('A client disconnected');
  });
});

console.log(`WebSocket server is running on port ${PORT}`);
