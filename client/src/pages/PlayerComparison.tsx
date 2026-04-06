/**
 * PlayerComparison — Side-by-side player comparison
 * Design: "Fast Break" — overlaid radar charts, season trend lines, stat table
 * Supports up to 4 players selected from the Players page
 */
import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, X, Users } from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, BarChart, Bar, Cell,
} from "recharts";
import {
  TOP_PLAYERS, PLAYER_SEASON_TRENDS, COMPARISON_COLORS, POSITION_COLORS,
  type Player,
} from "@/lib/nbaData";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Normalise a stat value to 0-100 scale for radar chart */
function normalise(value: number, min: number, max: number): number {
  if (max === min) return 50;
  return Math.round(((value - min) / (max - min)) * 100);
}

const RADAR_AXES = [
  { key: "ppg", label: "Scoring", min: 18, max: 35 },
  { key: "rpg", label: "Rebounds", min: 3, max: 14 },
  { key: "apg", label: "Assists", min: 3, max: 12 },
  { key: "spg", label: "Steals", min: 0.5, max: 2.2 },
  { key: "bpg", label: "Blocks", min: 0.2, max: 1.3 },
  { key: "per", label: "PER", min: 20, max: 36 },
  { key: "ts", label: "TS%", min: 55, max: 68 },
] as const;

type RadarAxisKey = typeof RADAR_AXES[number]["key"];

function buildRadarData(players: Player[]) {
  return RADAR_AXES.map(({ key, label, min, max }) => {
    const entry: Record<string, number | string> = { subject: label };
    players.forEach((p) => {
      entry[p.name] = normalise(p[key as keyof Player] as number, min, max);
    });
    return entry;
  });
}

const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

function buildTrendData(players: Player[], metric: "ppg" | "rpg" | "apg" | "fgPct") {
  return MONTHS.map((month) => {
    const entry: Record<string, number | string> = { month };
    players.forEach((p) => {
      const trends = PLAYER_SEASON_TRENDS[p.id];
      const point = trends?.find((t) => t.month === month);
      entry[p.name] = point ? point[metric] : 0;
    });
    return entry;
  });
}

const STAT_ROWS = [
  { key: "ppg", label: "PPG", higherBetter: true },
  { key: "rpg", label: "RPG", higherBetter: true },
  { key: "apg", label: "APG", higherBetter: true },
  { key: "spg", label: "SPG", higherBetter: true },
  { key: "bpg", label: "BPG", higherBetter: true },
  { key: "mpg", label: "MPG", higherBetter: false },
  { key: "fgPct", label: "FG%", higherBetter: true },
  { key: "fg3Pct", label: "3P%", higherBetter: true },
  { key: "ftPct", label: "FT%", higherBetter: true },
  { key: "per", label: "PER", higherBetter: true },
  { key: "ts", label: "TS%", higherBetter: true },
  { key: "plusMinus", label: "+/-", higherBetter: true },
  { key: "bpm", label: "BPM", higherBetter: true },
  { key: "ws", label: "Win Shares", higherBetter: true },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs shadow-xl"
      style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.1)" }}
    >
      <div className="text-white/50 mb-1.5 font-semibold">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-white/60 truncate max-w-[100px]">{p.name.split(" ").pop()}:</span>
          <span className="text-white font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const RadarTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs shadow-xl"
      style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.1)" }}
    >
      <div className="text-white/50 mb-1.5 font-semibold">{payload[0]?.payload?.subject}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-white/60 truncate max-w-[100px]">{p.name.split(" ").pop()}:</span>
          <span className="text-white font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

