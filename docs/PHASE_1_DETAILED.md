# Phase 1: Foundation & Infrastructure Setup - Detailed Documentation

## Overview
This phase establishes the complete development environment, project structure, database infrastructure, and CI/CD pipeline. After completion, developers will be able to run the full stack locally and deploy changes automatically.

## Technology Decisions

### Backend
- **Python**: Latest version (3.13.x)
- **Framework**: FastAPI (async support, auto-docs, validation)
- **Task Scheduler**: APScheduler (simpler setup, adequate for initial scale)
- **Web Scraping**: crawl4ai (latest version)
- **NLP**: sentence-transformers + spaCy (semantic similarity + NER)
- **ORM**: SQLAlchemy 2.x with asyncpg driver
- **Testing**: pytest + pytest-asyncio

### Frontend
- **Node.js**: Latest LTS (20.x or 21.x)
- **Framework**: Next.js 14+ with App Router
- **Styling**: TailwindCSS
- **Visualization**: Chart.js
- **Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright

### Database
- **PostgreSQL**: via Supabase (managed hosting)
- **Migrations**: Alembic (SQLAlchemy migrations)
- **Phase 1 Scope**: Database only (Auth in Phase 5)

### DevOps
- **Version Control**: Git with Git Flow
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, Prettier, Black, Ruff
- **Environment**: Ubuntu (dev and production)
- **Deployment**: Configured in Phase 7 (Vercel + Railway/Render)

---

## Detailed Task Breakdown

### Task 1: Initialize Monorepo Project Structure
**Order**: First
**Duration Estimate**: 30 minutes

#### Steps:
1. Create root directory structure
2. Initialize Git repository (if not already done)
3. Set up Git Flow branching strategy
4. Create `.gitignore` for Python and Node.js
5. Create monorepo folder structure

#### File Structure to Create:
```
tradingapp/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
├── backend/
│   ├── src/
│   │   ├── api/           # FastAPI routes
│   │   ├── core/          # Configuration, logging
│   │   ├── db/            # Database models, migrations
│   │   ├── scrapers/      # Web scraping modules
│   │   ├── analysis/      # NLP and correlation detection
│   │   ├── services/      # Business logic
│   │   └── main.py        # FastAPI application entry
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── conftest.py
│   ├── alembic/           # Database migrations
│   ├── requirements.txt
│   ├── pyproject.toml     # Python project config
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities, API client
│   │   ├── styles/        # Global styles
│   │   └── types/         # TypeScript types
│   ├── public/            # Static assets
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/           # Playwright tests
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .eslintrc.json
│   ├── .prettierrc
│   └── README.md
├── docs/                  # Project documentation
├── .env.example           # Example environment variables
├── .gitignore
├── README.md              # Root README with onboarding
└── docker-compose.yml     # Future: local development (not Phase 1)
```

#### Commands to Execute:
```bash
# Ensure we're in the project root
cd /home/mack/my_workspace/tradingapp

# Create directory structure
mkdir -p .github/workflows
mkdir -p backend/src/{api,core,db,scrapers,analysis,services}
mkdir -p backend/tests/{unit,integration}
mkdir -p backend/alembic
mkdir -p frontend/src/{app,components,lib,styles,types}
mkdir -p frontend/public
mkdir -p frontend/tests/{unit,integration,e2e}
```

---

### Task 2: Set Up Supabase Database
**Order**: Second
**Duration Estimate**: 20 minutes
**Dependencies**: Task 1

#### Steps:
1. Create Supabase account (if needed)
2. Create new Supabase project
3. Get database connection credentials
4. Configure PostgreSQL extensions needed
5. Document connection strings

#### Supabase Setup Instructions:

1. **Sign Up/Login**: Visit https://supabase.com and create account
2. **Create New Project**:
   - Click "New Project"
   - Name: `tradingapp` (or your preference)
   - Database Password: Generate strong password (save to password manager)
   - Region: Choose closest to your location
   - Pricing: Free tier (sufficient for development)
3. **Get Connection Details**:
   - Navigate to Project Settings > Database
   - Note down:
     - Connection String (URI)
     - Direct Connection String (for migrations)
     - Host, Port, Database name
4. **Enable Extensions** (via SQL Editor):
   ```sql
   -- Full-text search
   CREATE EXTENSION IF NOT EXISTS pg_trgm;

   -- UUID support
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

   -- Vector similarity (if using pgvector for embeddings)
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

#### Credentials to Save:
- Project URL: `https://[project-ref].supabase.co`
- Anon/Public Key: (for frontend - Phase 5)
- Service Role Key: (for backend - keep secret)
- Database URL: `postgresql://postgres:[password]@[host]:5432/postgres`

---

### Task 3: Backend - Python Environment & Dependencies
**Order**: Third
**Duration Estimate**: 30 minutes
**Dependencies**: Task 1, Task 2

