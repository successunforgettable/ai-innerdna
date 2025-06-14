import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AssessmentProvider, useAssessment } from "@/context/AssessmentContext";
import Welcome from "@/pages/Welcome";
import FoundationStones from "@/pages/FoundationStones";
import BuildingBlocks from "@/pages/BuildingBlocks";
import ColorStates from "@/pages/ColorStates";
import DetailTokens from "@/pages/DetailTokens";
import Results from "@/pages/Results";
import NotFound from "@/pages/not-found";

function AppContent() {
  const { currentScreen } = useAssessment();

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <Welcome />;
      case 'foundation-stones':
        return <FoundationStones />;
      case 'building-blocks':
        return <BuildingBlocks />;
      case 'color-states':
        return <ColorStates />;
      case 'detail-tokens':
        return <DetailTokens />;
      case 'results':
        return <Results />;
      default:
        return <Welcome />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentScreen()}
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={AppContent} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AssessmentProvider>
          <Toaster />
          <Router />
        </AssessmentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
