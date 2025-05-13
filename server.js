import express from "express";
import fs from "fs";

const app = express();
const port = 8080;
const DATA_FILE = "raceResults.json";

app.use(express.json());
app.use(express.static("Timer Pro"));

// Load saved results if they exist
let raceResults = [];
if (fs.existsSync(DATA_FILE)) {
  const saved = fs.readFileSync(DATA_FILE);
  raceResults = JSON.parse(saved);
}

// Endpoint to receive results
app.post("/submit", (req, res) => {
  const data = req.body;
  if (Array.isArray(data)) {
    raceResults.push(...data);
  } else {
    raceResults.push(data);
  }

  // Save to file
  fs.writeFileSync(DATA_FILE, JSON.stringify(raceResults, null, 2));

  console.log("Received Results:", data);
  res.sendStatus(200);
});

// Endpoint to get all results
app.get("/results", (req, res) => {
  res.json(raceResults);
});

// Clear all results
app.delete("/clear", (req, res) => {
  raceResults.length = 0;
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  res.send("Race Results cleared.");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