#### Steps:
1. Verify Python 3.13+ installation
2. Create virtual environment
3. Create `requirements.txt` with all dependencies
4. Create `pyproject.toml` for project metadata
5. Install dependencies
6. Verify installations

#### Files to Create:

**backend/requirements.txt**:
```txt
# Web Framework
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-multipart==0.0.6

# Database
sqlalchemy==2.0.25
asyncpg==0.29.0
alembic==1.13.1
psycopg2-binary==2.9.9

# Supabase
supabase==2.3.4

# Web Scraping
crawl4ai==0.1.0  # Use latest version available
httpx==0.26.0
beautifulsoup4==4.12.3
lxml==5.1.0

# NLP & Analysis
sentence-transformers==2.3.1
spacy==3.7.2
numpy==1.26.3
pandas==2.1.4

# Task Scheduling
apscheduler==3.10.4

# Configuration
pydantic==2.5.3
pydantic-settings==2.1.0
python-dotenv==1.0.0

# Utilities
python-dateutil==2.8.2
pytz==2023.3.post1

# Testing
pytest==7.4.4
pytest-asyncio==0.23.3
pytest-cov==4.1.0
httpx==0.26.0  # For testing FastAPI
faker==22.6.0

# Code Quality
black==23.12.1
ruff==0.1.11
mypy==1.8.0
```

**backend/pyproject.toml**:
```toml
[build-system]
requires = ["setuptools>=68.0"]
build-backend = "setuptools.build_meta"

[project]
name = "tradingapp-backend"
version = "0.1.0"
description = "Trading app intelligent financial insights backend"
requires-python = ">=3.13"
authors = [
    {name = "Trading App Team"}
]

[tool.black]
line-length = 100
target-version = ['py313']
include = '\.pyi?$'

[tool.ruff]
line-length = 100
select = ["E", "F", "I", "N", "W"]
ignore = []

[tool.mypy]
python_version = "3.13"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = false

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = "test_*.py"
python_classes = "Test*"
python_functions = "test_*"
asyncio_mode = "auto"
```

#### Commands to Execute:
```bash
cd backend

# Check Python version (should be 3.13+)
python3 --version

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Verify installation
python -c "import fastapi; print(f'FastAPI: {fastapi.__version__}')"
python -c "import crawl4ai; print(f'Crawl4AI installed')"
python -c "import sentence_transformers; print(f'sentence-transformers installed')"
```

---

### Task 4: Backend - Database Models & Alembic Setup
**Order**: Fourth
**Duration Estimate**: 45 minutes
**Dependencies**: Task 3

#### Steps:
1. Create SQLAlchemy base and session configuration
2. Initialize Alembic for migrations
3. Configure Alembic for async PostgreSQL
4. Create initial database models (basic structure)
5. Generate initial migration
6. Test database connection

#### Files to Create:

**backend/src/core/config.py**:
```python
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Trading App API"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str
    DATABASE_ECHO: bool = False

    # API
    API_PREFIX: str = "/api/v1"

    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
```

**backend/src/db/base.py**:
```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from src.core.config import settings


class Base(DeclarativeBase):
    pass


# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DATABASE_ECHO,
    future=True,
)

# Create session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


# Dependency for FastAPI
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

**backend/src/db/models.py** (Initial stub models):
```python
from datetime import datetime
from sqlalchemy import String, Text, Float, Integer, DateTime, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
import uuid

from src.db.base import Base


class Source(Base):
    """News sources and forecast providers"""
    __tablename__ = "sources"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    source_type: Mapped[str] = mapped_column(String(50))  # news, forecast, analyst
    credibility_score: Mapped[float] = mapped_column(Float, default=0.5)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    scrape_config: Mapped[dict] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Article(Base):
    """Scraped articles and forecasts"""
    __tablename__ = "articles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=True)
    url: Mapped[str] = mapped_column(String(1000), nullable=False, unique=True)
    published_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    scraped_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    metadata: Mapped[dict] = mapped_column(JSON, nullable=True)


# Import all models here to ensure they're registered
__all__ = ["Source", "Article", "Base"]
```

**backend/alembic.ini**:
```ini
[alembic]
script_location = alembic
prepend_sys_path = .
version_path_separator = os

[alembic:exclude]
tables = spatial_ref_sys

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
```

#### Commands to Execute:
```bash
cd backend

# Initialize Alembic
alembic init alembic

# Edit alembic/env.py to use async and import models
# (See detailed content in Files to Modify section below)

# Create initial migration
alembic revision --autogenerate -m "Initial database schema"

# Apply migration
alembic upgrade head

# Verify tables created in Supabase
```

**backend/alembic/env.py** (Modified for async):
```python
import asyncio
from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config
from alembic import context
from src.core.config import settings
from src.db.base import Base
from src.db.models import *  # Import all models

