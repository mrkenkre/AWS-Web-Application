// const mysql = require("mysql2/promise");

// // Database connection configuration
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
// });

// // Create the database if it doesn't exist
// async function createDatabase() {
//   try {
//     await connection.query("CREATE DATABASE IF NOT EXISTS nodemysql");
//     console.log("Database created or already exists.");
//   } catch (error) {
//     console.error("Error creating database:", error);
//   } finally {
//     connection.end();
//   }
// }

// module.exports = createDatabase;
