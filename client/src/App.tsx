/**
 * NBA Analytics Dashboard — App Router
 * Design: "Fast Break" — Premium Sports Analytics
 * Dark navy theme, sidebar layout, multi-page routing
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
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
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/players" component={Players} />
        <Route path="/players/:id" component={PlayerDetail} />
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
