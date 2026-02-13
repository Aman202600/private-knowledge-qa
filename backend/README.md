# Private Knowledge Q&A Backend

Production-ready backend for the Private Knowledge Q&A application.

## Tech Stack

- Node.js 20 LTS
- Express 4.x
- MongoDB 6.x
- OpenAI API
- Multer (File Upload)

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your details:
   ```bash
   cp .env.example .env
   ```
   - `OPENAI_API_KEY` is required.
   - `MONGO_URI` defaults to local mongodb.

3. **Run Server**
   ```bash
   npm start
   ```
   Development mode:
   ```bash
   npm run dev
   ```

## API Documentation

### Documents

- **POST /api/documents/upload**
  - Upload a .txt file (max 5MB).
  - Returns document ID and chunk stats.

- **GET /api/documents**
  - List all uploaded documents.

- **DELETE /api/documents/:id**
  - Delete a document and its chunks.

### Query

- **POST /api/query**
  - Body: `{ "question": "...", "top_k": 3 }`
  - Returns AI answer based on document context.

### System

- **GET /api/health**
  - Check system status (DB, LLM).
