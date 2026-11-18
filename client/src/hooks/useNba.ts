/**
 * useNba — React hooks for ESPN public API data via tRPC
 * Completely free, no API key required
 * Live: Games (scoreboard), Standings
 * Static fallback: Player stats (curated 2024-25 data)
 */

import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import {
  EAST_STANDINGS,
  WEST_STANDINGS,
  SCORING_LEADERS,
  ASSIST_LEADERS,
  REBOUND_LEADERS,
  TOP_PLAYERS,
  type Team,
} from "@/lib/nbaData";

// ─────────────────────────────────────────────────────────────────────────────
// Team color overrides (ESPN colors are sometimes wrong)
// ─────────────────────────────────────────────────────────────────────────────

export const TEAM_COLORS: Record<string, string> = {
  ATL: "#E03A3E", BOS: "#007A33", BKN: "#000000", CHA: "#1D1160",
  CHI: "#CE1141", CLE: "#6F263D", DAL: "#00538C", DEN: "#0E2240",
  DET: "#C8102E", GSW: "#1D428A", HOU: "#CE1141", IND: "#002D62",
  LAC: "#C8102E", LAL: "#552583", MEM: "#5D76A9", MIA: "#98002E",
  MIL: "#00471B", MIN: "#0C2340", NOP: "#0C2340", NYK: "#006BB6",
  OKC: "#007AC1", ORL: "#0077C0", PHI: "#006BB6", PHX: "#1D1160",
  POR: "#E03A3E", SAC: "#5A2D81", SAS: "#C4CED4", TOR: "#CE1141",
  UTA: "#002B5C", WAS: "#002B5C",
};

export const ESPN_TEAM_IDS: Record<string, string> = {
  ATL: "1", BOS: "2", BKN: "17", CHA: "30", CHI: "4", CLE: "5", DAL: "6", DEN: "7",
  DET: "8", GSW: "9", HOU: "10", IND: "11", LAC: "12", LAL: "13", MEM: "29", MIA: "14",
  MIL: "15", MIN: "16", NOP: "3", NYK: "18", OKC: "25", ORL: "19", PHI: "20", PHX: "21",
  POR: "22", SAC: "23", SAS: "24", TOR: "28", UTA: "26", WAS: "27",
};

// ─────────────────────────────────────────────────────────────────────────────
// Live game types
// ─────────────────────────────────────────────────────────────────────────────

export type GameStatus = "LIVE" | "FINAL" | "UPCOMING";

