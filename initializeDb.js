import sqlite3 from "sqlite3";
sqlite3.verbose();

export default function initDb() {
  const db = new sqlite3.Database("database.db");

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS race_results (
        id TEXT PRIMARY KEY,
        time TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS timer_state (
        id INTEGER PRIMARY KEY,
        hour INTEGER,
        minute INTEGER,
        second INTEGER,
        millisecond INTEGER,
        isRunning INTEGER
      )
    `);
  });

  return db;
}
