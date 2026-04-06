/**
 * DashboardLayout — Fixed sidebar + main content area
 * Design: "Fast Break" — deep navy sidebar, blue accent active states
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  BarChart3,
  Users,
  Trophy,
  TrendingUp,
  Activity,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: BarChart3, label: "Dashboard", exact: true },
  { href: "/players", icon: Users, label: "Players" },
  { href: "/standings", icon: Trophy, label: "Standings" },
  { href: "/trends", icon: TrendingUp, label: "Trends" },
  { href: "/live", icon: Activity, label: "Live Scores" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location === href;
    return location.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Zap className="w-4 h-4 text-white" fill="white" />
        </div>
        <div>
          <div className="font-bold text-white text-sm leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>
            NBA Analytics
          </div>
          <div className="text-[10px] text-blue-400/70 mt-0.5 uppercase tracking-widest">
            2024–25 Season
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-widest text-white/25 px-3 mb-3 font-semibold">
          Main
        </div>
        {NAV_ITEMS.map(({ href, icon: Icon, label, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link key={href} href={href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  active
                    ? "bg-blue-500/15 text-blue-300 border-l-2 border-blue-400 pl-[10px]"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.05] border-l-2 border-transparent"
                )}
                onClick={() => setMobileOpen(false)}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 flex-shrink-0 transition-colors",
                    active ? "text-blue-400" : "text-white/35 group-hover:text-white/60"
                  )}
                />
                {label}
                {label === "Live Scores" && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 live-indicator" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Season badge */}
      <div className="px-4 py-4 border-t border-white/[0.06]">
        <div
          className="rounded-lg p-3 text-xs"
          style={{ background: "rgba(59, 130, 246, 0.08)", border: "1px solid rgba(59, 130, 246, 0.15)" }}
        >
          <div className="text-blue-300 font-semibold mb-0.5">2024–25 Regular Season</div>
          <div className="text-white/40">Data through Apr 5, 2025</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#060B18" }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-white/[0.06]"
        style={{ background: "#080E1C" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="relative w-64 flex flex-col border-r border-white/[0.06] z-10"
            style={{ background: "#080E1C" }}
          >
            <button
              className="absolute top-4 right-4 text-white/50 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header
          className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-white/[0.06] flex-shrink-0"
          style={{ background: "rgba(8, 14, 28, 0.8)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-white/50 hover:text-white"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:block">
              <h1
                className="text-white font-bold text-lg leading-none"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {NAV_ITEMS.find(n => isActive(n.href, n.exact))?.label ?? "Dashboard"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-indicator" />
              <span className="hidden sm:block">Live</span>
            </div>
            {/* Season selector */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-white/60 border border-white/[0.08] cursor-pointer hover:border-white/20 transition-colors"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <span>2024–25</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