config = context.config
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

---

### Task 5: Backend - FastAPI Application Setup
**Order**: Fifth
**Duration Estimate**: 30 minutes
**Dependencies**: Task 4

#### Steps:
1. Create FastAPI application with basic configuration
2. Set up CORS middleware
3. Create health check endpoint
4. Create basic API router structure
5. Test local server startup

#### Files to Create:

**backend/src/main.py**:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.api import health

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url=f"{settings.API_PREFIX}/docs",
    openapi_url=f"{settings.API_PREFIX}/openapi.json",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix=settings.API_PREFIX, tags=["health"])


@app.get("/")
async def root():
    return {
        "message": "Trading App API",
        "version": settings.APP_VERSION,
        "docs": f"{settings.API_PREFIX}/docs"
    }
```

**backend/src/api/health.py**:
```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from src.db.base import get_db

router = APIRouter()


@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """Health check endpoint with database connectivity test"""
    try:
        # Test database connection
        result = await db.execute(text("SELECT 1"))
        db_status = "healthy" if result else "unhealthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "database": db_status,
        "version": "0.1.0"
    }
```

**backend/.env.example**:
```env
# Application
APP_NAME=Trading App API
APP_VERSION=0.1.0
DEBUG=True

# Database (Supabase)
DATABASE_URL=postgresql+asyncpg://postgres:[PASSWORD]@[HOST]:5432/postgres

# API Configuration
API_PREFIX=/api/v1

# CORS Origins (comma-separated)
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

#### Commands to Execute:
```bash
cd backend

# Copy .env.example to .env and fill in Supabase credentials
cp .env.example .env
# Edit .env with your Supabase DATABASE_URL

# Run FastAPI development server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# Test in another terminal:
curl http://localhost:8000/api/v1/health
```

---

### Task 6: Frontend - Next.js & TypeScript Setup
**Order**: Sixth (can run parallel with Task 3-5)
**Duration Estimate**: 45 minutes
**Dependencies**: Task 1

#### Steps:
1. Verify Node.js installation
2. Initialize Next.js project with TypeScript
3. Install all required dependencies
4. Configure TailwindCSS
5. Configure ESLint and Prettier
6. Set up basic folder structure
7. Create environment configuration

#### Commands to Execute:
```bash
cd frontend

# Initialize Next.js with TypeScript (interactive)
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# Answer prompts:
# - Would you like to use TypeScript? Yes
# - Would you like to use ESLint? Yes
# - Would you like to use Tailwind CSS? Yes
# - Would you like to use `src/` directory? Yes
# - Would you like to use App Router? Yes
# - Would you like to customize the default import alias? Yes (@/*)

# Install additional dependencies
npm install chart.js react-chartjs-2
npm install axios swr
npm install date-fns
npm install @supabase/supabase-js  # For Phase 5, but install now

# Install dev dependencies
npm install -D @types/node @types/react @types/react-dom
npm install -D @playwright/test
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D jest jest-environment-jsdom
npm install -D prettier prettier-plugin-tailwindcss
```

#### Files to Create/Modify:

**frontend/.prettierrc**:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**frontend/.eslintrc.json**:
```json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off"
  }
}
```

**frontend/tsconfig.json** (verify/update):
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**frontend/next.config.js**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig
```

**frontend/.env.example**:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Supabase (Phase 5 - Auth)
# NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**frontend/src/lib/api.ts** (API client stub):
```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check function
export async function checkHealth() {
  const response = await apiClient.get('/health');
  return response.data;
}
```

**frontend/src/app/page.tsx** (Update homepage):
```typescript
'use client';

import { useEffect, useState } from 'react';
import { checkHealth } from '@/lib/api';

export default function Home() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth()
      .then((data) => {
        setHealth(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Health check failed:', error);
        setLoading(false);
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Trading App</h1>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Backend Status</h2>
          {loading ? (
            <p>Loading...</p>
          ) : health ? (
            <div>
              <p className="text-green-600">✓ Backend Connected</p>
              <p className="text-sm text-gray-600 mt-2">Status: {health.status}</p>
              <p className="text-sm text-gray-600">Database: {health.database}</p>
            </div>
          ) : (
            <p className="text-red-600">✗ Backend Disconnected</p>
          )}
        </div>
      </div>
    </main>
  );
}
```

#### Test Commands:
```bash
cd frontend

# Copy environment file
cp .env.example .env.local

# Run development server
npm run dev

# Visit http://localhost:3000 to see the app
```

---

### Task 7: Testing Framework Configuration
**Order**: Seventh
**Duration Estimate**: 40 minutes
**Dependencies**: Task 5 (backend), Task 6 (frontend)

#### Backend Testing Setup:

**backend/tests/conftest.py**:
```python
import pytest
import asyncio
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from httpx import AsyncClient
from src.main import app
from src.db.base import Base, get_db
from src.core.config import settings

# Test database URL (should be different from dev)
TEST_DATABASE_URL = settings.DATABASE_URL.replace("/postgres", "/postgres_test")

test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestSessionLocal = async_sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)


