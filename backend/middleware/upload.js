const multer = require('multer');
const path = require('path');

// Memory storage
const storage = multer.memoryStorage();

// File filter (TXT + PDF)
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['text/plain', 'application/pdf'];
    const allowedExtensions = ['.txt', '.pdf'];

    const ext = path.extname(file.originalname).toLowerCase();

    if (
        allowedMimeTypes.includes(file.mimetype) ||
        allowedExtensions.includes(ext)
    ) {
        cb(null, true);
    } else {
        cb(new Error('Only .txt and .pdf files are allowed!'));
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter
});

module.exports = upload;