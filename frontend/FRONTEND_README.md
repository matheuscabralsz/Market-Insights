# MarketInsight Frontend

A modern, responsive financial intelligence platform built with Next.js, React, and TailwindCSS.

## Overview

This is the frontend UI for the MarketInsight trading app - an intelligent platform that aggregates market news and forecasts from multiple sources, identifies patterns and correlations, and provides real-time alerts for high-confidence investment opportunities.

## Tech Stack

- **Next.js 15.5** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS framework
- **Chart.js + react-chartjs-2** - Data visualization
- **Turbopack** - Fast development bundler

## Project Structure

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Dashboard/Home page
│   ├── opportunities/       # Market opportunities view
│   ├── sources/            # Source management
│   ├── analytics/          # Historical accuracy charts
│   ├── alerts/             # Alerts & notifications
│   ├── layout.tsx          # Root layout with navigation
│   └── globals.css         # Global styles
├── components/
│   ├── layout/             # Layout components
│   │   └── Navigation.tsx  # Main navigation bar
│   ├── ui/                 # Reusable UI components
│   │   ├── Card.tsx       # Card container components
│   │   ├── Badge.tsx      # Badge/tag component
│   │   └── StatCard.tsx   # Stat display card
│   └── charts/            # Chart components
│       └── AccuracyChart.tsx  # Line chart for accuracy tracking
└── public/                # Static assets
```

## Features Implemented

### 1. Dashboard (/)
- **Stats Overview**: Active opportunities, tracked sources, average confidence, alerts
- **High Confidence Opportunities**: Quick view of top opportunities with 3+ sources
- **Source Conflicts**: Alerts for diverging predictions
- **Recent Activity**: Timeline of latest updates
- **Quick Actions**: Add sources, configure alerts, export reports

### 2. Market Opportunities (/opportunities)
- **Filterable List**: Filter by all/bullish/bearish predictions
- **Sortable**: Sort by confidence, source count, or recency
- **Detailed Cards**: Show asset info, price targets, potential gains, timeframes
- **Source Tags**: Display which sources agree on each opportunity
- **Empty States**: Graceful handling when no matches

### 3. Source Management (/sources)
- **Source Table**: Comprehensive view of all data sources
- **Status Indicators**: Active/paused sources with visual badges
- **Accuracy Tracking**: Progress bars showing accuracy percentages
- **Credibility Weights**: Adjustable source trust levels (0.5x - 2.0x)
- **Add Source Modal**: UI for adding new sources
- **Summary Stats**: Total sources, active count, average accuracy

### 4. Analytics (/analytics)
- **Accuracy Over Time Chart**: Line chart showing 6-month historical trends
- **Source Leaderboard**: Ranked list by prediction accuracy
- **Asset Performance**: Accuracy breakdown by individual assets
- **Insights Cards**: Best performing category, most improved source, consensus rate

### 5. Alerts & Notifications (/alerts)
- **Alert Feed**: Chronological list of all notifications
- **Unread Filter**: Dedicated view for unread alerts
- **Alert Types**: Correlation, conflict, update, and accuracy alerts
- **Priority Levels**: High/medium/low priority visual indicators
- **Settings**: Notification preferences and channel configuration
- **Minimum Confidence**: Adjustable threshold for alerts

## UI Components

### Layout Components
- **Navigation**: Responsive navbar with mobile menu, notification bell
- **Card System**: Modular card components with header/body separation

### UI Components
- **Badge**: Status indicators with 5 variants (success, warning, danger, info, neutral)
- **StatCard**: Metric display cards with icons, values, and change percentages

### Chart Components
- **AccuracyChart**: Customizable line chart for historical accuracy visualization

## Design System

### Color Palette
- **Background**: Gray-950 (dark mode)
- **Cards**: Gray-800 with Gray-700 borders
- **Text**: White primary, Gray-400 secondary
- **Accents**:
  - Blue-500/600 (primary actions, info)
  - Green-400/500 (success, bullish)
  - Red-400/500 (danger, bearish)
  - Yellow-400/500 (warning, conflicts)
  - Purple-400/500 (analytics)

### Typography
- **Font**: Geist Sans (primary), Geist Mono (code)
- **Headers**: Bold, 2xl-3xl sizes
- **Body**: Regular, sm-base sizes

### Spacing
- Consistent padding: 4px increments (p-4, p-6, p-8)
- Card gaps: 6-8 units
- Component spacing: 2-4 units

## Responsive Design

All pages are fully responsive with breakpoints:
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (lg, xl)

Features:
- Mobile-friendly navigation with hamburger menu
- Responsive grid layouts (1 col mobile → 2-4 cols desktop)
- Touch-friendly buttons and interactive elements
- Readable text sizes across all devices

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Mock Data

**Note**: All pages currently use mock data for demonstration purposes. The UI is fully functional, but data is static.

To integrate with the backend:
1. Create API service layer in `lib/api/`
2. Add data fetching using Next.js Server Components or client-side hooks
3. Replace mock data arrays with API calls
4. Add loading states and error handling
5. Implement real-time updates with WebSockets or polling

## Future Enhancements

### Backend Integration
- [ ] Connect to Python backend API
- [ ] Implement data fetching and caching
- [ ] Add real-time WebSocket updates
- [ ] Integrate OneSignal for push notifications

### Features
- [ ] User authentication and profiles
- [ ] Watchlist/favorites functionality
- [ ] Advanced filtering and search
- [ ] Export functionality (PDF, CSV)
- [ ] Dark/light theme toggle
- [ ] Multi-language support

### UX Improvements
- [ ] Loading skeletons
- [ ] Error boundaries
- [ ] Toast notifications
- [ ] Keyboard shortcuts
- [ ] Accessibility improvements (ARIA labels, focus management)

### Analytics
- [ ] More chart types (bar, pie, candlestick)
- [ ] Custom date range selection
- [ ] Comparison tools
- [ ] Performance benchmarking

## Development Notes

- All components are using TypeScript for type safety
- Client components marked with 'use client' directive
- Server components by default in App Router
- Mock data clearly marked with comments for easy identification
- Component structure follows atomic design principles
- Consistent naming conventions throughout

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

When adding new features:
1. Follow existing component patterns
2. Use TypeScript for type safety
3. Maintain responsive design
4. Add comments for complex logic
5. Keep components modular and reusable

## License

Part of the MarketInsight Trading App project.
