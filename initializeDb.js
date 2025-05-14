import sqlite3 from "sqlite3";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const directoryName = dirname(fileURLToPath(import.meta.url));
const dbPath = resolve(directoryName, "database.db");

const sql = sqlite3.verbose();
const db = new sql.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) console.error("Connection error:", err.message);
  }
);

function initDb() {
  const createTables = `
      CREATE TABLE IF NOT EXISTS race_results (
        id TEXT PRIMARY KEY,
        time TEXT NOT NULL
      );
    `;

  db.exec(createTables, (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
    } else {
      console.log("Table created.");

      db.run("DELETE FROM race_results", [], (err) => {
        if (err) {
          console.error("Error clearing table on startup:", err.message);
        } else {
          console.log("Database cleared on startup.");
        }
      });
    }
  });

  return db;
}

export default initDb;
