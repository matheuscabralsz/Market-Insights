# Market Insights

Financial insights platform that aggregates forex news from multiple sources.

## Prerequisites

- Node.js 18+
- Python 3.12+
- Docker

## Setup

### 1. Install Dependencies

```bash
# Backend
cd backend && npm install

# Python crawler
pip3 install --user --break-system-packages -r scripts/requirements.txt

# Playwright browsers
python3 -m playwright install
```

### 2. Start Services

```bash
# Start Redis (required for job queue)
docker-compose up -d redis
```

### 3. Setup Database

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### 4. Start Backend

```bash
cd backend
npm run dev   # Runs on http://localhost:3001
```

## API Testing (E2E Crawl)

```bash
# Trigger a crawl (5 articles)
curl -s -X POST http://localhost:3001/api/v1/crawler/fxstreet-news -H "Content-Type: application/json" -d '{"maxArticles": 5}' | jq

# Check job status (replace <jobId>)
curl -s http://localhost:3001/api/v1/crawler/jobs/<jobId> | jq

# View scraped articles
curl -s http://localhost:3001/api/v1/articles | jq

# Health check
curl -s http://localhost:3001/api/v1/health | jq
```

## View Database

```bash
cd backend && npm run prisma:studio   # Opens http://localhost:5555
```

## Project Structure

```
├── backend/          # Node.js API + job processing
├── frontend/         # Next.js UI
├── scripts/          # Python crawlers
└── docker-compose.yml
```
