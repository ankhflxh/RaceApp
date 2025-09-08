// server.js
import express from "express";
import initDb from "./initializeDb.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.static(__dirname));

// top-level await works in ESM (Node 22+). If you prefer, wrap in an async start()
const db = await initDb();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "landing.html"));
});

app.post("/submit", (req, res) => {
  const data = req.body;
  const insert = db.prepare(
    "INSERT OR REPLACE INTO race_results (id, time) VALUES (?, ?)"
  );

  // serialize so the insert(s) run in order
  db.serialize(() => {
    try {
      if (Array.isArray(data)) {
        data.forEach((entry) => insert.run(entry.id, entry.time));
      } else {
        insert.run(data.id, data.time);
      }
      insert.finalize((err) => {
        if (err) {
          console.error(err.message);
          return res.sendStatus(500);
        }
        console.log("Saved to DB:", data);
        res.sendStatus(200);
      });
    } catch (err) {
      console.error(err.message);
      res.sendStatus(500);
    }
  });
});

app.get("/results", (req, res) => {
  db.all("SELECT * FROM race_results", [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.sendStatus(500);
    }
    res.json(rows);
  });
});

app.delete("/clear", (req, res) => {
  db.run("DELETE FROM race_results", [], function (err) {
    if (err) {
      console.error(err.message);
      return res.sendStatus(500);
    }
    res.send("Race Results cleared.");
  });
});

app.get("/timer-state", (req, res) => {
  db.get("SELECT * FROM timer_state WHERE id = 1", (err, row) => {
    if (err) {
      console.error(err.message);
      return res.sendStatus(500);
    }
    res.json(row || {});
  });
});

app.post("/timer-state", (req, res) => {
  const { hour, minute, second, millisecond, isRunning } = req.body;

  const stmt = db.prepare(`
    INSERT INTO timer_state (id, hour, minute, second, millisecond, isRunning)
    VALUES (1, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      hour = excluded.hour,
      minute = excluded.minute,
      second = excluded.second,
      millisecond = excluded.millisecond,
      isRunning = excluded.isRunning
  `);

  stmt.run(hour, minute, second, millisecond, isRunning, (err) => {
    stmt.finalize();
    if (err) {
      console.error(err.message);
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  });
});

app.delete("/timer-state", (req, res) => {
  db.run("DELETE FROM timer_state WHERE id = 1", [], function (err) {
    if (err) {
      console.error(err.message);
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
