# Trading App - Project Context

## Project Overview
An intelligent financial insights platform that aggregates market news and forecasts from multiple sources, identifies patterns and correlations, tracks source accuracy over time, and provides real-time alerts when high-confidence investment opportunities emerge.

## Core Features
1. **Data Aggregation**: Automatically scrape and organize financial news/forecasts from 5-10 diverse web sources
2. **Correlation Detection**: Identify when multiple credible sources align on similar investment ideas (3+ sources, >80% confidence)
3. **Historical Accuracy Tracking**: Track which sources/analysts have been most accurate over time (6+ months of data)
4. **Conflict Highlighting**: Flag when respected sources have opposing views on the same asset
5. **Source Credibility Weighting**: Allow users to weight sources based on their own trust levels
6. **Real-time Push Notifications**: Alert within 5 minutes when new high-confidence ideas appear

## Tech Stack

### Backend (Python)
- **Crawl4ai** for intelligent web scraping
- **FastAPI or Flask** for REST API
- **Celery/APScheduler** for background job scheduling and periodic scraping
- **NLP libraries** for text analysis and correlation detection

### Database
- **PostgreSQL** via Supabase (managed hosting)
- Time-series optimization for historical tracking
- Full-text search capabilities

### Frontend
- **Next.js/React** with server-side rendering
- **TailwindCSS** for responsive UI
- **Chart.js** for data visualization and trend analysis
- Real-time updates via WebSocket or polling

### Notifications
- **OneSignal** for push notifications (web and mobile)

### Deployment
- **Vercel** for Next.js frontend
- **Railway/Render** for Python backend
- **Supabase** for managed PostgreSQL

## Architecture
Microservices-style separation with:
- Backend handling data collection and analysis
- Frontend focusing on presentation
- Database as central data store
- Event-driven design for real-time updates

## Implementation Phases

### Phase 1: Foundation & Infrastructure Setup (Simple)
- Project structure initialization
- Supabase database setup
- Development environment configuration
- CI/CD pipeline setup

### Phase 2: Database Schema & Data Models (Moderate)
- Schema for sources, scraped content, predictions, users, alerts
- Migrations and ORM models
- ERD documentation

### Phase 3: Backend - Web Scraping & Data Collection (Complex)
- Crawl4ai integration
- 5-10 source scrapers with normalization
- Scheduling system with error handling
- Rate limiting and monitoring

### Phase 4: Backend - Analysis & Intelligence Layer (Complex)
- Correlation and conflict detection algorithms
- Historical accuracy tracking
- Source credibility weighting engine
- Alert generation logic
- REST API endpoints with caching

### Phase 5: Frontend - Core UI & Data Visualization (Moderate)
- Authentication and user management
- Dashboard with current opportunities
- Source management interface
- Historical accuracy visualizations
- Responsive design

### Phase 6: Real-time Notifications & Alerts (Moderate)
- OneSignal integration
- Notification preferences management
- Backend notification service
- Delivery tracking

### Phase 7: Testing, Optimization & Deployment (Moderate)
- Comprehensive test suite (>80% coverage)
- Load testing and optimization
- Production deployment
- Monitoring and error tracking
- Security audit

## Quality Gates
- All unit tests must pass before proceeding to next phase
- Code review required before merging to main
- Integration tests for completed features
- Documentation updated for all phases

## Success Metrics
- Data collection uptime >99%
- Alert generation latency <5 minutes
- Historical accuracy tracking shows improvement over random selection
- User engagement >3 sessions/week for active users

## Current Status
Project is in initial planning phase with:
- Initial idea documented (docs/INITIAL_IDEA.md)
- High-level implementation plan created (docs/IMPLEMENTATION_PLAN.md)
- Git repository initialized on feature/initial-docs branch

## Next Steps
1. Review and approve implementation plan
2. Begin Phase 1: Foundation & Infrastructure Setup
3. Design detailed database schema for Phase 2

## Important Context for Development
- Focus on defensive security only
- Implement robust error handling for web scraping failures
- Build respectful crawling practices (rate limiting, robots.txt compliance)
- Prioritize data quality validation and cleaning pipelines
- Design for scalability from the start
- Consider API rate limits and caching strategies