function PlayerBadge({
  player, color, onRemove,
}: { player: Player; color: string; onRemove: () => void }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
      style={{ background: `${color}18`, border: `1px solid ${color}40` }}
    >
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
      <span className="text-white/80 font-medium">{player.name}</span>
      <span className="text-white/35 text-xs">{player.teamAbbr}</span>
      <button
        onClick={onRemove}
        className="ml-1 text-white/30 hover:text-white/70 transition-colors"
        aria-label={`Remove ${player.name}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

interface PlayerComparisonProps {
  selectedIds: number[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export default function PlayerComparison({ selectedIds, onRemove, onClear }: PlayerComparisonProps) {
  const players = useMemo(
    () => TOP_PLAYERS.filter((p) => selectedIds.includes(p.id)),
    [selectedIds]
  );

  const radarData = useMemo(() => buildRadarData(players), [players]);
  const ppgTrend = useMemo(() => buildTrendData(players, "ppg"), [players]);
  const rpgTrend = useMemo(() => buildTrendData(players, "rpg"), [players]);
  const apgTrend = useMemo(() => buildTrendData(players, "apg"), [players]);
  const fgTrend = useMemo(() => buildTrendData(players, "fgPct"), [players]);

  if (players.length === 0) {
    return (
      <div className="p-4 lg:p-6">
        <div
          className="rounded-xl py-20 text-center"
          style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Users className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <div className="text-white/40 text-sm mb-2">No players selected for comparison.</div>
          <Link href="/players">
            <span className="text-blue-400/70 hover:text-blue-400 text-sm transition-colors cursor-pointer">
              ← Go back to Players to select some
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/players">
              <span className="text-white/40 hover:text-white/70 transition-colors cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
              </span>
            </Link>
            <h2
              className="text-white font-bold text-xl"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Player Comparison
            </h2>
          </div>
          <p className="text-white/40 text-sm">
            2024–25 Season · {players.length} player{players.length > 1 ? "s" : ""} selected
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {players.map((p, i) => (
            <PlayerBadge
              key={p.id}
              player={p}
              color={COMPARISON_COLORS[i % COMPARISON_COLORS.length]}
              onRemove={() => onRemove(p.id)}
            />
          ))}
          <button
            onClick={onClear}
            className="px-3 py-1.5 rounded-lg text-xs text-white/35 border border-white/[0.08] hover:border-white/20 hover:text-white/60 transition-all"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Radar Chart */}
      <div
        className="rounded-xl p-5"
        style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3
          className="text-white font-bold text-sm mb-1"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Skill Radar — Normalised to League Scale
        </h3>
        <p className="text-white/30 text-xs mb-4">
          Each axis is scaled relative to the top 15 players in the league.
        </p>
        <ResponsiveContainer width="100%" height={340}>
          <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="rgba(255,255,255,0.07)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }}
              tickCount={4}
            />
            {players.map((p, i) => (
              <Radar
                key={p.id}
                name={p.name}
                dataKey={p.name}
                stroke={COMPARISON_COLORS[i % COMPARISON_COLORS.length]}
                fill={COMPARISON_COLORS[i % COMPARISON_COLORS.length]}
                fillOpacity={0.12}
                strokeWidth={2}
                dot={{ r: 3, fill: COMPARISON_COLORS[i % COMPARISON_COLORS.length] }}
              />
            ))}
            <Tooltip content={<RadarTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>
                  {value}
                </span>
              )}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Season Trend Charts — 2×2 grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* PPG Trend */}
        <div
          className="rounded-xl p-5"
          style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3
            className="text-white font-bold text-sm mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Scoring (PPG) — Monthly Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ppgTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {players.map((p, i) => (
                <Line
                  key={p.id}
                  type="monotone"
                  dataKey={p.name}
                  stroke={COMPARISON_COLORS[i % COMPARISON_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: COMPARISON_COLORS[i % COMPARISON_COLORS.length] }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* RPG Trend */}
        <div
          className="rounded-xl p-5"
          style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3
            className="text-white font-bold text-sm mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Rebounds (RPG) — Monthly Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={rpgTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {players.map((p, i) => (
                <Line
                  key={p.id}
                  type="monotone"
                  dataKey={p.name}
                  stroke={COMPARISON_COLORS[i % COMPARISON_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: COMPARISON_COLORS[i % COMPARISON_COLORS.length] }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* APG Trend */}
        <div
          className="rounded-xl p-5"
          style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3
            className="text-white font-bold text-sm mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Assists (APG) — Monthly Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={apgTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {players.map((p, i) => (
                <Line
                  key={p.id}
                  type="monotone"
                  dataKey={p.name}
                  stroke={COMPARISON_COLORS[i % COMPARISON_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: COMPARISON_COLORS[i % COMPARISON_COLORS.length] }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* FG% Trend */}
        <div
          className="rounded-xl p-5"
          style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3
            className="text-white font-bold text-sm mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Field Goal % — Monthly Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={fgTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 65]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {players.map((p, i) => (
                <Line
                  key={p.id}
                  type="monotone"
                  dataKey={p.name}
                  stroke={COMPARISON_COLORS[i % COMPARISON_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: COMPARISON_COLORS[i % COMPARISON_COLORS.length] }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Stats Bar Chart */}
      <div
        className="rounded-xl p-5"
        style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3
          className="text-white font-bold text-sm mb-4"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Key Stats — Side-by-Side
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={[
              { stat: "PPG", ...Object.fromEntries(players.map((p) => [p.name, p.ppg])) },
              { stat: "RPG", ...Object.fromEntries(players.map((p) => [p.name, p.rpg])) },
              { stat: "APG", ...Object.fromEntries(players.map((p) => [p.name, p.apg])) },
              { stat: "SPG", ...Object.fromEntries(players.map((p) => [p.name, p.spg])) },
              { stat: "BPG", ...Object.fromEntries(players.map((p) => [p.name, p.bpg])) },
            ]}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="stat" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
                  {value.split(" ").pop()}
                </span>
              )}
            />
            {players.map((p, i) => (
              <Bar
                key={p.id}
                dataKey={p.name}
                fill={COMPARISON_COLORS[i % COMPARISON_COLORS.length]}
                radius={[3, 3, 0, 0]}
                maxBarSize={28}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Full Stat Comparison Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h3
            className="text-white font-bold text-sm"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Full Stat Breakdown
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-white/25 font-semibold">
                  Stat
                </th>
                {players.map((p, i) => (
                  <th
                    key={p.id}
                    className="text-center px-4 py-3 text-[10px] uppercase tracking-widest font-semibold whitespace-nowrap"
                    style={{ color: COMPARISON_COLORS[i % COMPARISON_COLORS.length] }}
                  >
                    {p.name.split(" ").pop()}
                    <div className="text-white/25 font-normal normal-case tracking-normal mt-0.5">
                      {p.teamAbbr}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STAT_ROWS.map(({ key, label, higherBetter }) => {
                const values = players.map((p) => p[key as keyof Player] as number);
                const best = higherBetter ? Math.max(...values) : Math.min(...values);
                return (
                  <tr
                    key={key}
                    className="hover:bg-white/[0.02] transition-colors"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <td className="px-5 py-3 text-white/40 text-xs font-semibold uppercase tracking-wider">
                      {label}
                    </td>
                    {players.map((p, i) => {
                      const val = p[key as keyof Player] as number;
                      const isBest = val === best && players.length > 1;
                      const isPlusMinus = key === "plusMinus" || key === "bpm";
                      return (
                        <td key={p.id} className="px-4 py-3 text-center">
                          <span
                            className={cn(
                              "text-sm font-semibold",
                              isBest ? "text-white" : "text-white/50"
                            )}
                            style={{
                              fontFamily: "'Barlow Condensed', sans-serif",
                              color: isBest
                                ? COMPARISON_COLORS[i % COMPARISON_COLORS.length]
                                : undefined,
                            }}
                          >
                            {isPlusMinus && val > 0 ? "+" : ""}
                            {val.toFixed(1)}
                            {isBest && (
                              <span className="ml-1 text-[9px] opacity-70">▲</span>
                            )}
                          </span>
                        </td>
                      );
                    })}
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
