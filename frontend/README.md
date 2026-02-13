# Private Knowledge Q&A Frontend

A modern, responsive React frontend for the Private Knowledge Q&A application. Built for visual excellence and premium user experience.

## Features

- **Intuitive UI**: Clean, glassmorphic design inspired by modern premium dashboards.
- **Document Management**: Easy upload and list management for your private knowledge base.
- **AI Chat Interface**: Interactive querying with real-time feedback and source citations.
- **System Monitoring**: Dedicated status page to track backend, database, and AI health.
- **Responsive Design**: Fully optimized for desktop and mobile viewing.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Networking**: Axios (with custom interceptors for error handling)
- **Feedback**: React Hot Toast for micro-animations and notifications

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root of the frontend folder:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
   *Note: For production, set this to your deployed backend URL.*

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

- `src/components`: UI components including a central `Layout` and navigation.
- `src/pages`: 
  - `Home`: Overview and landing.
  - `Upload`: File ingestion and management.
  - `Query`: The core AI chat experience.
  - `Status`: Real-time system monitoring.
- `src/services`: Centralized API service using Axios.

## Production Note

When deploying to Render or similar platforms, ensure `VITE_API_URL` is pointing to your backend endpoint (e.g., `https://your-backend.onrender.com`).
