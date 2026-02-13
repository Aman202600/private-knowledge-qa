const mongoose = require('mongoose');
const { openai } = require('../services/llmService');

const getHealth = async (req, res) => {
    const health = {
        status: 'healthy',
        database: 'disconnected',
        llm_connection: 'disconnected',
        llm_provider: 'xAI (Grok)',
        timestamp: new Date().toISOString(),
        uptime_seconds: process.uptime()
    };

    // Check DB
    if (mongoose.connection.readyState === 1) {
        health.database = 'connected';
    } else {
        health.status = 'degraded';
    }

    // Check xAI Connectivity
    try {
        await openai.models.list();
        health.llm_connection = 'connected';
    } catch (error) {
        health.llm_connection = 'disconnected';
        health.status = 'degraded';
    }

    res.status(200).json(health);
};

module.exports = { getHealth };
