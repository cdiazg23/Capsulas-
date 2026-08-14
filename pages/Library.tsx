import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useConcepts, useAuth } from '../contexts';
import { supabase } from '../lib/supabase';

const Library: React.FC = () => {
  const navigate = useNavigate();
  const { concepts } = useConcepts();
  const { user } = useAuth();
  const [savedConcepts, setSavedConcepts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    await fetchSavedConcepts();
    setLoading(false);
  };

  const fetchSavedConcepts = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('saved_concepts')
        .select('concept_id')
        .eq('user_id', user.id);

      if (data) setSavedConcepts(data.map(item => item.concept_id));
    } catch (error) {
      console.error('Error fetching saved concepts:', error);
    }
  };

  const toggleSave = async (conceptId: string) => {
    if (!user) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const isSaved = savedConcepts.includes(conceptId);

      if (isSaved) {
        // Remove from saved
        await supabase
          .from('saved_concepts')
          .delete()
          .eq('user_id', session.user.id)
          .eq('concept_id', conceptId);

        setSavedConcepts(prev => prev.filter(id => id !== conceptId));
      } else {
        // Add to saved
        await supabase
          .from('saved_concepts')
          .insert({
            user_id: session.user.id,
            concept_id: conceptId
          });

        setSavedConcepts(prev => [...prev, conceptId]);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const savedConceptsList = useMemo(() => {
    const list = concepts?.filter(c => savedConcepts.includes(c.id)) || [];
    if (!searchTerm.trim()) return list;

    const term = searchTerm.toLowerCase();
    return list.filter(c =>
      c.concept.toLowerCase().includes(term) ||
      c.subcategory.toLowerCase().includes(term) ||
      c.definitionSimple.toLowerCase().includes(term) ||
      c.category.toLowerCase().includes(term)
    );
  }, [concepts, savedConcepts, searchTerm]);

  const totalSaved = concepts?.filter(c => savedConcepts.includes(c.id)).length || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-bold">Cargando biblioteca...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <Helmet>
        <title>Mi Biblioteca | IurisAcademy</title>
        <meta name="description" content="Colección personalizada de conceptos legales guardados para consulta rápida y preparación de grado." />
      </Helmet>

      <div className="mb-10">
        <h1 className="text-4xl font-black mb-2 dark:text-white">Mi Biblioteca</h1>
        <p className="text-gray-500 dark:text-slate-400">
          Tus contenidos guardados para referencia rápida
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-start md:items-center">
        <div className="flex gap-4">
          <div className="px-6 py-2 rounded-xl text-xs font-black bg-primary text-white">
            Conceptos ({totalSaved})
          </div>
        </div>

        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
          <input
            type="text"
            placeholder="Buscar en mi biblioteca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-white"
          />
        </div>
      </div>

      {savedConceptsList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-16 text-center border border-gray-100 dark:border-slate-800">
          <span className="material-symbols-outlined text-8xl text-gray-200 dark:text-slate-800 mb-6 block">auto_stories</span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Tu biblioteca está vacía</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            Guarda tus conceptos favoritos para acceder a ellos rápidamente desde aquí
          </p>
          <button
            onClick={() => {
              navigate('/app/explorer');
              setSearchTerm('');
            }}
            className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            {searchTerm ? 'Limpiar Búsqueda' : 'Explorar Conceptos'}
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
              {savedConceptsList.length} {savedConceptsList.length === 1 ? 'concepto guardado' : 'conceptos guardados'}
            </p>
            <button
              onClick={() => navigate('/app/explorer')}
              className="text-sm font-bold text-primary hover:underline"
            >
              + Agregar más
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedConceptsList.map((concept) => (
              <div
                key={concept.id}
                className="group bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-2xl transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-8 -mt-8 rounded-full group-hover:scale-110 transition-transform"></div>

                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 rounded-lg bg-gray-50 dark:bg-slate-950 text-gray-400 dark:text-slate-500 text-[10px] font-bold tracking-widest uppercase border border-gray-100 dark:border-slate-800">
                    {concept.id}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(concept.id);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <span className="material-symbols-outlined text-xl text-red-500 fill-1">bookmark</span>
                  </button>
                </div>

                <h3
                  onClick={() => navigate(`/app/concept/${concept.id}`)}
                  className="text-xl font-bold mb-3 dark:text-white group-hover:text-primary transition-colors cursor-pointer"
                >
                  {concept.concept}
                </h3>

                <p className="text-sm text-gray-400 dark:text-slate-500 line-clamp-3 leading-relaxed mb-6">
                  {concept.definitionSimple}
                </p>

                <div className="flex items-center justify-between pt-5 border-t border-gray-50 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-wider">
                    {concept.subcategory}
                  </span>
                  <button
                    onClick={() => navigate(`/app/concept/${concept.id}`)}
                    className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Library;
