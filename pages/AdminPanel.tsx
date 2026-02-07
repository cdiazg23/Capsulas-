import React, { useState, useEffect } from 'react';
import { LegalConcept, MasterClass } from '../types';
import { categories, fetchLegalConcepts, fetchMasterClasses } from '../data';
import { supabase } from '../lib/supabase';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'users' | 'masterclasses'>('concepts');
  const [concepts, setConcepts] = useState<LegalConcept[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [masterClasses, setMasterClasses] = useState<MasterClass[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMCModalOpen, setIsMCModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const [editingConcept, setEditingConcept] = useState<LegalConcept | null>(null);
  const [editingMC, setEditingMC] = useState<MasterClass | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [filterSubcategory, setFilterSubcategory] = useState('Todas');

  const [formData, setFormData] = useState<Partial<LegalConcept>>({});
  const [mcFormData, setMcFormData] = useState<Partial<MasterClass>>({});
  const [newKeyPoint, setNewKeyPoint] = useState('');

  const filteredConcepts = concepts.filter(c => {
    const matchesSearch = c.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'Todas' || c.category === filterCategory;
    const matchesSubcategory = filterSubcategory === 'Todas' || (c.subcategory || '') === filterSubcategory;
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const filteredProfiles = profiles.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    return (p.username || '').toLowerCase().includes(searchLower) ||
      (p.full_name || '').toLowerCase().includes(searchLower);
  });

  const subcategories = Array.from(new Set(
    concepts
      .filter(c => filterCategory === 'Todas' || c.category === filterCategory)
      .map(c => c.subcategory)
  )).filter(Boolean).sort() as string[];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const conceptsData = await fetchLegalConcepts();
      setConcepts(conceptsData || []);

      const mcData = await fetchMasterClasses();
      setMasterClasses(mcData || []);

      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .order('username', { ascending: true });

      if (userError) {
        console.error('Error fetching profiles:', userError);
      } else {
        setProfiles(userData || []);
      }
    } catch (error) {
      console.error('Unexpected error in loadData:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (concept?: LegalConcept) => {
    if (concept) {
      setEditingConcept(concept);
      setFormData(concept);
    } else {
      setEditingConcept(null);
      setFormData({
        id: `DC-${Math.floor(Math.random() * 9999)}`,
        concept: '',
        category: categories[0] || 'Derecho Civil',
        subcategory: '',
        definitionSimple: '',
        realExample: '',
        regulation: '',
        jurisprudence: '',
        videoUrl: '',
        keyPoints: []
      });
    }
    setIsModalOpen(true);
  };

  const handleDeleteConcept = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este concepto?')) return;
    const { error } = await supabase.from('legal_concepts').delete().eq('id', id);
    if (error) alert(error.message);
    else await loadData();
  };

  const handleSaveConcept = async (e: React.FormEvent) => {
    e.preventDefault();
    const conceptToSave = formData as LegalConcept;

    const dbPayload = {
      id: conceptToSave.id,
      concept: conceptToSave.concept,
      category: conceptToSave.category,
      subcategory: conceptToSave.subcategory,
      definition_simple: conceptToSave.definitionSimple,
      real_example: conceptToSave.realExample,
      regulation: conceptToSave.regulation,
      jurisprudence: conceptToSave.jurisprudence,
      video_url: conceptToSave.videoUrl,
      key_points: conceptToSave.keyPoints || []
    };

    const { error } = await supabase.from('legal_concepts').upsert(dbPayload);

    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      await loadData();
      setIsModalOpen(false);
    }
  };

  const handleBulkSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const rows = bulkText.trim().split('\n');
      if (rows.length === 0) return;

      const conceptsToSave = rows.map(row => {
        const [concept, category, subcategory, definition, example, regulation, jurisprudence, keyPointsStr] = row.split(';').map(s => s?.trim());

        if (!concept) return null;

        return {
          id: `DC-${Math.floor(Math.random() * 99999)}`,
          concept,
          category: category || categories[0],
          subcategory: subcategory || '',
          definition_simple: definition || '',
          real_example: example || '',
          regulation: regulation || '',
          jurisprudence: jurisprudence || '',
          video_url: '', // Video removed as requested
          key_points: keyPointsStr ? keyPointsStr.split('|').map(kp => kp.trim()) : []
        };
      }).filter(Boolean);

      if (conceptsToSave.length === 0) {
        alert('No se encontraron conceptos válidos.');
        return;
      }

      const { error } = await supabase.from('legal_concepts').upsert(conceptsToSave);

      if (error) {
        alert('Error al guardar masivamente: ' + error.message);
      } else {
        await loadData();
        setIsBulkModalOpen(false);
        setBulkText('');
        alert(`${conceptsToSave.length} conceptos cargados con éxito.`);
      }
    } catch (err) {
      alert('Error procesando los datos: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    const headers = ['Concepto', 'Categoría', 'Subcategoría', 'Definición', 'Ejemplo', 'Regulación', 'Jurisprudencia', 'Sintesis Tecnica'];
    const rows = concepts.map(c => [
      c.concept || '',
      c.category || '',
      c.subcategory || '',
      (c.definitionSimple || '').replace(/;/g, ','),
      (c.realExample || '').replace(/;/g, ','),
      (c.regulation || '').replace(/;/g, ','),
      (c.jurisprudence || '').replace(/;/g, ','),
      (c.keyPoints || []).join('|')
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(r => r.join(';'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `conceptos_iuris_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };



  const handleAddKeyPoint = () => {
    if (!newKeyPoint.trim()) return;
    setFormData(prev => ({
      ...prev,
      keyPoints: [...(prev.keyPoints || []), newKeyPoint.trim()]
    }));
    setNewKeyPoint('');
  };

  const handleRemoveKeyPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyPoints: (prev.keyPoints || []).filter((_, i) => i !== index)
    }));
  };

  // MasterClass Handlers
  const handleOpenMCModal = (mc?: MasterClass) => {
    if (mc) {
      setEditingMC(mc);
      setMcFormData(mc);
    } else {
      setEditingMC(null);
      setMcFormData({
        title: '',
        description: '',
        video_url: '',
        category: 'Masterclass',
        professor: 'Iuris Academy',
        duration: ''
      });
    }
    setIsMCModalOpen(true);
  };

  const handleSaveMC = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('masterclasses').upsert(mcFormData);
    if (error) {
      alert('Error: ' + error.message);
    } else {
      await loadData();
      setIsMCModalOpen(false);
    }
  };

  const handleDeleteMC = async (id: string) => {
    if (!confirm('¿Eliminar esta Masterclass?')) return;
    const { error } = await supabase.from('masterclasses').delete().eq('id', id);
    if (error) alert(error.message);
    else await loadData();
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (error) alert(error.message);
    else await loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-in slide-in-from-right duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight dark:text-white">Gestión del Sistema</h1>
          <p className="text-gray-500">Administra conceptos, roles y Aula Iuris.</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'concepts' && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsBulkModalOpen(true)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              >
                Carga Masiva
              </button>
              <button
                onClick={() => handleOpenModal()}
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg"
              >
                + Nuevo Concepto
              </button>
            </div>
          )}
          {activeTab === 'masterclasses' && (
            <button
              onClick={() => handleOpenMCModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg"
            >
              + Nueva Masterclass
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'concepts', label: 'Conceptos', count: concepts.length },
          { id: 'masterclasses', label: 'Aula Iuris', count: masterClasses.length },
          { id: 'users', label: 'Usuarios', count: profiles.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      {(activeTab === 'concepts' || activeTab === 'users') && (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input
              type="text"
              placeholder={activeTab === 'concepts' ? "Buscar concepto..." : "Buscar usuario por nombre o email..."}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-sm dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {activeTab === 'concepts' && (
            <div className="flex flex-wrap gap-2">
              <select
                className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl px-4 py-3 text-sm dark:text-white"
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setFilterSubcategory('Todas');
                }}
              >
                <option value="Todas">Todas las áreas</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select
                className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl px-4 py-3 text-sm dark:text-white min-w-[150px]"
                value={filterSubcategory}
                onChange={(e) => setFilterSubcategory(e.target.value)}
              >
                <option value="Todas">Todas las subáreas</option>
                {subcategories.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <button
                onClick={handleDownloadCSV}
                className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl px-4 py-3 text-sm dark:text-white flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                title="Descargar CSV"
              >
                <span className="material-symbols-outlined text-xl">download</span>
                <span className="hidden md:inline">Exportar CSV</span>
              </button>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl">
              <span className="material-symbols-outlined text-amber-500 text-sm">info</span>
              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                Para donadores de Ko-fi, busca el usuario y asígnale el rol "FOUNDER" manualmente.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'concepts' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-slate-800/50 border-b dark:border-slate-800">
                <tr>
                  <th className="p-4 text-[10px] font-black uppercase text-gray-400 w-1/3">Concepto</th>
                  <th className="p-4 text-[10px] font-black uppercase text-gray-400">Área</th>
                  <th className="p-4 text-[10px] font-black uppercase text-gray-400">Subárea</th>
                  <th className="p-4 text-[10px] font-black uppercase text-gray-400 text-right w-40">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {filteredConcepts.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-bold dark:text-white">{c.concept}</p>
                      <p className="text-[10px] text-gray-400">{c.id}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 dark:text-gray-300 whitespace-nowrap">
                        {c.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {c.subcategory || 'Sin subárea'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleOpenModal(c)} className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button onClick={() => handleDeleteConcept(c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'masterclasses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {masterClasses.map(mc => (
            <div key={mc.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm relative group">
              <h3 className="text-lg font-black mb-1 dark:text-white line-clamp-1">{mc.title}</h3>
              <p className="text-xs text-gray-400 mb-6 line-clamp-2">{mc.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 px-2.5 py-1 rounded-lg">
                  {mc.category || 'Masterclass'}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleOpenMCModal(mc)} className="size-9 flex items-center justify-center text-primary hover:bg-primary/5 rounded-lg">
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                  <button onClick={() => handleDeleteMC(mc.id)} className="size-9 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg">
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {masterClasses.length === 0 && (
            <div className="col-span-full py-20 text-center opacity-30">
              <span className="material-symbols-outlined text-6xl block mb-2">video_library</span>
              <p className="font-bold uppercase tracking-widest text-xs">No hay videos registrados</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-slate-800/50 border-b dark:border-slate-800">
                <tr>
                  <th className="p-4 text-[10px] font-black uppercase text-gray-400">Usuario</th>
                  <th className="p-4 text-[10px] font-black uppercase text-gray-400">Rol Actual</th>
                  <th className="p-4 text-[10px] font-black uppercase text-gray-400 text-right">Asignar Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {filteredProfiles.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50">
                    <td className="p-4">
                      <p className="text-sm font-bold dark:text-white">{p.username || 'Usuario sin nombre'}</p>
                      <p className="text-[10px] text-gray-400">{p.full_name || 'ID: ' + p.id.substring(0, 8)}</p>
                    </td>
                    <td className="p-4">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${p.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : p.role === 'founder' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                        {p.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex rounded-lg border dark:border-slate-800 overflow-hidden text-[9px] font-bold">
                        <button onClick={() => updateUserRole(p.id, 'user')} className={`px-2 py-1.5 ${p.role === 'user' ? 'bg-gray-200 dark:bg-slate-700' : 'hover:bg-gray-50 dark:hover:bg-slate-800 dark:text-gray-400'}`}>USER</button>
                        <button onClick={() => updateUserRole(p.id, 'founder')} className={`px-2 py-1.5 border-l dark:border-slate-800 ${p.role === 'founder' ? 'bg-primary text-white' : 'hover:bg-gray-50 dark:hover:bg-slate-800 dark:text-gray-400'}`}>FOUNDER</button>
                        <button onClick={() => updateUserRole(p.id, 'admin')} className={`px-2 py-1.5 border-l dark:border-slate-800 ${p.role === 'admin' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50 dark:hover:bg-slate-800 dark:text-gray-400'}`}>ADMIN</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProfiles.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-10 text-center text-gray-400 text-xs italic">
                      No se encontraron usuarios que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODALS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-2xl font-black dark:text-white">{editingConcept ? 'Editar Concepto' : 'Nuevo Concepto'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="dark:text-gray-400"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleSaveConcept} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">ID</label>
                  <input className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm dark:text-white" value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nombre</label>
                  <input className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm dark:text-white" value={formData.concept} onChange={e => setFormData({ ...formData, concept: e.target.value })} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Categoría</label>
                  <select className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm dark:text-white" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Subcategoría</label>
                  <input className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm dark:text-white" value={formData.subcategory} onChange={e => setFormData({ ...formData, subcategory: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Definición</label>
                <textarea className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm dark:text-white" rows={2} value={formData.definitionSimple} onChange={e => setFormData({ ...formData, definitionSimple: e.target.value })} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Ejemplo Real</label>
                <textarea className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm dark:text-white" rows={2} value={formData.realExample} onChange={e => setFormData({ ...formData, realExample: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Regulación / Base Legal</label>
                  <input className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm dark:text-white" value={formData.regulation} onChange={e => setFormData({ ...formData, regulation: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Jurisprudencia / Referencia</label>
                  <input className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm dark:text-white" value={formData.jurisprudence} onChange={e => setFormData({ ...formData, jurisprudence: e.target.value })} />
                </div>
              </div>

              <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">SÍNTESIS TÉCNICA (Puntos Clave)</label>
                <div className="flex flex-wrap gap-2">
                  {formData.keyPoints?.map((kp, i) => (
                    <span key={i} className="bg-white dark:bg-slate-900 border dark:border-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 dark:text-white">
                      {kp}
                      <button type="button" onClick={() => handleRemoveKeyPoint(i)} className="text-red-400 hover:text-red-600">×</button>
                    </span>
                  ))}
                  {(!formData.keyPoints || formData.keyPoints.length === 0) && (
                    <p className="text-[10px] text-gray-400 italic">No hay puntos clave asignados.</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    placeholder="Agregar nuevo punto..."
                    className="flex-1 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-4 py-2 text-sm dark:text-white"
                    value={newKeyPoint}
                    onChange={e => setNewKeyPoint(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddKeyPoint())}
                  />
                  <button type="button" onClick={handleAddKeyPoint} className="bg-primary text-white px-4 rounded-xl font-bold">+</button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-100 dark:bg-slate-800 dark:text-white rounded-2xl font-bold">Cancelar</button>
                <button type="submit" className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black shadow-lg">Guardar Concepto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isMCModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black mb-6 dark:text-white">{editingMC ? 'Editar Masterclass' : 'Nueva Masterclass'}</h2>
            <form onSubmit={handleSaveMC} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Título de la Clase</label>
                <input required className="w-full bg-gray-50 dark:bg-slate-800 border-none p-3 rounded-xl text-sm dark:text-white" value={mcFormData.title} onChange={e => setMcFormData({ ...mcFormData, title: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Descripción</label>
                <textarea rows={3} className="w-full bg-gray-50 dark:bg-slate-800 border-none p-3 rounded-xl text-sm dark:text-white" value={mcFormData.description} onChange={e => setMcFormData({ ...mcFormData, description: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">URL YouTube</label>
                <input required className="w-full bg-gray-50 dark:bg-slate-800 border-none p-3 rounded-xl text-sm dark:text-white" value={mcFormData.video_url} onChange={e => setMcFormData({ ...mcFormData, video_url: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Categoría</label>
                  <input className="w-full bg-gray-50 dark:bg-slate-800 border-none p-3 rounded-xl text-sm dark:text-white" value={mcFormData.category} onChange={e => setMcFormData({ ...mcFormData, category: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Duración</label>
                  <input className="w-full bg-gray-50 dark:bg-slate-800 border-none p-3 rounded-xl text-sm dark:text-white" placeholder="Ej: 45 min" value={mcFormData.duration} onChange={e => setMcFormData({ ...mcFormData, duration: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsMCModalOpen(false)} className="flex-1 py-4 bg-gray-100 dark:bg-slate-800 dark:text-white rounded-2xl font-bold">Cancelar</button>
                <button type="submit" className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg">Publicar Video</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBulkModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black dark:text-white">Carga Masiva de Conceptos</h2>
                <p className="text-xs text-gray-500 mt-1">Pega tus datos separados por punto y coma (;)</p>
              </div>
              <button onClick={() => setIsBulkModalOpen(false)} className="dark:text-gray-400"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleBulkSave} className="p-8 space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-primary mb-2">Formato Requerido:</p>
                <code className="text-[10px] dark:text-gray-300 break-all">
                  Concepto;Categoría;Subcategoría;Definición;Ejemplo;Regulación;Jurisprudencia;SintesisTecnica
                </code>
                <p className="text-[9px] text-gray-400 mt-2 italic">* Usa el símbolo "|" para separar múltiples puntos en la Síntesis Técnica.</p>
              </div>
              <textarea
                className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-4 text-xs font-mono dark:text-white"
                rows={12}
                placeholder="Ejemplo:&#10;Contrato de Compraventa;Derecho Civil;Contratos;Acuerdo donde uno se obliga a dar...;Venta de una casa;Art. 1793;Corte Suprema Rol 123...;Punto 1|Punto 2|Punto 3"
                value={bulkText}
                onChange={e => setBulkText(e.target.value)}
                required
              />

              <div className="flex gap-4">
                <button type="button" onClick={() => setIsBulkModalOpen(false)} className="flex-1 py-4 bg-gray-100 dark:bg-slate-800 dark:text-white rounded-2xl font-bold">Cancelar</button>
                <button type="submit" className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black shadow-lg">Iniciar Carga</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
