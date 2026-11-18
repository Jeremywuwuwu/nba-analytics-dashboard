import { Link, useRoute } from "wouter";
import { ArrowLeft, CalendarDays, ChevronRight, MapPin, Shield, Users, Wifi, WifiOff } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTeamDetail } from "@/hooks/useNba";
import { cn } from "@/lib/utils";

const cardStyle = { background: "#0E1628", border: "1px solid rgba(255,255,255,0.06)" };

function Metric({ label, value, suffix = "" }: { label: string; value: string | number; suffix?: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="text-[10px] uppercase tracking-widest text-white/30">{label}</div>
      <div className="mt-2 text-2xl font-bold text-white stat-value">{value}<span className="text-sm text-white/40 ml-0.5">{suffix}</span></div>
    </div>
  );
}

function TeamDetail() {
  const [, params] = useRoute<{ abbr: string }>("/teams/:abbr");
  const abbr = params?.abbr?.toUpperCase() ?? "OKC";
  const { data, isLive, isLoading } = useTeamDetail(abbr);
  const shootingData = [
    { zone: "Field goal", value: data.shooting.fgPct },
    { zone: "2-point", value: data.shooting.twoPct },
    { zone: "3-point", value: data.shooting.threePct },
    { zone: "Free throw", value: data.shooting.ftPct },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/standings">
          <span className="inline-flex items-center gap-2 text-xs text-white/45 hover:text-blue-300 transition-colors"><ArrowLeft className="w-3.5 h-3.5" />Back to standings</span>
        </Link>
        <div className={cn("inline-flex items-center gap-1.5 text-xs", isLive ? "text-emerald-400" : "text-white/35")}>
          {isLive ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          {isLive ? "Live from ESPN" : "Curated fallback"}
          {isLoading && <span className="ml-1 animate-pulse">· syncing</span>}
        </div>
      </div>

      <section className="relative overflow-hidden rounded-2xl p-6 lg:p-8" style={{ background: `linear-gradient(120deg, ${data.team.color}55 0%, #0E1628 52%, #0E1628 100%)`, border: `1px solid ${data.team.color}55` }}>
        <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full blur-3xl opacity-25" style={{ background: data.team.color }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden" style={{ background: `${data.team.color}30`, border: `1px solid ${data.team.color}80` }}>
            {data.team.logo ? <img src={data.team.logo} alt="" className="w-14 h-14 object-contain" /> : <Shield className="w-10 h-10" style={{ color: data.team.color }} />}
          </div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-[0.22em] font-semibold" style={{ color: data.team.alternateColor }}>{data.team.abbreviation} · {data.team.standingSummary || "NBA"}</div>
            <h2 className="mt-1 text-3xl lg:text-4xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{data.team.displayName}</h2>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/45"><span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{data.team.location}</span><span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" />2024–25 regular season</span></div>
          </div>
          <div className="sm:text-right"><div className="text-xs uppercase tracking-widest text-white/35">Record</div><div className="text-3xl font-bold text-white stat-value">{data.team.recordSummary || "—"}</div></div>
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Metric label="FG%" value={data.shooting.fgPct.toFixed(1)} suffix="%" />
        <Metric label="3P%" value={data.shooting.threePct.toFixed(1)} suffix="%" />
        <Metric label="FT%" value={data.shooting.ftPct.toFixed(1)} suffix="%" />
        <Metric label="PPG" value={data.shooting.pointsPerGame.toFixed(1)} />
        <Metric label="APG" value={data.shooting.assistsPerGame.toFixed(1)} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <section className="xl:col-span-3 rounded-xl p-5" style={cardStyle}>
          <div className="flex items-start justify-between mb-4"><div><h3 className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>Team shooting profile</h3><p className="text-white/35 text-xs mt-1">Conversion rates across the floor</p></div><div className="text-xs text-blue-300">{data.shooting.threeMadePerGame.toFixed(1)} 3PM / game</div></div>
          <ResponsiveContainer width="100%" height={245}><BarChart data={shootingData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} /><XAxis dataKey="zone" tick={{ fill: "rgba(255,255,255,0.42)", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: "#0E1628", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, color: "white" }} formatter={(value: number) => [`${value.toFixed(1)}%`, "Accuracy"]} /><Bar dataKey="value" fill={data.team.color} radius={[5, 5, 0, 0]} maxBarSize={42} /></BarChart></ResponsiveContainer>
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/[0.06] text-center"><div><div className="text-white/30 text-[10px] uppercase tracking-widest">2PA / game</div><div className="text-white stat-value mt-1">{data.shooting.twoAttemptedPerGame.toFixed(1)}</div></div><div><div className="text-white/30 text-[10px] uppercase tracking-widest">3PA / game</div><div className="text-white stat-value mt-1">{data.shooting.threeAttemptedPerGame.toFixed(1)}</div></div><div><div className="text-white/30 text-[10px] uppercase tracking-widest">RPG</div><div className="text-white stat-value mt-1">{data.shooting.reboundsPerGame.toFixed(1)}</div></div></div>
        </section>

        <section className="xl:col-span-2 rounded-xl p-5" style={cardStyle}>
          <div className="flex items-start justify-between mb-4"><div><h3 className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>Next five games</h3><p className="text-white/35 text-xs mt-1">Schedule from ESPN</p></div><CalendarDays className="w-4 h-4 text-amber-400" /></div>
          <div className="space-y-2">{data.games.map(game => <div key={game.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white/[0.04] transition-colors"><div className="w-12 text-[10px] uppercase text-white/35">{new Date(game.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div><div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center overflow-hidden">{game.opponentLogo ? <img src={game.opponentLogo} alt="" className="w-6 h-6 object-contain" /> : <span className="text-[9px] text-white/45">{game.opponentAbbreviation}</span>}</div><div className="flex-1 min-w-0"><div className="text-sm text-white/80 truncate">{game.homeAway === "home" ? "vs" : "@"} {game.opponent}</div><div className="text-[10px] text-white/30">{game.detail}</div></div><ChevronRight className="w-3.5 h-3.5 text-white/20" /></div>)}</div>
        </section>
      </div>

      <section className="rounded-xl overflow-hidden" style={cardStyle}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]"><div><h3 className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>Full roster</h3><p className="text-white/35 text-xs mt-1">{data.roster.length} players · ESPN roster feed</p></div><Users className="w-4 h-4 text-blue-400" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">{data.roster.map((player, index) => <div key={player.id} className={cn("flex items-center gap-3 px-5 py-3", index % 2 ? "bg-white/[0.015]" : "", "border-b border-white/[0.04]")}><div className="w-9 h-9 rounded-full overflow-hidden bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-xs text-blue-300 font-bold">{player.headshot ? <img src={player.headshot} alt="" className="w-full h-full object-cover" /> : player.jersey}</div><div className="flex-1 min-w-0"><div className="text-sm text-white/80 truncate">{player.fullName}</div><div className="text-[11px] text-white/35">{player.position} · #{player.jersey} · {player.height}</div></div><span className={cn("text-[10px] px-2 py-1 rounded-full", player.status.toLowerCase().includes("active") ? "text-emerald-300 bg-emerald-400/10" : "text-white/35 bg-white/[0.05]")}>{player.status}</span></div>)}</div>
      </section>
    </div>
  );
}

export default TeamDetail;
