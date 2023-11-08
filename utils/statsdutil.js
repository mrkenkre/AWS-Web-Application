const StatsD = require("node-statsd");
const client = new StatsD({
  host: "localhost",
  port: 8125,
});
client.socket.on("error", function (error) {
  return console.error("Error in socket: ", error);
});
module.exports = client;
