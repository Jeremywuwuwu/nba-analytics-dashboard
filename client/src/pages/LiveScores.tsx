/**
 * LiveScores — Live game scores and box scores
 * Design: "Fast Break" — live indicator, score cards
 */
import { Activity, Clock, RefreshCw } from "lucide-react";
import { TEAM_STANDINGS } from "@/lib/nbaData";
import { cn } from "@/lib/utils";

const MOCK_GAMES = [
  {
    id: 1, status: "LIVE", period: "Q3", clock: "4:32",
    home: { abbr: "OKC", score: 87, color: "#007AC1" },
    away: { abbr: "BOS", score: 81, color: "#007A33" },
    arena: "Paycom Center",
  },
  {
    id: 2, status: "LIVE", period: "Q2", clock: "1:15",
    home: { abbr: "LAL", score: 54, color: "#552583" },
    away: { abbr: "DEN", score: 61, color: "#0E2240" },
    arena: "Crypto.com Arena",
  },
  {
    id: 3, status: "FINAL", period: "Final", clock: "",
    home: { abbr: "MIL", score: 118, color: "#00471B" },
    away: { abbr: "MIA", score: 104, color: "#98002E" },
    arena: "Fiserv Forum",
  },
  {
    id: 4, status: "FINAL", period: "Final", clock: "",
    home: { abbr: "PHX", score: 109, color: "#1D1160" },
    away: { abbr: "MIN", score: 115, color: "#0C2340" },
    arena: "Footprint Center",
  },
  {
    id: 5, status: "UPCOMING", period: "7:30 PM ET", clock: "",
    home: { abbr: "NYK", score: 0, color: "#006BB6" },
    away: { abbr: "IND", score: 0, color: "#002D62" },
    arena: "Madison Square Garden",
  },
  {
    id: 6, status: "UPCOMING", period: "10:00 PM ET", clock: "",
    home: { abbr: "GSW", score: 0, color: "#1D428A" },
    away: { abbr: "CLE", score: 0, color: "#6F263D" },
    arena: "Chase Center",
  },
];

export default function LiveScores() {
  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>
            Live Scores
          </h2>
          <p className="text-white/40 text-sm mt-0.5">Apr 6, 2025 · NBA Game Day</p>
        </div>
        <button className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-2 rounded-lg border border-white/[0.08] hover:border-white/20">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Live Games */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 live-indicator" />
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">Live Now</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MOCK_GAMES.filter(g => g.status === "LIVE").map(game => (
            <div
              key={game.id}
              className="rounded-xl p-5"
              style={{ background: "#0E1628", border: "1px solid rgba(16,185,129,0.2)", boxShadow: "0 0 20px rgba(16,185,129,0.05)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-indicator" />
                  <span className="text-xs text-emerald-400 font-semibold">{game.period}</span>
                  {game.clock && (
                    <span className="flex items-center gap-1 text-xs text-white/40">
                      <Clock className="w-3 h-3" />{game.clock}
                    </span>
                  )}
                </div>
                <span className="text-xs text-white/30">{game.arena}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: game.away.color }} />
                  <span className="text-white font-semibold text-sm">{game.away.abbr}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={cn("text-3xl font-bold", game.away.score > game.home.score ? "text-white" : "text-white/50")}
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {game.away.score}
                  </span>
                  <span className="text-white/20 text-sm">—</span>
                  <span
                    className={cn("text-3xl font-bold", game.home.score > game.away.score ? "text-white" : "text-white/50")}
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {game.home.score}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold text-sm">{game.home.abbr}</span>
                  <div className="w-3 h-3 rounded-full" style={{ background: game.home.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Games */}
      <div>
        <div className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-3">Final</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MOCK_GAMES.filter(g => g.status === "FINAL").map(game => (
            <div
              key={game.id}
              className="rounded-xl p-5"
              style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-white/30 font-semibold uppercase tracking-widest">Final</span>
                <span className="text-xs text-white/25">{game.arena}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: game.away.color }} />
                  <span className="text-white/70 font-semibold text-sm">{game.away.abbr}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={cn("text-3xl font-bold", game.away.score > game.home.score ? "text-white" : "text-white/40")}
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {game.away.score}
                  </span>
                  <span className="text-white/15 text-sm">—</span>
                  <span
                    className={cn("text-3xl font-bold", game.home.score > game.away.score ? "text-white" : "text-white/40")}
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {game.home.score}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/70 font-semibold text-sm">{game.home.abbr}</span>
                  <div className="w-3 h-3 rounded-full" style={{ background: game.home.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Games */}
      <div>
        <div className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-3">Upcoming</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MOCK_GAMES.filter(g => g.status === "UPCOMING").map(game => (
            <div
              key={game.id}
              className="rounded-xl p-5"
              style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-blue-400/70 font-semibold">{game.period}</span>
                <span className="text-xs text-white/25">{game.arena}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: game.away.color }} />
                  <span className="text-white/60 font-semibold text-sm">{game.away.abbr}</span>
                </div>
                <span className="text-white/20 text-sm font-semibold">vs</span>
                <div className="flex items-center gap-3">
                  <span className="text-white/60 font-semibold text-sm">{game.home.abbr}</span>
                  <div className="w-3 h-3 rounded-full" style={{ background: game.home.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
