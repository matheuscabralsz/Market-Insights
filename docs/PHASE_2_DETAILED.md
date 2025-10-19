# Phase 2: Database Schema & Data Models - Detailed Documentation

## Overview
This phase designs and implements the complete database schema supporting all core features. We'll create tables for sources, articles, predictions, assets, users, alerts, and tracking systems. The schema is optimized for time-series queries, full-text search, and historical accuracy tracking.

## Technology Decisions

### Database Design Principles
- **Normalization**: 3NF for most tables, denormalization only for performance
- **Extensibility**: Support easy addition of new asset types
- **Audit Trail**: Timestamps on all tables (created_at, updated_at)
- **Soft Deletes**: Where applicable (sources, users)
- **Indexing Strategy**: B-tree for lookups, GiST for full-text search
- **Data Types**: UUIDs for primary keys, JSONB for flexible data

### Schema Design Approach
- **Asset-Centric**: Predictions linked to specific assets
- **Source Tracking**: Every piece of data traced to its source
- **Signal-Based Predictions**: Simple sentiment signals (bearish to bullish)
- **Flexible Alerts**: JSON-based preferences for extensibility
- **Historical Accuracy**: Separate table tracking source performance

---

## Detailed Task Breakdown

### Task 1: Design Core Entity Schema
**Order**: First
**Duration Estimate**: 60 minutes

#### Entities to Design:

1. **sources** (Enhanced from Phase 1)
   - Tracks news sources, analysts, forecast providers
   - Includes credibility scoring and user-defined weights

2. **articles** (Enhanced from Phase 1)
   - Scraped content from sources
   - Cleaned text only, no raw HTML
   - Full-text search enabled

3. **asset_types**
   - Lookup table: forex, crypto, shares
   - Extensible for future asset classes

4. **assets**
   - Individual tradeable instruments
   - Forex pairs (EUR/USD), crypto (BTC/USDT), stocks (AAPL)
   - Linked to asset_type

5. **predictions**
   - Forecast signals from articles
   - Signal type: bearish/neutral/bullish (5 levels)
   - Timeframe: short-term, long-term
   - Risk level: low, medium, high
   - Outcome tracking for accuracy

6. **users** (Basic structure for Phase 5)
   - Minimal fields for foreign key relationships
   - Full implementation in Phase 5

7. **alerts**
   - User alert rules and preferences
   - Confidence thresholds, asset filters
   - JSONB for flexible preferences

8. **alert_history**
   - Notification delivery tracking
   - Read/unread status, delivery timestamp

9. **source_accuracy**
   - Aggregated accuracy metrics per source
   - Prediction success rates, confidence calibration

10. **correlations**
    - Detected correlations between predictions
    - Multiple sources agreeing on same signal

11. **conflicts**
    - Detected conflicts between predictions
    - Sources with opposing views

#### Database Relationships:
```
sources 1:N articles
articles 1:N predictions
assets 1:N predictions
sources 1:N source_accuracy (time-series)
predictions N:M correlations (self-referential)
predictions N:M conflicts (self-referential)
users 1:N alerts
alerts 1:N alert_history
```

---

### Task 2: Create Enhanced SQLAlchemy Models
**Order**: Second
**Duration Estimate**: 90 minutes
**Dependencies**: Task 1

#### Files to Modify/Create:

**backend/src/db/models.py** (Complete rewrite):

