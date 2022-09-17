import express from "express";

const app = express();

app.get("/games", (req, res) => {
  return res.json(["game1", "game2", "game3"]);
});

app.post("/ads", (req, res) => {
  return res.status(201).json(["ad1", "ad2", "ad3"]);
});

app.get("/games/:id/ads", (req, res) => {
  res.json([
    {
      id: 1,
      name: "ad1",
    },
    {
      id: 2,
      name: "ad2",
    },
    {
      id: 3,
      name: "ad3",
    },
  ]);
});

app.get("/ads/:id/discord", (req, res) => {
  res.json([]);
});

app.listen(3333);
