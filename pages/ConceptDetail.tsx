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

  const [isPlaying, setIsPlaying] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isMastered, setIsMastered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Find concept by ID
  const concept = concepts?.find(c => c.id === id);

  useEffect(() => {
    if (user && id) {
      checkIfSaved();
    }
  }, [user, id]);

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

  const getEmbedUrl = (url: string | undefined) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      let videoId = '';

      if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v') || '';
      } else if (urlObj.hostname === 'youtu.be') {
        videoId = urlObj.pathname.substring(1);
      }

      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
    } catch (e) {
      return url || '';
    }
  };

  const handleToggleMastery = () => {
    if (!isMastered) {
      addXP(50);
      incrementLearnedConcepts();
      setIsMastered(true);
    } else {
      setIsMastered(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'user') return;

    const today = new Date().toDateString();
    const lastDate = stats.lastConsultationAt ? new Date(stats.lastConsultationAt).toDateString() : '';

    let currentDaily = stats.consultationsToday;

    if (today !== lastDate) {
      currentDaily = 0;
    }

    if (currentDaily >= 10) {
      navigate('/pricing');
      return;
    }

    if (concept) {
      updateStats({
        consultationsToday: currentDaily + 1,
        consultationsMonth: stats.consultationsMonth + 1,
        lastConsultationAt: new Date().toISOString()
      });
    }
  }, [id, user?.role]);

  return (
    <div className="max-w-4xl mx-auto pb-32 animate-in fade-in zoom-in duration-300">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-400 dark:text-slate-500 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-slate-800">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">
              <span>{concept.category}</span>
              <span className="size-1 bg-gray-200 dark:bg-slate-800 rounded-full"></span>
              <span>{concept.subcategory}</span>
            </div>
            <h1 className="text-4xl font-black dark:text-white">{concept.concept}</h1>
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

          <div className="grid md:grid-cols-2 gap-6">
            <section className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-red-500 text-xl">scale</span>
                <h3 className="font-black uppercase tracking-widest text-xs dark:text-slate-400">Normativa (Chile)</h3>
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{concept.regulation}</p>
            </section>

            <section className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-purple-500 text-xl">balance</span>
                <h3 className="font-black uppercase tracking-widest text-xs dark:text-slate-400">Jurisprudencia</h3>
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{concept.jurisprudence}</p>
            </section>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-3">
            <div className="aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl relative group ring-8 ring-white dark:ring-slate-900">
              {isPlaying ? (
                <iframe
                  src={getEmbedUrl(concept.videoUrl)}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <>
                  <img
                    src={`https://picsum.photos/seed/${concept.id}/600/400`}
                    className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
                    alt="Video Thumbnail"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="size-16 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-4xl fill-1">play_arrow</span>
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                    <p className="text-white text-xs font-bold uppercase tracking-widest">Video Explicativo</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center justify-between px-4">
              <a
                href={concept.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-xs">link</span>
                Ver fuente en YouTube
              </a>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Uso Académico</span>
            </div>
          </div>

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
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl lg:left-[calc(50%+144px)] transition-all z-40">
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between gap-6">
          <div className="flex-1 hidden sm:block pl-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                Progreso del Concepto
              </span>
              <span className="text-xs font-black text-primary">{isMastered ? '100%' : '0%'}</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
              <div
                className={`h-full bg-primary transition-all duration-1000 ease-out ${isMastered ? 'w-full' : 'w-0'}`}
              />
            </div>
          </div>

          <button
            onClick={handleToggleMastery}
            className={`flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl text-sm font-black transition-all transform active:scale-95 shadow-lg ${isMastered
              ? 'bg-green-500 text-white shadow-green-500/20'
              : 'bg-primary text-white shadow-primary/30 hover:shadow-primary/50'
              }`}
          >
            <span className="material-symbols-outlined text-xl">{isMastered ? 'verified' : 'bolt'}</span>
            <span>{isMastered ? 'DOMINADO' : 'MARCAR COMO APRENDIDO'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConceptDetail;
