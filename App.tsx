
import React, { useState, useMemo, useEffect } from 'react';
import { ViewType, LegalConcept, UserStats, User } from './types';
import { fetchLegalConcepts } from './data';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Explorer from './pages/Explorer';
import ConceptDetail from './pages/ConceptDetail';
import AdminPanel from './pages/AdminPanel';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Library from './pages/Library';
import Pricing from './pages/Pricing';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [selectedConcept, setSelectedConcept] = useState<LegalConcept | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(undefined);
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    points: 0,
    streak: 0,
    learnedConcepts: 0,
    completedQuizzes: 0
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [concepts, setConcepts] = useState<LegalConcept[]>([]);

  useEffect(() => {
    const fetchUserRole = async (session: any) => {
      try {
        if (!session?.user) return null;
        console.log('Fetching role for:', session.user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.warn('Profile fetch error, defaulting to user:', error);
        }

        return {
          username: session.user.email?.split('@')[0] || 'User',
          role: (data?.role as any) || 'user',
          name: data?.full_name || session.user.email?.split('@')[0] || 'User',
        };
      } catch (e) {
        console.error('Critical error in fetchUserRole:', e);
        return {
          username: session?.user?.email?.split('@')[0] || 'User',
          role: 'user' as any,
          name: session?.user?.email?.split('@')[0] || 'User',
        };
      }
    };

    // Check active session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const userData = await fetchUserRole(session);
        if (userData) {
          setUser(userData);
          setCurrentView('dashboard');
        }
      }
      setLoading(false);
    });

    // Fetch concepts
    fetchLegalConcepts().then(setConcepts);

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth Event:', event, !!session);

      if (session) {
        // 1. Navegación inmediata
        setCurrentView(current => {
          if (['login', 'landing'].includes(current)) return 'dashboard';
          return current;
        });

        // 2. Carga de datos de usuario (sin bloquear la navegación)
        fetchUserRole(session).then(userData => {
          if (userData) setUser(userData);
        });
      } else {
        setUser(null);
        setCurrentView('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUpdateStats = (update: Partial<UserStats>) => {
    setStats(prev => {
      const newStats = { ...prev, ...update };
      // Basic leveling logic
      if (newStats.xp >= newStats.nextLevelXp) {
        newStats.level += 1;
        newStats.xp -= newStats.nextLevelXp;
        newStats.nextLevelXp = Math.round(newStats.nextLevelXp * 1.5);
      }
      return newStats;
    });
  };

  const navigateTo = (view: ViewType, concept: LegalConcept | null = null, category?: string, subcategory?: string) => {
    // Basic protection: only admins can see admin view
    if (view === 'admin' && user?.role !== 'admin') {
      setCurrentView('dashboard');
      return;
    }
    setCurrentView(view);
    if (concept) setSelectedConcept(concept);
    if (category) setSelectedCategory(category);
    if (subcategory !== undefined) setSelectedSubcategory(subcategory);
    window.scrollTo(0, 0);
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setCurrentView('dashboard');
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onStart={() => navigateTo('login')} onLogin={() => navigateTo('login')} onViewPricing={() => navigateTo('pricing')} />;
      case 'login':
        return <Auth onAuthSuccess={() => setCurrentView('dashboard')} />;
      case 'dashboard':
        return <Dashboard onSelectConcept={(c) => navigateTo('detail', c)} navigateTo={navigateTo} stats={stats} concepts={concepts} />;
      case 'explorer':
        return <Explorer onSelectConcept={(c) => navigateTo('detail', c)} concepts={concepts} initialCategory={selectedCategory} initialSubcategory={selectedSubcategory} />;
      case 'detail':
        return selectedConcept ? (
          <ConceptDetail
            concept={selectedConcept}
            onBack={() => navigateTo('explorer')}
            stats={stats}
            onUpdateStats={handleUpdateStats}
          />
        ) : null;
      case 'admin':
        return user?.role === 'admin' ? <AdminPanel /> : <Dashboard onSelectConcept={(c) => navigateTo('detail', c)} navigateTo={navigateTo} stats={stats} concepts={concepts} />;
      case 'profile':
        return <Profile stats={stats} user={user} onUpdateUser={setUser} />;
      case 'library':
        return <Library />;
      case 'pricing':
        return <Pricing onBack={() => navigateTo(user ? 'dashboard' : 'landing')} onSelectFree={() => navigateTo(user ? 'dashboard' : 'login')} />;
      default:
        return <Dashboard onSelectConcept={(c) => navigateTo('detail', c)} navigateTo={navigateTo} stats={stats} concepts={concepts} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-slate-400 font-bold animate-pulse">Cargando IurisAcademy...</p>
        </div>
      </div>
    );
  }

  const showLayout = !['landing', 'login'].includes(currentView) && (currentView !== 'pricing' || user);

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors ${showLayout ? 'bg-[#f6f6f8]' : 'bg-white'}`}>
      {showLayout && (
        <Header
          user={user}
          stats={stats}
          concepts={concepts}
          onProfileClick={() => navigateTo('profile')}
          onLogoClick={() => navigateTo('dashboard')}
          onLibraryClick={() => navigateTo('library')}
          onPricingClick={() => navigateTo('pricing')}
          onSelectConcept={(c) => navigateTo('detail', c)}
          onAdminClick={() => navigateTo('admin')}
          onLogout={async () => {
            await supabase.auth.signOut();
            setUser(null);
            setCurrentView('landing');
          }}
        />
      )}

      <div className="flex">
        {showLayout && isSidebarOpen && (
          <Sidebar
            onNavigate={(view, category, subcategory) => navigateTo(view, null, category, subcategory)}
            currentView={currentView}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            stats={stats}
          />
        )}

        <main className={`flex-1 min-w-0 ${showLayout ? 'p-6 md:p-10' : ''}`}>
          {renderView()}
        </main>
      </div>

      {showLayout && (
        <footer className="mt-auto border-t border-gray-200 py-10 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 opacity-50">
            <div className="flex flex-col items-center md:items-start gap-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">balance</span>
                <span className="font-bold">IurisAcademy 2025</span>
              </div>
              <p className="text-[10px] font-medium tracking-wide">
                desarrollado por el equipo de <span className="text-primary font-bold">@capsulasdederecho</span>
              </p>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-xs font-medium hover:text-primary transition-colors">Privacidad</a>
              <a href="#" className="text-xs font-medium hover:text-primary transition-colors">Soporte</a>
              <a href="#" className="text-xs font-medium hover:text-primary transition-colors">Glosario</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
