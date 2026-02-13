const OpenAI = require('openai');
const logger = require('../config/logger');

// Initialize OpenRouter client (OpenAI SDK compatible)
const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
});

/**
 * Generates a numeric embedding array for the given text using OpenRouter.
 * @param {string} text - The text to embed.
 * @returns {Promise<number[]>} - The embedding vector.
 */
const generateEmbedding = async (text) => {
    try {
        if (!process.env.OPENROUTER_API_KEY) {
            throw new Error("OPENROUTER_API_KEY is not defined in environment variables");
        }

        const response = await openai.embeddings.create({
            model: "openai/text-embedding-3-small", // Common model via OpenRouter
            input: text,
            encoding_format: "float"
        });

        return response.data[0].embedding;
    } catch (error) {
        logger.error(`OpenRouter Embedding Error: ${error.message}`);
        throw new Error(`Failed to generate OpenRouter embedding: ${error.message}`);
    }
};

module.exports = { generateEmbedding };
