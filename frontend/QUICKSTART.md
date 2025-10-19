# Frontend Quick Start Guide

## Running the Application

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will be available at **http://localhost:3000**

### 3. Explore the UI

Navigate through the app using the top navigation bar:

#### Dashboard (/)
- View overall statistics
- See high-confidence opportunities
- Check source conflicts
- Review recent activity

#### Opportunities (/opportunities)
- Browse all market opportunities
- Filter by prediction type (All/Bullish/Bearish)
- Sort by confidence, source count, or recency
- Click on cards to view details (UI only, no modal implemented yet)

#### Sources (/sources)
- View all configured data sources
- See accuracy metrics and prediction counts
- Adjust credibility weights
- Add new sources (modal UI implemented)

#### Analytics (/analytics)
- View accuracy trends over time
- See source leaderboard
- Check asset-specific performance
- Review key insights

#### Alerts (/alerts)
- View all notifications
- Filter unread alerts
- Configure notification preferences
- Set minimum confidence thresholds

## Page-by-Page Features

### Dashboard
✅ 4 stat cards with metrics
✅ High confidence opportunities list
✅ Source conflicts sidebar
✅ Quick actions panel
✅ Recent activity feed

### Opportunities
✅ Filter buttons (All/Bullish/Bearish)
✅ Sort dropdown
✅ Opportunity cards with details
✅ Source tags
✅ Empty state

### Sources
✅ Summary statistics
✅ Comprehensive source table
✅ Status badges
✅ Accuracy progress bars
✅ Credibility weight sliders
✅ Add source modal

### Analytics
✅ Interactive line chart
✅ Source leaderboard with rankings
✅ Asset performance breakdown
✅ Insight cards

### Alerts
✅ Alert feed with icons
✅ Unread filter
✅ Priority indicators
✅ Settings tab with preferences
✅ Notification channel toggles

## Key UI Components

### Navigation
- Responsive with mobile hamburger menu
- Active page highlighting (needs routing state)
- Notification bell icon

### Cards
- Consistent styling across all pages
- Hover effects
- Header with optional actions
- Flexible body content

### Badges
- 5 color variants (success, warning, danger, info, neutral)
- 3 size options (sm, md, lg)
- Used for status, types, and tags

### Charts
- Powered by Chart.js
- Responsive and interactive
- Dark theme compatible
- Tooltips on hover

## Mock Data

All data is currently mocked. Here's what to replace:

**Dashboard:**
- `mockOpportunities` - High confidence opportunities
- `mockConflicts` - Source conflicts

**Opportunities:**
- `mockOpportunities` - All opportunities with full details

**Sources:**
- `mockSources` - Data source configurations

**Analytics:**
- `accuracyOverTimeData` - Chart data
- `mockLeaderboard` - Source rankings
- `mockAssetPerformance` - Asset accuracy

**Alerts:**
- `mockAlerts` - Notification feed

## Interactive Elements

### Working Interactions:
- ✅ Navigation menu (desktop & mobile)
- ✅ Filter buttons (state managed)
- ✅ Sort dropdown (state managed)
- ✅ Tab switching (Alerts page)
- ✅ Modal open/close (Add Source)
- ✅ Hover effects on cards
- ✅ Chart tooltips

### Non-functional (UI only):
- ❌ "View All" links
- ❌ "View Details" buttons
- ❌ "Edit" and "Pause/Resume" buttons
- ❌ Form submissions
- ❌ "Mark all as read"
- ❌ Checkbox toggles
- ❌ Slider adjustments

These are styled and positioned but don't have event handlers or backend integration yet.

## Responsive Breakpoints

Test responsive design:
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
3. Test different device sizes:
   - Mobile: iPhone SE (375px)
   - Tablet: iPad (768px)
   - Desktop: 1920px

## Customization

### Colors
Edit `app/globals.css` or component-level Tailwind classes.

### Fonts
Configured in `app/layout.tsx` using Geist Sans and Geist Mono.

### Theme
Currently dark mode only. Add theme toggle by:
1. Creating theme context
2. Adding localStorage persistence
3. Updating color classes conditionally

### Charts
Customize in `components/charts/AccuracyChart.tsx`:
- Colors
- Grid styles
- Tooltip formatting
- Legend position

## Build for Production

```bash
npm run build
npm start
```

Optimized build will be in `.next/` directory.

## Common Issues

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 npm run dev
```

### Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Chart not rendering
Ensure Chart.js is registered in the component:
```typescript
ChartJS.register(CategoryScale, LinearScale, ...)
```

## Next Steps

1. **Backend Integration**: Create API service layer
2. **Authentication**: Add user login/signup
3. **Real-time Updates**: WebSocket or polling
4. **Testing**: Add Jest + React Testing Library
5. **Optimization**: Image optimization, code splitting

## Questions?

Refer to:
- `FRONTEND_README.md` for detailed documentation
- Next.js docs: https://nextjs.org/docs
- TailwindCSS docs: https://tailwindcss.com/docs
- Chart.js docs: https://www.chartjs.org/docs
