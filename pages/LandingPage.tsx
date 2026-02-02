
import React, { useEffect, useState } from 'react';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
  onViewPricing: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin, onViewPricing }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-primary/20">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>

      {/* Navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <nav className={`flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-300 ${scrolled ? 'glass shadow-lg border-slate-200' : 'bg-transparent border-transparent'}`}>
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-primary text-white size-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                <span className="material-symbols-outlined text-2xl">balance</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                Iuris<span className="text-primary">Academy</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={onViewPricing} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-accent-gold">favorite</span>
                Apoyar Proyecto
              </button>
              <a href="#comunidad" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Comunidad</a>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={onLogin} className="hidden sm:block text-sm font-bold text-slate-700 hover:bg-slate-100 px-5 py-2.5 rounded-xl transition-all">
                Iniciar Sesión
              </button>
              <button onClick={onStart} className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all">
                Prueba Gratis
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Banner TikTok / Comunidad */}
        <div className="pt-24 md:pt-32">
          <div className="bg-slate-900 overflow-hidden py-3 relative">
            <div className="flex whitespace-nowrap animate-scroll">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="flex items-center gap-8 mx-4">
                  <span className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="size-1.5 bg-accent-gold rounded-full"></span>
                    Únete a los +14k de @capsulasdederecho
                  </span>
                  <span className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="size-1.5 bg-primary rounded-full"></span>
                    Educación Legal Independiente
                  </span>
                  <span className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="size-1.5 bg-emerald-500 rounded-full"></span>
                    IA Hecha por Abogados para Estudiantes
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Section Re-diseñado */}
        <section className="relative pt-16 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-gold/5 border border-accent-gold/10 mb-8">
                  <span className="material-symbols-outlined text-sm text-accent-gold">volunteer_activism</span>
                  <span className="text-[12px] font-bold text-accent-gold uppercase tracking-wider">Proyecto 100% Independiente</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] mb-8">
                  Aprende Derecho <br />
                  <span className="text-primary italic">Impulsado por ti</span>
                </h1>

                <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-xl">
                  IurisAcademy no es una gran corporación. Somos una comunidad. Tu apoyo nos permite mantener los servidores, mejorar nuestra IA y mantener la educación legal accesible para todos.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                  <button onClick={onStart} className="w-full sm:w-auto bg-primary text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all">
                    Empezar a Estudiar
                  </button>
                  <button onClick={onViewPricing} className="w-full sm:w-auto flex items-center justify-center gap-3 border-2 border-slate-200 px-10 py-5 rounded-2xl text-lg font-bold text-slate-700 hover:bg-slate-50 transition-all group">
                    <span className="material-symbols-outlined text-accent-gold group-hover:scale-125 transition-transform">favorite</span>
                    Apoyar Proyecto
                  </button>
                </div>

                <div className="flex items-center gap-6 p-4 bg-white/60 rounded-2xl border border-white max-w-max">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/100?img=${i + 20}`} className="size-10 rounded-full border-2 border-white" alt="User" />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Impulsado por la comunidad</p>
                    <p className="text-xs text-slate-500">Sé parte de los socios fundadores</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white p-4 rounded-[3rem] shadow-2xl border border-white rotate-2 animate-float">
                  <img
                    src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800"
                    className="rounded-[2.5rem] w-full object-cover h-[500px]"
                    alt="Law Student"
                  />

                  {/* Floating Message */}
                  <div className="absolute top-10 -right-6 glass p-5 rounded-3xl shadow-xl border border-white max-w-[220px]">
                    <div className="flex gap-3">
                      <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-xl">chat</span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 leading-tight">
                        "Gracias por el aporte de hoy, ¡hemos subido 50 conceptos más!"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Propósito */}
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary rounded-full blur-[120px]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <h2 className="text-accent-gold font-bold uppercase tracking-[0.2em] text-sm mb-6">Nuestro Compromiso</h2>
            <h3 className="text-4xl md:text-5xl font-black mb-16">Transparencia y Crecimiento</h3>

            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <div className="text-primary text-5xl mb-6 flex justify-center">
                  <span className="material-symbols-outlined text-6xl">storage</span>
                </div>
                <h4 className="text-xl font-bold mb-4">Servidores e IA</h4>
                <p className="text-slate-400 leading-relaxed">Las donaciones cubren los costos operativos de mantener nuestra IA inteligente y rápida 24/7.</p>
              </div>
              <div>
                <div className="text-primary text-5xl mb-6 flex justify-center">
                  <span className="material-symbols-outlined text-6xl">school</span>
                </div>
                <h4 className="text-xl font-bold mb-4">Contenido Gratuito</h4>
                <p className="text-slate-400 leading-relaxed">Tu apoyo permite que miles de estudiantes accedan al glosario jurídico sin costo.</p>
              </div>
              <div>
                <div className="text-primary text-5xl mb-6 flex justify-center">
                  <span className="material-symbols-outlined text-6xl">update</span>
                </div>
                <h4 className="text-xl font-bold mb-4">Escalabilidad</h4>
                <p className="text-slate-400 leading-relaxed">Cada café en Ko-fi se traduce en nuevas funcionalidades para preparar tu grado.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA TikTok / Comunidad */}
        <section id="comunidad" className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="size-16 bg-slate-900 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-3xl">brand_awareness</span>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-900">@capsulasdederecho</h4>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Aprende derecho en 60 segundos</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm">
                      <span className="font-bold text-slate-700">Seguidores TikTok</span>
                      <span className="text-primary font-black text-xl">14.2k</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed italic">
                      "IurisAcademy nace de la necesidad de mis seguidores de tener una herramienta real y potente para estudiar, más allá de los videos cortos."
                    </p>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-4">Únete a la Revolución</h2>
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-8">De TikTok a tu Escritorio</h3>
                <p className="text-xl text-slate-600 leading-relaxed mb-10">
                  Lo que empezó como cápsulas informativas hoy es una plataforma completa. Al donar, no solo pagas un servidor; estás validando que la educación legal puede ser diferente.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://ko-fi.com/capsulasdederecho" target="_blank" className="bg-[#13c3ff] text-white px-8 py-4 rounded-2xl font-bold text-center shadow-lg shadow-blue-200">Visitar mi Ko-fi</a>
                  <button onClick={onStart} className="text-slate-900 px-8 py-4 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all text-center">Registrarme Gratis</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-50 py-16 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="material-symbols-outlined text-primary text-3xl">balance</span>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">IurisAcademy</span>
            </div>
            <p className="text-slate-500 text-sm max-w-lg mx-auto mb-8">
              Un proyecto creado con ❤️ para la comunidad de derecho en Chile y Latinoamérica.
            </p>
            <div className="flex justify-center gap-6 text-slate-400 mb-8">
              <a href="https://www.tiktok.com/@capsulasdederecho" target="_blank" className="hover:text-primary transition-colors flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined">brand_awareness</span>
                TikTok @capsulasdederecho
              </a>
            </div>
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
              © 2025 Capsulas de Derecho. Todos los derechos reservados.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
