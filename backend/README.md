# Private Knowledge Q&A Backend

Production-ready backend for the Private Knowledge Q&A application, featuring RAG (Retrieval-Augmented Generation) capabilities.

## Tech Stack

- **Runtime**: Node.js 20 LTS
- **Framework**: Express 5.x
- **Database**: MongoDB (Mongoose)
- **AI Integration**: OpenRouter API 
- **File Handling**: Multer (Support for PDF and Text)
- **Logging**: Winston

## Features

- **RAG Pipeline**: Automatically chunks documents and generates embeddings for semantic search.
- **Semantic Search**: Uses vector similarity to find relevant context for user questions.
- **Robust Integration**: Custom Axios-based client for OpenRouter with detailed error logging and resilience.
- **Health Monitoring**: Comprehensive system checks including Database and LLM connectivity.

## LLM Provider and Configuration

This project uses **OpenRouter** as the primary LLM gateway to provide flexible and cost-effective AI completions.

- **Provider**: [OpenRouter.ai](https://openrouter.ai/)
- **Default Model**: `arcee-ai/trinity-large-preview:free`
- **Config**: Configured with a `temperature` of 0.3 and `max_tokens` of 800 for consistent, factual responses.

### Environment Variable Requirements:
To run the project, the following keys must be set in your `.env` file:
- `OPENROUTER_API_KEY`: Your OpenRouter API key.
- `MONGO_URI`: A valid MongoDB connection string.

## RAG Pipeline Workflow

The system follows a standard Retrieval-Augmented Generation (RAG) flow:
1. **Document Upload**: Users upload `.txt` or `.pdf` files.
2. **Chunking**: Documents are split into smaller segments (500 chars) with a 50-char overlap to preserve context.
3. **Embedding Generation**: Chunks are converted into numeric vectors (via OpenRouter/OpenAI models).
4. **Similarity Search**: When a user asks a question, the system creates an embedding for the query and finds the most relevant document chunks in the vector database.
5. **LLM Response**: The relevant context is passed to the LLM alongside the question to generate a grounded answer.
6. **Source Citation**: The final response includes references to the specific documents used to generate the answer.

## Local Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configuration**
   Copy the provided `.env.example` file to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
   *Note: You MUST fill in your actual API keys and database URI in the `.env` file.*

3. **Run Application**
   - **Production Mode**: `npm start`
   - **Development Mode**: `npm run dev` (Runs with nodemon for auto-reloading)


## API Documentation

### System
- **GET /**
  - Basic health check for deployment monitoring (Render/Heroku compatible).
- **GET /api/health**
  - Detailed system status (DB status, LLM provider connectivity).

### Documents
- **POST /api/documents/upload**
  - Upload a file (PDF/Text, max 5MB).
  - Triggers chunking and embedding generation.
- **GET /api/documents**
  - List all metadata for uploaded documents.
- **DELETE /api/documents/:id**
  - Purge a document and its associated vector chunks.

### Query
- **POST /api/query**
  - Body: `{ "question": "your question", "top_k": 3 }`
  - Performs semantic search and generates an answer using the `arcee-ai/trinity-large-preview:free` model (via OpenRouter).

## Deployment

This backend is optimized for deployment on **Render**. Ensure the `PORT` environment variable is not hardcoded and that the root route (`/`) is available for Render's health check monitoring.
