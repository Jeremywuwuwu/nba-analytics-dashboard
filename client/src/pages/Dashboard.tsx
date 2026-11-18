/**
 * Dashboard — Main overview page
 * Design: "Fast Break" — stat cards, trend charts, leaderboard, standings preview
 */
import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from "recharts";
import { TrendingUp, TrendingDown, Users, Trophy, Activity, ArrowRight, Star, Wifi } from "lucide-react";
import {
  TOP_PLAYERS, TEAM_STANDINGS, SEASON_TRENDS, TEAM_STATS_COMPARISON,
  SCORING_LEADERS, EAST_STANDINGS, WEST_STANDINGS
} from "@/lib/nbaData";
import { useTodaysGames } from "@/hooks/useNba";
import { cn } from "@/lib/utils";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496153499/PM4KysXAdyzTa5mHGNSYJf/nba-hero-bg-FmbkuVw6g9dHefDLKtWwQA.webp";
const HEATMAP_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496153499/PM4KysXAdyzTa5mHGNSYJf/nba-court-heatmap-9WA2iv7SCUzDecqtsA2w6J.webp";

// Animated counter hook
function useCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target * 10) / 10);
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function StatCard({
  label, value, unit, change, changeLabel, accent = "blue"
}: {
  label: string; value: number; unit?: string; change?: number;
  changeLabel?: string; accent?: "blue" | "amber" | "green" | "red";
}) {
  const displayed = useCounter(value);
  const accentColors = {
    blue: { border: "rgba(59,130,246,0.25)", glow: "rgba(59,130,246,0.08)", text: "#60A5FA", bg: "rgba(59,130,246,0.1)" },
    amber: { border: "rgba(245,158,11,0.25)", glow: "rgba(245,158,11,0.08)", text: "#FCD34D", bg: "rgba(245,158,11,0.1)" },
    green: { border: "rgba(16,185,129,0.25)", glow: "rgba(16,185,129,0.08)", text: "#34D399", bg: "rgba(16,185,129,0.1)" },
    red: { border: "rgba(239,68,68,0.25)", glow: "rgba(239,68,68,0.08)", text: "#F87171", bg: "rgba(239,68,68,0.1)" },
  };
  const c = accentColors[accent];
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.01]"
      style={{ background: "#0E1628", border: `1px solid ${c.border}`, boxShadow: `0 4px 20px ${c.glow}` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest font-semibold text-white/40">{label}</span>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
            change >= 0 ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"
          )}>
            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="flex items-end gap-1.5">
        <span
          className="text-4xl font-bold leading-none"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color: c.text }}
        >
          {displayed % 1 === 0 ? displayed.toFixed(0) : displayed.toFixed(1)}
        </span>
        {unit && <span className="text-white/40 text-sm mb-0.5">{unit}</span>}
      </div>
      {changeLabel && <span className="text-xs text-white/30">{changeLabel}</span>}
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

function TodaysGamesWidget() {
  const { games, isLoading } = useTodaysGames();
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-white/30 animate-pulse">
        <Wifi className="w-3.5 h-3.5" />
        <span>Loading today's games...</span>
      </div>
    );
  }
  if (!games.length) return null;
  const live = games.filter(g => g.status === "LIVE");
  const final = games.filter(g => g.status === "FINAL");
  const upcoming = games.filter(g => g.status === "UPCOMING");
  return (
    <div className="flex flex-wrap items-center gap-2">
      {live.length > 0 && (
        <Link href="/live">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1 hover:bg-emerald-400/15 transition-colors cursor-pointer">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
            {live.length} Live Game{live.length > 1 ? "s" : ""}
          </span>
        </Link>
      )}
      {final.length > 0 && (
        <Link href="/live">
          <span className="text-xs text-white/40 bg-white/[0.05] border border-white/[0.08] rounded-full px-3 py-1 hover:text-white/60 transition-colors cursor-pointer">
            {final.length} Final
          </span>
        </Link>
      )}
      {upcoming.length > 0 && (
        <Link href="/live">
          <span className="text-xs text-blue-400/60 bg-blue-400/[0.06] border border-blue-400/[0.12] rounded-full px-3 py-1 hover:text-blue-400/80 transition-colors cursor-pointer">
            {upcoming.length} Upcoming
          </span>
        </Link>
      )}
    </div>
  );
}