```python
from datetime import datetime
from typing import Optional
from enum import Enum as PyEnum
from sqlalchemy import (
    String, Text, Float, Integer, DateTime, Boolean, JSON,
    ForeignKey, Index, CheckConstraint, UniqueConstraint, Enum
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, TSVECTOR
import uuid

from src.db.base import Base


# ===== ENUMS =====

class SourceType(str, PyEnum):
    """Source type enumeration"""
    NEWS = "news"
    FORECAST = "forecast"
    ANALYST = "analyst"
    BLOG = "blog"
    SOCIAL = "social"


class AssetType(str, PyEnum):
    """Asset type enumeration"""
    FOREX = "forex"
    CRYPTO = "crypto"
    SHARES = "shares"


class SignalType(str, PyEnum):
    """Signal type enumeration (bearish to bullish)"""
    STRONG_BEARISH = "strong_bearish"
    BEARISH = "bearish"
    NEUTRAL = "neutral"
    BULLISH = "bullish"
    STRONG_BULLISH = "strong_bullish"


class TimeframeType(str, PyEnum):
    """Prediction timeframe"""
    SHORT_TERM = "short_term"  # Days to weeks
    LONG_TERM = "long_term"    # Weeks to months


class RiskLevel(str, PyEnum):
    """Risk level for predictions"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class PredictionOutcome(str, PyEnum):
    """Prediction verification outcome"""
    PENDING = "pending"
    CORRECT = "correct"
    INCORRECT = "incorrect"
    PARTIALLY_CORRECT = "partially_correct"
    EXPIRED = "expired"


class AlertStatus(str, PyEnum):
    """Alert status"""
    ACTIVE = "active"
    PAUSED = "paused"
    DISABLED = "disabled"


class NotificationStatus(str, PyEnum):
    """Notification delivery status"""
    PENDING = "pending"
    SENT = "sent"
    FAILED = "failed"
    READ = "read"


# ===== CORE TABLES =====

class Source(Base):
    """News sources, analysts, and forecast providers"""
    __tablename__ = "sources"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    source_type: Mapped[SourceType] = mapped_column(Enum(SourceType), nullable=False)

    # Credibility and weighting
    base_credibility_score: Mapped[float] = mapped_column(Float, default=0.5)  # System-calculated
    user_weight: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # User-defined

    # Configuration
    scrape_config: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    scrape_frequency_minutes: Mapped[int] = mapped_column(Integer, default=60)

    # Status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_scraped_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    consecutive_failures: Mapped[int] = mapped_column(Integer, default=0)

    # Metadata
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    language: Mapped[str] = mapped_column(String(10), default="en")
    timezone: Mapped[str] = mapped_column(String(50), default="UTC")

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)  # Soft delete

    # Relationships
    articles = relationship("Article", back_populates="source", cascade="all, delete-orphan")
    accuracy_records = relationship("SourceAccuracy", back_populates="source", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_sources_source_type", "source_type"),
        Index("ix_sources_is_active", "is_active"),
        Index("ix_sources_deleted_at", "deleted_at"),
    )


class Asset(Base):
    """Tradeable assets (forex pairs, crypto, stocks)"""
    __tablename__ = "assets"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_type: Mapped[AssetType] = mapped_column(Enum(AssetType), nullable=False)
    symbol: Mapped[str] = mapped_column(String(50), nullable=False)  # EUR/USD, BTC/USDT, AAPL
    name: Mapped[str] = mapped_column(String(255), nullable=False)  # Euro / US Dollar

    # Market data
    exchange: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # NYSE, Binance, Forex
    base_currency: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)  # For forex/crypto
    quote_currency: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)  # For forex/crypto

    # Metadata
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    predictions = relationship("Prediction", back_populates="asset", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint("asset_type", "symbol", name="uq_asset_type_symbol"),
        Index("ix_assets_asset_type", "asset_type"),
        Index("ix_assets_symbol", "symbol"),
        Index("ix_assets_is_active", "is_active"),
    )


class Article(Base):
    """Scraped articles and content from sources"""
    __tablename__ = "articles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("sources.id"), nullable=False)

    # Content
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # Cleaned text only
    url: Mapped[str] = mapped_column(String(1000), nullable=False, unique=True)
    author: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Timestamps
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    scraped_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Full-text search (populated by trigger or app)
    search_vector: Mapped[Optional[str]] = mapped_column(TSVECTOR, nullable=True)

    # Metadata
    metadata: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)  # Tags, categories, etc.
    language: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)

    # Processing status
    is_processed: Mapped[bool] = mapped_column(Boolean, default=False)  # LLM analysis complete
    processed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    # Relationships
    source = relationship("Source", back_populates="articles")
    predictions = relationship("Prediction", back_populates="article", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_articles_source_id", "source_id"),
        Index("ix_articles_published_at", "published_at"),
        Index("ix_articles_scraped_at", "scraped_at"),
        Index("ix_articles_is_processed", "is_processed"),
        Index("ix_articles_search_vector", "search_vector", postgresql_using="gin"),
    )


class Prediction(Base):
    """Predictions/forecasts extracted from articles"""
    __tablename__ = "predictions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    article_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("articles.id"), nullable=False)
    asset_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("assets.id"), nullable=False)

    # Prediction details
    signal_type: Mapped[SignalType] = mapped_column(Enum(SignalType), nullable=False)
    timeframe: Mapped[TimeframeType] = mapped_column(Enum(TimeframeType), nullable=False)
    risk_level: Mapped[RiskLevel] = mapped_column(Enum(RiskLevel), nullable=False)

    # Confidence and reasoning
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False)  # 0.0 to 1.0
    reasoning: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # LLM-extracted reasoning

    # Verification
    outcome: Mapped[PredictionOutcome] = mapped_column(
        Enum(PredictionOutcome),
        default=PredictionOutcome.PENDING
    )
    outcome_verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    outcome_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Target dates
    target_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)  # When to evaluate
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)  # No longer relevant after

    # Metadata
    metadata: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)  # Additional extracted info

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    article = relationship("Article", back_populates="predictions")
    asset = relationship("Asset", back_populates="predictions")

    __table_args__ = (
        Index("ix_predictions_article_id", "article_id"),
        Index("ix_predictions_asset_id", "asset_id"),
        Index("ix_predictions_signal_type", "signal_type"),
        Index("ix_predictions_timeframe", "timeframe"),
        Index("ix_predictions_outcome", "outcome"),
        Index("ix_predictions_confidence_score", "confidence_score"),
        Index("ix_predictions_created_at", "created_at"),
        Index("ix_predictions_target_date", "target_date"),
        CheckConstraint("confidence_score >= 0.0 AND confidence_score <= 1.0", name="ck_confidence_range"),
    )


# ===== ACCURACY TRACKING =====

class SourceAccuracy(Base):
    """Historical accuracy tracking for sources"""
    __tablename__ = "source_accuracy"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("sources.id"), nullable=False)

    # Time period
    period_start: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    period_end: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    # Accuracy metrics
    total_predictions: Mapped[int] = mapped_column(Integer, default=0)
    correct_predictions: Mapped[int] = mapped_column(Integer, default=0)
    incorrect_predictions: Mapped[int] = mapped_column(Integer, default=0)
    partially_correct_predictions: Mapped[int] = mapped_column(Integer, default=0)
    pending_predictions: Mapped[int] = mapped_column(Integer, default=0)

    # Calculated scores
    accuracy_score: Mapped[float] = mapped_column(Float, default=0.0)  # correct / total
    confidence_calibration: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # How well confidence matches outcomes

    # Breakdown by asset type
    accuracy_by_asset_type: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    source = relationship("Source", back_populates="accuracy_records")

    __table_args__ = (
        Index("ix_source_accuracy_source_id", "source_id"),
        Index("ix_source_accuracy_period_start", "period_start"),
        Index("ix_source_accuracy_period_end", "period_end"),
        UniqueConstraint("source_id", "period_start", "period_end", name="uq_source_period"),
    )


class Correlation(Base):
    """Detected correlations between predictions"""
    __tablename__ = "correlations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("assets.id"), nullable=False)

    # Correlated predictions (many-to-many via JSON array of UUIDs)
    prediction_ids: Mapped[list] = mapped_column(JSON, nullable=False)  # Array of prediction UUIDs

    # Correlation details
    signal_type: Mapped[SignalType] = mapped_column(Enum(SignalType), nullable=False)
    timeframe: Mapped[TimeframeType] = mapped_column(Enum(TimeframeType), nullable=False)
    source_count: Mapped[int] = mapped_column(Integer, nullable=False)  # Number of agreeing sources

    # Confidence
    aggregate_confidence: Mapped[float] = mapped_column(Float, nullable=False)  # Combined confidence
    correlation_strength: Mapped[float] = mapped_column(Float, nullable=False)  # 0.0 to 1.0

    # Timestamps
    detected_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    # Alert generated
    alert_sent: Mapped[bool] = mapped_column(Boolean, default=False)
    alert_sent_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    __table_args__ = (
        Index("ix_correlations_asset_id", "asset_id"),
        Index("ix_correlations_signal_type", "signal_type"),
        Index("ix_correlations_detected_at", "detected_at"),
        Index("ix_correlations_correlation_strength", "correlation_strength"),
        CheckConstraint("source_count >= 3", name="ck_min_sources"),  # Need 3+ sources
        CheckConstraint("correlation_strength >= 0.0 AND correlation_strength <= 1.0", name="ck_correlation_range"),
    )


class Conflict(Base):
    """Detected conflicts between predictions"""
    __tablename__ = "conflicts"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("assets.id"), nullable=False)

    # Conflicting predictions (JSON arrays of UUIDs by side)
    bullish_prediction_ids: Mapped[list] = mapped_column(JSON, nullable=False)
    bearish_prediction_ids: Mapped[list] = mapped_column(JSON, nullable=False)

    # Conflict details
    timeframe: Mapped[TimeframeType] = mapped_column(Enum(TimeframeType), nullable=False)
    bullish_count: Mapped[int] = mapped_column(Integer, nullable=False)
    bearish_count: Mapped[int] = mapped_column(Integer, nullable=False)

    # Confidence
    conflict_strength: Mapped[float] = mapped_column(Float, nullable=False)  # How strong the disagreement

    # Timestamps
    detected_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    resolution_outcome: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # Which side was right

    __table_args__ = (
        Index("ix_conflicts_asset_id", "asset_id"),
        Index("ix_conflicts_timeframe", "timeframe"),
        Index("ix_conflicts_detected_at", "detected_at"),
        CheckConstraint("conflict_strength >= 0.0 AND conflict_strength <= 1.0", name="ck_conflict_range"),
    )


# ===== USER & ALERTS =====

class User(Base):
    """Users (basic structure for Phase 5 auth implementation)"""
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)

    # Auth fields (to be fully implemented in Phase 5)
    password_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    # Profile
    display_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    timezone: Mapped[str] = mapped_column(String(50), default="UTC")

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)  # Soft delete

    # Relationships
    alerts = relationship("Alert", back_populates="user", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_users_email", "email"),
        Index("ix_users_is_active", "is_active"),
    )


class Alert(Base):
    """User alert configurations and preferences"""
    __tablename__ = "alerts"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    # Alert configuration
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Filters (JSONB for flexibility)
    preferences: Mapped[dict] = mapped_column(JSON, nullable=False)
    # Example structure:
    # {
    #   "asset_types": ["forex", "crypto"],
    #   "assets": ["EUR/USD", "BTC/USDT"],
    #   "min_confidence": 0.8,
    #   "min_sources": 3,
    #   "signal_types": ["bullish", "strong_bullish"],
    #   "timeframes": ["short_term"],
    #   "max_risk": "medium",
    #   "notify_on_conflicts": true
    # }

    # Status
    status: Mapped[AlertStatus] = mapped_column(Enum(AlertStatus), default=AlertStatus.ACTIVE)

    # Delivery settings
    notification_channels: Mapped[dict] = mapped_column(JSON, default=dict)  # {"push": true, "email": false}

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_triggered_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="alerts")
    notifications = relationship("AlertHistory", back_populates="alert", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_alerts_user_id", "user_id"),
        Index("ix_alerts_status", "status"),
    )


class AlertHistory(Base):
    """Notification delivery history"""
    __tablename__ = "alert_history"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    alert_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("alerts.id"), nullable=False)
    correlation_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("correlations.id"),
        nullable=True
    )

    # Notification content
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    notification_data: Mapped[dict] = mapped_column(JSON, nullable=False)  # Full correlation/conflict data

    # Delivery
    channel: Mapped[str] = mapped_column(String(50), nullable=False)  # push, email, sms
    status: Mapped[NotificationStatus] = mapped_column(Enum(NotificationStatus), default=NotificationStatus.PENDING)

    # Timestamps
    sent_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    read_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Error tracking
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    retry_count: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    alert = relationship("Alert", back_populates="notifications")

    __table_args__ = (
        Index("ix_alert_history_alert_id", "alert_id"),
        Index("ix_alert_history_status", "status"),
        Index("ix_alert_history_sent_at", "sent_at"),
        Index("ix_alert_history_created_at", "created_at"),
    )


# Import all models for Alembic
__all__ = [
    "Source", "Asset", "Article", "Prediction",
    "SourceAccuracy", "Correlation", "Conflict",
    "User", "Alert", "AlertHistory",
    # Enums
    "SourceType", "AssetType", "SignalType", "TimeframeType", "RiskLevel",
    "PredictionOutcome", "AlertStatus", "NotificationStatus",
]
```

