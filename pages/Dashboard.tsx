
import React, { useState, useMemo } from 'react';
import { UserStats, LegalConcept, ViewType } from '../types';

interface DashboardProps {
  onSelectConcept: (c: LegalConcept) => void;
  navigateTo: (view: ViewType, concept?: any, category?: string, subcategory?: string) => void;
  stats: UserStats;
  concepts: LegalConcept[];
  activityLogs: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectConcept, stats, navigateTo, concepts, activityLogs }) => {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);

  const conceptOfTheDay = useMemo(() => concepts[0] || {} as LegalConcept, [concepts]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      onSelectConcept(searchResults[0]);
    }
  };

  const categories = useMemo(() => {
    const cats = [
      { name: 'Derecho Civil', icon: 'gavel', color: 'blue' },
      { name: 'Derecho Penal', icon: 'policy', color: 'red' },
      { name: 'Derecho Laboral', icon: 'work', color: 'orange' },
      { name: 'Derecho Administrativo', icon: 'account_balance', color: 'purple' },
      { name: 'Derecho Constitucional', icon: 'history_edu', color: 'slate' },
      { name: 'Derecho Procesal', icon: 'account_tree', color: 'indigo' },
      { name: 'Derecho Comercial', icon: 'storefront', color: 'emerald' },
      { name: 'Derecho de Familia', icon: 'family_restroom', color: 'rose' }
    ];

    return cats.map(cat => ({
      ...cat,
      count: concepts.filter(c => c.category === cat.name).length
    }));
  }, [concepts]);

  const userRank = useMemo(() => {
    if (stats.level >= 13) return { name: 'Magistrado de la Corte', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: 'gavel', border: 'border-indigo-100' };
    if (stats.level >= 8) return { name: 'Abogado de la República', color: 'text-primary', bg: 'bg-primary/5', icon: 'balance', border: 'border-primary/20' };
    if (stats.level >= 4) return { name: 'Licenciado en Derecho', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'school', border: 'border-emerald-100' };
    return { name: 'Estudiante de Derecho', color: 'text-slate-600', bg: 'bg-slate-50', icon: 'history_edu', border: 'border-slate-200' };
  }, [stats.level]);
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'concept': return 'task_alt';
      case 'quiz': return 'quiz';
      case 'level_up': return 'military_tech';
      case 'session': return 'style';
      default: return 'history';
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} h`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className={`p-8 bg-white dark:bg-slate-900 rounded-[2rem] border ${userRank.border} dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-all duration-500`}>
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <span className="material-symbols-outlined text-[100px] dark:text-white">{userRank.icon}</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className={`size-12 ${userRank.bg} dark:bg-primary/20 ${userRank.color} rounded-2xl flex items-center justify-center`}>
                <span className="material-symbols-outlined text-2xl font-black">{userRank.icon}</span>
              </div>
              <div>
                <p className="text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Rango Jurídico</p>
                <p className={`text-sm font-black uppercase tracking-tight ${userRank.color}`}>{userRank.name}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-end justify-between mb-2">
                <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">Nivel {stats.level}</p>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stats.xp} / {stats.nextLevelXp} XP</p>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-50 dark:border-slate-700 p-0.5">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-1000 ease-out shadow-lg shadow-primary/30"
                  style={{ width: `${(stats.xp / stats.nextLevelXp) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-primary text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">
              Faltan {stats.nextLevelXp - stats.xp} XP para el siguiente grado
            </p>
          </div>
        </div>

        <div className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col justify-between group hover:scale-[1.02] transition-all duration-500">
          <div className="flex justify-between items-start mb-6">
            <div className="size-12 bg-accent-gold/10 text-accent-gold rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl font-black">stars</span>
            </div>
            <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Global</span>
          </div>
          <div>
            <p className="text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Prestigio Acumulado</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white mb-4">{stats.xp.toLocaleString()} <span className="text-lg text-slate-300 dark:text-slate-700">XP</span></p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 rounded-full text-[10px] font-black uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              En ascenso
            </div>
          </div>
        </div>

        <div className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col justify-between group hover:scale-[1.02] transition-all duration-500">
          <div className="flex justify-between items-start mb-6">
            <div className="size-12 bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 rounded-2xl flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-2xl font-black">local_fire_department</span>
            </div>
            <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Estudio</span>
          </div>
          <div>
            <p className="text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Racha de Repaso</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white mb-4">{stats.streak} <span className="text-lg text-slate-300 dark:text-slate-700">Días</span></p>
            <p className="text-orange-500 text-[9px] font-black uppercase tracking-[0.15em]">¡No rompas el ciclo!</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center max-w-2xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-8 dark:text-white">¿Qué concepto jurídico quieres <span className="text-primary italic">dominar</span> hoy?</h1>
        <form onSubmit={(e) => { e.preventDefault(); if (searchResults.length > 0) onSelectConcept(searchResults[0]); }} className="w-full relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-2xl group-focus-within:text-primary transition-colors">search</span>
          <input
            type="text"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="Busca por ID, término o descripción..."
            className="w-full h-16 pl-12 pr-32 bg-white dark:bg-slate-900 rounded-2xl border-2 border-gray-200 dark:border-slate-800 shadow-xl shadow-primary/5 focus:border-primary focus:ring-0 text-lg transition-all dark:text-white dark:placeholder-slate-600"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white h-10 px-6 rounded-xl font-bold hover:bg-primary-dark transition-all">Buscar</button>

          {showResults && searchText.length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2">
              {searchResults.length > 0 ? (
                <div className="divide-y divide-gray-50 dark:divide-slate-700">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        onSelectConcept(result);
                        setShowResults(false);
                        setSearchText('');
                      }}
                      className="w-full flex items-center gap-4 p-4 hover:bg-primary/5 dark:hover:bg-primary/10 text-left transition-colors group"
                    >
                      <div className="size-10 rounded-lg bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-primary font-mono text-[10px] font-bold border dark:border-slate-800">
                        {result.id.split('-').pop()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary">{result.concept}</p>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">{result.subcategory}</p>
                      </div>
                      <span className="material-symbols-outlined text-gray-300 dark:text-slate-700 group-hover:text-primary text-sm">arrow_forward</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <span className="material-symbols-outlined text-gray-200 dark:text-slate-700 text-4xl mb-2">search_off</span>
                  <p className="text-sm text-gray-400 dark:text-slate-500 font-bold">No se encontraron resultados para "{searchText}"</p>
                </div>
              )}
              <div className="p-3 bg-gray-50 dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center">
                <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">Presiona Enter para el primer resultado</p>
                <button onClick={() => setShowResults(false)} className="text-[10px] font-black text-primary uppercase hover:underline">Cerrar</button>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight dark:text-white">Categorías Principales</h2>
            <button onClick={() => navigateTo('explorer')} className="text-primary text-sm font-bold hover:underline">Ver todas</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {categories.map(cat => (
              <div
                key={cat.name}
                className="group flex items-center p-5 bg-white dark:bg-slate-900 rounded-2xl border border-transparent dark:border-slate-800 hover:border-primary/30 shadow-sm hover:shadow-xl transition-all cursor-pointer"
                onClick={() => navigateTo('explorer', undefined, cat.name)}
              >
                <div className={`size-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary mr-4 group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg dark:text-white">{cat.name}</h3>
                  <p className="text-xs text-gray-400 dark:text-slate-500 uppercase font-bold tracking-wider">{cat.count} Conceptos</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-400 dark:text-slate-500">Actividad Reciente</h4>
            <div className="space-y-4">
              {activityLogs.length > 0 ? (
                activityLogs.map((log, i) => (
                  <div key={i} className="flex gap-3 animate-in slide-in-from-right-2 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="mt-1 size-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                      <span className="material-symbols-outlined text-lg">{getActivityIcon(log.type)}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">{log.description}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest">{formatTime(log.created_at)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-300 dark:text-slate-700">
                  <span className="material-symbols-outlined text-3xl mb-2">history</span>
                  <p className="text-xs font-bold uppercase tracking-widest">Sin actividad reciente</p>
                </div>
              )}
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-600 to-primary text-white rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden group cursor-pointer" onClick={() => navigateTo('flashcards')}>
            <div className="absolute top-[-10%] right-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-700 rotate-12">
              <span className="material-symbols-outlined text-[150px]">style</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 text-white/60">
                <span className="material-symbols-outlined text-sm">memory</span>
                <span className="text-xs font-black uppercase tracking-widest">Estudio Activo</span>
              </div>
              <h3 className="text-3xl font-black mb-4">Modo Flashcards</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                Memoriza conceptos clave con tarjetas interactivas. Gana XP extra y sube de rango.
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl font-black text-sm group-hover:bg-indigo-50 transition-colors">
                <span>Comenzar Sesión</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1e293b] dark:bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden group border dark:border-slate-800">
            <div className="absolute top-[-10%] right-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-[150px]">auto_awesome</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 text-accent-gold">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span className="text-xs font-black uppercase tracking-widest">Concepto del día</span>
              </div>
              <h3 className="text-2xl font-black mb-4 italic leading-tight">"{conceptOfTheDay.concept}"</h3>
              <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed mb-8 line-clamp-2">
                {conceptOfTheDay.definitionSimple}
              </p>
              <button
                onClick={() => onSelectConcept(conceptOfTheDay)}
                className="w-full bg-white/10 hover:bg-white/20 py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all backdrop-blur-sm dark:bg-primary/20 dark:hover:bg-primary/30"
              >
                Estudiar ahora
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showResults && (
        <div
          className="fixed inset-0 z-50 cursor-default"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
