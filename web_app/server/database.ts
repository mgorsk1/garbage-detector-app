import sqlite3, { Database } from 'sqlite3';
import { CollectionDay, emptyStats, emptyTimeStats, GarbageClass, Message, Statistics, TimeStatistics } from './types';

export function openDatabase(): Database {
  const db = new sqlite3.Database(':memory:');
  db.run('CREATE TABLE IF NOT EXISTS collections(user text, class text, time text)', (err) => {
    if (err) {
      console.error('Failed to open database!');
      process.exit(1);
    }
  });
  return db;
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
  let query = 'SELECT class, date(time) as dt, count(*) as points FROM collections WHERE date(time) >= date(?) GROUP BY class, dt ORDER BY class, dt';

  db.all(query, [dateFrom], (err, rows) => {
    if (err) {
      console.error(`Failed to query time statistics: ${err.message}`);
    }
    let stats: TimeStatistics = { ...emptyTimeStats };
    rows.forEach(row => {
      stats[row.class as GarbageClass].push({ date: row.dt, points: row.points });
    });
    callback(stats);
  });
}