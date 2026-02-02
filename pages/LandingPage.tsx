
import React from 'react';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-primary size-10 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl">balance</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">LegalTech<span className="text-primary">Ed</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onLogin} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors px-4 py-2">Iniciar Sesión</button>
            <button onClick={onStart} className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">Comenzar Gratis</button>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24 overflow-hidden relative">
        <div className="absolute inset-0 z-0 bg-slate-50/50">
          <div className="absolute top-0 right-0 w-2/3 h-full bg-slate-100/40 transform -skew-x-12 translate-x-32"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-gold/10 text-accent-gold text-[13px] font-bold uppercase tracking-widest mb-8 border border-accent-gold/20">
                <span className="material-symbols-outlined text-sm">military_tech</span>
                Plataforma Académica Nº1 en Derecho
              </span>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                Domina el Derecho con <span className="text-primary italic">Inteligencia</span> y Gamificación
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed mb-12 max-w-2xl">
                Aprende conceptos legales de forma efectiva. Transformamos el rigor académico en una experiencia interactiva impulsada por IA para que alcances tu máximo potencial.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 mb-12">
                <button onClick={onStart} className="bg-primary text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Comenzar Gratis
                </button>
                <button className="flex items-center justify-center gap-2 border border-slate-200 bg-white px-10 py-5 rounded-2xl text-lg font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
                  <span className="material-symbols-outlined text-accent-gold">play_circle</span>
                  Ver Metodología
                </button>
              </div>
              <div className="flex items-center gap-6 p-4 bg-white/60 rounded-2xl border border-white max-w-max">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <img key={i} alt="Student" className="size-12 rounded-full border-4 border-white bg-slate-100 object-cover" src={`https://picsum.photos/seed/student${i}/100/100`} />
                  ))}
                  <div className="size-12 rounded-full border-4 border-white bg-accent-gold flex items-center justify-center text-white text-xs font-bold">+5k</div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Confiado por +5,000 alumnos</p>
                  <p className="text-xs text-slate-500 font-medium">De las mejores facultades de derecho</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="bg-primary/5 rounded-[3rem] p-4 shadow-2xl border border-white rotate-3">
                <img src="https://picsum.photos/seed/dashboard/800/1000" className="rounded-[2.5rem] w-full" alt="Product Mockup" />
              </div>
              <div className="absolute -top-10 -left-10 bg-white p-5 rounded-3xl shadow-2xl animate-bounce-slow border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined">trending_up</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">XP Ganada</p>
                    <p className="text-xl font-black text-slate-900">0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
