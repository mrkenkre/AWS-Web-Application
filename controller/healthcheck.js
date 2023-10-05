const sequelize = require("../config/sequelize");

async function healthz(req, res) {
  try {
    res.set("Cache-Control", "no-cache");
    if (req.method !== "GET") {
      console.log("Method not allowed.");
      res.status(405).send();
    } else if (JSON.stringify(req.body).length > 2) {
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
      console.log("MySQL connected successfully.");
    }
  } catch (error) {
    console.log("Unable to connect to the database: " + error);
    res.status(503).send();
  }
}

module.exports = { healthz };
