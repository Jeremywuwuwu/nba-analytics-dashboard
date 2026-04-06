/**
 * Trends — Advanced analytics and league-wide trends
 * Design: "Fast Break" — multi-chart analytics view
 */
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ReferenceLine
} from "recharts";
import { TrendingUp, BarChart3, Activity } from "lucide-react";
import { TOP_PLAYERS, SEASON_TRENDS, TEAM_STATS_COMPARISON, POSITION_COLORS } from "@/lib/nbaData";

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

// Efficiency vs scoring scatter data
const efficiencyData = TOP_PLAYERS.map(p => ({
  name: p.name.split(" ").pop(),
  ppg: p.ppg,
  ts: p.ts,
  per: p.per,
  pos: p.position,
}));

// Monthly FG% trend
const fgTrend = SEASON_TRENDS.map(t => ({
  month: t.month,
  fgPct: t.fgPct,
  ppg: t.ppg,
}));

// Position scoring averages
const positionData = Object.entries(
  TOP_PLAYERS.reduce((acc, p) => {
    if (!acc[p.position]) acc[p.position] = { ppg: 0, count: 0, rpg: 0, apg: 0 };
    acc[p.position].ppg += p.ppg;
    acc[p.position].rpg += p.rpg;
    acc[p.position].apg += p.apg;
    acc[p.position].count++;
    return acc;
  }, {} as Record<string, { ppg: number; rpg: number; apg: number; count: number }>)
).map(([pos, stats]) => ({
  position: pos,
  ppg: (stats.ppg / stats.count).toFixed(1),
  rpg: (stats.rpg / stats.count).toFixed(1),
  apg: (stats.apg / stats.count).toFixed(1),
}));

export default function Trends() {
  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h2 className="text-white font-bold text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>
          League Trends
        </h2>
        <p className="text-white/40 text-sm mt-0.5">Advanced analytics · 2024–25 Regular Season</p>
      </div>

      {/* Top metrics summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "League Avg PPG", value: "115.4", change: "+2.1", color: "#3B82F6" },
          { label: "League Avg 3P%", value: "36.8%", change: "+0.4", color: "#10B981" },
          { label: "League Avg Pace", value: "99.8", change: "+1.2", color: "#F59E0B" },
          { label: "Avg Assists/Game", value: "26.1", change: "+0.8", color: "#8B5CF6" },
        ].map(m => (
          <div
            key={m.label}
            className="rounded-xl p-4"
            style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="text-xs uppercase tracking-widest text-white/35 font-semibold mb-2">{m.label}</div>
            <div className="text-3xl font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: m.color }}>
              {m.value}
            </div>
            <div className="text-xs text-emerald-400 mt-1">↑ {m.change} vs last season</div>
          </div>
        ))}
      </div>

      {/* FG% and Scoring Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="rounded-xl p-5"
          style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
              FG% vs PPG — Monthly Correlation
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={fgTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" domain={[48, 56]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line yAxisId="left" type="monotone" dataKey="ppg" name="PPG" stroke="#3B82F6" strokeWidth={2.5} dot={{ fill: "#3B82F6", r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="fgPct" name="FG%" stroke="#F59E0B" strokeWidth={2.5} dot={{ fill: "#F59E0B", r: 3 }} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Position Averages */}
        <div
          className="rounded-xl p-5"
          style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
              Avg Stats by Position
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={positionData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="position" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="ppg" name="PPG" fill="#3B82F6" radius={[3, 3, 0, 0]} maxBarSize={20} />
              <Bar dataKey="rpg" name="RPG" fill="#F59E0B" radius={[3, 3, 0, 0]} maxBarSize={20} />
              <Bar dataKey="apg" name="APG" fill="#10B981" radius={[3, 3, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Efficiency Scatter */}
      <div
        className="rounded-xl p-5"
        style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
            Scoring vs True Shooting% — Top Players
          </h3>
          <div className="ml-auto flex items-center gap-3 text-xs text-white/30">
            {Object.entries(POSITION_COLORS).map(([pos, color]) => (
              <span key={pos} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />{pos}
              </span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <ScatterChart margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="ppg" name="PPG" type="number" domain={[18, 36]}
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false}
              label={{ value: "Points Per Game", position: "insideBottom", offset: -5, fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
            />
            <YAxis
              dataKey="ts" name="TS%" type="number" domain={[54, 70]}
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false}
              label={{ value: "True Shooting %", angle: -90, position: "insideLeft", offset: 15, fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-lg px-3 py-2 text-xs shadow-xl" style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="text-white font-semibold mb-1">{d.name}</div>
                    <div className="text-white/60">PPG: <span className="text-blue-300 font-bold">{d.ppg}</span></div>
                    <div className="text-white/60">TS%: <span className="text-amber-300 font-bold">{d.ts}</span></div>
                    <div className="text-white/60">PER: <span className="text-emerald-300 font-bold">{d.per}</span></div>
                  </div>
                );
              }}
            />
            <ReferenceLine x={26} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 2" />
            <ReferenceLine y={60} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 2" />
            {Object.entries(POSITION_COLORS).map(([pos, color]) => (
              <Scatter
                key={pos}
                name={pos}
                data={efficiencyData.filter(d => d.pos === pos)}
                fill={color}
                opacity={0.85}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Team stats comparison */}
      <div
        className="rounded-xl p-5"
        style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3 className="text-white font-bold text-sm mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
          Top 5 Teams — Multi-Stat Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th className="text-left py-2.5 px-3 text-[10px] uppercase tracking-widest text-white/30 font-semibold">Category</th>
                {["OKC", "BOS", "DEN", "CLE", "LAL"].map(t => (
                  <th key={t} className="text-center py-2.5 px-3 text-[10px] uppercase tracking-widest text-white/30 font-semibold">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEAM_STATS_COMPARISON.map((row, i) => {
                const vals = [row.OKC, row.BOS, row.DEN, row.CLE, row.LAL];
                const max = Math.max(...vals);
                return (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 text-white/60 text-xs font-semibold uppercase tracking-widest">{row.category}</td>
                    {vals.map((v, j) => (
                      <td key={j} className="py-2.5 px-3 text-center">
                        <span
                          className="text-sm font-bold"
                          style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            color: v === max ? "#60A5FA" : "rgba(255,255,255,0.55)"
                          }}
                        >
                          {v}
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
