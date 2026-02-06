import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useStats, useTheme, useConcepts } from '../contexts';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { stats } = useStats();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { concepts } = useConcepts();

  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: '¡Bienvenido a IurisAcademy!', content: 'Empieza a estudiar los conceptos fundamentales del derecho civil.', time: '2h ago', unread: true },
    { id: 2, title: 'Nuevos códigos en Biblioteca', content: 'Hemos actualizado los links de BCN para el Código Civil y CPC.', time: '5h ago', unread: true },
    { id: 3, title: 'Meta alcanzada', content: 'Has completado tus primeros 100 puntos de XP. ¡Sigue así!', time: '1d ago', unread: false },
  ]);

  const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const searchResults = useMemo(() => {
    if (searchText.trim().length < 2 || concepts.length === 0) return [];
    const term = normalize(searchText);
    return concepts.filter(c =>
      normalize(c.concept).includes(term) ||
      normalize(c.id).includes(term) ||
      normalize(c.subcategory).includes(term) ||
      normalize(c.definitionSimple).includes(term) ||
      normalize(c.category).includes(term) ||
      normalize(c.regulation).includes(term) ||
      normalize(c.jurisprudence).includes(term) ||
      term.includes(normalize(c.concept))
    ).slice(0, 6);
  }, [searchText, concepts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userRank = useMemo(() => {
    if (stats.level >= 13) return { name: 'Magistrado', color: 'bg-indigo-600', icon: 'gavel' };
    if (stats.level >= 8) return { name: 'Abogado', color: 'bg-primary', icon: 'balance' };
    if (stats.level >= 4) return { name: 'Licenciado', color: 'bg-emerald-600', icon: 'school' };
    return { name: 'Estudiante', color: 'bg-slate-600', icon: 'history_edu' };
  }, [stats.level]);

  const xpPercentage = useMemo(() => {
    return Math.min(100, (stats.xp / stats.nextLevelXp) * 100);
  }, [stats.xp, stats.nextLevelXp]);

  const handleLogout = async () => {
    try {
      setShowMenu(false);
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      // Forzar salida aunque falle Supabase
      navigate('/');
    }
  };

  const handleToggleNotifications = () => {
    if (!showNotifications) {
      // Marcar todas como leídas al abrir
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    }
    setShowNotifications(!showNotifications);
  };

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e7ebf3] dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-3 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/app/dashboard')}>
            <div className="size-8 bg-primary text-white rounded-lg flex items-center justify-center group-hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-xl">balance</span>
            </div>
            <h2 className="text-slate-950 dark:text-white text-lg font-bold tracking-tight">Iuris<span className="text-primary">Academy</span></h2>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => navigate('/app/dashboard')}
              className={`text-sm font-black uppercase tracking-[0.15em] transition-all pb-1 ${isActive('/app/dashboard') ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/app/explorer')}
              className={`text-sm font-black uppercase tracking-[0.15em] transition-all pb-1 ${isActive('/app/explorer') ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'}`}
            >
              Explorer
            </button>
            <button
              onClick={() => navigate('/app/library')}
              className={`text-sm font-black uppercase tracking-[0.15em] transition-all pb-1 ${isActive('/app/library') ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'}`}
            >
              Biblioteca
            </button>
            <button
              onClick={() => navigate('/app/flashcards')}
              className={`text-sm font-black uppercase tracking-[0.15em] transition-all pb-1 ${isActive('/app/flashcards') ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'}`}
            >
              Flashcards
            </button>
            {user.role === 'admin' && (
              <button
                onClick={() => navigate('/app/admin')}
                className={`text-sm font-black uppercase tracking-[0.15em] transition-all pb-1 ${isActive('/app/admin') ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'}`}
              >
                Admin
              </button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block" ref={searchRef}>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus-within:border-primary dark:focus-within:border-primary transition-colors">
              <span className="material-symbols-outlined text-xl text-slate-400">search</span>
              <input
                type="text"
                placeholder="Buscar concepto..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setShowSearchResults(true);
                }}
                className="bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400 w-48"
              />
            </div>

            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-slide-in-top">
                {searchResults.map((concept) => (
                  <button
                    key={concept.id}
                    onClick={() => {
                      navigate(`/app/concept/${concept.id}`);
                      setShowSearchResults(false);
                      setSearchText('');
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0"
                  >
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{concept.concept}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{concept.id} • {concept.category}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Concept Limit Counter for Free Users */}
          {user.role === 'user' && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="material-symbols-outlined text-sm text-primary">visibility</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${stats.consultationsToday >= 10 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                {stats.consultationsToday}/10 Diarios
              </span>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 md:block hidden"
          >
            <span className="material-symbols-outlined">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={handleToggleNotifications}
              className="relative size-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">notifications</span>
              {notifications.some(n => n.unread) && (
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-full mt-2 right-0 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-slide-in-top">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-black text-slate-900 dark:text-white">Notificaciones</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${notif.unread ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && <span className="size-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>}
                        <div className="flex-1">
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{notif.title}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{notif.content}</p>
                          <p className="text-xs text-slate-400 mt-2">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="size-10 bg-gradient-to-br from-amber-400 to-accent-gold text-white rounded-xl flex items-center justify-center font-black shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-black text-slate-900 dark:text-white">{user.name}</p>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-0.5 ${userRank.color} text-white rounded-full text-[9px] font-black uppercase tracking-wide`}>
                    {userRank.name}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Nv {stats.level}</span>
                </div>
              </div>
            </button>

            {showMenu && (
              <div className="absolute top-full mt-2 right-0 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-slide-in-top">
                <div className="p-4 bg-gradient-to-br from-primary to-primary-dark text-white">
                  <div className="flex items-center gap-3">
                    <div className="size-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center font-black text-xl">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black">{user.name}</p>
                      <p className="text-xs opacity-90">{user.university || 'Estudiante'}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Nivel {stats.level}</span>
                      <span>{stats.xp} / {stats.nextLevelXp} XP</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${xpPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      navigate('/app/profile');
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">person</span>
                    <span className="text-sm text-slate-900 dark:text-white">Mi Perfil</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/pricing');
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">workspace_premium</span>
                    <span className="text-sm text-slate-900 dark:text-white">Apoyar Academia</span>
                  </button>
                  <button
                    onClick={toggleDarkMode}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left md:hidden"
                  >
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
                      {isDarkMode ? 'light_mode' : 'dark_mode'}
                    </span>
                    <span className="text-sm text-slate-900 dark:text-white">
                      {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
                    </span>
                  </button>
                  <hr className="my-2 border-slate-200 dark:border-slate-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left text-red-600 dark:text-red-400"
                  >
                    <span className="material-symbols-outlined">logout</span>
                    <span className="text-sm font-bold">Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
