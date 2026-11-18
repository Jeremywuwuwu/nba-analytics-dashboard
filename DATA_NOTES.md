# NBA Analytics Dashboard — Data Notes

## Where the data comes from

The live backend source is ESPN's public NBA API, accessed server-side through the Express/tRPC layer in `server/espnApi.ts`. It does not require an API key or paid subscription.

The dashboard currently uses these ESPN feeds:

| Dashboard area | ESPN feed | Behavior |
| --- | --- | --- |
| Live Scores | `site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard` | Current scoreboard, game status, scores, venue, and broadcasts |
| Standings | ESPN NBA standings feed | East/West records, win percentage, points for/against, streak, and recent form |
| Team Detail roster | `.../teams/{espnTeamId}/roster` | Active roster, position, jersey, height, weight, status, and headshot |
| Team Detail shooting | `.../teams/{espnTeamId}/statistics` | Team shooting percentages and per-game offensive/possession stats |
| Team Detail schedule | `.../teams/{espnTeamId}/schedule` | The next five scheduled or recently current team events |

Player leaderboards, player comparison data, historical player logs, monthly trends, and several dashboard visuals use the curated 2024–25 season dataset in `client/src/lib/nbaData.ts`. This is intentional: ESPN's public site feed is reliable for team/game context but is not used here as a complete player-statistics warehouse.

If an ESPN request fails or returns no usable data, the frontend displays the curated fallback dataset. The Team Detail page shows a `Live from ESPN` or `Curated fallback` indicator so the provenance is visible.

## How the advanced metrics are calculated

The player detail page displays PER, TS%, WS, and BPM as values from the curated season dataset. They are not recomputed in the browser because the source dataset already contains the season-level values.

The radar chart normalizes ordinary box-score values for visual comparison rather than presenting a new league metric:

- Scoring score = `min(100, PPG / 35 × 100)`
- Rebounding score = `min(100, RPG / 15 × 100)`
- Assist score = `min(100, APG / 12 × 100)`
- Defense score = `min(100, (SPG + BPG) / 4 × 100)`
- Efficiency score = `min(100, PER / 35 × 100)`
- Shooting score = `min(100, TS% / 70 × 100)`

The progress bars on the Player Detail page use the same visual normalization against fixed display ceilings: PER 40, TS% 75, WS 20, and BPM 15. Those ceilings are chart scales, not league-average formulas.

The Team Detail shooting chart maps ESPN's official team statistics directly to four available shooting splits: field-goal percentage, two-point percentage, three-point percentage, and free-throw percentage. Because the public ESPN team feed does not expose paint/midrange coordinates, the chart intentionally does not invent spatial shot-zone values. The page also shows ESPN per-game values for points, rebounds, assists, offensive rebounds, two-point attempts, and made/attempted threes.

## How refresh works

- Live Scores: cached for 60 seconds and refetched every 60 seconds so in-progress games update automatically.
- Recent games: cached for 120 seconds.
- Standings: cached for 300 seconds (5 minutes).
- Team Detail: roster, shooting statistics, and the next five future scheduled games are cached for 300 seconds and refetched every 300 seconds.
- Curated player data: static until the source file is intentionally updated.

The requests run through tRPC, so the browser does not need ESPN credentials or direct API-key configuration. A refresh after a cache window, a full page reload, or a new navigation to a detail page obtains fresh public data when ESPN is available.

## Cost and operational notes

The dashboard uses no paid data provider, no paid API key, and no scheduled background job. The public ESPN calls happen on demand as the application is used. The fallback dataset keeps the UI usable during API outages or rate limits.
