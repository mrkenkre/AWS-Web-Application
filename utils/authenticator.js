const Account = require("../models/account");
const bcrypt = require("bcrypt");
const {
  standardOutputLogger,
  standardErrorLogger,
} = require("../utils/logger");
//let user = null;

async function authenticate(req, res) {
  //console.log("reachhed " + req.headers.authorization.split(" ")[2]);

  //   if (
  //     !req.headers.authorization &&
  //     !req.headers.authorization.startsWith("Basic")
  //   ) {
  //     return res.status(401).send("Unauthorized!");
  //   }

  if (!req.headers.authorization) {
    standardErrorLogger.error("Unauthorized: Invalid credentials.");
    res.status(401).send("Unauthorized: Please pass valid credentials.");
    return false;
  }

  const base64Credentials = req.headers.authorization.split(" ")[1];

  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "utf-8"
  );
  const [username, password] = credentials.split(":");
  // console.log("Username:", username);
  // console.log("Password:", password);
  if (!username || !password) {
    standardErrorLogger.error(
      "Unauthorized: Username or password cannot be null."
    );
    res.status(401).send("Unauthorized: Username or password cannot be null.");
    return false;
  } else {
    try {
      user = await Account.findOne({ where: { email: username } });

      if (!user) {
        standardErrorLogger.error("Unauthorized: User not found.");
        res.status(401).send("Unauthorized: User not found.");
        return false;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        //console.log("here: " + user.id);
        req.user = user;
        return true;
      } else {
        standardErrorLogger.error("Unauthorized: Password is incorrect.");
        res.status(401).send("Unauthorized: Password is incorrect.");
        return false;
      }
    } catch (error) {
      standardErrorLogger.error("Authentication error:", error);
      console.error("Authentication error:", error);
      return false;
    }
  }
}

module.exports = { authenticate };
