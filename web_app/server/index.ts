import express from 'express';
import cors from 'cors';
import http from 'http';
import WebSocket from 'ws';
import {CollectionEvent, Message} from './types';
import {ExtWebSocket} from './extWebSocket';
import {getStatistics, getTimeSeries, insertMessage, openDatabase} from './database';

const app = express();
app.use(cors());
app.use(express.json());
const port = 9000;
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
    res.json(stats);
  });
});

app.get('/time-series', (req, res) => {
  if (!req.query.user) {
    res.status(400).send('Missing \'user\' query parameter');
    return;
  }
  if (!req.query.timeFrom) {
    res.status(400).send('Missing \'timeFrom\' query parameter');
    return;
  }
  if (!req.query.timeTo) {
    res.status(400).send('Missing \'timeTo\' query parameter');
    return;
  }
  const user = req.query.user as string;
  const timeFrom = req.query.timeFrom as string;
  const timeTo = req.query.timeTo as string;
  getTimeSeries(db, user, timeFrom, timeTo, (series: CollectionEvent[]) => {
    res.json(series);
  });
});

server.listen(port, () => {
  console.log(`Garbage collection API started on port ${port}!`);
});
