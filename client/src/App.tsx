import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Residency from "@/pages/residency";
import Marketplace from "@/pages/marketplace";
import CulturalLearning from "@/pages/cultural-learning";
import Admin from "@/pages/admin";
import GovernmentServices from "@/pages/government-services";
import NotFound from "@/pages/not-found";
import JobSearch from "@/pages/jobsearch";
import BusinessApplication from "./pages/businessapplication";
import CulturalHeritage from "./pages/culturalheritage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/residency" component={Residency} />
      <Route path="/jobsearch" component={JobSearch} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/cultural" component={CulturalLearning} />
      <Route path="/government" component={GovernmentServices} />
      <Route path="/admin" component={Admin} />
      <Route path="/jobsearch" component={JobSearch} />
      <Route path="/businessapplication" component={BusinessApplication}/>
      <Route path="/culturalheritage" component={CulturalHeritage}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
