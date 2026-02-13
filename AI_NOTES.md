# AI Development Notes

## Overview
This project, **Private Knowledge Q&A**, was developed with significant assistance from AI (Antigravity). The AI served as a pair programmer, helping architecture the RAG pipeline, implement core services, and troubleshoot deployment issues.

## AI Tasks & Contributions
During the development lifecycle, AI was utilized for the following core tasks:
- **Boilerplate Generation**: Rapidly scaffolding the Express.js backend and React frontend structures.
- **RAG Implementation**: Drafting logic for recursive character text splitting, vector similarity calculations, and OpenRouter API integration.
- **Debugging & Error Handling**: Resolving 500 errors during API migrations and adding robust logging for "Provider returned error" scenarios from LLM gateways.
- **Deployment Support**: Configuring the root health check route to ensure 100% uptime on Render and fixing PORT binding issues.
- **Documentation**: Drafting technical READMEs and this AI_NOTES file.

## Manual Implementation & Verification
While AI provided the initial logic and fixes, the following were manually verified and refined:
- **System Architecture**: The folder structure and service-oriented architecture (SOA) were reviewed to ensure modularity.
- **Security**: Verification that all API keys are strictly managed via `.env` files and never committed to version control.
- **Logic Validation**: Manual testing of the document chunking overlap to ensure no context loss occurred during the RAG process.
- **Performance Tuning**: Setting specific `max_tokens` (800) and `temperature` (0.3) for the LLM to balance response detail and hallucination control.

## LLM Provider & Model Details
- **Provider**: [OpenRouter](https://openrouter.ai/)
- **Model**: `arcee-ai/trinity-large-preview:free` (currently in use)
- **Reasoning**: This model was selected for its high stability in the free tier, generous context window, and reliable performance for Retrieval-Augmented Generation (RAG) demonstrations.

## Security Note
All sensitive credentials, including the `OPENROUTER_API_KEY` and `MONGO_URI`, are stored in environment variables. No secrets were hardcoded or exposed during the generation of this codebase.
