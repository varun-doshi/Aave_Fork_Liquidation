const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const port = 3000;
require("dotenv").config();

app.use(express.json());

app.get("/", async (req, res) => {
  res.send("hello chainrisk!");
});

app.get("/get", async (req, res) => {
  var url = process.env.MONGO_URI;
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db("chainrisk");
  const collection = db.collection("aave");
  let result = await collection.find({}).toArray();
  res.send(result);
  console.log("results fetched!");
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
