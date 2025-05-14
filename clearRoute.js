app.delete("/clear", (req, res) => {
    db.run("DELETE FROM race_results", [], function (err) {
      if (err) {
        console.error("Failed to clear table:", err.message);
        return res.status(500).send("Error clearing results");
      }
      console.log("Results cleared");
      res.sendStatus(200);
    });
  });
  