---

### Task 3: Create Database Migrations
**Order**: Third
**Duration Estimate**: 30 minutes
**Dependencies**: Task 2

#### Commands to Execute:

```bash
cd backend
source venv/bin/activate

# Remove old migration (from Phase 1 stub)
rm -f alembic/versions/*

# Generate new comprehensive migration
alembic revision --autogenerate -m "Create comprehensive schema for Phase 2"

# Review the generated migration file
# Located at: alembic/versions/XXXX_create_comprehensive_schema_for_phase_2.py

# Apply migration
alembic upgrade head

# Verify tables created
python -c "
from sqlalchemy import inspect
from src.db.base import engine
import asyncio

async def check_tables():
    async with engine.connect() as conn:
        tables = await conn.run_sync(lambda sync_conn: inspect(sync_conn).get_table_names())
        print('Created tables:', tables)

asyncio.run(check_tables())
"
```

---

### Task 4: Create Seed Data for Testing
**Order**: Fourth
**Duration Estimate**: 45 minutes
**Dependencies**: Task 3

#### Files to Create:

**backend/src/db/seed.py**:

```python
"""Seed data for development and testing"""
import asyncio
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.base import AsyncSessionLocal
from src.db.models import (
    Source, Asset, Article, Prediction, User,
    SourceType, AssetType, SignalType, TimeframeType, RiskLevel
)


async def clear_all_data(db: AsyncSession):
    """Clear all existing data (for development only)"""
    print("Clearing existing data...")

    # Delete in reverse dependency order
    await db.execute("DELETE FROM alert_history")
    await db.execute("DELETE FROM alerts")
    await db.execute("DELETE FROM conflicts")
    await db.execute("DELETE FROM correlations")
    await db.execute("DELETE FROM source_accuracy")
    await db.execute("DELETE FROM predictions")
    await db.execute("DELETE FROM articles")
    await db.execute("DELETE FROM assets")
    await db.execute("DELETE FROM sources")
    await db.execute("DELETE FROM users")

    await db.commit()
    print("✓ Data cleared")


async def seed_sources(db: AsyncSession):
    """Create sample sources"""
    print("Seeding sources...")

    sources = [
        Source(
            name="Bloomberg Markets",
            url="https://www.bloomberg.com/markets",
            source_type=SourceType.NEWS,
            base_credibility_score=0.85,
            scrape_frequency_minutes=30,
            description="Leading global financial news provider",
        ),
        Source(
            name="Trading View Forecasts",
            url="https://www.tradingview.com/markets/currencies/forex-cross-rates/",
            source_type=SourceType.FORECAST,
            base_credibility_score=0.75,
            scrape_frequency_minutes=60,
            description="Technical analysis and forecasts",
        ),
        Source(
            name="Crypto Insights Daily",
            url="https://cryptoinsightsdaily.example.com",
            source_type=SourceType.ANALYST,
            base_credibility_score=0.70,
            scrape_frequency_minutes=120,
            description="Cryptocurrency analysis and predictions",
        ),
        Source(
            name="FX Street Analysis",
            url="https://www.fxstreet.com",
            source_type=SourceType.FORECAST,
            base_credibility_score=0.78,
            scrape_frequency_minutes=60,
            description="Forex market analysis and forecasts",
        ),
        Source(
            name="MarketWatch Stocks",
            url="https://www.marketwatch.com",
            source_type=SourceType.NEWS,
            base_credibility_score=0.82,
            scrape_frequency_minutes=45,
            description="Stock market news and analysis",
        ),
    ]

    db.add_all(sources)
    await db.commit()
    print(f"✓ Created {len(sources)} sources")
    return sources


async def seed_assets(db: AsyncSession):
    """Create sample assets"""
    print("Seeding assets...")

    assets = [
        # Forex
        Asset(
            asset_type=AssetType.FOREX,
            symbol="EUR/USD",
            name="Euro / US Dollar",
            exchange="Forex",
            base_currency="EUR",
            quote_currency="USD",
        ),
        Asset(
            asset_type=AssetType.FOREX,
            symbol="GBP/USD",
            name="British Pound / US Dollar",
            exchange="Forex",
            base_currency="GBP",
            quote_currency="USD",
        ),
        Asset(
            asset_type=AssetType.FOREX,
            symbol="USD/JPY",
            name="US Dollar / Japanese Yen",
            exchange="Forex",
            base_currency="USD",
            quote_currency="JPY",
        ),
        # Crypto
        Asset(
            asset_type=AssetType.CRYPTO,
            symbol="BTC/USDT",
            name="Bitcoin / Tether",
            exchange="Binance",
            base_currency="BTC",
            quote_currency="USDT",
        ),
        Asset(
            asset_type=AssetType.CRYPTO,
            symbol="ETH/USDT",
            name="Ethereum / Tether",
            exchange="Binance",
            base_currency="ETH",
            quote_currency="USDT",
        ),
        Asset(
            asset_type=AssetType.CRYPTO,
            symbol="SOL/USDT",
            name="Solana / Tether",
            exchange="Binance",
            base_currency="SOL",
            quote_currency="USDT",
        ),
        # Shares
        Asset(
            asset_type=AssetType.SHARES,
            symbol="AAPL",
            name="Apple Inc.",
            exchange="NASDAQ",
            description="Technology - Consumer Electronics",
        ),
        Asset(
            asset_type=AssetType.SHARES,
            symbol="TSLA",
            name="Tesla Inc.",
            exchange="NASDAQ",
            description="Automotive - Electric Vehicles",
        ),
        Asset(
            asset_type=AssetType.SHARES,
            symbol="NVDA",
            name="NVIDIA Corporation",
            exchange="NASDAQ",
            description="Technology - Semiconductors",
        ),
    ]

    db.add_all(assets)
    await db.commit()
    print(f"✓ Created {len(assets)} assets")
    return assets


async def seed_users(db: AsyncSession):
    """Create sample users"""
    print("Seeding users...")

    users = [
        User(
            email="test@example.com",
            display_name="Test User",
            is_active=True,
            is_verified=True,
        ),
        User(
            email="trader@example.com",
            display_name="Pro Trader",
            is_active=True,
            is_verified=True,
        ),
    ]

    db.add_all(users)
    await db.commit()
    print(f"✓ Created {len(users)} users")
    return users


async def seed_articles_and_predictions(db: AsyncSession, sources: list[Source], assets: list[Asset]):
    """Create sample articles with predictions"""
    print("Seeding articles and predictions...")

    articles_data = [
        {
            "source": sources[0],  # Bloomberg
            "title": "EUR/USD Shows Strong Bullish Momentum",
            "content": "The Euro continues to strengthen against the US Dollar, with technical indicators suggesting further upside potential. Analysts cite improving European economic data as a key driver.",
            "url": "https://bloomberg.example.com/eur-usd-bullish-2024",
            "published_at": datetime.utcnow() - timedelta(hours=2),
            "predictions": [
                {
                    "asset": next(a for a in assets if a.symbol == "EUR/USD"),
                    "signal_type": SignalType.BULLISH,
                    "timeframe": TimeframeType.SHORT_TERM,
                    "risk_level": RiskLevel.MEDIUM,
                    "confidence_score": 0.82,
                    "reasoning": "Technical breakout confirmed, strong fundamentals",
                }
            ]
        },
        {
            "source": sources[1],  # Trading View
            "title": "Bitcoin Technical Analysis: Consolidation Phase",
            "content": "BTC/USDT is consolidating between key support and resistance levels. A breakout in either direction could lead to significant moves.",
            "url": "https://tradingview.example.com/btc-analysis-123",
            "published_at": datetime.utcnow() - timedelta(hours=5),
            "predictions": [
                {
                    "asset": next(a for a in assets if a.symbol == "BTC/USDT"),
                    "signal_type": SignalType.NEUTRAL,
                    "timeframe": TimeframeType.SHORT_TERM,
                    "risk_level": RiskLevel.LOW,
                    "confidence_score": 0.65,
                    "reasoning": "Awaiting directional breakout from consolidation",
                }
            ]
        },
        {
            "source": sources[2],  # Crypto Insights
            "title": "Ethereum Upgrade Could Drive Long-Term Growth",
            "content": "The upcoming Ethereum network upgrade is expected to improve scalability and reduce fees, potentially driving long-term bullish sentiment.",
            "url": "https://cryptoinsights.example.com/eth-upgrade-2024",
            "published_at": datetime.utcnow() - timedelta(hours=8),
            "predictions": [
                {
                    "asset": next(a for a in assets if a.symbol == "ETH/USDT"),
                    "signal_type": SignalType.STRONG_BULLISH,
                    "timeframe": TimeframeType.LONG_TERM,
                    "risk_level": RiskLevel.MEDIUM,
                    "confidence_score": 0.78,
                    "reasoning": "Fundamental upgrade catalyst, long-term growth potential",
                }
            ]
        },
        {
            "source": sources[3],  # FX Street
            "title": "USD/JPY Under Pressure from BoJ Policy Shift",
            "content": "The Bank of Japan's policy adjustments are putting downward pressure on USD/JPY as yield differentials narrow.",
            "url": "https://fxstreet.example.com/usdjpy-boj-2024",
            "published_at": datetime.utcnow() - timedelta(hours=3),
            "predictions": [
                {
                    "asset": next(a for a in assets if a.symbol == "USD/JPY"),
                    "signal_type": SignalType.BEARISH,
                    "timeframe": TimeframeType.SHORT_TERM,
                    "risk_level": RiskLevel.MEDIUM,
                    "confidence_score": 0.75,
                    "reasoning": "Central bank policy divergence, yield compression",
                }
            ]
        },
        {
            "source": sources[4],  # MarketWatch
            "title": "Apple Stock: AI Integration Could Drive Growth",
            "content": "Apple's aggressive AI integration across its product lineup has analysts optimistic about future revenue growth and margin expansion.",
            "url": "https://marketwatch.example.com/aapl-ai-2024",
            "published_at": datetime.utcnow() - timedelta(hours=6),
            "predictions": [
                {
                    "asset": next(a for a in assets if a.symbol == "AAPL"),
                    "signal_type": SignalType.BULLISH,
                    "timeframe": TimeframeType.LONG_TERM,
                    "risk_level": RiskLevel.LOW,
                    "confidence_score": 0.88,
                    "reasoning": "Strong product cycle, AI adoption, solid fundamentals",
                }
            ]
        },
    ]

    for article_data in articles_data:
        # Create article
        article = Article(
            source_id=article_data["source"].id,
            title=article_data["title"],
            content=article_data["content"],
            url=article_data["url"],
            published_at=article_data["published_at"],
            is_processed=True,
            processed_at=datetime.utcnow(),
        )
        db.add(article)
        await db.flush()  # Get article ID

        # Create predictions
        for pred_data in article_data["predictions"]:
            prediction = Prediction(
                article_id=article.id,
                asset_id=pred_data["asset"].id,
                signal_type=pred_data["signal_type"],
                timeframe=pred_data["timeframe"],
                risk_level=pred_data["risk_level"],
                confidence_score=pred_data["confidence_score"],
                reasoning=pred_data["reasoning"],
                target_date=datetime.utcnow() + timedelta(days=7 if pred_data["timeframe"] == TimeframeType.SHORT_TERM else 30),
            )
            db.add(prediction)

    await db.commit()
    print(f"✓ Created {len(articles_data)} articles with predictions")


async def main():
    """Run all seed functions"""
    print("Starting database seeding...")

    async with AsyncSessionLocal() as db:
        # Clear existing data (dev only!)
        await clear_all_data(db)

        # Seed data
        sources = await seed_sources(db)
        assets = await seed_assets(db)
        users = await seed_users(db)
        await seed_articles_and_predictions(db, sources, assets)

    print("\n✅ Database seeding complete!")


if __name__ == "__main__":
    asyncio.run(main())
```

