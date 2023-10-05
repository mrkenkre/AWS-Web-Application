const express = require("express");
const bodyParser = require("body-parser");
const healthz = require("./routes/healthcheck");
const assg = require("./routes/assg");
const configureDatabase = require("./config/dbConfig");

const app = express();
configureDatabase();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());

app.use("/", healthz);
app.use("/v1", assg);

app.listen("3000", () => {
  console.log("Server started on port 3000.");
});

module.exports = app;
