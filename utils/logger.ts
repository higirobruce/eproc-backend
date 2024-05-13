const winston = require("winston");
require("winston-mongodb");

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    // winston.format.label({ label: 'right meow!' }),
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  defaultMeta: { service: "user-service" },
  // transports: [
  //   //
  //   // - Write all logs with importance level of `error` or less to `error.log`
  //   // - Write all logs with importance level of `info` or less to `combined.log`
  //   //
  //   new winston.transports.File({ filename: './dist/error.log', level: 'error' }),
  //   new winston.transports.File({ filename: './dist/combined.log' }),
  // ],
  transports: [
    // Add MongoDB transport
    new winston.transports.MongoDB({
      level: "info", // Log level for this transport
      db: "mongodb://127.0.0.1:27017/eproc", // MongoDB connection URL
      options: {
        useNewUrlParser: true, // MongoDB connection options
        useUnifiedTopology: true,
      },
      collection: "logs", // MongoDB collection to store logs
      storeHost: true, // Store hostname in MongoDB
      metaKey: "meta",
    }),
  ],
});
