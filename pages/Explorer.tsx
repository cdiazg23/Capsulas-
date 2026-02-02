
import React, { useState } from 'react';
import { LegalConcept } from '../types';
interface ExplorerProps {
  onSelectConcept: (c: LegalConcept) => void;
  concepts: LegalConcept[];
  initialCategory?: string;
  initialSubcategory?: string;
}

const Explorer: React.FC<ExplorerProps> = ({ onSelectConcept, concepts, initialCategory, initialSubcategory }) => {
  const categories = Array.from(new Set(concepts.map(c => c.category)));
  const [activeCategory, setActiveCategory] = useState(initialCategory || categories[0] || '');
  const [searchTerm, setSearchTerm] = useState(initialSubcategory || '');

  React.useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
    if (initialSubcategory) {
      setSearchTerm(initialSubcategory);
    } else {
      setSearchTerm(''); // Limpiar búsqueda si solo se cambia categoría
    }
  }, [initialCategory, initialSubcategory]);

  const filteredConcepts = concepts.filter(c => {
    const conceptCat = (c.category || '').trim();
    const activeCat = activeCategory.trim();
    const subCat = (c.subcategory || '').trim().toLowerCase();
    const term = searchTerm.trim().toLowerCase();
    const name = (c.concept || '').trim().toLowerCase();

    const matchesSearch = term === '' ||
      name.includes(term) ||
      subCat.includes(term) ||
      c.id.toLowerCase().includes(term);

    // Si navegamos específicamente a una subcategoría desde el sidebar, 
    // priorizamos que se encuentre ese término ignorando la categoría si es necesario.
    if (term !== '' && initialSubcategory && term === initialSubcategory.trim().toLowerCase()) {
      return matchesSearch;
    }

    // Comportamiento estándar: filtrar por categoría + búsqueda
    return conceptCat === activeCat && matchesSearch;
  });

  return (
    <div className="animate-in fade-in duration-500">
      <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-slate-500 font-medium mb-4">
        <span className="material-symbols-outlined text-lg">home</span>
        <span>Home</span>
        <span>/</span>
        <span className="text-slate-950 dark:text-white font-bold">{activeCategory}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-4xl font-black mb-2 dark:text-white">{activeCategory}</h1>
        <p className="text-gray-500 dark:text-slate-400 max-w-2xl">
          Explora los conceptos fundamentales, la jurisprudencia y normativa aplicable en el sistema jurídico chileno.
        </p>
      </div>

      <div className="flex gap-4 mb-10 overflow-x-auto pb-4 custom-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setSearchTerm('');
            }}
            className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredConcepts.map((concept) => (
          <div
            key={concept.id}
            onClick={() => onSelectConcept(concept)}
            className="group bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-transparent dark:border-slate-800 hover:border-primary/30 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-8 -mt-8 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 rounded-lg bg-gray-50 dark:bg-slate-950 text-gray-400 dark:text-slate-500 text-[10px] font-bold tracking-widest uppercase border border-gray-100 dark:border-slate-800">{concept.id}</span>
              <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </div>
            <h3 className="text-xl font-bold mb-3 dark:text-white group-hover:text-primary transition-colors">{concept.concept}</h3>
            <p className="text-sm text-gray-400 dark:text-slate-500 line-clamp-3 leading-relaxed mb-6">
              {concept.definitionSimple}
            </p>
            <div className="flex items-center justify-between pt-5 border-t border-gray-50 dark:border-slate-800">
              <span className="text-[11px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-wider">{concept.subcategory}</span>
              {/* <div className="flex items-center gap-1 text-green-500">
                <span className="material-symbols-outlined text-sm fill-1">check_circle</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Dominado</span>
              </div> */}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Explorer;
