const express = require('express');
const router = express.Router();
const { uploadDocument, getDocuments, deleteDocument } = require('../controllers/documentController');
const upload = require('../middleware/upload');

// POST /api/documents/upload
router.post('/upload', upload.single('file'), uploadDocument);

// GET /api/documents
router.get('/', getDocuments);

// DELETE /api/documents/:id
router.delete('/:id', deleteDocument);

module.exports = router;
