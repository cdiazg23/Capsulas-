
import React, { useState, useMemo } from 'react';

interface Resource {
  id: string;
  title: string;
  category: 'Código' | 'Manual' | 'Esquema' | 'Grado';
  type: 'PDF' | 'DOCX' | 'LINK';
  description: string;
  color: string;
  lastUpdate: string;
}

const Library: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('Todos');

  const resources: (Resource & { url: string })[] = [
    { id: '1', title: 'Código Civil', category: 'Código', type: 'LINK', color: 'blue', description: 'Acceso directo al texto refundido, coordinado y sistematizado del Código Civil chileno.', lastUpdate: '2024', url: 'https://www.bcn.cl/leychile/navegar?idNorma=172986&idParte=8717776' },
    { id: '2', title: 'Código Penal', category: 'Código', type: 'LINK', color: 'red', description: 'Acceso al texto actualizado del Código Penal, incluyendo últimas modificaciones.', lastUpdate: '2024', url: 'https://www.bcn.cl/leychile/navegar?idNorma=1984' },
    { id: '3', title: 'Constitución Política', category: 'Código', type: 'LINK', color: 'slate', description: 'Texto vigente de la Constitución Política de la República de Chile.', lastUpdate: '2024', url: 'https://www.bcn.cl/leychile/navegar?idNorma=242302' },
    { id: '4', title: 'Código del Trabajo', category: 'Código', type: 'LINK', color: 'amber', description: 'Texto completo y actualizado del Código del Trabajo y leyes complementarias.', lastUpdate: '2024', url: 'https://www.bcn.cl/leychile/navegar?idNorma=207436' },
    { id: '5', title: 'Estatuto Administrativo', category: 'Código', type: 'LINK', color: 'purple', description: 'Fija el texto refundido, coordinado y sistematizado de la Ley Nº 18.834.', lastUpdate: '2024', url: 'https://www.bcn.cl/leychile/navegar?idNorma=236392' },
    { id: '6', title: 'Código de Procedimiento Civil', category: 'Código', type: 'LINK', color: 'emerald', description: 'Reglas de procedimiento para el ejercicio de acciones civiles en Chile.', lastUpdate: '2024', url: 'https://www.bcn.cl/leychile/navegar?idNorma=22740&idParte=0' },
  ];

  const categories = ['Todos', 'Código', 'Manual', 'Esquema', 'Grado'];

  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'Todos' || r.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex-1">
          <h1 className="text-4xl font-black mb-2 tracking-tight">Biblioteca Legal</h1>
          <p className="text-gray-500 max-w-xl">
            Repositorio centralizado con enlaces directos a la normativa vigente en BCN y recursos de estudio compartidos.
          </p>
        </div>
        <div className="w-full md:w-80 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            type="text"
            placeholder="Buscar en la biblioteca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 h-12 bg-white border-2 border-gray-100 rounded-xl focus:border-primary focus:ring-0 transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === cat
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'bg-white text-gray-400 border border-gray-100 hover:border-primary/30 hover:text-primary'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.length > 0 ? (
          filteredResources.map((res) => (
            <a
              key={res.id}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden flex flex-col h-full"
            >
              <div className={`absolute top-0 left-0 w-2 h-full transition-all group-hover:w-3 bg-${res.color}-500`}></div>

              <div className="flex justify-between items-start mb-6">
                <div className={`size-14 rounded-2xl bg-${res.color}-50 flex items-center justify-center text-${res.color}-600`}>
                  <span className="material-symbols-outlined text-3xl">
                    {res.category === 'Código' ? 'account_balance' :
                      res.category === 'Esquema' ? 'account_tree' :
                        res.category === 'Grado' ? 'school' : 'description'}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{res.type}</span>
                </div>
              </div>

              <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors leading-tight">
                {res.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-8 flex-1">
                {res.description}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                <div className="flex items-center gap-2">
                  <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">BCN Actualizado</span>
                </div>
                <span className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ver en BCN
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </span>
              </div>
            </a>
          ))
        ) : (
          <div className="col-span-full py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">find_in_page</span>
            <p className="text-lg font-bold text-gray-400">No encontramos lo que buscas</p>
            <button
              onClick={() => { setSearchTerm(''); setActiveFilter('Todos'); }}
              className="mt-4 text-sm font-black text-primary uppercase hover:underline"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}
      </div>

      <div className="bg-slate-950 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
          <span className="material-symbols-outlined text-[240px]">auto_awesome_motion</span>
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-gold text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              Próximamente
            </span>
            <h2 className="text-4xl font-black mb-6 tracking-tight leading-tight">
              ¿No encuentras tus apuntes? <br />
              <span className="text-accent-gold">Sube los tuyos.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Estamos construyendo una comunidad donde los mejores estudiantes comparten sus manuales y esquemas. Recibe puntos y XP por cada descarga de tu material.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-2xl shadow-primary/40 hover:scale-105 transition-all flex items-center gap-3">
                <span className="material-symbols-outlined">upload_file</span>
                Contribuir Material
              </button>
              <button className="px-8 py-4 bg-slate-800 text-white/70 rounded-2xl font-black text-sm hover:bg-slate-700 transition-all">
                Más información
              </button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-800 backdrop-blur-sm">
              <div className="space-y-4">
                {[
                  { user: 'Carolina P.', title: 'Esquema de Sucesión', pts: '+500' },
                  { user: 'Juan M.', title: 'Manual de Procesal I', pts: '+1200' },
                  { user: 'Sofía R.', title: 'Resumen Obligaciones', pts: '+850' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-slate-800 rounded-full flex items-center justify-center text-accent-gold font-bold text-xs">
                        {item.user.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{item.title}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Por {item.user}</p>
                      </div>
                    </div>
                    <span className="text-accent-gold font-black text-xs">{item.pts} PTS</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
