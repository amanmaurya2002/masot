# Materials Science & Engineering Hub

A modern web application that aggregates and displays the latest research papers, breakthroughs, and innovations in materials science and engineering.

## Features

- **Live ArXiv Integration**: Fetches latest materials science papers from ArXiv
- **Research Paper Display**: Shows papers with abstracts, authors, and materials focus
- **Modern UI**: Clean, responsive interface built with SvelteKit
- **Real-time Data**: Automatically fetches the latest research

## Tech Stack

- **Frontend**: SvelteKit + TypeScript
- **Backend**: FastAPI + Python
- **Database**: PostgreSQL
- **Data Source**: ArXiv API

## Getting Started

1. Clone the repository
2. Run with Docker:
   ```bash
   docker compose up -d
   ```
3. Visit `http://localhost:3000`

## API Endpoints

- `GET /api/papers/arxiv/fetch` - Fetch latest ArXiv papers
- `GET /api/papers/arxiv/topic/{topic}` - Search papers by topic
- `GET /api/stats/papers` - Get paper statistics

## Development

The app is structured as a monorepo with:
- `apps/frontend/` - SvelteKit frontend
- `apps/backend/` - FastAPI backend
- Database models for materials science data