export default function Dashboard() {
  const leader = TOP_PLAYERS[0]; // SGA
  const topTeam = TEAM_STANDINGS.find(t => t.abbr === "OKC")!;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Hero Banner */}
      <div
        className="relative rounded-2xl overflow-hidden h-44 lg:h-56 flex items-end"
        style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}
      >
        <img src={HERO_BG} alt="NBA Court" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(6,11,24,0.92) 0%, rgba(6,11,24,0.5) 60%, transparent 100%)" }} />
        <div className="relative z-10 p-6 lg:p-8">
          <div className="text-xs uppercase tracking-widest text-blue-400/80 font-semibold mb-1">
            2024–25 NBA Season
          </div>
          <h2
            className="text-2xl lg:text-3xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Season Analytics
          </h2>
          <p className="text-white/50 text-sm mt-1">
            Real-time stats · Advanced metrics · Full standings
          </p>
          <div className="mt-3">
            <TodaysGamesWidget />
          </div>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-3 py-1.5 text-xs text-emerald-300 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-indicator" />
          Live
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard label="League PPG Leader" value={32.7} unit="pts" change={4.2} changeLabel="SGA · OKC" accent="blue" />
        <StatCard label="Top Win %" value={78.0} unit="%" change={2.1} changeLabel="OKC Thunder" accent="amber" />
        <StatCard label="3P% Leader" value={41.3} unit="%" change={1.8} changeLabel="Steph Curry" accent="green" />
        <StatCard label="Assist Leader" value={11.4} unit="apg" change={0.9} changeLabel="Trae Young" accent="red" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Season Trend Chart */}
        <div
          className="lg:col-span-2 rounded-xl p-5"
          style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
                SGA Season Progression
              </h3>
              <p className="text-white/40 text-xs mt-0.5">Points, Rebounds & Assists by month</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400" />PPG</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" />RPG</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" />APG</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={SEASON_TRENDS} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ppgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rpgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="apgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="ppg" name="PPG" stroke="#3B82F6" strokeWidth={2} fill="url(#ppgGrad)" dot={false} />
              <Area type="monotone" dataKey="rpg" name="RPG" stroke="#F59E0B" strokeWidth={2} fill="url(#rpgGrad)" dot={false} />
              <Area type="monotone" dataKey="apg" name="APG" stroke="#10B981" strokeWidth={2} fill="url(#apgGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Court Heatmap Card */}
        <div
          className="rounded-xl overflow-hidden relative flex flex-col"
          style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)", minHeight: 280 }}
        >
          <div className="p-4 pb-2">
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
              Shot Distribution
            </h3>
            <p className="text-white/40 text-xs mt-0.5">SGA — 2024–25 Season</p>
          </div>
          <div className="flex-1 relative">
            <img src={HEATMAP_IMG} alt="Shot Heatmap" className="w-full h-full object-cover opacity-90" />
            <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between text-xs"
              style={{ background: "linear-gradient(to top, rgba(14,22,40,1) 0%, transparent 100%)" }}>
              <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400" />Paint (42%)</span>
              <span className="flex items-center gap-1.5 text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-400" />3PT (31%)</span>
              <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400" />Mid (27%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scoring Leaders + Team Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Scoring Leaders */}
        <div
          className="rounded-xl p-5"
          style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
              Scoring Leaders
            </h3>
            <Link href="/players">
              <span className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
          <div className="space-y-2">
            {SCORING_LEADERS.slice(0, 8).map((player, i) => (
              <Link key={player.id} href={`/players/${player.id}`}>
                <div className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-white/[0.04] transition-colors group cursor-pointer">
                  <span
                    className="w-6 text-center text-xs font-bold flex-shrink-0"
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      color: i === 0 ? "#FCD34D" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "rgba(255,255,255,0.3)"
                    }}
                  >
                    {i + 1}
                  </span>
                  {i === 0 && <Star className="w-3 h-3 text-amber-400 flex-shrink-0" fill="#F59E0B" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-white/90 text-sm font-medium truncate group-hover:text-white transition-colors">
                      {player.name}
                    </div>
                    <div className="text-white/35 text-xs">{player.teamAbbr} · {player.position}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-400"
                        style={{ width: `${(player.ppg / SCORING_LEADERS[0].ppg) * 100}%` }}
                      />
                    </div>
                    <span
                      className="text-blue-300 font-bold text-sm w-10 text-right"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {player.ppg}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Team Comparison Bar Chart */}
        <div
          className="rounded-xl p-5"
          style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
              Top Teams — PPG vs Opp PPG
            </h3>
            <Link href="/standings">
              <span className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                Standings <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={[
                { team: "OKC", ppg: 119.3, opp: 108.6 },
                { team: "BOS", ppg: 118.6, opp: 110.2 },
                { team: "DEN", ppg: 117.4, opp: 113.1 },
                { team: "MIL", ppg: 116.8, opp: 113.2 },
                { team: "LAL", ppg: 115.9, opp: 113.7 },
                { team: "CLE", ppg: 115.2, opp: 107.4 },
              ]}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              barGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="team" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[100, 125]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="ppg" name="PPG" fill="#3B82F6" radius={[3, 3, 0, 0]} maxBarSize={18} />
              <Bar dataKey="opp" name="Opp PPG" fill="#EF4444" radius={[3, 3, 0, 0]} maxBarSize={18} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conference Standings Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          { conf: "East", data: EAST_STANDINGS.slice(0, 5) },
          { conf: "West", data: WEST_STANDINGS.slice(0, 5) },
        ].map(({ conf, data }) => (
          <div
            key={conf}
            className="rounded-xl p-5"
            style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h3 className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {conf}ern Conference
                </h3>
              </div>
              <Link href="/standings">
                <span className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                  Full <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
            <div className="space-y-1">
              <div className="grid grid-cols-12 text-[10px] uppercase tracking-widest text-white/25 px-2 pb-1 font-semibold">
                <span className="col-span-1">#</span>
                <span className="col-span-5">Team</span>
                <span className="col-span-2 text-center">W</span>
                <span className="col-span-2 text-center">L</span>
                <span className="col-span-2 text-center">PCT</span>
              </div>
              {data.map((team, i) => (
                <div
                  key={team.id}
                  className={cn(
                    "grid grid-cols-12 items-center py-2 px-2 rounded-lg text-sm transition-colors",
                    i === 0 ? "bg-blue-500/10 border border-blue-500/20" : "hover:bg-white/[0.03]"
                  )}
                >
                  <span className="col-span-1 text-white/30 text-xs font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {i + 1}
                  </span>
                  <div className="col-span-5 flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: team.color }}
                    />
                    <Link href={`/teams/${team.abbr}`}>
                      <span className={cn("text-xs font-semibold truncate hover:text-blue-300 transition-colors", i === 0 ? "text-white" : "text-white/70")}>
                        {team.abbr}
                      </span>
                    </Link>
                  </div>
                  <span className="col-span-2 text-center text-xs font-bold text-emerald-400" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {team.wins}
                  </span>
                  <span className="col-span-2 text-center text-xs text-white/40" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {team.losses}
                  </span>
                  <span className="col-span-2 text-center text-xs text-white/60" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {team.pct.toFixed(3)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
