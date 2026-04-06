/**
 * Players — Full player stats table with sorting and filtering
 * Design: "Fast Break" — data-dense table with hover cards
 * Data: Curated 2024-25 season stats (ESPN free API doesn't expose per-player averages)
 */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  Search, ChevronUp, ChevronDown, ChevronsUpDown, Filter, ArrowRight
} from "lucide-react";
import { TOP_PLAYERS, POSITION_COLORS, type Player } from "@/lib/nbaData";
import { cn } from "@/lib/utils";

type SortKey = keyof Player;
type SortDir = "asc" | "desc";

const STAT_COLUMNS: { key: SortKey; label: string }[] = [
  { key: "gp", label: "GP" },
  { key: "mpg", label: "MPG" },
  { key: "ppg", label: "PPG" },
  { key: "rpg", label: "RPG" },
  { key: "apg", label: "APG" },
  { key: "spg", label: "SPG" },
  { key: "bpg", label: "BPG" },
  { key: "fgPct", label: "FG%" },
  { key: "fg3Pct", label: "3P%" },
  { key: "ftPct", label: "FT%" },
  { key: "plusMinus", label: "+/-" },
  { key: "per", label: "PER" },
  { key: "ts", label: "TS%" },
];

const POSITIONS = ["All", "PG", "SG", "SF", "PF", "C"];
const TEAMS = ["All", ...Array.from(new Set(TOP_PLAYERS.map(p => p.teamAbbr))).sort()];

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown className="w-3 h-3 text-white/20" />;
  return dir === "asc"
    ? <ChevronUp className="w-3 h-3 text-blue-400" />
    : <ChevronDown className="w-3 h-3 text-blue-400" />;
}

export default function Players() {
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("All");
  const [team, setTeam] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("ppg");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    return TOP_PLAYERS
      .filter(p => {
        const q = search.toLowerCase();
        const matchSearch = !q || p.name.toLowerCase().includes(q) || p.teamAbbr.toLowerCase().includes(q);
        const matchPos = position === "All" || p.position === position;
        const matchTeam = team === "All" || p.teamAbbr === team;
        return matchSearch && matchPos && matchTeam;
      })
      .sort((a, b) => {
        const av = a[sortKey] as number;
        const bv = b[sortKey] as number;
        return sortDir === "asc" ? av - bv : bv - av;
      });
  }, [search, position, team, sortKey, sortDir]);

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-bold text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>
            Player Statistics
          </h2>
          <p className="text-white/40 text-sm mt-0.5">
            2024–25 Regular Season · {TOP_PLAYERS.length} players
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Filter className="w-3.5 h-3.5" />
          <span>{filtered.length} results</span>
        </div>
      </div>

      {/* Filters */}
      <div
        className="rounded-xl p-4 flex flex-col sm:flex-row gap-3"
        style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search players or teams..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
        {/* Position filter */}
        <div className="flex gap-1.5 flex-wrap">
          {POSITIONS.map(pos => (
            <button
              key={pos}
              onClick={() => setPosition(pos)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                position === pos
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                  : "text-white/40 border border-white/[0.08] hover:border-white/20 hover:text-white/60"
              )}
            >
              {pos}
            </button>
          ))}
        </div>
        {/* Team filter */}
        <select
          value={team}
          onChange={e => setTeam(e.target.value)}
          className="bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/70 outline-none focus:border-blue-500/50 transition-colors"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          {TEAMS.map(t => (
            <option key={t} value={t} style={{ background: "#0E1628" }}>
              {t === "All" ? "All Teams" : t}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th
                  className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-white/30 font-semibold sticky left-0 z-10 min-w-[200px]"
                  style={{ background: "#0E1628" }}
                >
                  Player
                </th>
                <th className="text-center px-3 py-3 text-[10px] uppercase tracking-widest text-white/30 font-semibold">
                  POS
                </th>
                <th className="text-center px-3 py-3 text-[10px] uppercase tracking-widest text-white/30 font-semibold">
                  AGE
                </th>
                {STAT_COLUMNS.map(col => (
                  <th
                    key={col.key}
                    className="text-center px-3 py-3 text-[10px] uppercase tracking-widest font-semibold cursor-pointer select-none whitespace-nowrap"
                    style={{ color: sortKey === col.key ? "#60A5FA" : "rgba(255,255,255,0.3)" }}
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {col.label}
                      <SortIcon active={sortKey === col.key} dir={sortDir} />
                    </div>
                  </th>
                ))}
                <th className="text-center px-3 py-3 text-[10px] uppercase tracking-widest text-white/30 font-semibold">
                  Detail
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((player) => (
                <tr
                  key={player.id}
                  className="transition-colors hover:bg-white/[0.03] group"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  {/* Player name */}
                  <td className="px-4 py-3 sticky left-0 z-10" style={{ background: "inherit" }}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{
                          background: `${POSITION_COLORS[player.position]}20`,
                          border: `1px solid ${POSITION_COLORS[player.position]}40`,
                          color: POSITION_COLORS[player.position],
                          fontFamily: "'Barlow Condensed', sans-serif"
                        }}
                      >
                        {player.number}
                      </div>
                      <div>
                        <div className="text-white/90 font-medium text-sm group-hover:text-white transition-colors whitespace-nowrap">
                          {player.name}
                        </div>
                        <div className="text-white/35 text-xs">{player.teamAbbr}</div>
                      </div>
                    </div>
                  </td>
                  {/* Position */}
                  <td className="px-3 py-3 text-center">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-md"
                      style={{
                        background: `${POSITION_COLORS[player.position]}15`,
                        color: POSITION_COLORS[player.position],
                      }}
                    >
                      {player.position}
                    </span>
                  </td>
                  {/* Age */}
                  <td className="px-3 py-3 text-center text-white/50 text-xs">{player.age}</td>
                  {/* Stats */}
                  {STAT_COLUMNS.map(col => {
                    const val = player[col.key] as number;
                    const isActive = sortKey === col.key;
                    const isPlusMinus = col.key === "plusMinus";
                    return (
                      <td key={col.key} className="px-3 py-3 text-center">
                        <span
                          className="text-sm"
                          style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontWeight: isActive ? 700 : 500,
                            color: isActive
                              ? "#93C5FD"
                              : isPlusMinus
                                ? val >= 0 ? "#34D399" : "#F87171"
                                : "rgba(255,255,255,0.65)"
                          }}
                        >
                          {isPlusMinus && val > 0 ? "+" : ""}
                          {val.toFixed(col.key === "gp" ? 0 : 1)}
                        </span>
                      </td>
                    );
                  })}
                  {/* Detail link */}
                  <td className="px-3 py-3 text-center">
                    <Link href={`/players/${player.id}`}>
                      <span className="text-blue-400/60 hover:text-blue-400 transition-colors">
                        <ArrowRight className="w-4 h-4 mx-auto" />
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-white/30 text-sm">
            No players match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
