/**
 * NBA Analytics Dashboard — App Router
 * Design: "Fast Break" — Premium Sports Analytics
 * Dark navy theme, sidebar layout, multi-page routing
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Players from "./pages/Players";
import Standings from "./pages/Standings";
import PlayerDetail from "./pages/PlayerDetail";
import NotFound from "./pages/NotFound";
import Trends from "./pages/Trends";
import LiveScores from "./pages/LiveScores";
import PlayerComparison from "./pages/PlayerComparison";
import { useState, useCallback } from "react";

const MAX_COMPARE = 4;

function Router() {
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [, navigate] = useLocation();

  const toggleCompare = useCallback((id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev; // cap at 4
      return [...prev, id];
    });
  }, []);

  const removeCompare = useCallback((id: number) => {
    setCompareIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
    navigate("/players");
  }, [navigate]);

  return (
    <DashboardLayout compareCount={compareIds.length} onViewCompare={() => navigate("/compare")}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/players">
          {() => (
            <Players
              compareIds={compareIds}
              onToggleCompare={toggleCompare}
              onViewCompare={() => navigate("/compare")}
            />
          )}
        </Route>
        <Route path="/players/:id" component={PlayerDetail} />
        <Route path="/compare">
          {() => (
            <PlayerComparison
              selectedIds={compareIds}
              onRemove={removeCompare}
              onClear={clearCompare}
            />
          )}
        </Route>
        <Route path="/standings" component={Standings} />
        <Route path="/trends" component={Trends} />
        <Route path="/live" component={LiveScores} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
