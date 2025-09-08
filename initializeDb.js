// initializeDb.js
import sqlite3 from "sqlite3";
sqlite3.verbose();

export default async function initDb() {
  const db = new sqlite3.Database("database.db");

  // tiny promise wrapper so we can await sqlite3 callbacks
  const run = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this);
      });
    });

  try {
    // 1) Create tables FIRST
    await run(`
      CREATE TABLE IF NOT EXISTS race_results (
        id   TEXT PRIMARY KEY,
        time TEXT
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS timer_state (
        id          INTEGER PRIMARY KEY,  -- we’ll use a single row id=1
        hour        INTEGER DEFAULT 0,
        minute      INTEGER DEFAULT 0,
        second      INTEGER DEFAULT 0,
        millisecond INTEGER DEFAULT 0,
        isRunning   INTEGER DEFAULT 0
      )
    `);

    // 2) (Optional) Clear tables in dev ONLY after they exist
    // await run("DELETE FROM race_results");
    // await run("DELETE FROM timer_state");

    // 3) Ensure exactly one timer_state row exists
    await run(`
      INSERT INTO timer_state (id, hour, minute, second, millisecond, isRunning)
      SELECT 1, 0, 0, 0, 0, 0
      WHERE NOT EXISTS (SELECT 1 FROM timer_state WHERE id = 1)
    `);

    return db;
  } catch (e) {
    db.close();
    throw e;
  }
}
