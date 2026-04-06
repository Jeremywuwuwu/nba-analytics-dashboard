/**
 * Standings — Full conference standings with team stats
 * Design: "Fast Break" — tabbed East/West, playoff seeding visualization
 */
import { useState } from "react";
import { Trophy, TrendingUp, TrendingDown, Minus, Wifi, WifiOff } from "lucide-react";
import { TEAM_STATS_COMPARISON, type Team } from "@/lib/nbaData";
import { useStandings } from "@/hooks/useNba";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { cn } from "@/lib/utils";

const PLAYOFF_CUTOFF = 6;
const PLAY_IN_CUTOFF = 8;

function StreakBadge({ streak }: { streak: string }) {
  const isWin = streak.startsWith("W");
  const num = parseInt(streak.slice(1));
  return (
    <span
      className={cn(
        "text-xs font-bold px-2 py-0.5 rounded-md",
        isWin ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
      )}
      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
    >
      {streak}
    </span>
  );
}

function LastTenBar({ record }: { record: string }) {
  const [w, l] = record.split("-").map(Number);
  const total = w + l;
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden flex">
        <div className="h-full bg-emerald-400 rounded-l-full" style={{ width: `${(w / total) * 100}%` }} />
        <div className="h-full bg-red-400 rounded-r-full" style={{ width: `${(l / total) * 100}%` }} />
      </div>
      <span className="text-xs text-white/40" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
        {record}
      </span>
    </div>
  );
}

function StandingsTable({ teams, title }: { teams: Team[]; title: string }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
        <Trophy className="w-4 h-4 text-amber-400" />
        <h3 className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
          {title}
        </h3>
        <div className="ml-auto flex items-center gap-3 text-[10px] text-white/30">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-blue-500/30 border border-blue-500/50" />
            Playoff
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-amber-500/30 border border-amber-500/50" />
            Play-In
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {["#", "Team", "W", "L", "PCT", "GB", "Home", "Away", "L10", "Streak", "PPG", "Opp"].map(h => (
                <th
                  key={h}
                  className={cn(
                    "py-2.5 text-[10px] uppercase tracking-widest text-white/25 font-semibold",
                    h === "Team" ? "text-left px-4" : "text-center px-3"
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teams.map((team, i) => {
              const isPlayoff = i < PLAYOFF_CUTOFF;
              const isPlayIn = i >= PLAYOFF_CUTOFF && i < PLAY_IN_CUTOFF;
              const rowBg = i === 0
                ? "bg-blue-500/[0.07]"
                : isPlayoff
                  ? ""
                  : isPlayIn
                    ? "bg-amber-500/[0.04]"
                    : "";
              return (
                <tr
                  key={team.id}
                  className={cn("transition-colors hover:bg-white/[0.03] group", rowBg)}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  {/* Seed */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        "text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center mx-auto",
                        isPlayoff
                          ? i === 0 ? "bg-blue-500/30 text-blue-300" : "text-white/40"
                          : isPlayIn
                            ? "text-amber-400/60"
                            : "text-white/20"
                      )}
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {i + 1}
                    </span>
                  </td>
                  {/* Team */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ background: team.color, boxShadow: `0 0 6px ${team.color}60` }}
                      />
                      <div>
                        <div className={cn("font-semibold text-sm whitespace-nowrap", i === 0 ? "text-white" : "text-white/80")}>
                          {team.city} {team.name.split(" ").pop()}
                        </div>
                        <div className="text-white/30 text-xs">{team.division}</div>
                      </div>
                    </div>
                  </td>
                  {/* W */}
                  <td className="px-3 py-3 text-center">
                    <span className="text-emerald-400 font-bold text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {team.wins}
                    </span>
                  </td>
                  {/* L */}
                  <td className="px-3 py-3 text-center">
                    <span className="text-white/50 text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {team.losses}
                    </span>
                  </td>
                  {/* PCT */}
                  <td className="px-3 py-3 text-center">
                    <span className="text-white/70 text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {team.pct.toFixed(3)}
                    </span>
                  </td>
                  {/* GB */}
                  <td className="px-3 py-3 text-center">
                    <span className="text-white/40 text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {team.gb === 0 ? "—" : team.gb}
                    </span>
                  </td>
                  {/* Home */}
                  <td className="px-3 py-3 text-center">
                    <span className="text-white/50 text-xs">{team.homeRecord}</span>
                  </td>
                  {/* Away */}
                  <td className="px-3 py-3 text-center">
                    <span className="text-white/50 text-xs">{team.awayRecord}</span>
                  </td>
                  {/* Last 10 */}
                  <td className="px-3 py-3">
                    <LastTenBar record={team.lastTen} />
                  </td>
                  {/* Streak */}
                  <td className="px-3 py-3 text-center">
                    <StreakBadge streak={team.streak} />
                  </td>
                  {/* PPG */}
                  <td className="px-3 py-3 text-center">
                    <span className="text-blue-300 text-sm font-semibold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {team.ppg}
                    </span>
                  </td>
                  {/* Opp PPG */}
                  <td className="px-3 py-3 text-center">
                    <span className="text-red-400/70 text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {team.oppPpg}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs shadow-xl" style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="text-white/50 mb-1.5 font-semibold">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-white/70">{p.name}:</span>
          <span className="text-white font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function Standings() {
  const [tab, setTab] = useState<"East" | "West" | "Both">("East");
  const { east, west, isLive, isLoading } = useStandings();

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-white font-bold text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>
              League Standings
            </h2>
            {isLive ? (
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                <Wifi className="w-3.5 h-3.5" />
                <span>Live</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-white/30 text-xs">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Cached</span>
              </div>
            )}
          </div>
          <p className="text-white/40 text-sm mt-0.5">2024–25 Regular Season{isLive ? " · Live from ESPN" : " · Curated data"}</p>
        </div>
        <div className="flex rounded-lg overflow-hidden border border-white/[0.08]">
          {(["East", "West", "Both"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-4 py-2 text-xs font-semibold transition-all",
                tab === t
                  ? "bg-blue-500/20 text-blue-300"
                  : "text-white/40 hover:text-white/60 hover:bg-white/[0.04]"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      )}

      {/* Tables */}
      {!isLoading && (tab === "East" || tab === "Both") && (
        <StandingsTable teams={east} title="Eastern Conference" />
      )}
      {!isLoading && (tab === "West" || tab === "Both") && (
        <StandingsTable teams={west} title="Western Conference" />
      )}

      {/* Win % Comparison Chart */}
      <div
        className="rounded-xl p-5"
        style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3 className="text-white font-bold text-sm mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
          Top 8 Teams — Win Percentage Comparison
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={[...east, ...west]
              .sort((a, b) => b.pct - a.pct)
              .slice(0, 8)
              .map(t => ({ team: t.abbr, pct: parseFloat((t.pct * 100).toFixed(1)), conf: t.conference, color: t.color }))}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="team" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[40, 85]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="pct" name="Win %" radius={[4, 4, 0, 0]} maxBarSize={32}>
              {[...east, ...west]
                .sort((a, b) => b.pct - a.pct)
                .slice(0, 8)
                .map((t, i) => (
                  <rect key={i} fill={t.conference === "East" ? "#3B82F6" : "#F59E0B"} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-2 text-xs text-white/40">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400" />Eastern</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" />Western</span>
        </div>
      </div>
    </div>
  );
}
