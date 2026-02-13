const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const documentRoutes = require('./routes/documentRoutes');
const queryRoutes = require('./routes/queryRoutes');
const healthRoutes = require('./routes/healthRoutes');
const logger = require('./config/logger');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
});

// Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server is running'
    });
});

// Routes
app.use('/api/documents', documentRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/health', healthRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
