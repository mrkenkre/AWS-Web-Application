const winston = require("winston");
const moment = require("moment-timezone");

const customFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    const formattedTimestamp = moment(timestamp).tz("America/New_York").format();
    return `${formattedTimestamp} [${level}]: ${message}`;
  })
);


const standardOutputLogger = winston.createLogger({
  format: customFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "/var/log/csye6225_stdop.log" }),
  ],
  options: {
    timezone: "America/New_York",
  },
});

const standardErrorLogger = winston.createLogger({
  format: customFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "/var/log/csye6225_error.log" }),
  ],
  options: {
    timezone: "America/New_York",
  },
});

module.exports = {
  standardOutputLogger,
  standardErrorLogger,
};
