const sequelize = require("../config/sequelize");
const {
  standardOutputLogger,
  standardErrorLogger,
} = require("../utils/logger");
const client = require("../utils/statsdutil");

async function healthz(req, res) {
  client.increment("API.healthz.GET");
  try {
    res.set("Cache-Control", "no-cache");
    if (req.method !== "GET") {
      standardErrorLogger.error("Method Not Allowed");
      console.log("Method not allowed.");
      res.status(405).send();
    } else if (JSON.stringify(req.body).length > 2) {
      standardErrorLogger.error("Request payload not allowed.");
      console.log("Request payload not allowed.");
      res.status(400).send();
    } else {
      // dbConfig.getConnection(function (err) {
      //     if (err) {
      //         console.error('MySQL connection failed: ' + err);
      //         res.status(503).send();
      //     } else {
      //         console.log('MySQL connected.');
      //         res.status(200).send();
      //     }
      // });

      await sequelize.authenticate();
      res.status(200).send();
      standardOutputLogger.info("MySQL connected successfully.");
      console.log("MySQL connected successfully.");
    }
  } catch (error) {
    console.log("Unable to connect to the database: " + error);
    standardErrorLogger.error("Unable to connect to the database: " + error);
    res.status(503).send();
  }
}

module.exports = { healthz };
