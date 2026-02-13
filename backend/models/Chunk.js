const mongoose = require('mongoose');

const ChunkSchema = new mongoose.Schema({
    document_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    chunk_text: {
        type: String,
        required: true
    },
    chunk_index: {
        type: Number,
        required: true
    },
    embedding: {
        type: [Number],
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

ChunkSchema.index({ document_id: 1 });
ChunkSchema.index({ created_at: -1 });

module.exports = mongoose.model('Chunk', ChunkSchema);
