import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAppStore } from "@/store/appStore";

import Setup from "@/pages/setup";
import Dashboard from "@/pages/dashboard";
import Play from "@/pages/play";
import Live from "@/pages/live";
import Mirror from "@/pages/mirror";
import Archive from "@/pages/archive";
import Growth from "@/pages/growth";
import Journey from "@/pages/journey";
import Leaderboard from "@/pages/leaderboard";
import Blend from "@/pages/blend";

import { Home, User, BarChart, Clock, Sparkles } from "lucide-react";

// Placeholder Landing
const Landing = () => {
  const [, setLocation] = useLocation();
  const couple = useAppStore(state => state.couple);
  
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 flex items-center justify-center pointer-events-none">
        <div className="w-[150vw] h-[150vw] bg-primary/10 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-1000"></div>
      </div>
      
      <div className="relative z-10 max-w-sm">
        <h1 className="text-5xl font-serif text-primary mb-6 tracking-tight">Infinite Us</h1>
        <p className="text-xl text-muted-foreground mb-12 italic leading-relaxed">
          "The thunder didn't make her love him more.<br/>It just made the moment possible."
        </p>
        <button 
          onClick={() => setLocation(couple ? '/dashboard' : '/setup')}
          className="w-full py-4 bg-primary text-primary-foreground rounded-2xl text-lg font-medium hover:bg-primary/90 transition-all active:scale-95 shadow-[0_0_40px_rgba(232,121,160,0.3)]"
        >
          Begin
        </button>
      </div>
    </div>
  );
};

const Bonds = () => <div className="p-6">Bonds Page (Coming Soon)</div>;

function ProtectedRoute({ component: Component }: { component: React.FC }) {
  const couple = useAppStore(state => state.couple);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!couple) {
      setLocation("/setup");
    }
  }, [couple, setLocation]);

  if (!couple) return null;

  return (
    <div className="min-h-[100dvh] bg-background text-foreground pb-20">
      <Component />
      <BottomNav />
    </div>
  );
}

function BottomNav() {
  const [location, setLocation] = useLocation();
  
  const navItems = [
    { label: "Home", path: "/dashboard", icon: Home },
    { label: "Mirror", path: "/mirror", icon: User },
    { label: "Play", path: "/play", icon: Sparkles },
    { label: "Archive", path: "/archive", icon: Clock },
    { label: "Growth", path: "/growth", icon: BarChart },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border flex justify-around items-center p-3 pb-safe z-50">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = location === item.path;
        return (
          <button 
            key={item.path}
            onClick={() => setLocation(item.path)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <div className={`p-1 rounded-full ${isActive ? 'bg-primary/10' : ''}`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/setup" component={Setup} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/play" component={() => <ProtectedRoute component={Play} />} />
      <Route path="/live" component={() => <ProtectedRoute component={Live} />} />
      <Route path="/mirror" component={() => <ProtectedRoute component={Mirror} />} />
      <Route path="/archive" component={() => <ProtectedRoute component={Archive} />} />
      <Route path="/growth" component={() => <ProtectedRoute component={Growth} />} />
      <Route path="/bonds" component={() => <ProtectedRoute component={Bonds} />} />
      <Route path="/journey" component={() => <ProtectedRoute component={Journey} />} />
      <Route path="/leaderboard" component={() => <ProtectedRoute component={Leaderboard} />} />
      <Route path="/blend" component={() => <ProtectedRoute component={Blend} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Ensure dark mode is active
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
