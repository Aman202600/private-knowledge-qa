const { generateEmbedding, generateChatCompletion } = require('../services/llmService');
const Chunk = require('../models/Chunk');
const { cosineSimilarity } = require('../services/similarityService');
const logger = require('../config/logger');

// @desc    Query the knowledge base
// @route   POST /api/query
const query = async (req, res, next) => {
    try {
        const { question, top_k = 3 } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Please provide a question' });
        }

        // Generate embedding for the question
        const questionEmbedding = await generateEmbedding(question);

        // Fetch all chunks from DB (simple approach as requested)
        // For production "simple but clean", fetching all chunks to compute similarity in memory
        // is acceptable for small scale. The prompt says "Store embeddings in MongoDB (no external vector DB to reduce complexity)" 
        // and "Use cosine similarity manually". This implies in-memory calculation or a very inefficient DB query. 
        // Given Node single thread, let's fetch essential fields.

        const chunks = await Chunk.find({}, { embedding: 1, chunk_text: 1, filename: 1, document_id: 1 });

        if (chunks.length === 0) {
            return res.status(404).json({ error: 'No documents found to query against.' });
        }

        // Calculate similarity for each chunk
        const scoredChunks = chunks.map(chunk => {
            const similarity = cosineSimilarity(questionEmbedding, chunk.embedding);
            return {
                ...chunk.toObject(),
                similarity
            };
        });

        // Sort by similarity descending and take top_k
        scoredChunks.sort((a, b) => b.similarity - a.similarity);
        const topChunks = scoredChunks.slice(0, top_k);

        // Build context
        const context = topChunks.map(c => c.chunk_text).join('\n---\n');

        // Get LLM answer
        const answer = await generateChatCompletion(context, question);

        // Format sources
        const sources = topChunks.map(c => ({
            document_id: c.document_id,
            filename: c.filename,
            chunk_text: c.chunk_text,
            similarity_score: c.similarity
        }));

        res.status(200).json({
            answer,
            sources,
            confidence: "high" // Placeholder as requested roughly
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { query };
