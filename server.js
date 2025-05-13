import express from "express";
import fs from "fs";

const app = express();
const port = 8080;
const DATA_FILE = "raceResults.json";

app.use(express.json());
app.use(express.static("Timer Pro"));

let raceResults = [];
if (fs.existsSync(DATA_FILE)) {
  const saved = fs.readFileSync(DATA_FILE);
  raceResults = JSON.parse(saved);
}

app.post("/submit", (req, res) => {
  const data = req.body;
  if (Array.isArray(data)) {
    raceResults.push(...data);
  } else {
    raceResults.push(data);
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(raceResults, null, 2));

  console.log("Received Results:", data);
  res.sendStatus(200);
});

app.get("/results", (req, res) => {
  res.json(raceResults);
});

app.delete("/clear", (req, res) => {
  raceResults.length = 0;
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  res.send("Race Results cleared.");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
