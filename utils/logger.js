const winston = require('winston');
const { simple, padLevels, combine } = winston.format;


// Development logger
let logger = winston.createLogger({
    level: "info",
    format: combine(
        simple(),
        padLevels(),
    )
});

if (process.env.NOVE_ENV === 'production') {
    logger.add(new winston.transports.File({fileName: 'error.log', level: 'error' }));
} else {
    logger.add(new winston.transports.Console);
}

module.exports = logger;