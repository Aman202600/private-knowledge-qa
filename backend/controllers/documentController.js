const Document = require('../models/Document');
const Chunk = require('../models/Chunk');
const { chunkText } = require('../services/chunkingService');
const { generateEmbedding } = require('../services/llmService');
const logger = require('../config/logger');
const { PDFParse } = require('pdf-parse');
const path = require('path');

// @desc    Upload document
// @route   POST /api/documents/upload
// @access  Public
const uploadDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a file' });
        }

        // Check for empty file
        if (req.file.size === 0) {
            return res.status(400).json({ error: 'File is empty' });
        }

        let fileContent = '';
        const ext = path.extname(req.file.originalname).toLowerCase();

        if (ext === '.pdf') {
            try {
                const parser = new PDFParse({ data: req.file.buffer });
                const data = await parser.getText();
                fileContent = data.text;
                await parser.destroy(); // Always call destroy to free memory
                logger.info(`Parsed PDF: ${req.file.originalname}, characters: ${fileContent.length}`);
            } catch (err) {
                logger.error(`Error parsing PDF ${req.file.originalname}: ${err.message}`);
                return res.status(400).json({ error: 'Failed to parse PDF file' });
            }
        } else {
            // Assume text for other allowed types (like .txt)
            fileContent = req.file.buffer.toString('utf-8');
        }

        if (!fileContent || !fileContent.trim()) {
            return res.status(400).json({ error: 'File content is empty or could not be extracted' });
        }

        // Chunking
        const chunkSize = parseInt(process.env.CHUNK_SIZE) || 500;
        const chunkOverlap = parseInt(process.env.CHUNK_OVERLAP) || 50;
        const chunks = chunkText(fileContent, chunkSize, chunkOverlap);

        // Create Document
        const document = await Document.create({
            filename: req.file.originalname,
            chunk_count: chunks.length
        });

        // Generate embeddings and save chunks
        const BATCH_SIZE = 10;
        const chunkDocs = [];

        for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
            const batch = chunks.slice(i, i + BATCH_SIZE);
            const batchPromises = batch.map(async (text, index) => {
                const embedding = await generateEmbedding(text);
                return {
                    document_id: document._id,
                    filename: document.filename,
                    chunk_text: text,
                    chunk_index: i + index,
                    embedding: embedding
                };
            });

            const batchResults = await Promise.all(batchPromises);
            chunkDocs.push(...batchResults);
        }

        await Chunk.insertMany(chunkDocs);

        res.status(201).json({
            document_id: document._id,
            filename: document.filename,
            chunks_created: chunks.length,
            status: "success"
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get all documents
// @route   GET /api/documents
// @access  Public
const getDocuments = async (req, res, next) => {
    try {
        const documents = await Document.find().sort({ uploaded_at: -1 });

        const responseDocs = documents.map(doc => ({
            id: doc._id,
            filename: doc.filename,
            uploaded_at: doc.uploaded_at,
            chunk_count: doc.chunk_count
        }));

        res.status(200).json({ documents: responseDocs });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Public
const deleteDocument = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        await document.deleteOne();
        await Chunk.deleteMany({ document_id: req.params.id });

        res.status(200).json({
            status: "deleted",
            document_id: req.params.id
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadDocument,
    getDocuments,
    deleteDocument
};
