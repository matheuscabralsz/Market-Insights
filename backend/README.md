# Trading App Backend

Node.js/TypeScript backend API for the Trading App - an intelligent financial insights platform.

## Tech Stack

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (via Docker)
- **ORM**: Prisma
- **Task Queue**: BullMQ with Redis
- **Real-time**: Socket.io (to be implemented)
- **Logging**: Winston

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL (via Docker)
- Redis (via Docker)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Database Services

Start PostgreSQL and Redis using Docker Compose:

```bash
# From the project root
docker-compose up -d
```

This will start:
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`

### 3. Environment Variables

Copy `.env.example` to `.env` (already done):

```bash
cp .env.example .env
```

The default configuration works with the Docker Compose setup.

### 4. Database Setup

Generate Prisma Client:

```bash
npm run prisma:generate
```

Run database migrations:

```bash
npm run prisma:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files (database, redis, logger)
│   ├── controllers/    # Route controllers
│   ├── services/       # Business logic
│   ├── scrapers/       # Web scraping modules
│   ├── jobs/           # Background jobs (BullMQ)
│   ├── models/         # Data models and types
│   ├── utils/          # Utility functions
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   └── app.ts          # Express app entry point
├── prisma/
│   └── schema.prisma   # Database schema
├── logs/               # Application logs
├── .env                # Environment variables
└── package.json
```

## API Endpoints

### Health Check
- `GET /` - Root endpoint
- `GET /api/v1/health` - Health check with database and Redis status

### Sources
- `GET /api/v1/sources` - Get all active sources
- `GET /api/v1/sources/:id` - Get single source by ID
- `POST /api/v1/sources` - Create new source (admin only)

## Database Schema

The database includes the following models:
- **Source** - News/forecast sources
- **Article** - Scraped articles/content
- **Prediction** - Extracted predictions from articles
- **Correlation** - Correlation between predictions
- **SourceAccuracy** - Historical accuracy tracking
- **User** - User accounts
- **UserSourceWeight** - User's custom source weights
- **UserPreference** - User notification preferences
- **Alert** - Notifications

## Development

### Database Management

View and edit data using Prisma Studio:

```bash
npm run prisma:studio
```

### Logs

Logs are stored in the `logs/` directory:
- `error.log` - Error logs only
- `combined.log` - All logs

## Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f postgres
docker-compose logs -f redis

# Restart services
docker-compose restart
```

## Next Steps

1. Implement web scraping modules in `src/scrapers/`
2. Set up BullMQ job queues in `src/jobs/`
3. Add authentication middleware
4. Implement remaining API endpoints
5. Add Socket.io for real-time updates
6. Integrate OneSignal for push notifications

## Contributing

Please follow the existing code structure and naming conventions. Use TypeScript strict mode and ensure all code passes linting.
