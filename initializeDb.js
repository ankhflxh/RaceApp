import sqlite3 from "sqlite3";
sqlite3.verbose();

export default function initDb() {
  const db = new sqlite3.Database("database.db");

  db.serialize(() => {
    // 1) Wipe out any old rows on every server start:
    db.run("DELETE FROM timer_state");
    db.run("DELETE FROM race_results");

    // 2) Then ensure the tables exist (this won’t delete data)
    db.run(`
      CREATE TABLE IF NOT EXISTS race_results (
        id   TEXT PRIMARY KEY,
        time TEXT
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS timer_state (
        id          INTEGER PRIMARY KEY,
        hour        INTEGER,
        minute      INTEGER,
        second      INTEGER,
        millisecond INTEGER,
        isRunning   INTEGER
      )
    `);
  });

  return db;
}
