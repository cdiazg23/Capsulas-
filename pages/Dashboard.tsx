
import React, { useState, useMemo } from 'react';
import { UserStats, LegalConcept, ViewType } from '../types';

interface DashboardProps {
  onSelectConcept: (c: LegalConcept) => void;
  navigateTo: (view: ViewType, concept?: any, category?: string, subcategory?: string) => void;
  stats: UserStats;
  concepts: LegalConcept[];
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectConcept, stats, navigateTo, concepts }) => {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Pick a real concept from the data for the Concept of the Day.
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

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-sm font-medium">Progreso de Nivel</p>
            <span className="material-symbols-outlined text-primary">auto_stories</span>
          </div>
          <p className="text-3xl font-black mb-2">Nivel {stats.level}</p>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full transition-all" style={{ width: `${(stats.xp / stats.nextLevelXp) * 100}%` }}></div>
          </div>
          <p className="text-primary text-[10px] font-bold mt-2 uppercase tracking-widest">{stats.xp} / {stats.nextLevelXp} XP para Nivel {stats.level + 1}</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm border-l-4 border-l-accent-gold flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-sm font-medium">Puntos Acumulados</p>
            <span className="material-symbols-outlined text-accent-gold">monetization_on</span>
          </div>
          <p className="text-3xl font-black mb-2">{stats.points.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+0 hoy</span>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-sm font-medium">Racha de Estudio</p>
            <span className="material-symbols-outlined text-orange-500">local_fire_department</span>
          </div>
          <p className="text-3xl font-black mb-2">{stats.streak} días</p>
          <p className="text-orange-500 text-xs font-bold uppercase tracking-widest">¡Vas por excelente camino!</p>
        </div>
      </div>

      <div className="flex flex-col items-center max-w-2xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-8">¿Qué concepto jurídico quieres <span className="text-primary italic">dominar</span> hoy?</h1>
        <form onSubmit={handleSearchSubmit} className="w-full relative group">
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
            className="w-full h-16 pl-12 pr-32 bg-white rounded-2xl border-2 border-gray-200 shadow-xl shadow-primary/5 focus:border-primary focus:ring-0 text-lg transition-all"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white h-10 px-6 rounded-xl font-bold hover:bg-primary-dark transition-all">Buscar</button>

          {/* Search Results Dropdown */}
          {showResults && searchText.length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2">
              {searchResults.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        onSelectConcept(result);
                        setShowResults(false);
                        setSearchText('');
                      }}
                      className="w-full flex items-center gap-4 p-4 hover:bg-primary/5 text-left transition-colors group"
                    >
                      <div className="size-10 rounded-lg bg-gray-50 flex items-center justify-center text-primary font-mono text-[10px] font-bold">
                        {result.id.split('-').pop()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-primary">{result.concept}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{result.subcategory}</p>
                      </div>
                      <span className="material-symbols-outlined text-gray-300 group-hover:text-primary text-sm">arrow_forward</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <span className="material-symbols-outlined text-gray-200 text-4xl mb-2">search_off</span>
                  <p className="text-sm text-gray-400 font-bold">No se encontraron resultados para "{searchText}"</p>
                </div>
              )}
              <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Presiona Enter para el primer resultado</p>
                <button onClick={() => setShowResults(false)} className="text-[10px] font-black text-primary uppercase hover:underline">Cerrar</button>
              </div>
            </div>
          )}
        </form>

        <div className="flex gap-3 justify-center mt-4 flex-wrap">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest py-1">Tendencias:</span>
          {['Autonomía de la Voluntad', 'Dolo', 'Tradición', 'Usufructo'].map(tag => (
            <button
              key={tag}
              onClick={() => {
                setSearchText(tag);
                setShowResults(true);
              }}
              className="text-xs font-semibold px-3 py-1 bg-white border border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight">Categorías Principales</h2>
            <button onClick={() => navigateTo('explorer')} className="text-primary text-sm font-bold hover:underline">Ver todas</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {categories.map(cat => (
              <div
                key={cat.name}
                className="group flex items-center p-5 bg-white rounded-2xl border border-transparent hover:border-primary/30 shadow-sm hover:shadow-xl transition-all cursor-pointer"
                onClick={() => navigateTo('explorer', undefined, cat.name)}
              >
                <div className={`size-14 rounded-2xl bg-${cat.color}-50 flex items-center justify-center text-${cat.color}-600 mr-4 group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{cat.name}</h3>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{cat.count} Conceptos</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-primary text-white rounded-3xl p-8 shadow-xl relative overflow-hidden group cursor-pointer" onClick={() => navigateTo('flashcards')}>
            <div className="absolute top-[-10%] right-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-700 rotate-12">
              <span className="material-symbols-outlined text-[150px]">style</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 text-white/60">
                <span className="material-symbols-outlined text-sm">memory</span>
                <span className="text-xs font-bold uppercase tracking-widest">Estudio Activo</span>
              </div>
              <h3 className="text-2xl font-black mb-3">Modo Flashcards</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Memoriza conceptos clave con tarjetas interactivas. Ideal para el repaso diario.
              </p>
              <div className="flex items-center gap-2 font-bold text-sm">
                <span>Comenzar</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1e293b] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-[-10%] right-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-[150px]">auto_awesome</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 text-accent-gold">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span className="text-xs font-bold uppercase tracking-widest">Concepto del día</span>
              </div>
              <h3 className="text-2xl font-black mb-3 italic">"{conceptOfTheDay.concept}"</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-2">
                {conceptOfTheDay.definitionSimple}
              </p>
              <button
                onClick={() => onSelectConcept(conceptOfTheDay)}
                className="w-full bg-primary hover:bg-primary-dark py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
              >
                Estudiar ahora
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-400">Actividad Reciente</h4>
            <div className="space-y-6">
              <div className="text-center py-6 text-gray-300">
                <span className="material-symbols-outlined text-3xl mb-2">history</span>
                <p className="text-xs font-bold uppercase tracking-widest">Sin actividad reciente</p>
              </div>
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
