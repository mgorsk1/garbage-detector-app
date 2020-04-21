import sqlite3, { Database } from 'sqlite3';
import {
  CollectionDay,
  DayStatistics,
  emptyStats,
  emptyTimeStats,
  GarbageClass,
  Message,
  Statistics,
  TimeStatistics
} from './types';
import moment from 'moment';

export function openDatabase(): Database {
  const db = new sqlite3.Database(':memory:');
  db.run('CREATE TABLE IF NOT EXISTS collections(user text, class text, time text)', (err) => {
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
    const paper = Math.floor(Math.random() * 15);
    const glass = Math.floor(Math.random() * 7);
    const plastic = Math.floor(Math.random() * 15);
    const rest = Math.floor(Math.random() * 30);
    const time = date.toISOString();
    for (let i = 0; i < paper; i++) {
      db.run('INSERT INTO collections(user, class, time) VALUES (?, ?, ?)', ['Staszek', 'paper', time]);
    }
    for (let i = 0; i < glass; i++) {
      db.run('INSERT INTO collections(user, class, time) VALUES (?, ?, ?)', ['Staszek', 'glass', time]);
    }
    for (let i = 0; i < plastic; i++) {
      db.run('INSERT INTO collections(user, class, time) VALUES (?, ?, ?)', ['Staszek', 'plastic', time]);
    }
    for (let i = 0; i < rest; i++) {
      db.run('INSERT INTO collections(user, class, time) VALUES (?, ?, ?)', ['Staszek', 'rest', time]);
    }
    date = date.add(1, 'days');
  } while (date <= currentDate);
}

export function insertMessage(db: Database, msg: Message, time: string) {
  db.run('INSERT INTO collections(user, class, time) VALUES (?, ?, ?)', [msg.user, msg.class, time],
    (err) => {
      if (err) {
        console.error(`Failed to save data: ${err?.message}`);
      }
    });
}

export function getStatistics(db: Database, dateFrom: string, callback: (stats: Statistics) => void) {
  db.all('SELECT class, count(*) as count FROM collections WHERE date(time) >= date(?) GROUP BY class', [dateFrom], (err, rows) => {
    if (err) {
      console.error(`Failed to query statistics: ${err.message}`);
    }
    let stats: Statistics = emptyStats;
    rows.forEach(row => {
      stats = { ...stats, [row.class]: row.count };
    });
    callback(stats);
  });
}

export function getTimeStatistics(db: Database, dateFrom: string, callback: (series: TimeStatistics) => void) {
  let query = 'SELECT date(time) as dt, class, count(*) as points FROM collections WHERE date(time) >= date(?) GROUP BY dt, class ORDER BY dt, class';

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
      stats[index][row.class as GarbageClass] = row.points;
    });
    callback(stats);
  });
}