export interface LiveGame {
  id: string;
  status: GameStatus;
  period: string;
  clock: string;
  detail: string;
  homeTeam: { abbr: string; name: string; score: number; color: string; logo: string };
  awayTeam: { abbr: string; name: string; score: number; color: string; logo: string };
  date: string;
  venue?: string;
  broadcast?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function parseStatus(state: string, description: string): GameStatus {
  if (state === "post") return "FINAL";
  if (state === "in") return "LIVE";
  return "UPCOMING";
}

function transformGame(g: any): LiveGame {
  const competitors: any[] = g.competitors ?? [];
  const home = competitors.find((c: any) => c.homeAway === "home") ?? competitors[0] ?? {};
  const away = competitors.find((c: any) => c.homeAway === "away") ?? competitors[1] ?? {};

  const state = g.status?.type?.state ?? "pre";
  const description = g.status?.type?.description ?? "";
  const detail = g.status?.type?.detail ?? "";

  const homeAbbr = home.team?.abbreviation ?? "HOM";
  const awayAbbr = away.team?.abbreviation ?? "AWY";

  return {
    id: g.id,
    status: parseStatus(state, description),
    period: description === "Final" ? "Final" : description,
    clock: g.status?.displayClock ?? "",
    detail,
    homeTeam: {
      abbr: homeAbbr,
      name: home.team?.displayName ?? homeAbbr,
      score: parseInt(home.score ?? "0", 10),
      color: TEAM_COLORS[homeAbbr] ?? home.team?.color ?? "#3B82F6",
      logo: home.team?.logo ?? "",
    },
    awayTeam: {
      abbr: awayAbbr,
      name: away.team?.displayName ?? awayAbbr,
      score: parseInt(away.score ?? "0", 10),
      color: TEAM_COLORS[awayAbbr] ?? away.team?.color ?? "#6B7280",
      logo: away.team?.logo ?? "",
    },
    date: g.date ? new Date(g.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
    venue: g.venue?.fullName,
    broadcast: g.broadcasts?.[0]?.names?.[0],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────────────

/** Today's games — live from ESPN public API */
export function useTodaysGames() {
  const query = trpc.nba.todaysGames.useQuery(undefined, {
    staleTime: 60_000,
    refetchInterval: 60_000,
    retry: 2,
  });

  const games: LiveGame[] = useMemo(() => {
    if (!query.data?.length) return [];
    return query.data.map(transformGame);
  }, [query.data]);

  return { games, isLoading: query.isLoading, error: query.error };
}

/** Recent games (last N days) — live from ESPN public API */
export function useRecentGames(daysBack = 3) {
  const query = trpc.nba.recentGames.useQuery(
    { daysBack },
    { staleTime: 120_000, retry: 2 }
  );

  const games: LiveGame[] = useMemo(() => {
    if (!query.data?.length) return [];
    return query.data.map(transformGame);
  }, [query.data]);

  return { games, isLoading: query.isLoading, error: query.error };
}

/** Full standings — live from ESPN, falls back to curated static data */
export function useStandings() {
  const query = trpc.nba.standings.useQuery(undefined, {
    staleTime: 300_000,
    retry: 2,
  });

  const east: Team[] = useMemo(() => {
    if (!query.data?.east?.length) return EAST_STANDINGS;
    return transformStandings(query.data.east, "East");
  }, [query.data]);

  const west: Team[] = useMemo(() => {
    if (!query.data?.west?.length) return WEST_STANDINGS;
    return transformStandings(query.data.west, "West");
  }, [query.data]);

  return {
    east,
    west,
    isLive: Boolean(query.data),
    isLoading: query.isLoading,
    error: query.error,
  };
}

/** Leaders — static curated data (ESPN leaders endpoint not publicly available) */
export function useLeaders() {
  return {
    scoringLeaders: SCORING_LEADERS,
    assistLeaders: ASSIST_LEADERS,
    reboundLeaders: REBOUND_LEADERS,
    isLive: false,
  };
}

export interface TeamDetailData {
  team: { id: string; abbreviation: string; displayName: string; location: string; name: string; color: string; alternateColor: string; logo: string; recordSummary: string; standingSummary: string };
  roster: { id: string; fullName: string; position: string; jersey: string; age: number | null; height: string; weight: string; status: string; headshot: string }[];
  shooting: { fgPct: number; twoPct: number; threePct: number; ftPct: number; pointsPerGame: number; reboundsPerGame: number; assistsPerGame: number; offensiveReboundsPerGame: number; twoAttemptedPerGame: number; threeMadePerGame: number; threeAttemptedPerGame: number };
  games: { id: string; date: string; opponent: string; opponentAbbreviation: string; opponentLogo: string; homeAway: "home" | "away"; status: string; detail: string; score?: string }[];
}

function fallbackTeamDetail(abbr: string): TeamDetailData {
  const standing = [...EAST_STANDINGS, ...WEST_STANDINGS].find(team => team.abbr === abbr) ?? EAST_STANDINGS[0];
  const players = TOP_PLAYERS.filter(player => player.teamAbbr === abbr).map(player => ({
    id: String(player.id), fullName: player.name, position: player.position, jersey: player.number,
    age: player.age, height: "—", weight: "—", status: "Active", headshot: player.imageUrl ?? "",
  }));
  return {
    team: { id: String(standing.id), abbreviation: standing.abbr, displayName: standing.name, location: standing.city,
      name: standing.name.split(" ").pop() ?? standing.name, color: standing.color, alternateColor: standing.secondaryColor,
      logo: "", recordSummary: `${standing.wins}-${standing.losses}`, standingSummary: `${standing.conference} · ${standing.division}` },
    roster: players,
    shooting: { fgPct: 48.2, twoPct: 52.6, threePct: 37.8, ftPct: 78.4, pointsPerGame: standing.ppg, reboundsPerGame: 43.8, twoAttemptedPerGame: 58.5,
      assistsPerGame: 26.4, offensiveReboundsPerGame: 10.8, threeMadePerGame: 13.2, threeAttemptedPerGame: 35.0 },
    games: Array.from({ length: 5 }, (_, i) => ({ id: `fallback-${abbr}-${i}`, date: new Date(Date.now() + (i + 1) * 86_400_000).toISOString(),
      opponent: i % 2 ? "Scheduled opponent" : "League matchup", opponentAbbreviation: "NBA", opponentLogo: "", homeAway: (i % 2 ? "away" : "home") as "home" | "away", status: "pre", detail: "Scheduled" })),
  };
}

/** Team page data — ESPN live with a curated fallback when the public endpoint is unavailable. */
export function useTeamDetail(abbr: string) {
  const teamId = ESPN_TEAM_IDS[abbr.toUpperCase()] ?? abbr;
  const query = trpc.nba.teamDetail.useQuery({ teamId }, { staleTime: 300_000, refetchInterval: 300_000, retry: 1 });
  const data = useMemo(() => query.data ?? fallbackTeamDetail(abbr.toUpperCase()), [query.data, abbr]);
  return { data, isLive: Boolean(query.data), isLoading: query.isLoading, error: query.error };
}

// ─────────────────────────────────────────────────────────────────────────────
// Transformers
// ─────────────────────────────────────────────────────────────────────────────

function getStat(
  stats: { name: string; value: number | null; displayValue: string }[],
  name: string
): { value: number; display: string } {
  const s = stats.find((x) => x.name === name);
  return { value: s?.value ?? 0, display: s?.displayValue ?? "—" };
}

function transformStandings(
  entries: any[],
  conference: "East" | "West"
): Team[] {
  // Sort by wins descending
  const sorted = [...entries].sort((a, b) => {
    const aw = getStat(a.stats, "wins").value;
    const bw = getStat(b.stats, "wins").value;
    return bw - aw;
  });

  const leaderWins = getStat(sorted[0]?.stats ?? [], "wins").value;
  const leaderLosses = getStat(sorted[0]?.stats ?? [], "losses").value;

  return sorted.map((e, i) => {
    const wins = getStat(e.stats, "wins").value;
    const losses = getStat(e.stats, "losses").value;
    const pct = getStat(e.stats, "winPercent").value;
    const ppg = getStat(e.stats, "avgPointsFor").value;
    const oppPpg = getStat(e.stats, "avgPointsAgainst").value;
    const home = getStat(e.stats, "Home").display;
    const road = getStat(e.stats, "Road").display;
    const lastTen = getStat(e.stats, "Last Ten Games").display;
    const streakDisplay = getStat(e.stats, "streak").display;
    const gb = getStat(e.stats, "gamesBehind").value;
    const abbr = e.team?.abbreviation ?? "???";

    return {
      id: parseInt(e.team?.id ?? "0", 10),
      name: e.team?.displayName ?? "Unknown",
      abbr,
      city: e.team?.shortDisplayName ?? "",
      conference,
      division: "",
      wins,
      losses,
      pct,
      gb: i === 0 ? 0 : gb,
      homeRecord: home,
      awayRecord: road,
      lastTen,
      streak: streakDisplay,
      ppg: Math.round(ppg * 10) / 10,
      oppPpg: Math.round(oppPpg * 10) / 10,
      color: TEAM_COLORS[abbr] ?? "#3B82F6",
      secondaryColor: "#ffffff",
    } as Team;
  });
}
