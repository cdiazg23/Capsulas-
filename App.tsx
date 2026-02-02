
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
import Flashcards from './pages/Flashcards';
import CommunitySpace from './pages/CommunitySpace';
import IurisBot from './components/IurisBot';
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
  const [masteredConceptIds, setMasteredConceptIds] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [concepts, setConcepts] = useState<LegalConcept[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('iuris-theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Efecto para aplicar el tema
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('iuris-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('iuris-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Función para registrar actividad
  const logActivity = async (type: string, description: string) => {
    if (!user) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: session.user.id,
          type,
          description
        });

      if (!error) {
        // Actualizar localmente para feedback inmediato
        setActivityLogs(prev => [{ type, description, created_at: new Date().toISOString() }, ...prev].slice(0, 10));
      }
    } catch (e) {
      console.error('Error logging activity:', e);
    }
  };

  useEffect(() => {
    const fetchUserData = async (session: any) => {
      try {
        if (!session?.user) return null;

        // 1. Fetch Profile and Stats
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) console.warn('Profile fetch error:', profileError);

        if (profile) {
          setStats({
            level: profile.level || 1,
            xp: profile.xp || 0,
            nextLevelXp: profile.next_level_xp || 100,
            points: profile.points || 0,
            streak: profile.streak || 0,
            learnedConcepts: profile.learned_concepts || 0,
            completedQuizzes: profile.completed_quizzes || 0,
            consultationsToday: profile.consultations_today || 0,
            consultationsMonth: profile.consultations_month || 0,
            lastConsultationAt: profile.last_consultation_at
          });
        }

        // 2. Fetch Mastered Concepts
        const { data: mastery } = await supabase
          .from('user_mastery')
          .select('concept_id')
          .eq('user_id', session.user.id);

        if (mastery) {
          setMasteredConceptIds(mastery.map(m => m.concept_id));
        }

        // 3. Fetch Activity Logs
        const { data: logs } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (logs) setActivityLogs(logs);

        return {
          username: session.user.email?.split('@')[0] || 'User',
          role: (profile?.role as any) || 'user',
          name: profile?.full_name || session.user.email?.split('@')[0] || 'User',
          avatarUrl: profile?.avatar_url
        };
      } catch (e) {
        console.error('Critical error in fetchUserData:', e);
        return null;
      }
    };

    const initApp = async () => {
      try {
        // Check active session
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          const userData = await fetchUserData(session);
          if (userData) {
            setUser(userData);
            setCurrentView('dashboard');
          }
        }

        // Fetch concepts in parallel if possible, or just wait for it
        const fetchedConcepts = await fetchLegalConcepts();
        setConcepts(fetchedConcepts);

      } catch (error) {
        console.error('Error during app initialization:', error);
      } finally {
        setLoading(false);
      }
    };

    initApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session) {
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            const userData = await fetchUserData(session);
            if (userData) setUser(userData);
            setCurrentView('dashboard');
          }
        } else {
          setUser(null);
          setCurrentView('landing');
        }
      } catch (error) {
        console.error('Error in onAuthStateChange:', error);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sync stats to Supabase when they change
  useEffect(() => {
    const syncStats = async () => {
      if (!user) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase.from('profiles').update({
        xp: stats.xp,
        level: stats.level,
        points: stats.points,
        streak: stats.streak,
        learned_concepts: stats.learnedConcepts,
        completed_quizzes: stats.completedQuizzes,
        next_level_xp: stats.nextLevelXp,
        consultations_today: stats.consultationsToday,
        consultations_month: stats.consultationsMonth,
        last_consultation_at: stats.lastConsultationAt || new Date().toISOString()
      }).eq('id', session.user.id);
    };

    const timeoutId = setTimeout(syncStats, 2000); // Debounce to avoid too many writes
    return () => clearTimeout(timeoutId);
  }, [stats, user]);

  const handleUpdateStats = (update: Partial<UserStats>) => {
    setStats(prev => {
      let newXp = prev.xp + (update.xp || 0);
      let newLevel = prev.level;
      let newNextLevelXp = prev.nextLevelXp;

      // Leveling logic
      while (newXp >= newNextLevelXp) {
        newLevel += 1;
        newXp -= newNextLevelXp;
        newNextLevelXp = Math.round(newNextLevelXp * 1.5);
        logActivity('level_up', `¡Felicidades! Has alcanzado el Nivel ${newLevel}`);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        nextLevelXp: newNextLevelXp,
        points: prev.points + (update.points || 0),
        learnedConcepts: prev.learnedConcepts + (update.learnedConcepts || 0),
        completedQuizzes: prev.completedQuizzes + (update.completedQuizzes || 0),
        streak: update.streak !== undefined ? update.streak : prev.streak,
        consultationsToday: update.consultationsToday !== undefined ? update.consultationsToday : prev.consultationsToday,
        consultationsMonth: update.consultationsMonth !== undefined ? update.consultationsMonth : prev.consultationsMonth,
        lastConsultationAt: update.lastConsultationAt !== undefined ? update.lastConsultationAt : prev.lastConsultationAt
      };
    });
  };

  const toggleMastery = async (conceptId: string) => {
    if (!user) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const isCurrentlyMastered = masteredConceptIds.includes(conceptId);

    if (isCurrentlyMastered) {
      await supabase.from('user_mastery').delete().eq('user_id', session.user.id).eq('concept_id', conceptId);
      setMasteredConceptIds(prev => prev.filter(id => id !== conceptId));
    } else {
      await supabase.from('user_mastery').insert({ user_id: session.user.id, concept_id: conceptId });
      setMasteredConceptIds(prev => [...prev, conceptId]);
      handleUpdateStats({ xp: 20, points: 20, learnedConcepts: 1 });
      const concept = concepts.find(c => c.id === conceptId);
      logActivity('concept', `Has dominado el concepto: ${concept?.concept || conceptId}`);
    }
  };

  const navigateTo = (view: ViewType, concept: LegalConcept | null = null, category?: string, subcategory?: string) => {
    // Basic protection: only admins can see admin view
    if (view === 'admin' && user?.role !== 'admin') {
      setCurrentView('dashboard');
      return;
    }

    // Daily Limit Check for Free Users
    if (view === 'detail' && user?.role === 'user') {
      const today = new Date().toDateString();
      const lastConsultationDate = stats.lastConsultationAt ? new Date(stats.lastConsultationAt).toDateString() : '';

      let currentDaily = stats.consultationsToday;
      if (today !== lastConsultationDate) {
        currentDaily = 0;
      }

      if (currentDaily >= 10) {
        setCurrentView('pricing');
        return;
      }

      // Increment consultation count
      handleUpdateStats({
        consultationsToday: currentDaily + 1,
        consultationsMonth: stats.consultationsMonth + 1,
        lastConsultationAt: new Date().toISOString()
      });
    }

    setCurrentView(view);
    if (concept) setSelectedConcept(concept);
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
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
        return <Dashboard onSelectConcept={(c) => navigateTo('detail', c)} navigateTo={navigateTo} stats={stats} concepts={concepts} activityLogs={activityLogs} />;
      case 'explorer':
        return <Explorer onSelectConcept={(c) => navigateTo('detail', c)} concepts={concepts} initialCategory={selectedCategory} initialSubcategory={selectedSubcategory} />;
      case 'detail':
        return selectedConcept ? (
          <ConceptDetail
            concept={selectedConcept}
            onBack={() => navigateTo('explorer')}
            stats={stats}
            onUpdateStats={handleUpdateStats}
            isMastered={masteredConceptIds.includes(selectedConcept.id)}
            onToggleMastery={() => toggleMastery(selectedConcept.id)}
            isFreeUser={user?.role === 'user'}
          />
        ) : null;
      case 'admin':
        return user?.role === 'admin' ? <AdminPanel /> : <Dashboard onSelectConcept={(c) => navigateTo('detail', c)} navigateTo={navigateTo} stats={stats} concepts={concepts} activityLogs={activityLogs} />;
      case 'profile':
        return <Profile stats={stats} user={user} onUpdateUser={setUser} />;
      case 'library':
        return <Library />;
      case 'pricing':
        return <Pricing onBack={() => navigateTo(user ? 'dashboard' : 'landing')} onSelectFree={() => navigateTo(user ? 'dashboard' : 'login')} />;
      case 'flashcards':
        return user?.role !== 'user' ? (
          <Flashcards concepts={concepts} onBack={() => navigateTo('dashboard')} onUpdateStats={handleUpdateStats} onLogActivity={logActivity} />
        ) : <Pricing onBack={() => navigateTo('dashboard')} onSelectFree={() => navigateTo('dashboard')} />;
      case 'community':
        return user?.role !== 'user' ? <CommunitySpace user={user} /> : <Dashboard onSelectConcept={(c) => navigateTo('detail', c)} navigateTo={navigateTo} stats={stats} concepts={concepts} activityLogs={activityLogs} />;
      default:
        return <Dashboard onSelectConcept={(c) => navigateTo('detail', c)} navigateTo={navigateTo} stats={stats} concepts={concepts} activityLogs={activityLogs} />;
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

  const showLayout = !['landing', 'login', 'flashcards'].includes(currentView) && (currentView !== 'pricing' || user);

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${showLayout ? 'bg-[#f6f6f8] dark:bg-slate-950' : 'bg-white dark:bg-slate-950'}`}>
      {showLayout && (
        <Header
          user={user}
          stats={stats}
          concepts={concepts}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onProfileClick={() => navigateTo('profile')}
          onLogoClick={() => navigateTo('dashboard')}
          onLibraryClick={() => navigateTo('library')}
          onPricingClick={() => navigateTo('pricing')}
          onSelectConcept={(c) => navigateTo('detail', c)}
          onAdminClick={() => navigateTo('admin')}
          currentView={currentView}
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
            user={user}
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

      {user && currentView !== 'flashcards' && <IurisBot concepts={concepts} />}
    </div>
  );
};

export default App;
