import React, { useState, useMemo, useRef, useEffect } from 'react';
import { UserStats, User, LegalConcept } from '../types';

interface HeaderProps {
  user: User | null;
  stats: UserStats;
  onProfileClick: () => void;
  onLogoClick: () => void;
  onLibraryClick: () => void;
  onAdminClick: () => void;
  onSelectConcept: (c: LegalConcept) => void;
  onLogout: () => void;
  concepts: LegalConcept[];
}

const Header: React.FC<HeaderProps> = ({ user, stats, onProfileClick, onLogoClick, onLibraryClick, onAdminClick, onSelectConcept, onLogout, concepts }) => {
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e7ebf3] bg-white/80 backdrop-blur-md px-6 py-3">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={onLogoClick}>
            <div className="size-8 bg-primary text-white rounded-lg flex items-center justify-center group-hover:bg-primary-dark transition-colors">
              <span className="material-symbols-outlined text-xl">balance</span>
            </div>
            <h2 className="text-slate-950 text-lg font-bold tracking-tight">Iuris<span className="text-primary">Academy</span></h2>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <button onClick={onLogoClick} className="text-sm font-semibold text-primary border-b-2 border-primary pb-1">Dashboard</button>
            <button onClick={onLibraryClick} className="text-gray-500 text-sm font-medium hover:text-primary transition-colors">Biblioteca</button>
            {user?.role === 'admin' && (
              <button onClick={onAdminClick} className="text-gray-500 text-sm font-medium hover:text-primary transition-colors">Gestión</button>
            )}
          </nav>
        </div>

        <div className="flex-1 max-w-md mx-8 hidden md:block relative" ref={searchRef}>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input
              type="text"
              placeholder="Buscar conceptos, códigos..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full h-10 pl-10 pr-4 bg-gray-100 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {showSearchResults && searchText.trim().length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-1">
              {searchResults.length > 0 ? (
                <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        onSelectConcept(result);
                        setShowSearchResults(false);
                        setSearchText('');
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-primary/5 text-left transition-colors group"
                    >
                      <div className="size-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary font-mono text-[9px] font-bold">
                        {result.id.split('-').pop()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-primary truncate">{result.concept}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest truncate">{result.subcategory}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-xs text-gray-400 font-bold">No hay resultados para "{searchText}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">
            <span className="material-symbols-outlined text-lg">emoji_events</span>
            <span className="text-xs font-bold uppercase tracking-wider">Lvl {stats.level} • {stats.points} PTS</span>
          </div>

          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-bold text-sm">Notificaciones</h3>
                  <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-black uppercase">2 Nuevas</span>
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer relative ${n.unread ? 'bg-primary/[0.02]' : ''}`}>
                      {n.unread && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full"></div>}
                      <p className="text-xs font-bold text-slate-900 mb-0.5">{n.title}</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed mb-1.5">{n.content}</p>
                      <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{n.time}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/5 transition-colors border-t border-gray-50">
                  Marcar todas como leídas
                </button>
              </div>
            )}
          </div>

          <div className="relative" ref={menuRef}>
            <div
              className="size-10 rounded-full border-2 border-white shadow-sm bg-center bg-cover cursor-pointer hover:border-primary transition-colors"
              style={{ backgroundImage: `url("${user?.avatarUrl || 'https://picsum.photos/seed/lawyer/100/100'}")` }}
              onClick={() => setShowMenu(!showMenu)}
            />

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                <button onClick={() => { onProfileClick(); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">person</span>
                  Mi Perfil
                </button>
                <div className="border-t border-gray-50 my-1"></div>
                <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-bold">
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
