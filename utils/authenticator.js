const Account = require("../models/account");
const db = require("../models/index");
const bcrypt = require("bcrypt");

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
    res.status(403).send("Unauthorized: Please pass valid credentials.");
    return false;
  }

  const base64Credentials = req.headers.authorization.split(" ")[1];

  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "utf-8"
  );
  const [username, password] = credentials.split(":");
  console.log("Username:", username);
  console.log("Password:", password);
  if (!username || !password) {
    res.status(401).send("Unauthorized: Username or password is blank.");
    return false;
  } else {
    try {
      user = await Account.findOne({ where: { email: username } });

      if (!user) {
        res.status(401).send("Unauthorized: User not found.");
        return false;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        //console.log("herrrrr: " + user.id);
        req.user = user;
        return true;
      } else {
        res.status(401).send("Unauthorized: Password is incorrect.");
        return false;
      }
    } catch (error) {
      console.error("Authentication error:", error);
      return false;
    }
  }
}

module.exports = { authenticate };
