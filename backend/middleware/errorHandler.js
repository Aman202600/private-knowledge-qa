const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);

    // Multer error
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Max size is 5MB.' });
    }

    // Custom errors (if any, usually we throw Error objects with message)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        error: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;
