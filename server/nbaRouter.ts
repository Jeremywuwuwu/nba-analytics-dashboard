/**
 * NBA tRPC Router — proxies ESPN public API calls server-side
 * Completely free, no API key required
 * Endpoints: scoreboard, standings, teams
 */

import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import {
  getTodaysGames,
  getRecentGames,
  getScoreboardByDate,
  getStandings,
  getTeams,
  getTeamDetail,
} from "./espnApi";

export const nbaRouter = router({
  /** Today's NBA games from ESPN */
  todaysGames: publicProcedure.query(async () => {
    try {
      return await getTodaysGames();
    } catch (err) {
      console.error("[NBA] getTodaysGames error:", err);
      return [];
    }
  }),

  /** Recent games (last N days) from ESPN */
  recentGames: publicProcedure
    .input(z.object({ daysBack: z.number().min(1).max(7).default(3) }))
    .query(async ({ input }) => {
      try {
        return await getRecentGames(input.daysBack);
      } catch (err) {
        console.error("[NBA] getRecentGames error:", err);
        return [];
      }
    }),

  /** Games for a specific date (YYYYMMDD format) */
  gamesByDate: publicProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ input }) => {
      try {
        return await getScoreboardByDate(input.date);
      } catch (err) {
        console.error("[NBA] gamesByDate error:", err);
        return [];
      }
    }),

  /** Full NBA standings (East + West) from ESPN */
  standings: publicProcedure.query(async () => {
    try {
      return await getStandings();
    } catch (err) {
      console.error("[NBA] getStandings error:", err);
      return null;
    }
  }),

  /** All 30 NBA teams from ESPN */
  teams: publicProcedure.query(async () => {
    try {
      return await getTeams();
    } catch (err) {
      console.error("[NBA] getTeams error:", err);
      return [];
    }
  }),

  /** Roster, shooting splits, and next five scheduled games for one team. */
  teamDetail: publicProcedure
    .input(z.object({ teamId: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        return await getTeamDetail(input.teamId);
      } catch (err) {
        console.error("[NBA] getTeamDetail error:", err);
        return null;
      }
    }),
});
