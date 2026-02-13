const axios = require('axios');
const logger = require('../config/logger');
const { generateEmbedding } = require('./embeddingService');

// OpenRouter Configuration
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "arcee-ai/trinity-large-preview:free";

/**
 * Core function to interact with OpenRouter using Axios as requested.
 * @param {Array} messages - Array of message objects (role, content).
 * @returns {Promise<string>} - The response text.
 */
const askLLM = async (messages) => {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            logger.error("CRITICAL: OPENROUTER_API_KEY is missing from environment variables.");
            throw new Error("OPENROUTER_API_KEY is not defined in environment variables");
        }

        // Validate API Key format (simple check)
        if (!apiKey.startsWith('sk-or-v1-')) {
            logger.warn("Warning: OPENROUTER_API_KEY does not start with typical prefix 'sk-or-v1-'. Please verify your key.");
        }

        logger.debug(`Calling OpenRouter with model: ${MODEL}`);

        const response = await axios.post(
            OPENROUTER_URL,
            {
                model: MODEL,
                messages: messages,
                max_tokens: 800,
                temperature: 0.3
            },
            {
                headers: {
                    "Authorization": `Bearer ${apiKey.trim()}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "Private Knowledge QA"
                },
                timeout: 30000 // 30 second timeout
            }
        );

        if (!response.data || !response.data.choices || !response.data.choices[0]) {
            logger.error("OpenRouter Response Error: Unexpected body structure", response.data);
            throw new Error("Invalid response from OpenRouter");
        }

        return response.data.choices[0].message.content;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const fullError = error.response.data;
            const errorMsg = fullError?.error?.message || "Unknown Provider Error";
            const errorCode = fullError?.error?.code || "No Code";
            const metadata = fullError?.error?.metadata || {};

            logger.error(`OpenRouter API Error (${error.response.status}): ${errorMsg}`, {
                code: errorCode,
                metadata,
                fullResponse: fullError
            });

            // Specific check for common "Provider returned error" scenarios
            if (errorMsg.includes("Provider returned error")) {
                throw new Error(`OpenRouter Provider Error: The underlying AI provider for '${MODEL}' is currently unavailable or returned an error. Try again later or switch models.`);
            }

            throw new Error(`OpenRouter Error: ${errorMsg}`);
        } else if (error.request) {
            // The request was made but no response was received
            logger.error("OpenRouter Network Error: No response received from server.");
            throw new Error("Failed to connect to OpenRouter. Please check your internet connection.");
        } else {
            // Something happened in setting up the request that triggered an Error
            logger.error(`OpenRouter Integration Error: ${error.message}`);
            throw error;
        }
    }
};

/**
 * Generates an answer for a given prompt (compatibility wrapper).
 */
const generateAnswer = async (prompt) => {
    return await askLLM([{ role: "user", content: prompt }]);
};

/**
 * Compatibility function for existing RAG controllers.
 */
const generateChatCompletion = async (context, question) => {
    const messages = [
        {
            role: "system",
            content: "You are a helpful assistant. Use the provided context to answer the user's question."
        },
        {
            role: "user",
            content: `Based only on the context below, answer the question. \nIf the answer is not in the context, say you do not know.\n\nContext:\n${context}\n\nQuestion:\n${question}\n\nAnswer:`
        }
    ];
    return await askLLM(messages);
};

module.exports = {
    askLLM,
    generateAnswer,
    generateChatCompletion,
    generateEmbedding
};