@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Create test database session"""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestSessionLocal() as session:
        yield session

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Create test client"""
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(app=app, base_url="http://test") as test_client:
        yield test_client

    app.dependency_overrides.clear()
```

**backend/tests/unit/test_health.py**:
```python
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    """Test health check endpoint"""
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "database" in data
    assert data["status"] in ["healthy", "degraded"]


@pytest.mark.asyncio
async def test_root_endpoint(client: AsyncClient):
    """Test root endpoint"""
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data
```

#### Frontend Testing Setup:

**frontend/jest.config.js**:
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

**frontend/jest.setup.js**:
```javascript
import '@testing-library/jest-dom';
```

**frontend/playwright.config.ts**:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**frontend/tests/e2e/home.spec.ts**:
```typescript
import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');

  // Check title
  await expect(page.locator('h1')).toContainText('Trading App');

  // Check backend status section exists
  await expect(page.locator('text=Backend Status')).toBeVisible();
});

test('backend health check displays', async ({ page }) => {
  await page.goto('/');

  // Wait for health check to complete
  await page.waitForSelector('text=Backend Connected', { timeout: 5000 });

  // Verify status is shown
  const status = await page.locator('text=Status:');
  await expect(status).toBeVisible();
});
```

**Update frontend/package.json** (add test scripts):
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

### Task 8: GitHub Actions CI/CD Pipeline
**Order**: Eighth
**Duration Estimate**: 30 minutes
**Dependencies**: Task 7

#### Files to Create:

**.github/workflows/backend-ci.yml**:
```yaml
name: Backend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'backend/**'

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: postgres_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.13'
          cache: 'pip'

      - name: Install dependencies
        working-directory: ./backend
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          python -m spacy download en_core_web_sm

      - name: Run linting (Ruff)
        working-directory: ./backend
        run: ruff check src/

      - name: Run formatting check (Black)
        working-directory: ./backend
        run: black --check src/

      - name: Run type checking (mypy)
        working-directory: ./backend
        run: mypy src/ --ignore-missing-imports
        continue-on-error: true

      - name: Run tests
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql+asyncpg://postgres:postgres@localhost:5432/postgres_test
        run: |
          pytest tests/ -v --cov=src --cov-report=xml --cov-report=term

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage.xml
          flags: backend
```

**.github/workflows/frontend-ci.yml**:
```yaml
name: Frontend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'frontend/**'
      - '.github/workflows/frontend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'frontend/**'

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Run linting
        working-directory: ./frontend
        run: npm run lint

      - name: Run formatting check
        working-directory: ./frontend
        run: npx prettier --check .

      - name: Run type checking
        working-directory: ./frontend
        run: npx tsc --noEmit

      - name: Run unit tests
        working-directory: ./frontend
        run: npm test -- --coverage

      - name: Build
        working-directory: ./frontend
        run: npm run build

      - name: Install Playwright browsers
        working-directory: ./frontend
        run: npx playwright install --with-deps

      - name: Run E2E tests
        working-directory: ./frontend
        run: npm run test:e2e
        env:
          NEXT_PUBLIC_API_URL: http://localhost:8000/api/v1

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: frontend/playwright-report/
          retention-days: 30
```

---

### Task 9: IDE Configuration
**Order**: Ninth
**Duration Estimate**: 15 minutes
**Dependencies**: Task 1

#### Files to Create:

**.vscode/settings.json**:
```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/backend/venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.ruffEnabled": true,
  "python.formatting.provider": "black",
  "python.formatting.blackArgs": ["--line-length", "100"],
  "python.testing.pytestEnabled": true,
  "python.testing.pytestArgs": ["backend/tests"],
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": true
    }
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "files.exclude": {
    "**/__pycache__": true,
    "**/*.pyc": true,
    "**/.pytest_cache": true,
    "**/node_modules": true,
    "**/.next": true
  },
  "typescript.tsdk": "frontend/node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

**.vscode/extensions.json**:
```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.black-formatter",
    "charliermarsh.ruff",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-playwright.playwright"
  ]
}
```

**.idea/.gitignore** (for JetBrains IDEs):
```gitignore
# JetBrains IDEs
.idea/workspace.xml
.idea/tasks.xml
.idea/usage.statistics.xml
.idea/dictionaries
.idea/shelf
.idea/dataSources.local.xml
.idea/dataSources.ids
.idea/sqlDataSources.xml
.idea/dynamic.xml
.idea/uiDesigner.xml
.idea/dbnavigator.xml
.idea/httpRequests/
```

---

### Task 10: Documentation & Developer Onboarding
**Order**: Tenth (Final)
**Duration Estimate**: 45 minutes
**Dependencies**: All previous tasks

