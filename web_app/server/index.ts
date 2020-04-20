import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import {Message} from './message';
import {ExtWebSocket} from './extWebSocket';

const app = express();
app.use(express.json());
const PORT = 8080;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/subscribe' });
wss.on('connection', (ws: ExtWebSocket) => {
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });
  console.log(`Client connected (${wss.clients.size})`);
  ws.send('Connected.');
  ws.on('close', () => {
    console.log(`Client closed (${wss.clients.size})`);
  });
});
setInterval(() => {
  wss.clients.forEach((ws: WebSocket) => {
    if (!(ws as ExtWebSocket).isAlive) {
      console.log(`Client not alive (${wss.clients.size} - 1)`);
      return ws.terminate();
    }

    (ws as ExtWebSocket).isAlive = false;
    ws.ping(null, false, () => {
      (ws as ExtWebSocket).isAlive = false;
    });
  });
}, 10000);


const broadcastMessage = (msg: Message) => {
  console.log(`Notifying ${wss.clients.size} clients`);
  wss.clients
    .forEach(client => {
    client.send(JSON.stringify(msg));
  });
};

app.post('/collections', (req, res) => {
  const msg: Message = req.body;
  console.log(`Received message from user '${msg.user}', identified class: '${msg.class}'`);
  broadcastMessage(req.body);
  res.send('Collected.')
});

app.get('/statistics', (req, res) => {
  res.send('TODO: statistics');
});

server.listen(PORT, () => {
  console.log(`Garbage collection API started on port ${PORT}!`);
});
