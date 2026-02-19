import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useConcepts, useStats, useAuth } from '../contexts';
import { supabase } from '../lib/supabase';
import Quiz from '../components/Quiz';

const ConceptDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { concepts } = useConcepts();
  const { stats, addXP, incrementLearnedConcepts, updateStats } = useStats();
  const { user } = useAuth();

  const [showQuiz, setShowQuiz] = useState(false);
  const [isMastered, setIsMastered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Find concept by ID
  const conceptIndex = concepts?.findIndex(c => c.id === id) ?? -1;
  const concept = concepts?.[conceptIndex];
  const prevConcept = conceptIndex > 0 ? concepts?.[conceptIndex - 1] : null;
  const nextConcept = concepts && conceptIndex < concepts.length - 1 ? concepts[conceptIndex + 1] : null;

  useEffect(() => {
    if (user && id) {
      checkIfSaved();
      checkIfMastered();
    }
  }, [user, id]);

  const checkIfMastered = async () => {
    if (!user || !id) return;
    try {
      const { data } = await supabase
        .from('user_mastery')
        .select('id')
        .eq('user_id', user.id)
        .eq('concept_id', id)
        .maybeSingle();

      setIsMastered(!!data);
    } catch (error) {
      console.error('Error checking mastery:', error);
    }
  };

  const checkIfSaved = async () => {
    if (!user || !id) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('saved_concepts')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('concept_id', id)
        .single();

      setIsSaved(!!data);
    } catch (error) {
      // Concept not saved, that's ok
    }
  };

  const toggleSave = async () => {
    if (!user || !id) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      if (isSaved) {
        await supabase
          .from('saved_concepts')
          .delete()
          .eq('user_id', session.user.id)
          .eq('concept_id', id);
        setIsSaved(false);
      } else {
        await supabase
          .from('saved_concepts')
          .insert({
            user_id: session.user.id,
            concept_id: id
          });
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  if (!concept) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-gray-200 dark:text-slate-800 mb-4">error</span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Concepto no encontrado</h2>
          <button
            onClick={() => navigate('/app/explorer')}
            className="mt-4 px-6 py-3 bg-primary text-white rounded-xl font-bold"
          >
            Volver al Explorer
          </button>
        </div>
      </div>
    );
  }

  const isFreeUser = user?.role !== 'founder' && user?.role !== 'admin';


  const handleToggleMastery = async () => {
    if (!user || !id) return;

    try {
      if (!isMastered) {
        setIsMastered(true); // Optimistic update
        addXP(50);
        incrementLearnedConcepts();
        triggerXPFeedback();

        const { error } = await supabase
          .from('user_mastery')
          .insert({
            user_id: user.id,
            concept_id: id
          });

        if (error) throw error;
      } else {
        setIsMastered(false);
        // Not reducing XP or concept count for consistency/simplicity unless asked
        await supabase
          .from('user_mastery')
          .delete()
          .eq('user_id', user.id)
          .eq('concept_id', id);
      }
    } catch (error) {
      console.error('Error toggling mastery:', error);
    }
  };

  const [showXPFeedback, setShowXPFeedback] = useState(false);
  const triggerXPFeedback = () => {
    setShowXPFeedback(true);
    setTimeout(() => setShowXPFeedback(false), 2000);
  };

  useEffect(() => {
    if (!user) return;

    const today = new Date().toDateString();
    const lastDate = stats.lastConsultationAt ? new Date(stats.lastConsultationAt).toDateString() : '';

    // Only "user" role has consultation limits
    if (user.role === 'user') {
      let currentDaily = stats.consultationsToday;

      if (today !== lastDate) {
        currentDaily = 0;
      }

      if (currentDaily >= 10) {
        navigate('/pricing');
        return;
      }

      updateStats({
        consultationsToday: currentDaily + 1,
        consultationsMonth: stats.consultationsMonth + 1,
        lastConsultationAt: new Date().toISOString()
      });
    } else {
      // Admins and Founders: Just update last activity for streak purposes
      // No need to update consultationsToday if they are unlimited
      if (today !== lastDate) {
        updateStats({
          lastConsultationAt: new Date().toISOString()
        });
      }
    }
  }, [id, user?.role]);

  return (
    <div className="max-w-4xl mx-auto pb-32 animate-in fade-in zoom-in duration-300 relative">
      {showXPFeedback && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none animate-in slide-in-from-bottom-8 fade-in duration-500">
          <div className="bg-primary text-white px-6 py-3 rounded-2xl font-black shadow-2xl flex items-center gap-3">
            <span className="material-symbols-outlined fill-1 animate-level-up">bolt</span>
            <span>+50 XP PRESTIGIO</span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-400 dark:text-slate-500 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-slate-800">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">
              <button
                onClick={() => navigate('/app/explorer')}
                className="hover:text-primary transition-colors"
              >
                Explorer
              </button>
              <span className="size-1 bg-gray-200 dark:bg-slate-800 rounded-full"></span>
              <button
                onClick={() => navigate(`/app/explorer/${encodeURIComponent(concept.category)}`)}
                className="hover:text-primary transition-colors"
              >
                {concept.category}
              </button>
              <span className="size-1 bg-gray-200 dark:bg-slate-800 rounded-full"></span>
              <span>{concept.subcategory}</span>
            </div>
            <h1 className="text-4xl font-black dark:text-white mt-1">{concept.concept}</h1>
          </div>
        </div>
        <button
          onClick={toggleSave}
          className={`p-3 rounded-xl transition-all ${isSaved
            ? 'bg-primary/10 text-primary'
            : 'bg-white dark:bg-slate-900 text-gray-400 border border-gray-100 dark:border-slate-800 hover:border-primary/50'
            }`}
          title={isSaved ? 'Guardado en biblioteca' : 'Guardar en biblioteca'}
        >
          <span className={`material-symbols-outlined ${isSaved ? 'fill-1' : ''}`}>bookmark</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <span className="material-symbols-outlined text-[80px] dark:text-white">gavel</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-2xl">menu_book</span>
              <h2 className="text-xl font-black uppercase tracking-tight dark:text-white">Definición "En Simple"</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed italic">
              "{concept.definitionSimple}"
            </p>
          </section>

          <section className="bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-900/30 p-8 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">analytics</span>
              <h2 className="text-xl font-black uppercase tracking-tight text-blue-900 dark:text-blue-200">Ejemplo Real</h2>
            </div>
            <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
              {concept.realExample}
            </p>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-red-500 text-xl">scale</span>
              <h3 className="font-black uppercase tracking-widest text-xs dark:text-slate-400">Normativa (Chile)</h3>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{concept.regulation}</p>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <section className="bg-slate-900 dark:bg-slate-800 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 size-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors"></div>

            <div className="flex items-center gap-3 mb-6 relative">
              <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">tips_and_updates</span>
              </div>
              <h2 className="text-lg font-black uppercase tracking-tight">Síntesis Técnica</h2>
            </div>

            <div className="space-y-4 relative">
              {concept.keyPoints && concept.keyPoints.length > 0 ? (
                concept.keyPoints.map((point, index) => (
                  <div key={index} className="flex gap-3 items-start group/item">
                    <span className="mt-1.5 size-1.5 rounded-full bg-primary flex-shrink-0 group-hover/item:scale-150 transition-transform"></span>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                      {point}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center opacity-40">
                  <span className="material-symbols-outlined text-4xl mb-2">construction</span>
                  <p className="text-xs font-bold uppercase tracking-widest">Contenido en proceso</p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 relative">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Dato Clave</p>
              <p className="text-xs text-primary font-bold">{concept.subcategory} es fundamental en {concept.category}</p>
            </div>
          </section>

          <div className="bg-accent-gold/5 dark:bg-accent-gold/10 border border-accent-gold/20 dark:border-accent-gold/30 rounded-[2rem] p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-xl bg-accent-gold/20 flex items-center justify-center text-accent-gold">
                <span className="material-symbols-outlined text-2xl">quiz</span>
              </div>
              <h3 className="font-black text-slate-900 dark:text-white">{isFreeUser ? 'Función Premium' : '¿Listo para el desafío?'}</h3>
            </div>
            {isFreeUser ? (
              <>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Los quizzes son exclusivos para socios fundadores. ¡Apoya el proyecto para desbloquear todo tu potencial!</p>
                <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-dashed border-accent-gold/50 text-center">
                  <span className="text-[10px] font-black text-accent-gold uppercase tracking-widest">Contenido Bloqueado</span>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Completa este concepto y gana 50 XP adicionales para subir al siguiente nivel.</p>
                <button
                  onClick={() => setShowQuiz(true)}
                  className="w-full py-3 bg-white dark:bg-slate-950 border border-accent-gold text-accent-gold font-bold text-sm rounded-xl hover:bg-accent-gold hover:text-white transition-all"
                >
                  Comenzar Quiz Express
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showQuiz && (
        <Quiz
          concept={concept}
          onClose={() => setShowQuiz(false)}
          onComplete={(xp) => {
            setShowQuiz(false);
            if (!isMastered) {
              handleToggleMastery();
            } else {
              addXP(xp / 2);
            }
          }}
        />
      )}

      {/* Floating Action Bar - Improved Layout */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-3xl lg:left-[calc(50%+144px)] transition-all z-40">
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 p-3 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between gap-4">

          <div className="flex items-center gap-2">
            <button
              onClick={() => prevConcept && navigate(`/app/concept/${prevConcept.id}`)}
              disabled={!prevConcept}
              className="size-12 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary disabled:opacity-30 disabled:hover:text-slate-400 transition-all border border-gray-100 dark:border-slate-700"
              title={prevConcept ? `Anterior: ${prevConcept.concept}` : 'No hay más conceptos'}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={() => nextConcept && navigate(`/app/concept/${nextConcept.id}`)}
              disabled={!nextConcept}
              className="size-12 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary disabled:opacity-30 disabled:hover:text-slate-400 transition-all border border-gray-100 dark:border-slate-700"
              title={nextConcept ? `Siguiente: ${nextConcept.concept}` : 'No hay más conceptos'}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          <div className="flex-1 hidden md:block px-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-primary">Progreso</span>
              <span className="text-[10px] font-black text-primary">{isMastered ? '100%' : '0%'}</span>
            </div>
            <div className="h-1 bg-gray-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
              <div className={`h-full bg-primary transition-all duration-1000 ${isMastered ? 'w-full' : 'w-0'}`} />
            </div>
          </div>

          <button
            onClick={handleToggleMastery}
            className={`flex items-center justify-center gap-3 px-6 py-3 rounded-2xl text-xs font-black transition-all transform active:scale-95 shadow-lg ${isMastered
              ? 'bg-green-500 text-white shadow-green-500/20'
              : 'bg-primary text-white shadow-primary/30 hover:shadow-primary/50'
              }`}
          >
            <span className="material-symbols-outlined text-lg">{isMastered ? 'verified' : 'bolt'}</span>
            <span className="hidden sm:inline">{isMastered ? 'DOMINADO' : 'MARCAR COMO APRENDIDO'}</span>
            <span className="sm:hidden">{isMastered ? 'OK' : 'LISTO'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConceptDetail;
