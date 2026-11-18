# NBA Analytics Dashboard — TODO

## Core Dashboard
- [x] Dark navy "Fast Break" design system (Barlow Condensed + Syne fonts)
- [x] DashboardLayout with sidebar navigation
- [x] Hero banner with AI-generated court background
- [x] Animated KPI stat cards (PPG leader, Win%, 3P%, Assists)
- [x] SGA season progression area chart
- [x] Shot distribution heatmap card
- [x] Scoring leaders leaderboard
- [x] Top teams PPG vs Opp PPG bar chart
- [x] East/West conference standings preview
- [x] Live today's games widget in hero banner (ESPN API)

## Players Page
- [x] Sortable stats table (13 stat columns)
- [x] Position and team filters
- [x] Search by name or team
- [x] Link to player detail pages

## Player Detail Page
- [x] Full player profile with skill radar chart
- [x] Season scoring trend chart
- [x] Shot distribution breakdown
- [x] Advanced metrics progress bars
- [x] 10-game log table

## Standings Page
- [x] East/West tabbed conference tables
- [x] Playoff / play-in seeding visualization
- [x] Streak badges and Last-10 progress bars
- [x] Win % comparison bar chart
- [x] Live standings from ESPN API (with curated fallback)
- [x] Live/Cached indicator badge

## Live Scores Page
- [x] Today's games from ESPN public API
- [x] Recent games (last 3 days) tab
- [x] Live / Final / Upcoming game cards
- [x] Auto-refresh every 60 seconds during live games
- [x] Loading skeletons and error states

## Trends Page
- [x] FG% vs PPG correlation chart
- [x] Position averages bar chart
- [x] Efficiency scatter plot
- [x] Multi-team stat comparison table

## Team Detail Page
- [x] Team detail pages (/teams/:abbr)
- [x] Full roster view with active/inactive status
- [x] Team shooting chart with ESPN shooting splits
- [x] Next 5 scheduled games
- [x] Team links wired throughout dashboard, standings, and players views
- [x] ESPN-backed team data with curated fallback

## API Integration
- [x] ESPN Public API — scoreboard (live games, scores, status)
- [x] ESPN Public API — standings (East + West with full stats)
- [x] Backend tRPC proxy routes for all ESPN endpoints
- [x] Frontend hooks: useTodaysGames, useRecentGames, useStandings, useLeaders
- [x] Graceful fallback to curated static data when API unavailable
- [x] Zero cost, zero API key required

## Infrastructure
- [x] Full-stack upgrade (Express + tRPC + DB)
- [x] TypeScript strict mode — 0 errors
- [x] Vitest test suite passing
- [x] Hot module replacement working

## Delivery
- [x] Run build and test verification after team pages
- [x] Save a final WebDev checkpoint
- [x] Push final dashboard to the existing GitHub repo `nba-analytics-dashboard`
- [x] Document data sources, advanced metric formulas, fallback behavior, and refresh intervals

The current delivery scope is complete. Game detail / box score views and a historical season selector remain optional future product ideas rather than unfinished items in this release checklist.
