# Private Knowledge Q&A Frontend

Production-ready React frontend for querying your private documents using AI.

## Features

- **Document Upload**: Drag and drop interface for .txt files.
- **Progress Tracking**: Real-time upload progress.
- **Smart Querying**: Ask questions and get answers based ONLY on your documents.
- **Source Citations**: See exactly which document and chunk the answer came from.
- **System Status**: Monitor backend connectivity and health.

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS
- Lucide React Icons
- Axios
- React Hot Toast

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Update `VITE_API_URL` if your backend is not running on port 8000.

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

- `src/components`: Reusable UI components (Layout, etc.)
- `src/pages`: Main application pages (Home, Upload, Query, Status)
- `src/services`: API configuration and centralized requests
- `src/utils`: Helper functions


