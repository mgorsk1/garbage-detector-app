import express from 'express';
import cors from 'cors';
import http from 'http';
import WebSocket from 'ws';
import {Message} from './types';
import {ExtWebSocket} from './extWebSocket';
import {getStatistics, insertMessage, openDatabase} from './database';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 8080;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/subscribe' });

const db = openDatabase();

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
  insertMessage(db, msg, new Date().toISOString());
  broadcastMessage(req.body);
  res.send('Collected.')
});

app.get('/statistics', (req, res) => {
  getStatistics(db, stats => {
    res.send(JSON.stringify(stats));
  });
});

server.listen(PORT, () => {
  console.log(`Garbage collection API started on port ${PORT}!`);
});