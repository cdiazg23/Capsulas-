
import React, { useState } from 'react';
import { LegalConcept, UserStats } from '../types';
import Quiz from '../components/Quiz';

interface ConceptDetailProps {
  concept: LegalConcept;
  onBack: () => void;
  stats: UserStats;
  onUpdateStats: (update: Partial<UserStats>) => void;
  isMastered: boolean;
  onToggleMastery: () => void;
}

const ConceptDetail: React.FC<ConceptDetailProps> = ({ concept, onBack, stats, onUpdateStats, isMastered, onToggleMastery }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const getEmbedUrl = (url: string) => {
    // ... logic remains same
    if (!url) return '';
    let videoId = '';
    if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 animate-in fade-in zoom-in duration-300">
      {/* ... header logic remains same */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 text-gray-400 dark:text-slate-500 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-slate-800">
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
              <h3 className="font-black text-slate-900 dark:text-white">¿Listo para el desafío?</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Completa este concepto y gana 50 XP adicionales para subir al siguiente nivel.</p>
            <button
              onClick={() => setShowQuiz(true)}
              className="w-full py-3 bg-white dark:bg-slate-950 border border-accent-gold text-accent-gold font-bold text-sm rounded-xl hover:bg-accent-gold hover:text-white transition-all"
            >
              Comenzar Quiz Express
            </button>
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
              onToggleMastery(); // This now handles XP and state internally in App.tsx
            } else {
              onUpdateStats({ xp: xp / 2, points: xp / 2 });
            }
          }}
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-slate-800 p-4 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:flex flex-col">
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full bg-primary transition-all duration-1000 ${isMastered ? 'w-full' : 'w-0'}`}></div>
              </div>
              <span className="text-xs font-bold text-primary">{isMastered ? '100%' : '0%'} Completado</span>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">
              {isMastered ? 'Concepto dominado' : `Iniciando dominio de ${concept.category}`}
            </p>
          </div>

          <button
            onClick={onToggleMastery}
            className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 rounded-2xl text-base font-black transition-all shadow-xl transform active:scale-95 ${isMastered
              ? 'bg-green-500 text-white shadow-green-500/20'
              : 'bg-primary text-white shadow-primary/30 hover:bg-primary-dark'
              }`}
          >
            <span className="material-symbols-outlined text-2xl">{isMastered ? 'verified' : 'task_alt'}</span>
            {isMastered ? 'CONCEPTO DOMINADO' : 'MARCAR COMO APRENDIDO'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConceptDetail;
