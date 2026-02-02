
import React, { useState, useEffect } from 'react';
import { LegalConcept, User } from '../types';
import { categories, fetchLegalConcepts } from '../data';
import { supabase } from '../lib/supabase';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'users'>('concepts');
  const [concepts, setConcepts] = useState<LegalConcept[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMassUploadOpen, setIsMassUploadOpen] = useState(false);
  const [editingConcept, setEditingConcept] = useState<LegalConcept | null>(null);
  const [massData, setMassData] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todas');

  const filteredConcepts = concepts.filter(c => {
    const matchesSearch = c.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'Todas' || c.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const exportToExcel = () => {
    const headers = ['ID', 'Concepto', 'Categoría', 'Subcategoría', 'Definición', 'Ejemplo', 'Normativa', 'Jurisprudencia', 'Video URL'];
    const rows = filteredConcepts.map(c => [
      c.id, c.concept, c.category, c.subcategory,
      `"${c.definitionSimple.replace(/"/g, '""')}"`,
      `"${c.realExample.replace(/"/g, '""')}"`,
      c.regulation, c.jurisprudence, c.videoUrl
    ]);

    // Using semicolon for Excel compatibility in some regions, or comma
    const csvContent = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `IurisAcademy_Conceptos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Form State
  const [formData, setFormData] = useState<Partial<LegalConcept>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchLegalConcepts();
    setConcepts(data);

    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .order('username', { ascending: true });

    if (!userError) setProfiles(userData || []);
    setLoading(false);
  };

  const handleOpenModal = (concept?: LegalConcept) => {
    if (concept) {
      setEditingConcept(concept);
      setFormData(concept);
    } else {
      setEditingConcept(null);
      setFormData({
        id: `DC-NEW-${Math.floor(Math.random() * 999)}`,
        concept: '',
        category: categories[0] || 'Derecho Civil',
        subcategory: '',
        definitionSimple: '',
        realExample: '',
        regulation: '',
        jurisprudence: '',
        videoUrl: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDeleteConcept = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este concepto?')) {
      const { error } = await supabase.from('legal_concepts').delete().eq('id', id);
      if (error) {
        alert('Error al eliminar: ' + error.message);
      } else {
        setConcepts(prev => prev.filter(c => c.id !== id));
      }
    }
  };

  const handleSaveConcept = async (e: React.FormEvent) => {
    e.preventDefault();
    const conceptToSave = formData as LegalConcept;

    // Map camelCase to snake_case for Supabase
    const dbPayload = {
      id: conceptToSave.id,
      concept: conceptToSave.concept,
      category: conceptToSave.category,
      subcategory: conceptToSave.subcategory,
      definition_simple: conceptToSave.definitionSimple,
      real_example: conceptToSave.realExample,
      regulation: conceptToSave.regulation,
      jurisprudence: conceptToSave.jurisprudence,
      video_url: conceptToSave.videoUrl
    };

    const { error } = await supabase.from('legal_concepts').upsert(dbPayload);

    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      await loadData();
      setIsModalOpen(false);
    }
  };

  const handleMassUpload = async () => {
    try {
      const lines = massData.trim().split('\n');
      const dbPayloads = lines.map(line => {
        const [id, concept, category, subcategory, definitionSimple, realExample, regulation, jurisprudence, videoUrl] = line.split(';');
        return {
          id,
          concept,
          category,
          subcategory,
          definition_simple: definitionSimple,
          real_example: realExample,
          regulation,
          jurisprudence,
          video_url: videoUrl
        };
      });

      const { error } = await supabase.from('legal_concepts').upsert(dbPayloads);

      if (error) throw error;

      await loadData();
      setIsMassUploadOpen(false);
      setMassData('');
      alert(`${dbPayloads.length} conceptos cargados exitosamente.`);
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role: newRole } : p));
    }
  };

  const handleResetPassword = async (userId: string) => {
    const newPass = prompt('Ingresa la nueva contraseña para este usuario:', '123456');
    if (!newPass) return;

    const { error } = await supabase.rpc('reset_user_password', {
      user_id: userId,
      new_password: newPass
    });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Contraseña actualizada correctamente.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('¿ELIMINAR USUARIO? Esta acción borrará permanentemente la cuenta y es irreversible.')) return;

    const { error } = await supabase.rpc('delete_user', { user_id: userId });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setProfiles(prev => prev.filter(p => p.id !== userId));
      alert('Usuario eliminado del sistema.');
    }
  };

  if (loading && concepts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-right duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">Gestión del Sistema</h1>
          <p className="text-gray-500">Administra conceptos legales y roles de usuario.</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'concepts' && (
            <>
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-emerald-100"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                <span>Exportar Excel</span>
              </button>
              <button
                onClick={() => setIsMassUploadOpen(true)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-slate-800 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">upload_file</span>
                <span>Carga Masiva</span>
              </button>
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>Nuevo Concepto</span>
              </button>
            </>
          )}
        </div>
      </div>

      {activeTab === 'concepts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input
              type="text"
              placeholder="Filtrar por nombre o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="Todas">Categorías: Todas</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      )}

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('concepts')}
          className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'concepts' ? 'bg-primary text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
        >
          Conceptos ({concepts.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'users' ? 'bg-primary text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
        >
          Usuarios ({profiles.length})
        </button>
      </div>

      {activeTab === 'concepts' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { label: 'Total Conceptos', val: concepts.length, color: 'slate' },
              { label: 'Categorías Activas', val: new Set(concepts.map(c => c.category)).size, color: 'blue' },
              { label: 'Último Ingreso', val: concepts[0]?.id || 'N/A', color: 'green' },
              { label: 'Sincronizado', val: 'Vía Supabase', color: 'primary' }
            ].map(stat => (
              <div key={stat.label} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <p className={`text-2xl font-black text-${stat.color === 'primary' ? 'primary' : stat.color + '-600'}`}>{stat.val}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">ID</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Concepto</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Categoría</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredConcepts.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-gray-400">{c.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{c.concept}</span>
                          <span className="text-[10px] text-gray-400 truncate max-w-[200px]">{c.definitionSimple}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/5 text-primary">
                          {c.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1">
                        <button
                          onClick={() => handleOpenModal(c)}
                          className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Editar"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteConcept(c.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black">Control de Accesos</h2>
              <p className="text-sm text-gray-400">Promueve administradores o gestiona cuentas de estudiantes.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Email / Usuario</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Rol Actual</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {profiles.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{u.username}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.role === 'admin' ? 'Administrador' : 'Estudiante'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleUserRole(u.id, u.role)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${u.role === 'admin' ? 'border-red-100 text-red-600 hover:bg-red-50' : 'border-primary/20 text-primary hover:bg-primary/5'}`}
                      >
                        {u.role === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                      </button>
                      <button
                        onClick={() => handleResetPassword(u.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Resetear Password"
                      >
                        <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Eliminar Cuenta"
                      >
                        <span className="material-symbols-outlined text-[20px]">person_remove</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Add/Edit Concept */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-black">{editingConcept ? 'Editar Concepto' : 'Nuevo Concepto'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-slate-900 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveConcept} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">ID Único</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={e => setFormData({ ...formData, id: e.target.value })}
                    className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-primary/20 text-sm p-3 font-mono"
                    required
                    readOnly={!!editingConcept}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Nombre del Concepto</label>
                  <input
                    type="text"
                    value={formData.concept}
                    onChange={e => setFormData({ ...formData, concept: e.target.value })}
                    className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-primary/20 text-sm p-3"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-primary/20 text-sm p-3"
                    required
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Subcategoría</label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-primary/20 text-sm p-3"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Definición "En Simple"</label>
                <textarea
                  rows={3}
                  value={formData.definitionSimple}
                  onChange={e => setFormData({ ...formData, definitionSimple: e.target.value })}
                  className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-primary/20 text-sm p-3 leading-relaxed"
                  required
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ejemplo Real</label>
                <textarea
                  rows={3}
                  value={formData.realExample}
                  onChange={e => setFormData({ ...formData, realExample: e.target.value })}
                  className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-primary/20 text-sm p-3 leading-relaxed"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Normativa (Chile)</label>
                  <input
                    type="text"
                    value={formData.regulation}
                    onChange={e => setFormData({ ...formData, regulation: e.target.value })}
                    className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-primary/20 text-sm p-3"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Jurisprudencia</label>
                  <input
                    type="text"
                    value={formData.jurisprudence}
                    onChange={e => setFormData({ ...formData, jurisprudence: e.target.value })}
                    className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-primary/20 text-sm p-3"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Link Video (YouTube)</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full bg-gray-50 border-gray-200 rounded-xl focus:ring-primary/20 text-sm p-3"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-slate-900 rounded-2xl font-bold hover:bg-gray-200 transition-all">Cancelar</button>
                <button type="submit" className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all">
                  {editingConcept ? 'Actualizar Concepto' : 'Guardar Concepto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Mass Upload */}
      {isMassUploadOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black">Carga Masiva</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Formato: CSV (separado por ;)</p>
              </div>
              <button onClick={() => setIsMassUploadOpen(false)} className="text-gray-400 hover:text-slate-900 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <textarea
                rows={10}
                placeholder="ID;Concepto;Categoría;Subcategoría;Definición;Ejemplo;Normativa;Jurisprudencia;Link"
                value={massData}
                onChange={e => setMassData(e.target.value)}
                className="w-full bg-gray-50 border-gray-100 rounded-2xl font-mono text-xs p-4 focus:ring-primary/20 custom-scrollbar"
              ></textarea>
              <div className="flex gap-4">
                <button onClick={() => setIsMassUploadOpen(false)} className="flex-1 py-4 bg-gray-100 text-slate-900 rounded-2xl font-bold hover:bg-gray-200 transition-all">Cancelar</button>
                <button onClick={handleMassUpload} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all">Procesar Datos</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
