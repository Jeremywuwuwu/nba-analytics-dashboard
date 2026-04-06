/**
 * PlayerDetail — Full player profile with game log, radar chart, and advanced stats
 * Design: "Fast Break" — glassmorphism hero card, animated charts
 */
import { useParams, Link } from "wouter";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar
} from "recharts";
import { ArrowLeft, Star, TrendingUp, Activity } from "lucide-react";
import { TOP_PLAYERS, PLAYER_GAME_LOG, SEASON_TRENDS, POSITION_COLORS, type Player } from "@/lib/nbaData";
import { cn } from "@/lib/utils";

const HEATMAP_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496153499/PM4KysXAdyzTa5mHGNSYJf/nba-court-heatmap-9WA2iv7SCUzDecqtsA2w6J.webp";

function StatBox({ label, value, sub, highlight }: { label: string; value: string | number; sub?: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 text-center transition-all",
        highlight
          ? "border border-blue-500/30 bg-blue-500/10"
          : "border border-white/[0.06] bg-white/[0.03]"
      )}
    >
      <div
        className={cn("text-3xl font-bold leading-none mb-1", highlight ? "text-blue-300" : "text-white")}
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        {value}
      </div>
      <div className="text-xs uppercase tracking-widest text-white/40 font-semibold">{label}</div>
      {sub && <div className="text-xs text-white/25 mt-0.5">{sub}</div>}
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

