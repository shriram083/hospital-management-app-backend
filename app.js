const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connection } = require("./config/db");
const { hospitalRoute } = require("./controllers/hospitalControllers");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Hospital App API");
});

app.use("/hospital", hospitalRoute);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch {
    console.log("Failed to connect DB");
  }
  console.log(`Listening on localhost:${process.env.PORT}`);
});