#### Commands to Execute:

```bash
cd backend
source venv/bin/activate

# Run seed script
python src/db/seed.py

# Verify data in Supabase
# Or via Python:
python -c "
from src.db.models import Source, Asset, Article, Prediction
from src.db.base import AsyncSessionLocal
from sqlalchemy import select
import asyncio

async def check_data():
    async with AsyncSessionLocal() as db:
        sources = await db.execute(select(Source))
        assets = await db.execute(select(Asset))
        articles = await db.execute(select(Article))
        predictions = await db.execute(select(Prediction))

        print(f'Sources: {len(sources.scalars().all())}')
        print(f'Assets: {len(assets.scalars().all())}')
        print(f'Articles: {len(articles.scalars().all())}')
        print(f'Predictions: {len(predictions.scalars().all())}')

asyncio.run(check_data())
"
```

---

### Task 5: Create Database Access Layer (DAOs)
**Order**: Fifth
**Duration Estimate**: 60 minutes
**Dependencies**: Task 4

#### Files to Create:

**backend/src/db/dao_base.py** (Base DAO with common operations):

```python
"""Base Data Access Object with common CRUD operations"""
from typing import TypeVar, Generic, Type, Optional, List
from uuid import UUID
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseDAO(Generic[ModelType]):
    """Base DAO providing common CRUD operations"""

    def __init__(self, model: Type[ModelType], db: AsyncSession):
        self.model = model
        self.db = db

    async def get_by_id(self, id: UUID) -> Optional[ModelType]:
        """Get entity by ID"""
        result = await self.db.execute(
            select(self.model).where(self.model.id == id)
        )
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """Get all entities with pagination"""
        result = await self.db.execute(
            select(self.model).offset(skip).limit(limit)
        )
        return result.scalars().all()

    async def create(self, **kwargs) -> ModelType:
        """Create new entity"""
        entity = self.model(**kwargs)
        self.db.add(entity)
        await self.db.flush()
        await self.db.refresh(entity)
        return entity

    async def update_by_id(self, id: UUID, **kwargs) -> Optional[ModelType]:
        """Update entity by ID"""
        await self.db.execute(
            update(self.model).where(self.model.id == id).values(**kwargs)
        )
        await self.db.flush()
        return await self.get_by_id(id)

    async def delete_by_id(self, id: UUID) -> bool:
        """Delete entity by ID"""
        result = await self.db.execute(
            delete(self.model).where(self.model.id == id)
        )
        await self.db.flush()
        return result.rowcount > 0
```

