import React, { useState, useMemo, useRef, useEffect } from 'react';
import { UserStats, User, LegalConcept, ViewType } from '../types';

interface HeaderProps {
  user: User | null;
  stats: UserStats;
  onProfileClick: () => void;
  onLogoClick: () => void;
  onLibraryClick: () => void;
  onAdminClick: () => void;
  onPricingClick: () => void;
  onSelectConcept: (c: LegalConcept) => void;
  onLogout: () => void;
  concepts: LegalConcept[];
  currentView: ViewType;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user, stats, onProfileClick, onLogoClick, onLibraryClick, onAdminClick,
  onPricingClick, onSelectConcept, onLogout, concepts, currentView, isDarkMode, onToggleDarkMode
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, title: '¡Bienvenido a IurisAcademy!', content: 'Empieza a estudiar los conceptos fundamentales del derecho civil.', time: '2h ago', unread: true },
    { id: 2, title: 'Nuevos códigos en Biblioteca', content: 'Hemos actualizado los links de BCN para el Código Civil y CPC.', time: '5h ago', unread: true },
    { id: 3, title: 'Meta alcanzada', content: 'Has completado tus primeros 100 puntos de XP. ¡Sigue así!', time: '1d ago', unread: false },
  ];

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e7ebf3] dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-3 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={onLogoClick}>
            <div className="size-8 bg-primary text-white rounded-lg flex items-center justify-center group-hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-xl">balance</span>
            </div>
            <h2 className="text-slate-950 dark:text-white text-lg font-bold tracking-tight">Iuris<span className="text-primary">Academy</span></h2>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={onLogoClick}
              className={`text-sm font-black uppercase tracking-[0.15em] transition-all pb-1 ${currentView === 'dashboard' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'}`}
            >
              Dashboard
            </button>
            <button
              onClick={onLibraryClick}
              className={`text-[11px] font-black uppercase tracking-[0.15em] transition-all ${currentView === 'library' ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
            >
              Biblioteca
            </button>
            <button onClick={onPricingClick} className="flex items-center gap-2 px-3 py-1.5 bg-accent-gold/10 text-accent-gold rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-accent-gold/20 transition-all border border-accent-gold/20">
              <span className="material-symbols-outlined text-sm">favorite</span>
              Apoyar
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={onAdminClick}
                className={`text-[11px] font-black uppercase tracking-[0.15em] transition-all ${currentView === 'admin' ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
              >
                Admin
              </button>
            )}
          </nav>
        </div>

        <div className="flex-1 max-w-md mx-8 hidden md:block relative" ref={searchRef}>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
            <input
              type="text"
              placeholder="Buscar conceptos, códigos..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full h-10 pl-10 pr-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all dark:text-white"
            />
          </div>

          {showSearchResults && searchText.trim().length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-slate-700 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
              {searchResults.length > 0 ? (
                <div className="divide-y divide-gray-50 dark:divide-slate-700 max-h-[400px] overflow-y-auto">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        onSelectConcept(result);
                        setShowSearchResults(false);
                        setSearchText('');
                      }}
                      className="w-full flex items-center gap-4 p-4 hover:bg-primary/[0.02] dark:hover:bg-primary/[0.05] text-left transition-colors group"
                    >
                      <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-primary font-mono text-[10px] font-black border border-slate-100 dark:border-slate-700 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                        {result.id.split('-').pop()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-900 dark:text-white group-hover:text-primary truncate">{result.concept}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{result.subcategory}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-20">search_off</span>
                  <p className="text-xs font-black uppercase tracking-widest">Sin resultados</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden sm:flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2">
              <div className={`px-2 py-0.5 ${userRank.color} text-white rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm`}>
                <span className="material-symbols-outlined text-[12px]">{userRank.icon}</span>
                {userRank.name}
              </div>
              <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">LVL {stats.level}</span>
            </div>
            <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700">
              <div
                className={`h-full ${userRank.color} transition-all duration-1000 ease-out`}
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-gray-100 dark:border-slate-800 pl-5">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-all duration-300 transform active:rotate-180"
              title={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
            >
              <span className="material-symbols-outlined">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-full transition-all duration-300 ${showNotifications ? 'bg-primary/10 text-primary rotate-12' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-white'}`}
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-gray-50 dark:border-slate-700 flex items-center justify-between">
                    <h3 className="font-bold text-sm dark:text-white">Notificaciones</h3>
                    <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-black uppercase">2 Nuevas</span>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border-b border-gray-50 dark:border-slate-700 last:border-0 cursor-pointer relative ${n.unread ? 'bg-primary/[0.02] dark:bg-primary/[0.05]' : ''}`}>
                        {n.unread && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full"></div>}
                        <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{n.title}</p>
                        <p className="text-[10px] text-gray-500 dark:text-slate-400 leading-relaxed mb-1.5">{n.content}</p>
                        <span className="text-[9px] font-bold text-gray-300 dark:text-slate-500 uppercase tracking-widest">{n.time}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/5 transition-colors border-t border-gray-50 dark:border-slate-700">
                    Marcar todas como leídas
                  </button>
                </div>
              )}
            </div>

            <div className="relative" ref={menuRef}>
              <div
                className="size-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm bg-center bg-cover cursor-pointer hover:border-primary transition-colors"
                style={{ backgroundImage: `url("${user?.avatarUrl || 'https://picsum.photos/seed/lawyer/100/100'}")` }}
                onClick={() => setShowMenu(!showMenu)}
              />

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <button onClick={() => { onProfileClick(); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">person</span>
                    Mi Perfil
                  </button>
                  <div className="border-t border-gray-50 dark:border-slate-700 my-1"></div>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 font-bold transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>

  );
};

export default Header;
