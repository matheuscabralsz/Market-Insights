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
- Python 3.8+ (for crawlers)
- Docker and Docker Compose (for Redis)
- Supabase account (for PostgreSQL database)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database (Supabase)

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Get your database connection string from Project Settings > Database
4. The connection string format is:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

### 3. Start Redis

Start Redis using Docker Compose:

```bash
# From the project root
docker-compose up -d redis
```

This will start Redis on `localhost:6379`

### 4. Environment Variables

Update `.env` with your Supabase credentials:

```bash
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
```

Make sure Redis settings are correct (default values should work).

### 5. Install Python Dependencies

Install required Python packages for the crawler:

```bash
pip3 install --user feedparser crawl4ai beautifulsoup4 html2text
```

### 6. Database Setup

Generate Prisma Client:

```bash
npm run prisma:generate
```

Run database migrations:

```bash
npm run prisma:migrate
```

### 7. Start Development Server

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

### Crawler
- `POST /api/v1/crawler/fxstreet-news` - Trigger FXStreet news crawler
  - Body: `{ "maxArticles": 10 }` (optional, default: 10, max: 100)
  - Returns: Job ID for tracking
- `GET /api/v1/crawler/jobs/:jobId` - Get crawler job status and results

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

### Using the Crawler

#### Trigger FXStreet News Crawler

```bash
# Crawl 10 articles (default)
curl -X POST http://localhost:3001/api/v1/crawler/fxstreet-news \
  -H "Content-Type: application/json" \
  -d '{"maxArticles": 10}'

# Response:
# {
#   "success": true,
#   "message": "Crawler job initiated",
#   "data": {
#     "jobId": "123",
#     "source": "fxstreet",
#     "maxArticles": 10,
#     "status": "queued"
#   }
# }
```

#### Check Job Status

```bash
curl http://localhost:3001/api/v1/crawler/jobs/123

# Response:
# {
#   "success": true,
#   "data": {
#     "jobId": "123",
#     "state": "completed",
#     "progress": 100,
#     "result": {
#       "success": true,
#       "source": "fxstreet",
#       "scraped": 10,
#       "saved": 8
#     }
#   }
# }
```

### Logs

Logs are stored in the `logs/` directory:
- `error.log` - Error logs only
- `combined.log` - All logs

## Docker Commands

```bash
# Start Redis
docker-compose up -d redis

# Stop Redis
docker-compose down

# View Redis logs
docker-compose logs -f redis

# Restart Redis
docker-compose restart redis
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
