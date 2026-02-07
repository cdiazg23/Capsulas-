import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  stats: any;
  user: any;
  selectedCategory?: string;
  selectedSubcategory?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, stats, user, selectedCategory, selectedSubcategory }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const [expanded, setExpanded] = useState<string[]>(['Derecho Civil']);

  const toggleExpand = (cat: string) => {
    setExpanded(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const navItems = [
    {
      name: 'Derecho Civil',
      icon: 'book_2',
      items: ['Teoría de la Ley', 'Acto Jurídico', 'Bienes', 'Obligaciones', 'Contratos', 'Familia']
    },
    {
      name: 'Derecho Procesal',
      icon: 'contract',
      items: ['Orgánico', 'Reglas Comunes', 'Juicio Ordinario', 'Recursos', 'Insolvencia']
    },
    {
      name: 'Derecho Constitucional',
      icon: 'account_balance',
      items: ['Orgánico', 'Derechos Fundamentales']
    },
    {
      name: 'Derecho Laboral',
      icon: 'work',
      items: ['Individual', 'Colectivo']
    },
    {
      name: 'Derecho Administrativo',
      icon: 'corporate_fare',
      items: ['General']
    },
    {
      name: 'Procedimientos Especiales',
      icon: 'gavel',
      items: ['Policía Local']
    }
  ];

  const isExplorerRoute = location.pathname.startsWith('/app/explorer');
  const catParam = params.category;
  const subcatParam = params.subcategory;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-white dark:bg-slate-900 p-6 
        transform transition-transform duration-300 ease-in-out
        border-r border-[#e7ebf3] dark:border-slate-800
        lg:translate-x-0 lg:static lg:z-0 lg:h-[calc(100vh-64px)] lg:top-16
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between lg:hidden mb-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">balance</span>
            <h2 className="font-bold text-slate-900 dark:text-white">Menú</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-primary">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 h-full pb-20 lg:pb-0">
          <h1 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-4">Taxonomía Jurídica</h1>

          <div className="flex flex-col gap-1">
            {navItems.map((cat) => (
              <div key={cat.name} className="flex flex-col">
                <button
                  onClick={() => toggleExpand(cat.name)}
                  className={`flex items-center justify-between p-2 rounded-lg transition-all ${expanded.includes(cat.name)
                    ? 'bg-primary/5 dark:bg-primary/10 text-primary'
                    : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined text-[20px] ${expanded.includes(cat.name) ? 'fill-1' : ''}`}>{cat.icon}</span>
                    <span className="text-sm font-semibold">{cat.name}</span>
                  </div>
                  <span className="material-symbols-outlined text-sm">
                    {expanded.includes(cat.name) ? 'expand_more' : 'chevron_right'}
                  </span>
                </button>

                {expanded.includes(cat.name) && cat.items.length > 0 && (
                  <div className="ml-4 mt-1 border-l-2 border-primary/20 dark:border-primary/40 flex flex-col gap-0.5">
                    {cat.items.map(item => (
                      <button
                        key={item}
                        onClick={() => handleNavigate(`/app/explorer/${encodeURIComponent(cat.name)}/${encodeURIComponent(item)}`)}
                        className={`text-left py-2 px-4 text-sm transition-colors ${isExplorerRoute &&
                          (catParam === cat.name || selectedCategory === cat.name) &&
                          (subcatParam === item || selectedSubcategory === item)
                          ? 'font-semibold text-primary bg-primary/5 dark:bg-primary/10 rounded-r-lg border-l-2 border-primary -ml-[2px]'
                          : 'text-gray-500 dark:text-slate-500 hover:text-primary'
                          }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto space-y-4 pt-4 border-t border-gray-50 dark:border-slate-800">
            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
              <div className="flex items-center gap-3 text-orange-600 dark:text-orange-400 mb-1">
                <span className="material-symbols-outlined fill-1">local_fire_department</span>
                <p className="text-xs font-bold uppercase">Racha de {stats.streak} días</p>
              </div>
              <p className="text-[10px] text-orange-700 dark:text-orange-300 italic">¡Tu examen de grado está más cerca, no pares!</p>
            </div>

            <div className="p-2 space-y-1">
              {(user?.role === 'founder' || user?.role === 'admin') && (
                <button
                  onClick={() => handleNavigate('/app/community')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${location.pathname === '/app/community' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-900'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">forum</span>
                  <span>Espacio Fundadores</span>
                </button>
              )}

              <button
                onClick={() => handleNavigate('/app/masterclasses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${location.pathname === '/app/masterclasses' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-900'}`}
              >
                <span className="material-symbols-outlined text-[20px]">school</span>
                <span>Aula Iuris</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
