const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
        trim: true
    },
    uploaded_at: {
        type: Date,
        default: Date.now
    },
    chunk_count: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// DocumentSchema.index({ uploaded_at: -1 });

module.exports = mongoose.model('Document', DocumentSchema);
