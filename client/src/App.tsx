import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AssessmentProvider, useAssessment } from "@/context/AssessmentContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import Welcome from "@/pages/Welcome";
import FoundationStones from "@/pages/FoundationStones";
import BuildingBlocks from "@/pages/BuildingBlocks";
import ColorPhase from "@/pages/ColorPhase";
import DetailTokens from "@/pages/DetailTokens";
import Results from "@/pages/Results";
import Analytics from "@/pages/Analytics";
import AdminLogin from "@/pages/AdminLogin";
import AlgorithmTest from "@/pages/AlgorithmTest";
import AITestPage from "@/pages/AITestPage";
import Login from "@/pages/Login";
import Reports from "@/pages/Reports";
import ReportsBrowser from "@/pages/ReportsBrowser";
import ResetPassword from "@/pages/ResetPassword";
import Contact from "@/pages/Contact";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import { NotificationProvider } from './context/NotificationContext';
import NotificationBell from './components/Common/NotificationBell';
import NotificationCenter from './components/Common/NotificationCenter';
import LoginNotification from './components/Common/LoginNotification';


function AppContent() {
  const { currentScreen, setCurrentScreen } = useAssessment();
  const [location] = useLocation();

  useEffect(() => {
    // Scroll to top on every route change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Update screen based on URL
    const urlToScreen = {
      '/': 'welcome',
      '/foundation-stones': 'foundation-stones',
      '/building-blocks': 'building-blocks',
      '/color-phase': 'color-phase',
      '/detail-tokens': 'detail-tokens',
      '/results': 'results',
      '/analytics': 'analytics',
      '/admin-login': 'admin-login',
      '/algorithm-test': 'algorithm-test'
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
        return <DetailTokens />;
      case 'results':
        return <Results />;
      case 'analytics':
        return (
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        );
      case 'admin-login':
        return <AdminLogin />;
      case 'algorithm-test':
        return <AlgorithmTest />;
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
      <Route path="/analytics" component={AppContent} />
      <Route path="/admin-login" component={AppContent} />
      <Route path="/algorithm-test" component={AppContent} />
      <Route path="/ai-test" component={AITestPage} />
      <Route path="/login" component={Login} />
      <Route path="/reports" component={Reports} />
      <Route path="/reports-browser" component={ReportsBrowser} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AssessmentProvider>
          <NotificationProvider>
            <Toaster />
            <Router />
            <NotificationCenter />
            <LoginNotification user={null} />
          </NotificationProvider>
        </AssessmentProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
