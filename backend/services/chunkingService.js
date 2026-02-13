/**
 * Chunks a string into smaller pieces with overlap.
 * @param {string} text - The text to chunk.
 * @param {number} size - The size of each chunk.
 * @param {number} overlap - The overlap between chunks.
 * @returns {string[]} - The array of chunks.
 */
const chunkText = (text, size = 500, overlap = 50) => {
    if (!text) return [];

    // Normalize newlines
    const normalizedText = text.replace(/\r\n/g, '\n');
    const chunks = [];
    let startIndex = 0;

    while (startIndex < normalizedText.length) {
        let endIndex = startIndex + size;

        // If we are not at the end, try to find a natural break point (space or newline)
        // to avoid chopping words in half, if possible.
        // However, the requirement says "chunk into ~500 chars", strictly following size is simpler but let's be slightly smart.
        // For simplicity and to match strict requirements, strict slicing is usually acceptable unless specified otherwise.
        // Let's do strict slicing to ensure predictability as per "simple but clean".

        if (endIndex > normalizedText.length) {
            endIndex = normalizedText.length;
        }

        const chunk = normalizedText.slice(startIndex, endIndex);
        chunks.push(chunk);

        if (endIndex === normalizedText.length) break;

        // Move start index for next chunk, accounting for overlap
        startIndex = endIndex - overlap;

        // Safety check to prevent infinite loops if overlap >= size (bad config)
        if (startIndex >= endIndex) {
            startIndex = endIndex;
        }
    }

    return chunks;
};

module.exports = { chunkText };