export default function PlayerDetail() {
  const params = useParams<{ id: string }>();
  const player = TOP_PLAYERS.find(p => p.id === parseInt(params.id ?? "1")) ?? TOP_PLAYERS[0];

  const radarData = [
    { stat: "Scoring", value: Math.min(100, (player.ppg / 35) * 100) },
    { stat: "Rebounds", value: Math.min(100, (player.rpg / 15) * 100) },
    { stat: "Assists", value: Math.min(100, (player.apg / 12) * 100) },
    { stat: "Defense", value: Math.min(100, ((player.spg + player.bpg) / 4) * 100) },
    { stat: "Efficiency", value: Math.min(100, (player.per / 35) * 100) },
    { stat: "Shooting", value: Math.min(100, (player.ts / 70) * 100) },
  ];

  const posColor = POSITION_COLORS[player.position];

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Back */}
      <Link href="/players">
        <div className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm w-fit cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          Back to Players
        </div>
      </Link>

      {/* Hero Card */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{
          background: "linear-gradient(135deg, #0E1628 0%, #131F35 100%)",
          border: `1px solid ${posColor}30`,
          boxShadow: `0 8px 40px ${posColor}15`
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${posColor} 0%, transparent 70%)` }} />

        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold flex-shrink-0"
              style={{
                background: `${posColor}20`,
                border: `2px solid ${posColor}40`,
                color: posColor,
                fontFamily: "'Barlow Condensed', sans-serif"
              }}
            >
              #{player.number}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h2
                    className="text-white text-2xl lg:text-3xl font-bold leading-tight"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {player.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="text-white/50 text-sm">{player.team}</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-md"
                      style={{ background: `${posColor}20`, color: posColor }}
                    >
                      {player.position}
                    </span>
                    <span className="text-white/30 text-xs">Age {player.age}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Star className="w-4 h-4" fill="#F59E0B" />
                  <span className="text-sm font-semibold text-amber-300">PER {player.per}</span>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-5">
                {[
                  { label: "PPG", value: player.ppg, highlight: true },
                  { label: "RPG", value: player.rpg },
                  { label: "APG", value: player.apg },
                  { label: "SPG", value: player.spg },
                  { label: "BPG", value: player.bpg },
                  { label: "+/-", value: player.plusMinus > 0 ? `+${player.plusMinus}` : player.plusMinus },
                ].map(s => (
                  <StatBox key={s.label} label={s.label} value={s.value} highlight={s.highlight} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Radar */}
        <div
          className="rounded-xl p-5"
          style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3 className="text-white font-bold text-sm mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
            Skill Profile
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="stat"
                tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
              />
              <Radar
                name={player.name}
                dataKey="value"
                stroke={posColor}
                fill={posColor}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Season Trend */}
        <div
          className="lg:col-span-2 rounded-xl p-5"
          style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3 className="text-white font-bold text-sm mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
            Season Scoring Trend
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={SEASON_TRENDS} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ppgDetail" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={posColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={posColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[25, 38]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="ppg" name="PPG" stroke={posColor} strokeWidth={2.5} fill="url(#ppgDetail)" dot={{ fill: posColor, r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Advanced Stats + Shot Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Advanced Metrics */}
        <div
          className="rounded-xl p-5"
          style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3 className="text-white font-bold text-sm mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
            Advanced Metrics
          </h3>
          <div className="space-y-3">
            {[
              { label: "Player Efficiency Rating (PER)", value: player.per, max: 40, color: "#3B82F6", note: "League avg: 15.0" },
              { label: "True Shooting % (TS%)", value: player.ts, max: 75, color: "#10B981", note: "League avg: 57.5%" },
              { label: "Win Shares (WS)", value: player.ws, max: 20, color: "#F59E0B", note: "Season total" },
              { label: "Box Plus/Minus (BPM)", value: player.bpm, max: 15, color: "#8B5CF6", note: "Per 100 possessions" },
            ].map(m => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/60">{m.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/30">{m.note}</span>
                    <span
                      className="text-sm font-bold"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif", color: m.color }}
                    >
                      {m.value}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (m.value / m.max) * 100)}%`, background: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Shooting splits */}
          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <div className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-3">Shooting Splits</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "FG%", value: player.fgPct },
                { label: "3P%", value: player.fg3Pct },
                { label: "FT%", value: player.ftPct },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div
                    className="text-2xl font-bold text-white mb-0.5"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {s.value}%
                  </div>
                  <div className="text-xs text-white/35 uppercase tracking-widest">{s.label}</div>
                  <div className="mt-1.5 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-400"
                      style={{ width: `${(s.value / 100) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shot Chart */}
        <div
          className="rounded-xl overflow-hidden flex flex-col"
          style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="p-4 pb-2">
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
              Shot Distribution
            </h3>
            <p className="text-white/40 text-xs mt-0.5">2024–25 Regular Season</p>
          </div>
          <div className="flex-1 relative min-h-[200px]">
            <img src={HEATMAP_IMG} alt="Shot Chart" className="w-full h-full object-cover" />
            <div
              className="absolute bottom-0 left-0 right-0 p-4"
              style={{ background: "linear-gradient(to top, rgba(14,22,40,1) 0%, transparent 100%)" }}
            >
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-amber-400 font-bold text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>42%</div>
                  <div className="text-white/40">Paint</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 font-bold text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>31%</div>
                  <div className="text-white/40">3-Point</div>
                </div>
                <div className="text-center">
                  <div className="text-emerald-400 font-bold text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>27%</div>
                  <div className="text-white/40">Mid-Range</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Log */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
          <Activity className="w-4 h-4 text-blue-400" />
          <h3 className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
            Recent Game Log
          </h3>
          <span className="ml-auto text-xs text-white/30">Last 10 games</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["Date", "Opp", "Result", "MIN", "PTS", "REB", "AST", "STL", "BLK", "FG", "3P", "FT", "+/-"].map(h => (
                  <th
                    key={h}
                    className={cn(
                      "py-2.5 text-[10px] uppercase tracking-widest text-white/25 font-semibold",
                      h === "Date" || h === "Opp" ? "text-left px-4" : "text-center px-3"
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLAYER_GAME_LOG.map((game, i) => (
                <tr
                  key={i}
                  className="hover:bg-white/[0.03] transition-colors"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td className="px-4 py-2.5 text-white/50 text-xs whitespace-nowrap">{game.date}</td>
                  <td className="px-4 py-2.5 text-white/70 text-xs font-semibold">{game.opponent}</td>
                  <td className="px-3 py-2.5 text-center">
                    <span
                      className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded",
                        game.result === "W"
                          ? "bg-emerald-400/10 text-emerald-400"
                          : "bg-red-400/10 text-red-400"
                      )}
                    >
                      {game.result}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center text-white/50 text-xs">{game.min}</td>
                  <td className="px-3 py-2.5 text-center">
                    <span className="text-white font-bold text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {game.pts}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center text-white/60 text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{game.reb}</td>
                  <td className="px-3 py-2.5 text-center text-white/60 text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{game.ast}</td>
                  <td className="px-3 py-2.5 text-center text-white/60 text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{game.stl}</td>
                  <td className="px-3 py-2.5 text-center text-white/60 text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{game.blk}</td>
                  <td className="px-3 py-2.5 text-center text-white/50 text-xs">{game.fgm}/{game.fga}</td>
                  <td className="px-3 py-2.5 text-center text-white/50 text-xs">{game.fg3m}/{game.fg3a}</td>
                  <td className="px-3 py-2.5 text-center text-white/50 text-xs">{game.ftm}/{game.fta}</td>
                  <td className="px-3 py-2.5 text-center">
                    <span
                      className={cn("text-sm font-bold", game.plusMinus >= 0 ? "text-emerald-400" : "text-red-400")}
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {game.plusMinus > 0 ? "+" : ""}{game.plusMinus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
