const express = require("express");
const app = express();
const cors = require("cors");

const dbConfig = require("./db-config/database-config");
const mongoose = require("mongoose");



const dotenv = require("dotenv");
// const cors=require('cors');
dotenv.config();

const routes = require("./routes/user-routes");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// CORS (Just Ignore this One)
const corsOptions = {
  origin: "*",
  allowedHeaders: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};
app.use(cors(corsOptions));

// DataBase Connection
mongoose
  .connect(dbConfig.url, { useNewUrlParser: true })
  .then(() => {
    console.log("Successfully Connected to Database !");
  })
  .catch((err) => {
    console.log("Error in Connecting to Database !");
    process.exit();
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my USER application." });
});

app.listen(3000, () => {
  console.log("User Server Up & Running !");
});

app.use(routes);
app.use(require('./tokenChecker')); // Refresh Tokens