#### Files to Create:

**README.md** (Root):
```markdown
# Trading App - Intelligent Financial Insights Platform

An intelligent platform that aggregates market news and forecasts from multiple sources, identifies patterns and correlations, tracks source accuracy over time, and provides real-time alerts for high-confidence investment opportunities.

## Features

- **Automated Data Aggregation**: Web scraping from 5-10 diverse financial sources
- **Intelligent Analysis**: Correlation and conflict detection across sources
- **Historical Tracking**: Source accuracy metrics over time
- **Real-time Alerts**: Push notifications for high-confidence opportunities
- **Interactive Dashboard**: Data visualization with Chart.js

## Tech Stack

### Backend
- Python 3.13+ with FastAPI
- PostgreSQL (Supabase)
- crawl4ai for web scraping
- sentence-transformers + spaCy for NLP
- APScheduler for task scheduling

### Frontend
- Next.js 14+ (App Router)
- React + TypeScript
- TailwindCSS
- Chart.js

### DevOps
- GitHub Actions CI/CD
- Vercel (frontend deployment)
- Railway/Render (backend deployment)

## Project Structure

```
tradingapp/
├── backend/          # Python FastAPI backend
├── frontend/         # Next.js frontend
├── docs/             # Project documentation
└── .github/          # CI/CD workflows
```

## Getting Started

See [Developer Onboarding Guide](./docs/DEVELOPER_ONBOARDING.md) for detailed setup instructions.

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tradingapp
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your Supabase credentials
   alembic upgrade head
   uvicorn src.main:app --reload
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

4. **Visit**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/api/v1/docs

## Development

### Backend Commands
```bash
cd backend

# Run tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=src --cov-report=html

# Linting
ruff check src/
black src/

# Database migrations
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

### Frontend Commands
```bash
cd frontend

# Run tests
npm test

# E2E tests
npm run test:e2e

# Linting
npm run lint
npm run format

# Build
npm run build
```

## Documentation

- [Initial Idea](./docs/INITIAL_IDEA.md)
- [Implementation Plan](./docs/IMPLEMENTATION_PLAN.md)
- [Phase 1 Details](./docs/PHASE_1_DETAILED.md)
- [Developer Onboarding](./docs/DEVELOPER_ONBOARDING.md)

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Ensure tests pass
4. Submit a pull request

## License

[Add your license here]
```

**docs/DEVELOPER_ONBOARDING.md**:
```markdown
# Developer Onboarding Guide

Welcome to the Trading App project! This guide will help you set up your development environment and get started contributing.

## Prerequisites

