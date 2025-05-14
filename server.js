import express from "express";
import initDb from "./initializeDb.js";

const app = express();
const port = 8080;
const db = initDb();

app.use(express.json());
app.use(express.static("Timer Pro"));

app.post("/submit", (req, res) => {
  const data = req.body;
  const insert = db.prepare(
    "INSERT OR REPLACE INTO race_results (id, time) VALUES (?, ?)"
  );

  try {
    if (Array.isArray(data)) {
      data.forEach((entry) => insert.run(entry.id, entry.time));
    } else {
      insert.run(data.id, data.time);
    }
    insert.finalize();
    console.log("Saved to DB:", data);
    res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
