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

export interface EspnTeamDetail {
  id: string; abbreviation: string; displayName: string; location: string; name: string;
  color: string; alternateColor: string; logo: string; recordSummary: string; standingSummary: string;
}
export interface EspnRosterPlayer {
  id: string; fullName: string; position: string; jersey: string; age: number | null;
  height: string; weight: string; status: string; headshot: string;
}
export interface EspnTeamShooting {
  fgPct: number; twoPct: number; threePct: number; ftPct: number; pointsPerGame: number;
  reboundsPerGame: number; assistsPerGame: number; offensiveReboundsPerGame: number;
  twoAttemptedPerGame: number; threeMadePerGame: number; threeAttemptedPerGame: number;
}
export interface EspnTeamGame {
  id: string; date: string; opponent: string; opponentAbbreviation: string; opponentLogo: string;
  homeAway: "home" | "away"; status: string; detail: string; score?: string;
}
export interface EspnTeamDetailResponse {
  team: EspnTeamDetail; roster: EspnRosterPlayer[]; shooting: EspnTeamShooting; games: EspnTeamGame[];
}

function teamFromPayload(team: any, fallbackId: string): EspnTeamDetail {
  return {
    id: team?.id ?? fallbackId,
    abbreviation: team?.abbreviation ?? "NBA",
    displayName: team?.displayName ?? "NBA Team",
    location: team?.location ?? team?.displayName?.split(" ").slice(0, -1).join(" ") ?? "",
    name: team?.name ?? team?.shortDisplayName ?? "Team",
    color: team?.color ? `#${team.color.replace(/^#/, "")}` : "#3B82F6",
    alternateColor: team?.alternateColor ? `#${team.alternateColor.replace(/^#/, "")}` : "#1E40AF",
    logo: team?.logo ?? team?.logos?.[0]?.href ?? "",
    recordSummary: team?.recordSummary ?? team?.seasonSummary ?? "",
    standingSummary: team?.standingSummary ?? "",
  };
}

function statValue(categories: any[], name: string): number {
  for (const category of categories) {
    const stat = category.stats?.find((item: any) => item.name === name);
    if (stat) return Number(stat.value ?? 0);
  }
  return 0;
}

/** Fetch roster, shooting splits, and the next five scheduled games from ESPN. */
export async function getTeamDetail(teamId: string): Promise<EspnTeamDetailResponse> {
  const [teamRes, rosterRes, statsRes, scheduleRes] = await Promise.all([
    espn.get(`${ESPN_SITE}/teams/${teamId}`),
    espn.get(`${ESPN_SITE}/teams/${teamId}/roster`),
    espn.get(`${ESPN_SITE}/teams/${teamId}/statistics`),
    espn.get(`${ESPN_SITE}/teams/${teamId}/schedule`),
  ]);
  const team = teamFromPayload(teamRes.data?.team, teamId);
  const roster = (rosterRes.data?.athletes ?? []).map((player: any) => ({
    id: player.id, fullName: player.fullName ?? player.displayName ?? "Unknown Player",
    position: player.position?.abbreviation ?? player.position?.displayName ?? "—",
    jersey: player.jersey ?? "—", age: player.age ?? null, height: player.displayHeight ?? "—",
    weight: player.displayWeight ?? "—", status: player.status?.type ?? player.status?.name ?? "Active",
    headshot: player.headshot?.href ?? "",
  })) as EspnRosterPlayer[];
  const categories = statsRes.data?.results?.stats?.categories ?? [];
  const shooting: EspnTeamShooting = {
    fgPct: statValue(categories, "fieldGoalPct"), twoPct: statValue(categories, "twoPointFieldGoalPct"),
    threePct: statValue(categories, "threePointFieldGoalPct"), ftPct: statValue(categories, "freeThrowPct"),
    pointsPerGame: statValue(categories, "avgPoints"), reboundsPerGame: statValue(categories, "avgRebounds"),
    assistsPerGame: statValue(categories, "avgAssists"), offensiveReboundsPerGame: statValue(categories, "avgOffensiveRebounds"),
    twoAttemptedPerGame: statValue(categories, "avgTwoPointFieldGoalsAttempted"),
    threeMadePerGame: statValue(categories, "avgThreePointFieldGoalsMade"),
    threeAttemptedPerGame: statValue(categories, "avgThreePointFieldGoalsAttempted"),
  };
  const now = Date.now();
  const games = (scheduleRes.data?.events ?? []).filter((event: any) => new Date(event.date).getTime() >= now).slice(0, 5).map((event: any) => {
    const competition = event.competitions?.[0] ?? {};
    const opponent = (competition.competitors ?? []).find((entry: any) => entry.team?.id !== team.id) ?? {};
    return {
      id: event.id, date: event.date, opponent: opponent.team?.displayName ?? "Opponent",
      opponentAbbreviation: opponent.team?.abbreviation ?? "OPP", opponentLogo: opponent.team?.logo ?? "",
      homeAway: opponent.homeAway === "home" ? "away" : "home",
      status: event.status?.type?.state ?? "pre", detail: event.status?.type?.shortDetail ?? event.status?.type?.detail ?? "Scheduled",
      score: opponent.score,
    } as EspnTeamGame;
  });
  return { team, roster, shooting, games };
}
