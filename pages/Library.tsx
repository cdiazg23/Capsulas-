import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConcepts, useAuth } from '../contexts';
import { supabase } from '../lib/supabase';

const Library: React.FC = () => {
  const navigate = useNavigate();
  const { concepts } = useConcepts();
  const { user } = useAuth();
  const [savedConcepts, setSavedConcepts] = useState<string[]>([]);
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'concepts' | 'jurisprudence'>('concepts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      fetchSavedConcepts(),
      fetchSavedReports()
    ]);
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

  const fetchSavedReports = async () => {
    if (!user || (user.role !== 'founder' && user.role !== 'admin')) return;
    try {
      const { data, error } = await supabase
        .from('saved_revised_jurisprudence')
        .select('*, report:revised_jurisprudence(*)')
        .eq('user_id', user.id);

      if (error) throw error;
      if (data) setSavedReports(data.map(item => item.report));
    } catch (error) {
      console.error('Error fetching saved reports:', error);
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

  const savedConceptsList = concepts?.filter(c => savedConcepts.includes(c.id)) || [];

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
      <div className="mb-10">
        <h1 className="text-4xl font-black mb-2 dark:text-white">Mi Biblioteca</h1>
        <p className="text-gray-500 dark:text-slate-400">
          Tus contenidos guardados para referencia rápida
        </p>
      </div>

      {(user?.role === 'founder' || user?.role === 'admin') && (
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('concepts')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'concepts' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            Conceptos ({savedConceptsList.length})
          </button>
          <button
            onClick={() => setActiveTab('jurisprudence')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'jurisprudence' ? 'bg-amber-500 text-white' : 'bg-white dark:bg-slate-900 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            Jurisprudencia Pro ({savedReports.length})
          </button>
        </div>
      )}

      {activeTab === 'concepts' ? (
        savedConceptsList.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-16 text-center border border-gray-100 dark:border-slate-800">
            <span className="material-symbols-outlined text-8xl text-gray-200 dark:text-slate-800 mb-6 block">auto_stories</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Tu biblioteca está vacía</h2>
            <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Guarda tus conceptos favoritos para acceder a ellos rápidamente desde aquí
            </p>
            <button
              onClick={() => navigate('/app/explorer')}
              className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
            >
              Explorar Conceptos
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
        )
      ) : (
        savedReports.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-16 text-center border border-gray-100 dark:border-slate-800">
            <span className="material-symbols-outlined text-8xl text-amber-200 dark:text-slate-800 mb-6 block">fact_check</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No hay informes guardados</h2>
            <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Guarda informes de Jurisprudencia Pro para verlos aquí rápidamente.
            </p>
            <button
              onClick={() => navigate('/app/revised-jurisprudence')}
              className="px-8 py-4 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
            >
              Ir a Jurisprudencia Pro
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedReports.map((report) => (
              <div
                key={report.id}
                className="group bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 hover:border-amber-500/30 hover:shadow-2xl transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 -mr-8 -mt-8 rounded-full group-hover:scale-110 transition-transform"></div>

                <div className="flex justify-between items-start mb-4">
                  <div className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <span className="material-symbols-outlined text-lg">gavel</span>
                  </div>
                  <button
                    onClick={async () => {
                      await supabase
                        .from('saved_revised_jurisprudence')
                        .delete()
                        .eq('user_id', user!.id)
                        .eq('report_id', report.id);
                      setSavedReports(prev => prev.filter(r => r.id !== report.id));
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <span className="material-symbols-outlined text-xl text-amber-500 fill-1">bookmark</span>
                  </button>
                </div>

                <h3
                  onClick={() => navigate('/app/revised-jurisprudence')}
                  className="text-xl font-bold mb-3 dark:text-white group-hover:text-amber-600 transition-colors cursor-pointer"
                >
                  {report.concept_name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-4 leading-relaxed mb-6 italic">
                  "{report.report}"
                </p>

                <div className="flex items-center justify-between pt-5 border-t border-gray-50 dark:border-slate-800">
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
                    Informe Revisado
                  </span>
                  <button
                    onClick={() => navigate('/app/revised-jurisprudence')}
                    className="text-amber-500 hover:bg-amber-500/10 p-2 rounded-lg transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Library;