**backend/src/db/dao_source.py**:

```python
"""Source Data Access Object"""
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.dao_base import BaseDAO
from src.db.models import Source, SourceType


class SourceDAO(BaseDAO[Source]):
    """DAO for Source operations"""

    def __init__(self, db: AsyncSession):
        super().__init__(Source, db)

    async def get_by_name(self, name: str) -> Optional[Source]:
        """Get source by name"""
        result = await self.db.execute(
            select(Source).where(Source.name == name)
        )
        return result.scalar_one_or_none()

    async def get_active_sources(self) -> List[Source]:
        """Get all active sources"""
        result = await self.db.execute(
            select(Source)
            .where(Source.is_active == True)
            .where(Source.deleted_at.is_(None))
            .order_by(Source.base_credibility_score.desc())
        )
        return result.scalars().all()

    async def get_by_type(self, source_type: SourceType) -> List[Source]:
        """Get sources by type"""
        result = await self.db.execute(
            select(Source)
            .where(Source.source_type == source_type)
            .where(Source.is_active == True)
        )
        return result.scalars().all()
```

**backend/src/db/dao_asset.py**:

```python
"""Asset Data Access Object"""
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.dao_base import BaseDAO
from src.db.models import Asset, AssetType


class AssetDAO(BaseDAO[Asset]):
    """DAO for Asset operations"""

    def __init__(self, db: AsyncSession):
        super().__init__(Asset, db)

    async def get_by_symbol(self, symbol: str) -> Optional[Asset]:
        """Get asset by symbol"""
        result = await self.db.execute(
            select(Asset).where(Asset.symbol == symbol)
        )
        return result.scalar_one_or_none()

    async def get_by_type(self, asset_type: AssetType) -> List[Asset]:
        """Get assets by type"""
        result = await self.db.execute(
            select(Asset)
            .where(Asset.asset_type == asset_type)
            .where(Asset.is_active == True)
            .order_by(Asset.symbol)
        )
        return result.scalars().all()

    async def search_by_name(self, query: str) -> List[Asset]:
        """Search assets by name"""
        result = await self.db.execute(
            select(Asset)
            .where(Asset.name.ilike(f"%{query}%"))
            .where(Asset.is_active == True)
            .limit(20)
        )
        return result.scalars().all()
```

**backend/src/db/dao_prediction.py**:

```python
"""Prediction Data Access Object"""
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.dao_base import BaseDAO
from src.db.models import Prediction, SignalType, TimeframeType, PredictionOutcome


class PredictionDAO(BaseDAO[Prediction]):
    """DAO for Prediction operations"""

    def __init__(self, db: AsyncSession):
        super().__init__(Prediction, db)

    async def get_by_asset(self, asset_id: UUID, limit: int = 50) -> List[Prediction]:
        """Get predictions for an asset"""
        result = await self.db.execute(
            select(Prediction)
            .where(Prediction.asset_id == asset_id)
            .order_by(Prediction.created_at.desc())
            .limit(limit)
        )
        return result.scalars().all()

    async def get_recent_predictions(
        self,
        hours: int = 24,
        min_confidence: float = 0.7
    ) -> List[Prediction]:
        """Get recent high-confidence predictions"""
        cutoff = datetime.utcnow() - timedelta(hours=hours)
        result = await self.db.execute(
            select(Prediction)
            .where(
                and_(
                    Prediction.created_at >= cutoff,
                    Prediction.confidence_score >= min_confidence
                )
            )
            .order_by(Prediction.confidence_score.desc())
        )
        return result.scalars().all()

    async def get_pending_verifications(self) -> List[Prediction]:
        """Get predictions pending outcome verification"""
        result = await self.db.execute(
            select(Prediction)
            .where(Prediction.outcome == PredictionOutcome.PENDING)
            .where(Prediction.target_date <= datetime.utcnow())
        )
        return result.scalars().all()
```

