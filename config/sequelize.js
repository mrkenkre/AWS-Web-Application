const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("nodemysql", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

// check connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.log("Database Connection Error", error);
  });

module.exports = sequelize;
