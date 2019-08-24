const winston = require('winston');
const { simple, padLevels, combine } = winston.format;


// Development logger
const logger = winston.createLogger({
    level: "info",
    format: combine(
        simple(),
        padLevels(),
    ),
    transports: [
        new winston.transports.Console(),
    ]
});

module.exports = logger;