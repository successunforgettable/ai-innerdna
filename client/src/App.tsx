import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AssessmentProvider, useAssessment } from "@/context/AssessmentContext";
import { useEffect } from "react";
import Welcome from "@/pages/Welcome";
import FoundationStones from "@/pages/FoundationStones";
import BuildingBlocks from "@/pages/BuildingBlocks";
import ColorPhase from "@/pages/ColorPhase";
import DetailPhase from "@/components/Detail/DetailPhase";
import Results from "@/pages/Results";
import Analytics from "@/pages/Analytics";
import NotFound from "@/pages/not-found";

function AppContent() {
  const { currentScreen, setCurrentScreen } = useAssessment();
  const [location] = useLocation();

  useEffect(() => {
    // Update screen based on URL
    const urlToScreen = {
      '/': 'welcome',
      '/foundation-stones': 'foundation-stones',
      '/building-blocks': 'building-blocks',
      '/color-phase': 'color-phase',
      '/detail-tokens': 'detail-tokens',
      '/results': 'results',
      '/analytics': 'analytics'
    };
    
    const screen = urlToScreen[location as keyof typeof urlToScreen];
    if (screen && screen !== currentScreen) {
      setCurrentScreen(screen);
    }
  }, [location, currentScreen, setCurrentScreen]);

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <Welcome />;
      case 'foundation-stones':
        return <FoundationStones />;
      case 'building-blocks':
        return <BuildingBlocks />;
      case 'color-phase':
        return <ColorPhase />;
      case 'detail-tokens':
        return <DetailPhase />;
      case 'results':
        return <Results />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Welcome />;
    }
  };

  return (
    <>
      {renderCurrentScreen()}
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={AppContent} />
      <Route path="/foundation-stones" component={AppContent} />
      <Route path="/building-blocks" component={AppContent} />
      <Route path="/color-phase" component={AppContent} />
      <Route path="/detail-tokens" component={AppContent} />
      <Route path="/results" component={AppContent} />
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
