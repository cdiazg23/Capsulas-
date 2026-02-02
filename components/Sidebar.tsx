
import React, { useState } from 'react';
import { ViewType, UserStats } from '../types';

interface SidebarProps {
  onNavigate: (view: ViewType, category?: string, subcategory?: string) => void;
  currentView: ViewType;
  selectedCategory?: string;
  selectedSubcategory?: string;
  stats: UserStats;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentView, selectedCategory, selectedSubcategory, stats }) => {
  const [expanded, setExpanded] = useState<string[]>(['Derecho Civil']);

  const toggleExpand = (cat: string) => {
    setExpanded(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
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

  return (
    <aside className="w-72 border-r border-[#e7ebf3] bg-white p-6 hidden lg:flex flex-col h-[calc(100vh-64px)] sticky top-16">
      <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
        <h1 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Taxonomía Jurídica</h1>

        <div className="flex flex-col gap-1">
          {navItems.map((cat) => (
            <div key={cat.name} className="flex flex-col">
              <button
                onClick={() => toggleExpand(cat.name)}
                className={`flex items-center justify-between p-2 rounded-lg transition-all ${expanded.includes(cat.name) ? 'bg-primary/5 text-primary' : 'text-gray-700 hover:bg-gray-50'
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
                <div className="ml-4 mt-1 border-l-2 border-primary/20 flex flex-col gap-0.5">
                  {cat.items.map(item => (
                    <button
                      key={item}
                      onClick={() => onNavigate('explorer', cat.name, item)}
                      className={`text-left py-2 px-4 text-sm transition-colors ${selectedCategory === cat.name && selectedSubcategory === item && currentView === 'explorer'
                        ? 'font-semibold text-primary bg-primary/5 rounded-r-lg border-l-2 border-primary -ml-[2px]'
                        : 'text-gray-500 hover:text-primary'
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
      </div>

      <div className="mt-auto space-y-4 pt-4 border-t border-gray-50">
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
          <div className="flex items-center gap-3 text-orange-600 mb-1">
            <span className="material-symbols-outlined fill-1">local_fire_department</span>
            <p className="text-xs font-bold uppercase">Racha de {stats.streak} días</p>
          </div>
          <p className="text-[10px] text-orange-700 italic">¡Tu examen de grado está más cerca, no pares!</p>
        </div>

        <button
          onClick={() => onNavigate('explorer')}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined">school</span>
          <span>Modo de Estudio</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
