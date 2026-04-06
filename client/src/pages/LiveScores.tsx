/**
 * LiveScores — Live game scores powered by ESPN Public API (free, no key required)
 * Falls back to recent games (last 3 days) when no games today
 * Auto-refreshes every 60 seconds during live games
 */
import { useState } from "react";
import { RefreshCw, Clock, Wifi, WifiOff, Calendar } from "lucide-react";
import { useTodaysGames, useRecentGames, type LiveGame } from "@/hooks/useNba";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function GameCard({ game }: { game: LiveGame }) {
  const isLive = game.status === "LIVE";
  const isFinal = game.status === "FINAL";
  const isUpcoming = game.status === "UPCOMING";

  const homeWins = isFinal && game.homeTeam.score > game.awayTeam.score;
  const awayWins = isFinal && game.awayTeam.score > game.homeTeam.score;

  return (
    <div
      className="rounded-xl p-5 transition-all"
      style={{
        background: "#0E1628",
        border: isLive
          ? "1px solid rgba(16,185,129,0.25)"
          : "1px solid rgba(255,255,255,0.06)",
        boxShadow: isLive ? "0 0 20px rgba(16,185,129,0.06)" : "none",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isLive && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              style={{ animation: "pulse 1.5s ease-in-out infinite" }}
            />
          )}
          <span
            className={cn(
              "text-xs font-semibold",
              isLive ? "text-emerald-400" : isUpcoming ? "text-blue-400/70" : "text-white/30"
            )}
          >
            {game.period}
          </span>
          {isLive && game.clock && (
            <span className="flex items-center gap-1 text-xs text-white/35">
              <Clock className="w-3 h-3" />
              {game.clock}
            </span>
          )}
        </div>
        <span className="text-xs text-white/20">{game.date}</span>
      </div>

      {/* Scores */}
      <div className="space-y-2.5">
        {/* Away team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ background: game.awayTeam.color, boxShadow: `0 0 6px ${game.awayTeam.color}60` }}
            />
            <span
              className={cn(
                "font-semibold text-sm",
                awayWins ? "text-white" : isFinal ? "text-white/45" : "text-white/75"
              )}
            >
              {game.awayTeam.abbr}
            </span>
            {awayWins && (
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">W</span>
            )}
          </div>
          {!isUpcoming && (
            <span
              className={cn(
                "text-2xl font-bold",
                awayWins ? "text-white" : isFinal ? "text-white/40" : "text-white/80"
              )}
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {game.awayTeam.score}
            </span>
          )}
        </div>

        {/* Home team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ background: game.homeTeam.color, boxShadow: `0 0 6px ${game.homeTeam.color}60` }}
            />
            <span
              className={cn(
                "font-semibold text-sm",
                homeWins ? "text-white" : isFinal ? "text-white/45" : "text-white/75"
              )}
            >
              {game.homeTeam.abbr}
            </span>
            {homeWins && (
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">W</span>
            )}
          </div>
          {!isUpcoming && (
            <span
              className={cn(
                "text-2xl font-bold",
                homeWins ? "text-white" : isFinal ? "text-white/40" : "text-white/80"
              )}
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {game.homeTeam.score}
            </span>
          )}
          {isUpcoming && (
            <span className="text-white/30 text-sm font-semibold">vs</span>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-5 animate-pulse"
      style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="h-3 w-16 bg-white/10 rounded mb-4" />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-white/10 rounded" />
          <div className="h-6 w-8 bg-white/10 rounded" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-white/10 rounded" />
          <div className="h-6 w-8 bg-white/10 rounded" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function LiveScores() {
  const [tab, setTab] = useState<"today" | "recent">("today");

  const todayQuery = useTodaysGames();
  const recentQuery = useRecentGames(3);

  const isLoading = tab === "today" ? todayQuery.isLoading : recentQuery.isLoading;
  const error = tab === "today" ? todayQuery.error : recentQuery.error;
  const allGames = tab === "today" ? todayQuery.games : recentQuery.games;

  const liveGames = allGames.filter((g) => g.status === "LIVE");
  const finalGames = allGames.filter((g) => g.status === "FINAL");
  const upcomingGames = allGames.filter((g) => g.status === "UPCOMING");

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-white font-bold text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>
              Scores
            </h2>
            {/* Live indicator */}
            {!error ? (
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <Wifi className="w-3.5 h-3.5" />
                <span>Live</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-white/30 text-xs">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Offline</span>
              </div>
            )}
          </div>
          <p className="text-white/40 text-sm">{todayStr}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab switcher */}
          <div className="flex rounded-lg overflow-hidden border border-white/[0.08]">
            <button
              onClick={() => setTab("today")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5",
                tab === "today"
                  ? "bg-blue-500/20 text-blue-300"
                  : "text-white/40 hover:text-white/60"
              )}
            >
              <Calendar className="w-3 h-3" />
              Today
            </button>
            <button
              onClick={() => setTab("recent")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold transition-all",
                tab === "recent"
                  ? "bg-blue-500/20 text-blue-300"
                  : "text-white/40 hover:text-white/60"
              )}
            >
              Last 3 Days
            </button>
          </div>
          <button
            onClick={() => {
              todayQuery.isLoading || recentQuery.isLoading
                ? null
                : window.location.reload();
            }}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-1.5 rounded-lg border border-white/[0.08] hover:border-white/20"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm text-amber-300/80 flex items-center gap-2"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}
        >
          <WifiOff className="w-4 h-4 flex-shrink-0" />
          <span>Could not reach the scores API. Showing cached data.</span>
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* No games today */}
      {!isLoading && allGames.length === 0 && (
        <div
          className="rounded-xl py-16 text-center"
          style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Calendar className="w-10 h-10 text-white/15 mx-auto mb-3" />
          <div className="text-white/40 text-sm">
            {tab === "today"
              ? "No games scheduled for today."
              : "No games found in the last 3 days."}
          </div>
          <button
            onClick={() => setTab("recent")}
            className="mt-3 text-xs text-blue-400/70 hover:text-blue-400 transition-colors"
          >
            {tab === "today" ? "View recent games →" : ""}
          </button>
        </div>
      )}

      {/* Live Games */}
      {!isLoading && liveGames.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-2 h-2 rounded-full bg-emerald-400"
              style={{ animation: "pulse 1.5s ease-in-out infinite" }}
            />
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
              Live Now · {liveGames.length} game{liveGames.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {liveGames.map((g) => <GameCard key={g.id} game={g} />)}
          </div>
        </div>
      )}

      {/* Final Games */}
      {!isLoading && finalGames.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-3">
            Final · {finalGames.length} game{finalGames.length > 1 ? "s" : ""}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {finalGames.map((g) => <GameCard key={g.id} game={g} />)}
          </div>
        </div>
      )}

      {/* Upcoming Games */}
      {!isLoading && upcomingGames.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-3">
            Upcoming · {upcomingGames.length} game{upcomingGames.length > 1 ? "s" : ""}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingGames.map((g) => <GameCard key={g.id} game={g} />)}
          </div>
        </div>
      )}

      {/* Auto-refresh notice */}
      {!isLoading && liveGames.length > 0 && (
        <p className="text-center text-xs text-white/20">
          Auto-refreshes every 60 seconds during live games
        </p>
      )}

      {/* Data source badge */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-white/15 pt-2">
        <span>Powered by</span>
        <a
          href="https://www.espn.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/25 hover:text-white/50 transition-colors underline underline-offset-2"
        >
          ESPN Public API
        </a>
        <span>· Free · No API key required</span>
      </div>
    </div>
  );
}