**backend/src/db/__init__.py** (Update exports):

```python
from src.db.base import Base, get_db, AsyncSessionLocal, engine
from src.db.models import *
from src.db.dao_base import BaseDAO
from src.db.dao_source import SourceDAO
from src.db.dao_asset import AssetDAO
from src.db.dao_prediction import PredictionDAO

__all__ = [
    "Base", "get_db", "AsyncSessionLocal", "engine",
    "BaseDAO", "SourceDAO", "AssetDAO", "PredictionDAO",
]
```

---

### Task 6: Create API Endpoints for Core Models
**Order**: Sixth
**Duration Estimate**: 75 minutes
**Dependencies**: Task 5

#### Files to Create:

**backend/src/api/sources.py**:

```python
"""Source management endpoints"""
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from src.db.base import get_db
from src.db.dao_source import SourceDAO
from src.db.models import SourceType

router = APIRouter()


class SourceResponse(BaseModel):
    id: UUID
    name: str
    url: str
    source_type: SourceType
    base_credibility_score: float
    is_active: bool

    class Config:
        from_attributes = True


@router.get("/sources", response_model=List[SourceResponse])
async def list_sources(
    active_only: bool = True,
    db: AsyncSession = Depends(get_db)
):
    """List all sources"""
    dao = SourceDAO(db)
    if active_only:
        sources = await dao.get_active_sources()
    else:
        sources = await dao.get_all()
    return sources


@router.get("/sources/{source_id}", response_model=SourceResponse)
async def get_source(
    source_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get source by ID"""
    dao = SourceDAO(db)
    source = await dao.get_by_id(source_id)
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    return source
```

**backend/src/api/assets.py**:

```python
"""Asset management endpoints"""
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from src.db.base import get_db
from src.db.dao_asset import AssetDAO
from src.db.models import AssetType

router = APIRouter()


class AssetResponse(BaseModel):
    id: UUID
    asset_type: AssetType
    symbol: str
    name: str
    exchange: str | None = None

    class Config:
        from_attributes = True


@router.get("/assets", response_model=List[AssetResponse])
async def list_assets(
    asset_type: AssetType | None = None,
    search: str | None = None,
    db: AsyncSession = Depends(get_db)
):
    """List assets with optional filtering"""
    dao = AssetDAO(db)

    if search:
        assets = await dao.search_by_name(search)
    elif asset_type:
        assets = await dao.get_by_type(asset_type)
    else:
        assets = await dao.get_all(limit=200)

    return assets


@router.get("/assets/{asset_id}", response_model=AssetResponse)
async def get_asset(
    asset_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get asset by ID"""
    dao = AssetDAO(db)
    asset = await dao.get_by_id(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset
```

**backend/src/api/predictions.py**:

```python
"""Prediction endpoints"""
from typing import List
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from src.db.base import get_db
from src.db.dao_prediction import PredictionDAO
from src.db.models import SignalType, TimeframeType, RiskLevel, PredictionOutcome

router = APIRouter()


class PredictionResponse(BaseModel):
    id: UUID
    asset_id: UUID
    signal_type: SignalType
    timeframe: TimeframeType
    risk_level: RiskLevel
    confidence_score: float
    reasoning: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


@router.get("/predictions", response_model=List[PredictionResponse])
async def list_predictions(
    asset_id: UUID | None = None,
    min_confidence: float = Query(0.7, ge=0.0, le=1.0),
    hours: int = Query(24, ge=1, le=168),
    db: AsyncSession = Depends(get_db)
):
    """List recent predictions"""
    dao = PredictionDAO(db)

    if asset_id:
        predictions = await dao.get_by_asset(asset_id)
    else:
        predictions = await dao.get_recent_predictions(hours=hours, min_confidence=min_confidence)

    return predictions


@router.get("/predictions/{prediction_id}", response_model=PredictionResponse)
async def get_prediction(
    prediction_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get prediction by ID"""
    dao = PredictionDAO(db)
    prediction = await dao.get_by_id(prediction_id)
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return prediction
```

**backend/src/main.py** (Update to include new routers):

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.api import health, sources, assets, predictions

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
app.include_router(sources.router, prefix=settings.API_PREFIX, tags=["sources"])
app.include_router(assets.router, prefix=settings.API_PREFIX, tags=["assets"])
app.include_router(predictions.router, prefix=settings.API_PREFIX, tags=["predictions"])


@app.get("/")
async def root():
    return {
        "message": "Trading App API",
        "version": settings.APP_VERSION,
        "docs": f"{settings.API_PREFIX}/docs"
    }
```

---

### Task 7: Create Unit Tests for Models and DAOs
**Order**: Seventh
**Duration Estimate**: 60 minutes
**Dependencies**: Task 6

#### Files to Create:

**backend/tests/unit/test_models.py**:

```python
"""Unit tests for database models"""
import pytest
from src.db.models import (
    Source, Asset, Article, Prediction,
    SourceType, AssetType, SignalType, TimeframeType, RiskLevel
)


def test_source_creation():
    """Test Source model creation"""
    source = Source(
        name="Test Source",
        url="https://test.com",
        source_type=SourceType.NEWS,
    )
    assert source.name == "Test Source"
    assert source.source_type == SourceType.NEWS
    assert source.is_active == True
    assert source.base_credibility_score == 0.5


def test_asset_creation():
    """Test Asset model creation"""
    asset = Asset(
        asset_type=AssetType.FOREX,
        symbol="EUR/USD",
        name="Euro / US Dollar",
    )
    assert asset.asset_type == AssetType.FOREX
    assert asset.symbol == "EUR/USD"
    assert asset.is_active == True
```

**backend/tests/integration/test_dao.py**:

```python
"""Integration tests for DAOs"""
import pytest
from src.db.dao_source import SourceDAO
from src.db.dao_asset import AssetDAO
from src.db.models import SourceType, AssetType


@pytest.mark.asyncio
async def test_source_dao_create_and_get(db_session):
    """Test SourceDAO create and get operations"""
    dao = SourceDAO(db_session)

    # Create source
    source = await dao.create(
        name="Test DAO Source",
        url="https://testdao.com",
        source_type=SourceType.NEWS,
    )

    assert source.id is not None
    assert source.name == "Test DAO Source"

    # Get by ID
    retrieved = await dao.get_by_id(source.id)
    assert retrieved.name == "Test DAO Source"

    # Get by name
    by_name = await dao.get_by_name("Test DAO Source")
    assert by_name.id == source.id


