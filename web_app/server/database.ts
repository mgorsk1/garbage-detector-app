import sqlite3, { Database } from 'sqlite3';
import {
  emptyProgressStats,
  emptyStats,
  emptyTimeStats,
  GarbageCategory,
  IncomingMessage,
  ProgressStatistics,
  Statistics,
  TimeStatistics
} from './types';
import moment from 'moment';
import { getPoints } from './index';

export function openDatabase(): Database {
  const db = new sqlite3.Database(':memory:');
  db.run('CREATE TABLE IF NOT EXISTS collections(user text, category text, points integer, time text)', (err) => {
    if (err) {
      console.error('Failed to open database!');
      process.exit(1);
    }
    createSampleData(db);
  });
  return db;
}

function createSampleData(db: Database) {
  const currentDate = moment();
  let date = currentDate.clone().subtract(30, 'days');
  do {
    const paper = Math.floor(Math.random() * 5);
    const glass = Math.floor(Math.random() * 2);
    const plastic = Math.floor(Math.random() * 5);
    const rest = Math.floor(Math.random() * 10);
    const time = date.toISOString();
    for (let i = 0; i < paper; i++) {
      db.run('INSERT INTO collections(user, category, points, time) VALUES (?, ?, ?, ?)', ['Test', 'paper', 3, time]);
    }
    for (let i = 0; i < glass; i++) {
      db.run('INSERT INTO collections(user, category, points, time) VALUES (?, ?, ?, ?)', ['Test', 'glass', 5, time]);
    }
    for (let i = 0; i < plastic; i++) {
      db.run('INSERT INTO collections(user, category, points, time) VALUES (?, ?, ?, ?)', ['Test', 'plastic', 10, time]);
    }
    for (let i = 0; i < rest; i++) {
      db.run('INSERT INTO collections(user, category, points, time) VALUES (?, ?, ?, ?)', ['Test', 'rest', 1, time]);
    }
    date = date.add(1, 'days');
  } while (date <= currentDate);
}

export function insertMessage(db: Database, msg: IncomingMessage, time: string) {
  const points = getPoints(msg.category);
  db.run('INSERT INTO collections(user, category, points, time) VALUES (?, ?, ?, ?)', [msg.user, msg.category, points, time],
    (err) => {
      if (err) {
        console.error(`Failed to save data: ${err?.message}`);
      }
    });
}

export function getStatistics(db: Database, dateFrom: string, callback: (stats: Statistics) => void) {
  db.all('SELECT category, sum(points) as pointsSum FROM collections WHERE date(time) >= date(?) GROUP BY category', [dateFrom], (err, rows) => {
    if (err) {
      console.error(`Failed to query statistics: ${err.message}`);
    }
    let stats: Statistics = emptyStats;
    rows.forEach(row => {
      stats = { ...stats, [row.category]: row.pointsSum };
    });
    callback(stats);
  });
}

export function getTimeStatistics(db: Database, dateFrom: string, callback: (series: TimeStatistics) => void) {
  let query = 'SELECT date(time) as dt, category, sum(points) as pointsSum FROM collections WHERE date(time) >= date(?) GROUP BY dt, category ORDER BY dt, category';

  db.all(query, [dateFrom], (err, rows) => {
    if (err) {
      console.error(`Failed to query time statistics: ${err.message}`);
    }
    let stats: TimeStatistics = emptyTimeStats(dateFrom);
    let index: number = 0;
    rows.forEach(row => {
      while(stats[index].date !== row.dt) {
        index += 1;
      }
      stats[index][row.category as GarbageCategory] = row.pointsSum;
    });
    callback(stats);
  });
}

export function getProgress(db: Database, dateFrom: string, callback: (series: ProgressStatistics) => void) {
  let initialQuery = 'SELECT sum(points) as pointsSum FROM collections WHERE date(time) < date(?)';

  db.all(initialQuery, [dateFrom], (err, rows) => {
    if (err) {
      console.error(`Failed to query progress statistics: ${err.message}`);
    }
    let count = rows[0].pointsSum;

    let query = 'SELECT date(time) as dt, sum(points) as pointsSum FROM collections WHERE date(time) >= date(?) GROUP BY dt ORDER BY dt';

    db.all(query, [dateFrom], (err, rows) => {
      if (err) {
        console.error(`Failed to query time statistics: ${err.message}`);
      }
      let stats: ProgressStatistics = emptyProgressStats(dateFrom);
      let index: number = 0;
      rows.forEach(row => {
        while(stats[index].date !== row.dt) {
          index += 1;
        }
        count = count + row.pointsSum;
        stats[index].points = count;
      });
      callback(stats);
    });
  });
}