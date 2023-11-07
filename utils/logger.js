const winston = require("winston");

const standardOutputLogger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "/var/log/csye6225_stdop.log" }),
  ],
});

const standardErrorLogger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "/var/log/csye6225_error.log" }),
  ],
});

module.exports = {
  standardOutputLogger,
  standardErrorLogger,
};
