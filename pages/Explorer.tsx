import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useConcepts, useStats, useAuth } from '../contexts';

const Explorer: React.FC = () => {
  const navigate = useNavigate();
  const { category: urlCategory, subcategory: urlSubcategory } = useParams();
  const { concepts } = useConcepts();

  const safeConcepts = concepts || [];
  const categories = Array.from(new Set(safeConcepts.map(c => c.category)));

  const [activeCategory, setActiveCategory] = useState(urlCategory || categories[0] || 'Derecho Civil');
  const [searchTerm, setSearchTerm] = useState(urlSubcategory || '');

  React.useEffect(() => {
    if (urlCategory) {
      setActiveCategory(decodeURIComponent(urlCategory));
    }
    if (urlSubcategory) {
      setSearchTerm(decodeURIComponent(urlSubcategory));
    } else {
      setSearchTerm('');
    }
  }, [urlCategory, urlSubcategory]);

  const filteredConcepts = safeConcepts.filter((c: any) => {
    const conceptCat = (c.category || '').trim();
    const activeCat = activeCategory.trim();
    const subCat = (c.subcategory || '').trim().toLowerCase();
    const term = searchTerm.trim().toLowerCase();
    const name = (c.concept || '').trim().toLowerCase();

    const matchesSearch = term === '' ||
      name.includes(term) ||
      subCat.includes(term) ||
      c.id.toLowerCase().includes(term);

    if (term !== '' && urlSubcategory && term === decodeURIComponent(urlSubcategory).trim().toLowerCase()) {
      return matchesSearch;
    }

    return conceptCat === activeCat && matchesSearch;
  });

  const { stats } = useStats();
  const { user } = useAuth();

  const handleConceptClick = (conceptId: string) => {
    // Verificar límite para usuarios gratuitos antes de navegar
    if (user?.role === 'user' && stats.consultationsToday >= 10) {
      const today = new Date().toDateString();
      const lastDate = stats.lastConsultationAt ? new Date(stats.lastConsultationAt).toDateString() : '';

      // Solo bloquear si no es un nuevo día (en caso de que el reset no haya ocurrido aún)
      if (today === lastDate) {
        navigate('/pricing');
        return;
      }
    }
    navigate(`/app/concept/${conceptId}`);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <Helmet>
        <title>{`${activeCategory} | Explorador de Conceptos - IurisAcademy`}</title>
        <meta name="description" content={`Explora los conceptos fundamentales, normativa aplicada y doctrina de ${activeCategory} en el sistema legal chileno.`} />
      </Helmet>

      <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-slate-500 font-medium mb-4">
        <span className="material-symbols-outlined text-lg">home</span>
        <button onClick={() => navigate('/app/dashboard')} className="hover:text-primary">Home</button>
        <span>/</span>
        <span className="text-slate-950 dark:text-white font-bold">{activeCategory}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-4xl font-black mb-2 dark:text-white">{activeCategory}</h1>
        <p className="text-gray-500 dark:text-slate-400 max-w-2xl">
          Explora los conceptos fundamentales, la normativa aplicada y doctrina en el sistema jurídico chileno.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setSearchTerm('');
              navigate(`/app/explorer/${encodeURIComponent(cat)}`);
            }}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeCategory === cat
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-800 hover:border-primary/50'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-10 max-w-2xl">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
          <input
            type="text"
            placeholder="Buscar por concepto o ID en esta categoría..."
            value={searchTerm}
            className="w-full h-14 pl-12 pr-4 bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 rounded-2xl focus:border-primary dark:focus:border-primary focus:ring-0 text-base placeholder:text-gray-400 dark:text-white shadow-sm transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredConcepts.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-gray-200 dark:text-slate-800 mb-4">search_off</span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No se encontraron conceptos</h3>
          <p className="text-gray-500 dark:text-slate-400">Intenta con otros términos de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl">
          {filteredConcepts.map((concept) => (
            <div
              key={concept.id}
              onClick={() => handleConceptClick(concept.id)}
              className="group bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="px-2 py-0.5 rounded bg-gray-50 dark:bg-slate-950 text-gray-400 dark:text-slate-500 text-[9px] font-bold tracking-wider uppercase">{concept.id}</span>
                <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity text-base">arrow_forward</span>
              </div>
              <h3 className="text-base font-bold mb-2 dark:text-white group-hover:text-primary transition-colors">{concept.concept}</h3>
              <p className="text-xs text-gray-400 dark:text-slate-500 line-clamp-2 leading-relaxed mb-3">
                {concept.definitionSimple}
              </p>
              <div className="pt-3 border-t border-gray-50 dark:border-slate-800">
                <span className="text-[9px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-wider">{concept.subcategory}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explorer;