@pytest.mark.asyncio
async def test_asset_dao_operations(db_session):
    """Test AssetDAO operations"""
    dao = AssetDAO(db_session)

    # Create asset
    asset = await dao.create(
        asset_type=AssetType.CRYPTO,
        symbol="BTC/USD",
        name="Bitcoin / US Dollar",
    )

    assert asset.id is not None

    # Get by symbol
    by_symbol = await dao.get_by_symbol("BTC/USD")
    assert by_symbol.id == asset.id

    # Get by type
    crypto_assets = await dao.get_by_type(AssetType.CRYPTO)
    assert len(crypto_assets) >= 1
    assert asset.id in [a.id for a in crypto_assets]
```

**backend/tests/integration/test_api_endpoints.py**:

```python
"""Integration tests for API endpoints"""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_sources(client: AsyncClient):
    """Test GET /sources"""
    response = await client.get("/api/v1/sources")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_list_assets(client: AsyncClient):
    """Test GET /assets"""
    response = await client.get("/api/v1/assets")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_list_predictions(client: AsyncClient):
    """Test GET /predictions"""
    response = await client.get("/api/v1/predictions")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
```

---

### Task 8: Create Database Documentation (ERD)
**Order**: Eighth
**Duration Estimate**: 30 minutes
**Dependencies**: Task 2

#### Files to Create:

**docs/DATABASE_SCHEMA.md**:

```markdown
# Database Schema Documentation

## Overview
The Trading App database is designed to support real-time financial prediction tracking, source credibility management, and intelligent alerting.

## Core Tables

### sources
Tracks news sources, analysts, and forecast providers.

**Key Fields:**
- `id` (UUID, PK)
- `name` (string, unique)
- `url` (string)
- `source_type` (enum: news, forecast, analyst, blog, social)
- `base_credibility_score` (float, 0-1)
- `user_weight` (float, nullable)
- `is_active` (boolean)
- `scrape_config` (JSONB)

**Relationships:**
- Has many `articles`
- Has many `source_accuracy` records

---

### assets
Tradeable instruments (forex pairs, cryptocurrencies, stocks).

**Key Fields:**
- `id` (UUID, PK)
- `asset_type` (enum: forex, crypto, shares)
- `symbol` (string, e.g., "EUR/USD", "BTC/USDT", "AAPL")
- `name` (string)
- `exchange` (string, nullable)
- `base_currency` (string, nullable)
- `quote_currency` (string, nullable)

**Unique Constraint:** `(asset_type, symbol)`

**Relationships:**
- Has many `predictions`

---

### articles
Scraped content from sources (cleaned text only).

**Key Fields:**
- `id` (UUID, PK)
- `source_id` (UUID, FK → sources)
- `title` (string)
- `content` (text)
- `url` (string, unique)
- `published_at` (timestamp)
- `scraped_at` (timestamp)
- `is_processed` (boolean)
- `search_vector` (tsvector, for full-text search)

**Relationships:**
- Belongs to `source`
- Has many `predictions`

---

### predictions
Forecast signals extracted from articles.

**Key Fields:**
- `id` (UUID, PK)
- `article_id` (UUID, FK → articles)
- `asset_id` (UUID, FK → assets)
- `signal_type` (enum: strong_bearish, bearish, neutral, bullish, strong_bullish)
- `timeframe` (enum: short_term, long_term)
- `risk_level` (enum: low, medium, high)
- `confidence_score` (float, 0-1)
- `reasoning` (text, nullable)
- `outcome` (enum: pending, correct, incorrect, partially_correct, expired)
- `target_date` (timestamp, nullable)

**Relationships:**
- Belongs to `article`
- Belongs to `asset`

---

### source_accuracy
Time-series accuracy metrics for sources.

**Key Fields:**
- `id` (UUID, PK)
- `source_id` (UUID, FK → sources)
- `period_start` (timestamp)
- `period_end` (timestamp)
- `total_predictions` (int)
- `correct_predictions` (int)
- `accuracy_score` (float)
- `confidence_calibration` (float, nullable)

**Unique Constraint:** `(source_id, period_start, period_end)`

---

### correlations
Detected correlations between predictions.

**Key Fields:**
- `id` (UUID, PK)
- `asset_id` (UUID, FK → assets)
- `prediction_ids` (JSONB array of UUIDs)
- `signal_type` (enum)
- `timeframe` (enum)
- `source_count` (int, minimum 3)
- `aggregate_confidence` (float)
- `correlation_strength` (float, 0-1)
- `detected_at` (timestamp)

**Business Rule:** Requires minimum 3 sources in agreement

---

### conflicts
Detected conflicts between predictions.

**Key Fields:**
- `id` (UUID, PK)
- `asset_id` (UUID, FK → assets)
- `bullish_prediction_ids` (JSONB array)
- `bearish_prediction_ids` (JSONB array)
- `timeframe` (enum)
- `conflict_strength` (float, 0-1)
- `detected_at` (timestamp)

---

### users
User accounts (basic structure for Phase 5 full implementation).

**Key Fields:**
- `id` (UUID, PK)
- `email` (string, unique)
- `password_hash` (string, nullable)
- `is_active` (boolean)
- `is_verified` (boolean)

**Relationships:**
- Has many `alerts`

---

### alerts
User alert rules and preferences.

**Key Fields:**
- `id` (UUID, PK)
- `user_id` (UUID, FK → users)
- `name` (string)
- `preferences` (JSONB)
- `status` (enum: active, paused, disabled)
- `notification_channels` (JSONB)

**Preferences JSONB Structure:**
```json
{
  "asset_types": ["forex", "crypto"],
  "assets": ["EUR/USD", "BTC/USDT"],
  "min_confidence": 0.8,
  "min_sources": 3,
  "signal_types": ["bullish", "strong_bullish"],
  "timeframes": ["short_term"],
  "max_risk": "medium",
  "notify_on_conflicts": true
}
```

---

### alert_history
Notification delivery history.

**Key Fields:**
- `id` (UUID, PK)
- `alert_id` (UUID, FK → alerts)
- `correlation_id` (UUID, FK → correlations, nullable)
- `title` (string)
- `message` (text)
- `notification_data` (JSONB)
- `channel` (string)
- `status` (enum: pending, sent, failed, read)
- `sent_at` (timestamp, nullable)
- `read_at` (timestamp, nullable)

---

## Entity Relationship Diagram

```
sources 1────N articles 1────N predictions
   │                              │
   │                              │
   └─────N source_accuracy        └─────N assets
                                        │
                                        │
users 1────N alerts 1────N alert_history
                            │
                            └────1 correlations
```

## Indexes

### Performance Indexes:
- `sources`: `source_type`, `is_active`, `deleted_at`
- `assets`: `asset_type`, `symbol`, `is_active`
- `articles`: `source_id`, `published_at`, `scraped_at`, `is_processed`
- `articles`: GIN index on `search_vector` (full-text search)
- `predictions`: `article_id`, `asset_id`, `signal_type`, `timeframe`, `outcome`, `confidence_score`, `created_at`
- `source_accuracy`: `source_id`, `period_start`, `period_end`
- `correlations`: `asset_id`, `signal_type`, `detected_at`, `correlation_strength`
- `alert_history`: `alert_id`, `status`, `sent_at`, `created_at`

## Data Retention Policy

