/**
 * ESPN Public API Service — Backend
 * Completely free, no API key required
 * Endpoints: Scoreboard, Standings, Team Stats, Player Search
 */

import axios from "axios";

const ESPN_SITE = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba";
const ESPN_CORE = "https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba";

const espn = axios.create({ timeout: 10_000 });

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface EspnTeamInfo {
  id: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  color: string;
  alternateColor: string;
  logo: string;
}

export interface EspnCompetitor {
  id: string;
  homeAway: "home" | "away";
  score: string;
  team: EspnTeamInfo;
  records?: { name: string; summary: string }[];
  linescores?: { value: number }[];
}

export interface EspnGame {
  id: string;
  date: string;
  name: string;
  shortName: string;
  status: {
    clock: number;
    displayClock: string;
    period: number;
    type: {
      id: string;
      name: string;
      state: "pre" | "in" | "post";
      completed: boolean;
      description: string;
      detail: string;
      shortDetail: string;
    };
  };
  competitors: EspnCompetitor[];
  venue?: { fullName: string; city: string };
  broadcasts?: { names: string[] }[];
}

export interface EspnStandingEntry {
  team: {
    id: string;
    abbreviation: string;
    displayName: string;
    shortDisplayName: string;
    color: string;
    alternateColor: string;
    logo: string;
  };
  stats: {
    name: string;
    value: number | null;
    displayValue: string;
  }[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Scoreboard / Games
// ─────────────────────────────────────────────────────────────────────────────

/** Get today's NBA scoreboard */
export async function getScoreboard(dates?: string): Promise<EspnGame[]> {
  const params: Record<string, string> = { limit: "20" };
  if (dates) params.dates = dates;

  const res = await espn.get<{ events: any[] }>(`${ESPN_SITE}/scoreboard`, { params });
  const events = res.data.events ?? [];

  return events.map((e: any) => {
    const comp = e.competitions?.[0] ?? {};
    const competitors: EspnCompetitor[] = (comp.competitors ?? []).map((c: any) => ({
      id: c.id,
      homeAway: c.homeAway,
      score: c.score ?? "0",
      team: {
        id: c.team?.id,
        abbreviation: c.team?.abbreviation,
        displayName: c.team?.displayName,
        shortDisplayName: c.team?.shortDisplayName,
        color: c.team?.color ? `#${c.team.color}` : "#3B82F6",
        alternateColor: c.team?.alternateColor ? `#${c.team.alternateColor}` : "#1E40AF",
        logo: c.team?.logo ?? "",
      },
      records: c.records ?? [],
      linescores: c.linescores ?? [],
    }));

    const venue = comp.venue;
    const broadcasts = comp.broadcasts ?? [];

    return {
      id: e.id,
      date: e.date,
      name: e.name,
      shortName: e.shortName,
      status: {
        clock: e.status?.clock ?? 0,
        displayClock: e.status?.displayClock ?? "0:00",
        period: e.status?.period ?? 0,
        type: {
          id: e.status?.type?.id ?? "1",
          name: e.status?.type?.name ?? "STATUS_SCHEDULED",
          state: e.status?.type?.state ?? "pre",
          completed: e.status?.type?.completed ?? false,
          description: e.status?.type?.description ?? "Scheduled",
          detail: e.status?.type?.detail ?? "",
          shortDetail: e.status?.type?.shortDetail ?? "",
        },
      },
      competitors,
      venue: venue ? { fullName: venue.fullName, city: venue.address?.city ?? "" } : undefined,
      broadcasts: broadcasts.map((b: any) => ({ names: b.names ?? [] })),
    } as EspnGame;
  });
}

/** Get scoreboard for a specific date (YYYYMMDD format) */
export async function getScoreboardByDate(dateStr: string): Promise<EspnGame[]> {
  return getScoreboard(dateStr);
}

/** Get today's games */
export async function getTodaysGames(): Promise<EspnGame[]> {
  return getScoreboard();
}

/** Get recent games (last N days) */
export async function getRecentGames(daysBack = 3): Promise<EspnGame[]> {
  const results: EspnGame[] = [];
  const today = new Date();

  for (let i = 0; i <= daysBack; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10).replace(/-/g, "");
    try {
      const games = await getScoreboard(dateStr);
      results.push(...games);
    } catch {
      // skip days with no data
    }
  }

  // Sort by date descending
  return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ─────────────────────────────────────────────────────────────────────────────
// Standings
// ─────────────────────────────────────────────────────────────────────────────

export interface EspnStandings {
  east: EspnStandingEntry[];
  west: EspnStandingEntry[];
}

/** Get full NBA standings (East + West) */
export async function getStandings(): Promise<EspnStandings> {
  const res = await espn.get<{ children: any[] }>(`${ESPN_SITE.replace('/site/v2', '/v2')}/standings`);
  const children = res.data.children ?? [];

  const parseConference = (confData: any): EspnStandingEntry[] => {
    const entries = confData?.standings?.entries ?? [];
    return entries.map((e: any) => ({
      team: {
        id: e.team?.id,
        abbreviation: e.team?.abbreviation,
        displayName: e.team?.displayName,
        shortDisplayName: e.team?.shortDisplayName,
        color: e.team?.color ? `#${e.team.color}` : "#3B82F6",
        alternateColor: e.team?.alternateColor ? `#${e.team.alternateColor}` : "#1E40AF",
        logo: e.team?.logos?.[0]?.href ?? "",
      },
      stats: (e.stats ?? []).map((s: any) => ({
        name: s.name,
        value: s.value ?? null,
        displayValue: s.displayValue ?? "",
      })),
    }));
  };

  const east = children.find((c: any) => c.name?.includes("Eastern"))
    ?? children[0];
  const west = children.find((c: any) => c.name?.includes("Western"))
    ?? children[1];

  return {
    east: parseConference(east),
    west: parseConference(west),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Team Info
// ─────────────────────────────────────────────────────────────────────────────

export async function getTeams(): Promise<any[]> {
  const res = await espn.get<{ sports: any[] }>(`${ESPN_SITE}/teams?limit=30`);
  const leagues = res.data.sports?.[0]?.leagues ?? [];
  const teams = leagues[0]?.teams ?? [];
  return teams.map((t: any) => t.team);
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: stat lookup
// ─────────────────────────────────────────────────────────────────────────────

export function getStat(
  stats: { name: string; value: number | null; displayValue: string }[],
  name: string
): { value: number; display: string } {
  const s = stats.find((x) => x.name === name);
  return { value: s?.value ?? 0, display: s?.displayValue ?? "—" };
}
