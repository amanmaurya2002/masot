# MASOT - Chandigarh Events Platform

A modern, full-stack application for discovering and managing events in Chandigarh, built with Next.js, FastAPI, and PostgreSQL.

## 🏗️ Project Structure

```
masot/
├── apps/
│   ├── frontend/                 # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/             # Next.js App Router
│   │   │   ├── components/      # Reusable React components
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── lib/             # Utility libraries (API client, etc.)
│   │   │   ├── types/           # TypeScript type definitions
│   │   │   └── utils/           # Helper functions
│   │   ├── public/              # Static assets
│   │   └── styles/              # Global styles
│   └── backend/                 # FastAPI backend application
│       ├── api/                 # API route modules
│       ├── core/                # Core application logic
│       ├── models/              # Database models and ORM setup
│       ├── services/            # Business logic services
│       ├── tests/               # Test files
│       └── utils/               # Utility functions
├── shared/                      # Shared code between frontend/backend
│   ├── types/                   # Shared TypeScript types
│   ├── constants/               # Shared constants
│   └── utils/                   # Shared utility functions
├── docker-compose.yml           # Docker orchestration
└── package.json                 # Root package.json for monorepo
```

## 🚀 Features

- **Events Management**: Browse and manage events in Chandigarh
- **News Integration**: Latest news about Chandigarh
- **Admin Dashboard**: Manage events and content
- **Responsive Design**: Mobile-first, modern UI
- **Database Persistence**: PostgreSQL with SQLAlchemy ORM
- **API Integration**: Ticketmaster and NewsAPI integration
- **Docker Support**: Containerized deployment

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Custom CSS** - Clean, maintainable styling
- **React Hooks** - Custom hooks for data management

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL** - Primary database
- **httpx** - Async HTTP client
- **Pydantic** - Data validation

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-service orchestration
- **PostgreSQL** - Database service

## 📦 Installation

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL (if running locally)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd masot
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

3. **Start with Docker**
   ```bash
   npm run docker:up
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   cd apps/frontend && npm install
   cd ../backend && pip install -r requirements.txt
   ```

2. **Set up environment variables**
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   
   # Backend (environment variables)
   export DATABASE_URL=postgresql://user:pass@localhost:5432/masot
   export NEWS_API_KEY=your_news_api_key
   export TICKETMASTER_API_KEY=your_ticketmaster_key
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev                    # Start both frontend and backend
npm run dev:frontend          # Start frontend only
npm run dev:backend           # Start backend only

# Building
npm run build                 # Build frontend
npm run build:frontend        # Build frontend only

# Production
npm run start                 # Start both in production mode
npm run start:frontend        # Start frontend in production
npm run start:backend         # Start backend in production

# Docker
npm run docker:build          # Build Docker images
npm run docker:up             # Start containers
npm run docker:down           # Stop containers
npm run docker:logs           # View logs

# Maintenance
npm run clean                 # Clean build artifacts
```

### Project Structure Details

#### Frontend (`apps/frontend/`)
- **Components**: Reusable UI components (EventCard, NewsCard, etc.)
- **Hooks**: Custom React hooks for data fetching and state management
- **Lib**: API client and utility functions
- **Types**: TypeScript interfaces and types
- **App Router**: Next.js 13+ App Router structure

#### Backend (`apps/backend/`)
- **API**: FastAPI route modules organized by feature
- **Models**: SQLAlchemy models and database setup
- **Services**: Business logic and external API integrations
- **Core**: Application configuration and middleware
- **Utils**: Helper functions and utilities

#### Shared (`shared/`)
- **Types**: Common TypeScript types used by both frontend and backend
- **Constants**: Shared constants and configuration
- **Utils**: Common utility functions

## 🌐 API Endpoints

### Events
- `GET /events` - Get all events
- `POST /events` - Create a new event

### News
- `GET /news` - Get latest news

### Health Check
- `GET /` - API health check

## 🎨 Styling

The application uses a custom CSS system with:
- CSS Variables for theming
- Utility classes for common patterns
- Responsive design with mobile-first approach
- Green color scheme representing Chandigarh's greenery

## 🗄️ Database

The application uses PostgreSQL with the following main tables:
- **events**: Event information and metadata
- **news**: News articles and sources

## 🚀 Deployment

### Docker Deployment
```bash
# Build and start
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEWS_API_KEY`: NewsAPI.org API key
- `TICKETMASTER_API_KEY`: Ticketmaster API key
- `NEXT_PUBLIC_BACKEND_URL`: Backend URL for frontend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/docs` when running locally
- Review the code structure and comments