All data retained indefinitely initially. Archival strategy to be implemented in future phase if needed.

## Extension Points

### Adding New Asset Types:
1. Add new value to `AssetType` enum in models.py
2. Run migration
3. No code changes required - system is asset-type agnostic

### Adding New Signal Types:
1. Add new value to `SignalType` enum
2. Update LLM analysis prompts to include new signal type
3. Update frontend visualization

## Security Considerations

- UUIDs prevent enumeration attacks
- Soft deletes (via `deleted_at`) preserve data integrity
- JSONB fields validated at application layer
- Password hashing (full implementation in Phase 5)
```

---

## Configuration Files Summary

### Files to Create:
1. `backend/src/db/models.py` (complete rewrite, ~800 lines)
2. `backend/src/db/seed.py` (~300 lines)
3. `backend/src/db/dao_base.py` (~50 lines)
4. `backend/src/db/dao_source.py` (~40 lines)
5. `backend/src/db/dao_asset.py` (~40 lines)
6. `backend/src/db/dao_prediction.py` (~50 lines)
7. `backend/src/api/sources.py` (~50 lines)
8. `backend/src/api/assets.py` (~60 lines)
9. `backend/src/api/predictions.py` (~60 lines)
10. `backend/tests/unit/test_models.py` (~40 lines)
11. `backend/tests/integration/test_dao.py` (~60 lines)
12. `backend/tests/integration/test_api_endpoints.py` (~30 lines)
13. `docs/DATABASE_SCHEMA.md` (documentation)

### Files to Modify:
1. `backend/src/main.py` (add new routers)
2. `backend/src/db/__init__.py` (update exports)

---

## Validation Criteria

### ✅ Phase 2 Complete When:

#### Database:
- [ ] All 11 tables created successfully
- [ ] All indexes created
- [ ] All foreign keys and constraints in place
- [ ] Alembic migrations run without errors
- [ ] Seed data loads successfully

#### Models & DAOs:
- [ ] All SQLAlchemy models defined with proper relationships
- [ ] BaseDAO provides common CRUD operations
- [ ] Specialized DAOs (Source, Asset, Prediction) functional
- [ ] Enums defined for all categorical fields

#### API Endpoints:
- [ ] `/api/v1/sources` - list and get sources
- [ ] `/api/v1/assets` - list and get assets
- [ ] `/api/v1/predictions` - list and get predictions
- [ ] All endpoints return valid responses
- [ ] Swagger docs show all endpoints: http://localhost:8000/api/v1/docs

#### Testing:
- [ ] Model unit tests pass
- [ ] DAO integration tests pass
- [ ] API endpoint tests pass
- [ ] Test coverage >80% for new code
- [ ] `pytest tests/ -v` shows all green

#### Documentation:
- [ ] DATABASE_SCHEMA.md complete with ERD
- [ ] All tables documented
- [ ] Relationships explained
- [ ] Extension points identified

#### Verification Commands Pass:
```bash
# Database verification
cd backend
source venv/bin/activate
alembic current  # Shows latest migration
python src/db/seed.py  # Runs without errors

# API verification
uvicorn src.main:app --reload  # Starts successfully
curl http://localhost:8000/api/v1/sources  # Returns JSON
curl http://localhost:8000/api/v1/assets  # Returns JSON
curl http://localhost:8000/api/v1/predictions  # Returns JSON

# Test verification
pytest tests/ -v --cov=src  # All tests pass, >80% coverage
```

---

## Testing Requirements

### Unit Tests:
- **Model Creation**: Test instantiation of all models
- **Enum Values**: Verify all enum values work correctly
- **Constraints**: Test check constraints (confidence ranges, etc.)

### Integration Tests:
- **DAO CRUD**: Test create, read, update, delete for each DAO
- **Relationships**: Test loading related entities
- **Queries**: Test specialized query methods (get_by_type, search, etc.)

### API Tests:
- **Endpoint Responses**: Test all GET endpoints return 200
- **Filtering**: Test query parameter filtering
- **Error Handling**: Test 404 for non-existent resources
- **Pagination**: Test limit/offset parameters

---

## Estimated Timeline

- **Task 1** (Schema Design): 60 minutes
- **Task 2** (SQLAlchemy Models): 90 minutes
- **Task 3** (Migrations): 30 minutes
- **Task 4** (Seed Data): 45 minutes
- **Task 5** (DAOs): 60 minutes
- **Task 6** (API Endpoints): 75 minutes
- **Task 7** (Tests): 60 minutes
- **Task 8** (Documentation): 30 minutes

**Total Estimated Time**: ~7.5 hours

---

## Dependencies & Prerequisites

### From Phase 1:
- ✅ Backend environment set up (Python 3.13+, venv)
- ✅ Supabase PostgreSQL database accessible
- ✅ Alembic configured
- ✅ FastAPI application running
- ✅ Testing framework configured

### New Requirements:
- None - all dependencies already in requirements.txt from Phase 1

---

## Risk Mitigation

### Potential Issues:

1. **Migration Conflicts**:
   - Clear old Phase 1 stub migrations first
   - Review auto-generated migration before applying
   - Keep backup of database before migration

2. **Enum Handling**:
   - PostgreSQL enums can be tricky to modify
   - Use string-based enums for easier evolution
   - Document all enum values

3. **JSONB Validation**:
   - Application-layer validation required
   - Pydantic schemas for JSONB structures
   - Document expected JSON formats

4. **Relationship Loading**:
   - Be mindful of N+1 query problems
   - Use `joinedload` or `selectinload` strategically
   - Monitor query performance

5. **UUID Generation**:
   - Ensure `uuid.uuid4()` used consistently
   - Test UUID serialization in JSON responses

---

## Success Metrics

### Quantitative:
- ✅ 11 database tables created
- ✅ 20+ indexes defined
- ✅ 15+ unit/integration tests passing
- ✅ Test coverage >80%
- ✅ 3+ API endpoints functional
- ✅ Seed data creates 5+ sources, 9+ assets, 5+ articles, 5+ predictions

### Qualitative:
- ✅ Schema supports all core features
- ✅ Models are clean and maintainable
- ✅ DAOs provide intuitive API
- ✅ Endpoints well-documented (Swagger)
- ✅ Database is normalized and efficient
- ✅ Ready to begin Phase 3 (Web Scraping)

---

## Next Phase Preview

**Phase 3: Backend - Web Scraping & Data Collection**

After completing Phase 2, we'll have a solid data foundation. Phase 3 will focus on:
1. Integrating crawl4ai for web scraping
2. Building scrapers for 5-10 financial sources
3. Implementing scheduling system for periodic scraping
4. Data normalization and cleaning pipelines
5. Error handling and retry logic
6. Scraper monitoring and health checks

Estimated Timeline: 3-4 days

---

## Notes

- Prefer composition over inheritance in DAOs
- Keep business logic in services, not DAOs
- Use async/await consistently throughout
- Document complex queries
- Consider adding database triggers for `updated_at` fields
- Monitor query performance as data grows
- Plan for archival/partitioning at scale