### Required Software
- **Python 3.13+**: [Download](https://www.python.org/downloads/)
- **Node.js 20+**: [Download](https://nodejs.org/)
- **Git**: [Download](https://git-scm.com/)
- **PostgreSQL Client** (optional, for direct DB access)

### Accounts Needed
- **GitHub**: For repository access
- **Supabase**: For database hosting (free tier)

## Environment Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd tradingapp
```

### 2. Supabase Setup

1. **Create Account**: Visit [supabase.com](https://supabase.com) and sign up
2. **Create Project**:
   - Click "New Project"
   - Name: `tradingapp-dev` (or your preference)
   - Generate strong database password (save securely)
   - Select region closest to you
   - Click "Create Project"

3. **Get Connection Details**:
   - Navigate to: Project Settings > Database
   - Copy the "Connection string" (URI mode)
   - Format: `postgresql://postgres:[password]@[host]:5432/postgres`
   - Convert to async: `postgresql+asyncpg://postgres:[password]@[host]:5432/postgres`

4. **Enable Extensions** (SQL Editor):
   ```sql
   CREATE EXTENSION IF NOT EXISTS pg_trgm;
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

### 3. Backend Setup

```bash
cd backend

# Verify Python version (should be 3.13+)
python3 --version

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Configure environment
cp .env.example .env
# Edit .env and add your Supabase DATABASE_URL

# Run database migrations
alembic upgrade head

# Verify setup
python -c "import fastapi; print('FastAPI OK')"
python -c "import crawl4ai; print('Crawl4AI OK')"

# Start development server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**Test Backend**: Visit http://localhost:8000/api/v1/docs

### 4. Frontend Setup

```bash
cd frontend

# Verify Node.js version (should be 20+)
node --version

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Ensure NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Start development server
npm run dev
```

**Test Frontend**: Visit http://localhost:3000

### 5. Verify Full Stack

1. Backend running: http://localhost:8000/api/v1/health
2. Frontend running: http://localhost:3000
3. Frontend shows "Backend Connected" status

## IDE Setup

### VS Code (Recommended)

1. **Install Extensions**:
   - Python (ms-python.python)
   - Black Formatter (ms-python.black-formatter)
   - Ruff (charliermarsh.ruff)
   - ESLint (dbaeumer.vscode-eslint)
   - Prettier (esbenp.prettier-vscode)
   - Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
   - Playwright Test (ms-playwright.playwright)

2. **Settings**: Already configured in `.vscode/settings.json`

### JetBrains IDEs (PyCharm / WebStorm)

1. **Python Interpreter**:
   - File > Settings > Project > Python Interpreter
   - Add Interpreter > Existing Environment
   - Select `backend/venv/bin/python`

2. **Node.js**:
   - File > Settings > Languages & Frameworks > Node.js
   - Select Node.js installation

3. **Formatting**:
   - Enable Black for Python files
   - Enable Prettier for TypeScript/JavaScript

## Development Workflow

### Git Flow Branching

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches
- `hotfix/*`: Emergency production fixes

### Creating a Feature

```bash
# Ensure you're on develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, commit regularly
git add .
git commit -m "Descriptive commit message"

# Push to remote
git push origin feature/your-feature-name

# Create Pull Request on GitHub (target: develop)
```

### Before Committing

**Backend**:
```bash
cd backend

# Run tests
pytest tests/ -v

# Lint and format
ruff check src/
black src/

# Type check (optional)
mypy src/ --ignore-missing-imports
```

**Frontend**:
```bash
cd frontend

# Run tests
npm test

# Lint and format
npm run lint
npm run format

# Type check
npx tsc --noEmit

# Build check
npm run build
```

## Running Tests

### Backend Tests
```bash
cd backend
source venv/bin/activate

# All tests
pytest tests/ -v

# Specific test file
pytest tests/unit/test_health.py -v

# With coverage
pytest tests/ --cov=src --cov-report=html
# Open htmlcov/index.html in browser
```

### Frontend Tests
```bash
cd frontend

# Unit tests
npm test

# Watch mode
npm run test:watch

# E2E tests (requires app running)
npm run test:e2e

# E2E with UI
npm run test:e2e:ui
```

## Common Tasks

### Database Migrations

**Create Migration**:
```bash
cd backend
source venv/bin/activate
alembic revision --autogenerate -m "Description of changes"
```

**Apply Migrations**:
```bash
alembic upgrade head
```

**Rollback**:
```bash
alembic downgrade -1  # Rollback 1 migration
```

### Adding Dependencies

**Backend**:
```bash
cd backend
source venv/bin/activate
pip install package-name
pip freeze > requirements.txt
```

**Frontend**:
```bash
cd frontend
npm install package-name
# package.json and package-lock.json automatically updated
```

## Troubleshooting

### Backend Issues

**ImportError: No module named 'X'**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Database Connection Failed**
- Verify DATABASE_URL in `.env`
- Check Supabase project is running
- Ensure async driver: `postgresql+asyncpg://...`

**Port 8000 Already in Use**
```bash
# Find process
lsof -i :8000
# Kill process
kill -9 <PID>
```

### Frontend Issues

**Module Not Found**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 Already in Use**
```bash
# Find process
lsof -i :3000
# Kill process
kill -9 <PID>
```

**Build Errors**
```bash
rm -rf .next
npm run build
```

## Getting Help

- **Documentation**: Check `docs/` folder
- **API Docs**: http://localhost:8000/api/v1/docs (when running)
- **GitHub Issues**: Report bugs and request features
- **Code Review**: Ask questions in pull requests

## Next Steps

1. ✅ Complete environment setup
2. ✅ Run backend and frontend locally
3. ✅ Run test suites successfully
4. 📖 Read [Implementation Plan](./IMPLEMENTATION_PLAN.md)
5. 📖 Review existing code in `backend/src/` and `frontend/src/`
6. 🎯 Pick a task from current phase and create feature branch
7. 💻 Start coding!

Welcome to the team! 🚀
```

**backend/README.md**:
```markdown
# Trading App Backend

FastAPI-based backend for the Trading App platform.

## Tech Stack

- FastAPI 0.109+
- Python 3.13+
- PostgreSQL (Supabase)
- SQLAlchemy 2.0 (async)
- crawl4ai (web scraping)
- sentence-transformers + spaCy (NLP)

## Setup

See [Developer Onboarding](../docs/DEVELOPER_ONBOARDING.md) for detailed setup.

### Quick Start

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with Supabase credentials
alembic upgrade head
uvicorn src.main:app --reload
```

## Project Structure

```
backend/
├── src/
│   ├── api/            # API endpoints
│   ├── core/           # Configuration, logging
│   ├── db/             # Database models, session
│   ├── scrapers/       # Web scraping modules
│   ├── analysis/       # NLP, correlation detection
│   ├── services/       # Business logic
│   └── main.py         # FastAPI app
├── tests/
│   ├── unit/
│   ├── integration/
│   └── conftest.py
├── alembic/            # Database migrations
└── requirements.txt
```

## Development

### Run Server
```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### Run Tests
```bash
pytest tests/ -v --cov=src
```

### Database Migrations
```bash
# Create migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Code Quality
```bash
# Lint
ruff check src/

# Format
black src/

# Type check
mypy src/ --ignore-missing-imports
```

## API Documentation

When running, visit:
- Swagger UI: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc
```

**frontend/README.md**:
```markdown
# Trading App Frontend

Next.js-based frontend for the Trading App platform.

## Tech Stack

- Next.js 14+ (App Router)
- React 18+
- TypeScript
- TailwindCSS
- Chart.js
- Playwright (E2E testing)

## Setup

See [Developer Onboarding](../docs/DEVELOPER_ONBOARDING.md) for detailed setup.

### Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Project Structure

```
frontend/
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components
│   ├── lib/            # Utilities, API client
│   ├── styles/         # Global styles
│   └── types/          # TypeScript types
├── public/             # Static assets
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/            # Playwright tests
└── package.json
```

## Development

### Run Dev Server
```bash
npm run dev
# Visit http://localhost:3000
```

### Run Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```

### Code Quality
```bash
# Lint
npm run lint

# Format
npm run format

# Type check
npx tsc --noEmit
```

### Build
```bash
npm run build
npm start
```

## Key Features

- Server-side rendering (SSR)
- Responsive design (mobile-first)
- Dark mode support (future)
- Real-time data updates
- Interactive charts
```

---

## Configuration Files Summary

### Files to Create:
1. `.gitignore` (root)
2. `backend/requirements.txt`
3. `backend/pyproject.toml`
4. `backend/.env.example`
5. `backend/src/core/config.py`
6. `backend/src/db/base.py`
7. `backend/src/db/models.py`
8. `backend/alembic.ini`
9. `backend/alembic/env.py`
10. `backend/src/main.py`
11. `backend/src/api/health.py`
12. `backend/tests/conftest.py`
13. `backend/tests/unit/test_health.py`
14. `backend/README.md`
15. `frontend/.env.example`
16. `frontend/.prettierrc`
17. `frontend/.eslintrc.json`
18. `frontend/tsconfig.json`
19. `frontend/next.config.js`
20. `frontend/jest.config.js`
21. `frontend/jest.setup.js`
22. `frontend/playwright.config.ts`
23. `frontend/src/lib/api.ts`
24. `frontend/src/app/page.tsx`
25. `frontend/tests/e2e/home.spec.ts`
26. `frontend/README.md`
27. `.github/workflows/backend-ci.yml`
28. `.github/workflows/frontend-ci.yml`
29. `.vscode/settings.json`
30. `.vscode/extensions.json`
31. `.idea/.gitignore`
32. `README.md` (root)
33. `docs/DEVELOPER_ONBOARDING.md`

### Files to Modify:
- `frontend/package.json` (add test scripts)

---

## Validation Criteria

### ✅ Phase 1 Complete When:

#### Infrastructure:
- [ ] Supabase project created and accessible
- [ ] Database connection verified
- [ ] PostgreSQL extensions enabled (pg_trgm, uuid-ossp, vector)

#### Backend:
- [ ] Python 3.13+ installed and virtual environment activated
- [ ] All dependencies installed successfully
- [ ] Database migrations run without errors
- [ ] FastAPI server starts on port 8000
- [ ] Health check endpoint returns 200: `GET /api/v1/health`
- [ ] API documentation accessible: http://localhost:8000/api/v1/docs
- [ ] Backend tests pass: `pytest tests/ -v`
- [ ] Code quality checks pass: `ruff check src/ && black --check src/`

#### Frontend:
- [ ] Node.js 20+ installed
- [ ] All npm dependencies installed
- [ ] Development server starts on port 3000
- [ ] Homepage loads and displays "Backend Connected"
- [ ] Frontend tests pass: `npm test`
- [ ] Linting passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] E2E tests pass: `npm run test:e2e`

#### CI/CD:
- [ ] GitHub Actions workflows created
- [ ] Backend CI workflow passes on push/PR
- [ ] Frontend CI workflow passes on push/PR

#### Documentation:
- [ ] Root README.md complete with quick start
- [ ] Developer onboarding guide complete
- [ ] Backend README with API info
- [ ] Frontend README with development guide
- [ ] All environment variables documented in .env.example files

#### Developer Experience:
- [ ] New developer can clone repo and run locally within 30 minutes
- [ ] IDE configurations working (VSCode or JetBrains)
- [ ] Git Flow branching strategy documented
- [ ] No errors or warnings in console on fresh setup

---

## Testing Requirements

### Unit Tests (Backend):
- **test_health.py**: Health check endpoint
- **Test database connection**: Verify DB session creation
- **Test configuration loading**: Verify .env parsing

### Unit Tests (Frontend):
- **API client tests**: Mock API calls
- **Component tests**: Test basic component rendering

### Integration Tests (Backend):
- **Database operations**: CRUD operations on models
- **API endpoint integration**: Full request/response cycle

### E2E Tests (Frontend):
- **home.spec.ts**: Homepage loads and backend status displays
- **Navigation test**: Can navigate between pages (when added)

### CI/CD Tests:
- **Backend CI**: Linting, formatting, type checking, unit tests
- **Frontend CI**: Linting, formatting, type checking, unit tests, build, E2E tests

---

## Estimated Timeline

- **Task 1** (Project Structure): 30 minutes
- **Task 2** (Supabase): 20 minutes
- **Task 3** (Backend Setup): 30 minutes
- **Task 4** (Database Models): 45 minutes
- **Task 5** (FastAPI App): 30 minutes
- **Task 6** (Frontend Setup): 45 minutes
- **Task 7** (Testing Config): 40 minutes
- **Task 8** (CI/CD): 30 minutes
- **Task 9** (IDE Config): 15 minutes
- **Task 10** (Documentation): 45 minutes

**Total Estimated Time**: ~5.5 hours

---

## Dependencies & Prerequisites

### System Requirements:
- Ubuntu (dev environment)
- 4GB+ RAM
- 10GB+ free disk space

### Software to Install:
1. Python 3.13+ (latest)
2. Node.js 20+ (latest LTS)
3. Git
4. PostgreSQL client (optional, for direct DB access)

### External Services:
1. Supabase account (free tier)
2. GitHub account (for repository and Actions)

### Environment Variables Required:

**Backend (.env)**:
```
DATABASE_URL=postgresql+asyncpg://postgres:[PASSWORD]@[HOST]:5432/postgres
DEBUG=True
BACKEND_CORS_ORIGINS=http://localhost:3000
```

**Frontend (.env.local)**:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## Risk Mitigation

### Potential Issues:

1. **Dependency Installation Failures**:
   - Use latest pip: `pip install --upgrade pip`
   - Clear cache: `pip cache purge`
   - Use wheels when available

2. **Database Connection Issues**:
   - Verify Supabase project is running
   - Check firewall rules
   - Confirm connection string format (async driver)

3. **Port Conflicts**:
   - Backend: Use `lsof -i :8000` to find conflicts
   - Frontend: Use `lsof -i :3000` to find conflicts
   - Kill processes or change ports

4. **Version Mismatches**:
   - Use exact versions in requirements.txt
   - Lock frontend dependencies with package-lock.json
   - Document minimum versions

5. **CI/CD Failures**:
   - Test workflows locally with act (GitHub Actions emulator)
   - Ensure all secrets/env vars configured in GitHub
   - Use caching to speed up workflows

---

## Post-Phase 1 Verification Checklist

Run these commands to verify Phase 1 completion:

```bash
# Backend verification
cd backend
source venv/bin/activate
python -c "import fastapi, crawl4ai, sqlalchemy; print('All imports OK')"
alembic current
pytest tests/ -v
ruff check src/
black --check src/

# Frontend verification
cd frontend
npm run lint
npm test
npm run build
npm run test:e2e

# Full stack test
# 1. Start backend: uvicorn src.main:app --reload (terminal 1)
# 2. Start frontend: npm run dev (terminal 2)
# 3. Visit http://localhost:3000 (should show "Backend Connected")
# 4. Visit http://localhost:8000/api/v1/docs (should show Swagger UI)

# Git verification
git status  # Should be clean or only untracked .env files
git log --oneline -5  # Should show Phase 1 commits
```

---

## Success Metrics

### Quantitative:
- ✅ 100% of validation criteria met
- ✅ All tests passing (target: 10+ tests total)
- ✅ Code coverage >80% (both backend and frontend)
- ✅ CI/CD workflows green
- ✅ Zero critical linting errors

### Qualitative:
- ✅ Developer can clone and run locally in <30 minutes
- ✅ Documentation is clear and comprehensive
- ✅ Code follows established patterns and conventions
- ✅ Project structure is logical and organized
- ✅ Ready to begin Phase 2 (Database Schema Design)

---

## Next Phase Preview

**Phase 2: Database Schema & Data Models**

After completing Phase 1, we'll have a solid foundation. Phase 2 will focus on:
1. Designing comprehensive database schema
2. Creating all SQLAlchemy models (Sources, Articles, Predictions, Users, Alerts)
3. Setting up relationships and indexes
4. Creating seed data for testing
5. Implementing database access patterns

Estimated Timeline: 2-3 days

---

## Notes

- Keep `.env` files out of version control (already in .gitignore)
- Use `.env.example` as template for required variables
- Commit frequently with descriptive messages
- Run tests before pushing
- Update documentation as you make changes
- Use feature branches for all development
- Create PR to `develop` branch, not `main`
