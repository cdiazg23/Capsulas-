import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useConcepts } from '../contexts';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { concepts } = useConcepts();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-primary/10 selection:text-primary">
      <Helmet>
        <title>IurisAcademy | Domina el Derecho con Inteligencia Artificial</title>
        <meta name="description" content="La plataforma educativa definitiva para estudiantes de Derecho. Domina conceptos legales con gamificación, flashcards y resúmenes técnicos." />
        <meta name="keywords" content="derecho, academia legal, estudio juridico, chile, iurisacademy, flashcards legales" />
      </Helmet>

      {/* Navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-6'} `}>
        <div className="max-w-7xl mx-auto px-6">
          <nav className={`flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-300 ${scrolled ? 'glass shadow-lg border-slate-200' : 'bg-transparent border-transparent'} `}>
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-primary text-white size-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                <span className="material-symbols-outlined text-2xl">balance</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                Iuris<span className="text-primary">Academy</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => navigate('/pricing')} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-primary">credit_card</span>
                Ver Planes
              </button>
              <a href="#comunidad" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Comunidad</a>
            </div>


            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/login')} className="hidden sm:block text-sm font-bold text-slate-700 hover:bg-slate-100 px-5 py-2.5 rounded-xl transition-all">
                Iniciar Sesión
              </button>
              <button
                onClick={() => navigate('/login', { state: { mode: 'signup' } })}
                className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
              >
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
                    Academia Legal 2.0
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

        {/* Hero Section */}
        <section className="relative pt-16 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-8">
                  <span className="material-symbols-outlined text-sm text-primary">verified</span>
                  <span className="text-[12px] font-bold text-primary uppercase tracking-wider">Acceso Premium Ilimitado</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] mb-8">
                  Prueba IurisAcademy <br />
                  <span className="text-primary italic">Gratis por 3 días</span>
                </h1>

                <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-xl">
                  Accede sin límites a materias, biblioteca, flashcards, aula y comunidad en una sola plataforma diseñada para dominar el Derecho.
                </p>


                <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                  <button
                    onClick={() => navigate('/login', { state: { mode: 'signup' } })}
                    className="group relative bg-primary text-white px-10 py-5 rounded-[2rem] text-lg font-black shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all overflow-hidden"
                  >
                    Activar Prueba Gratis
                  </button>
                  <button onClick={() => navigate('/pricing')} className="w-full sm:w-auto flex items-center justify-center gap-3 border-2 border-slate-200 px-10 py-5 rounded-2xl text-lg font-bold text-slate-700 hover:bg-slate-50 transition-all group">
                    <span className="material-symbols-outlined text-primary group-hover:scale-125 transition-transform">credit_card</span>
                    Ver Planes
                  </button>
                </div>


                <div className="flex items-center gap-6 p-4 bg-white/60 rounded-2xl border border-white max-w-max">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/100?img=${i + 20}`} className="size-10 rounded-full border-2 border-white" alt="User" />
                    ))}
                  </div >
                  <div>
                    <p className="text-sm font-bold text-slate-900">100% de los módulos abiertos</p>
                    <p className="text-xs text-slate-500">Únete a cientos de estudiantes premium</p>
                  </div>
                </div >

              </div >

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
                        "El Glosario me salvó en el examen de Civil, ¡lo recomiendo 100%!"
                      </p>

                    </div>
                  </div>
                </div>
              </div>
            </div >
          </div >
        </section >

        {/* Public Search Section */}
        <section className="py-24 bg-slate-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-4">Glosario Jurídico Chile</h2>
              <p className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Busca conceptos ahora</p>
              <p className="text-slate-500 max-w-2xl mx-auto">Prueba nuestro buscador gratuito. Accede a definiciones técnicas de más de 1,100 conceptos clave para tu carrera.</p>
            </div>

            <div className="max-w-3xl mx-auto mb-12">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary size-6 transition-colors flex items-center justify-center font-black">search</span>
                <input
                  type="text"
                  placeholder="Ej: Recurso de Casación, Dominio, Femicidio..."
                  className="w-full h-18 pl-14 pr-6 bg-white border-2 border-slate-100 rounded-[2rem] focus:border-primary focus:ring-4 focus:ring-primary/10 text-lg shadow-xl shadow-slate-200/50 transition-all outline-none"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                />
              </div>
            </div>

            {searchTerm.length > 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {concepts
                  .filter(c =>
                    c.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.id.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .slice(0, 6)
                  .map(concept => (
                    <div
                      key={concept.id}
                      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all cursor-pointer group"
                      onClick={() => navigate('/login')}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-2 py-1 rounded bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-wider">{concept.id}</span>
                        <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">lock</span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mb-2 group-hover:text-primary transition-colors">{concept.concept}</h4>
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">{concept.definitionSimple}</p>
                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{concept.category}</span>
                        <div className="flex items-center gap-1 text-primary text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                          Ver más
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </div>
                      </div>
                    </div>
                  ))}
                {concepts.filter(c =>
                  c.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  c.id.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                    <div className="col-span-full text-center py-10">
                      <p className="text-slate-400 font-bold">No encontramos ese concepto, prueba con otro.</p>
                    </div>
                  )}
              </div>
            )}

            <div className="mt-12 text-center">
              <button
                onClick={() => navigate('/login', { state: { mode: 'signup' } })}
                className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] hover:gap-4 transition-all"
              >
                Registrarme para ver los 1,154 conceptos completos
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Real App Preview (Simulated Screenshot) */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-4">Experiencia Premium</h2>
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-8">Diseñado para la alta productividad</h3>
                <p className="text-lg text-slate-600 mb-8">
                  No es solo una lista de términos. Es un ecosistema completo con niveles, XP, y seguimiento de progreso diseñado por abogados para el ritmo de estudio actual.
                </p>
                <ul className="space-y-4 mb-10">
                  {['Gamificación competitiva', 'Estadísticas de estudio personalizadas', 'Flashcards interactivas', 'Acceso a Masterclasses exclusivas'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative">
                {/* Simulated App Dashboard */}
                <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200 p-2 shadow-2xl overflow-hidden shadow-primary/10">
                  <div className="bg-white rounded-[2rem] p-6 shadow-inner min-h-[400px]">
                    <div className="flex justify-between items-center mb-8">
                      <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-sm">grid_view</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="size-2 bg-slate-200 rounded-full"></div>
                        <div className="size-2 bg-slate-200 rounded-full"></div>
                        <div className="size-2 bg-slate-200 rounded-full"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Tu Nivel</p>
                        <p className="text-xl font-black text-slate-900">Nivel 8</p>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
                          <div className="bg-primary w-2/3 h-full rounded-full"></div>
                        </div>
                      </div>
                      <div className="p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
                        <p className="text-[8px] font-black text-white/60 uppercase tracking-widest mb-1">Prestigio</p>
                        <p className="text-xl font-black">2,450 XP</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Actividad Reciente</p>
                      {[
                        { icon: 'task_alt', title: 'Concepto Dominado', detail: 'Recurso de Queja' },
                        { icon: 'quiz', title: 'Quiz Completado', detail: 'Derecho Civil +50 XP' },
                        { icon: 'grade', title: 'Nueva Insignia', detail: 'Constitucionalista Jr.' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-50 rounded-xl shadow-sm">
                          <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-sm">{item.icon}</span>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-900 leading-none mb-1">{item.title}</p>
                            <p className="text-[9px] text-slate-400">{item.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tooltip Overlay */}
                <div className="absolute -bottom-6 -left-6 bg-primary text-white p-4 rounded-3xl shadow-xl animate-float">
                  <p className="text-xs font-black uppercase tracking-widest">Acceso Inmediato</p>
                  <p className="text-[10px] font-medium opacity-80">3 días de prueba full sin compromiso</p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Sección de Beneficios Detallada */}
        < section className="py-24 bg-slate-900 text-white relative overflow-hidden" >
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary rounded-full blur-[120px]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <h2 className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-6">Experiencia de Estudio Completa</h2>
            <h3 className="text-4xl md:text-5xl font-black mb-16">Todo lo que necesitas en un solo lugar</h3>

            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <div className="text-primary text-5xl mb-6 flex justify-center">
                  <span className="material-symbols-outlined text-6xl">library_books</span>
                </div>
                <h4 className="text-xl font-bold mb-4">Módulos Jurídicos</h4>
                <p className="text-slate-400 leading-relaxed">Taxonomía jurídica ordenada por materias: Civil, Procesal, Constitucional y más.</p>
              </div>
              <div>
                <div className="text-primary text-5xl mb-6 flex justify-center">
                  <span className="material-symbols-outlined text-6xl">style</span>
                </div>
                <h4 className="text-xl font-bold mb-4">Flashcards IA</h4>
                <p className="text-slate-400 leading-relaxed">Memoriza conceptos clave con nuestro sistema de repetición espaciada inteligente.</p>
              </div>
              <div>
                <div className="text-primary text-5xl mb-6 flex justify-center">
                  <span className="material-symbols-outlined text-6xl">forum</span>
                </div>
                <h4 className="text-xl font-bold mb-4">Comunidad Exclusiva</h4>
                <p className="text-slate-400 leading-relaxed">Resuelve dudas y conecta con otros estudiantes en un entorno académico moderado.</p>
              </div>
            </div>
          </div>
        </section >


        {/* CTA TikTok / Comunidad */}
        < section id="comunidad" className="py-32 bg-white" >
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
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-8">De TikTok a tu Grado</h3>
                <p className="text-xl text-slate-600 leading-relaxed mb-10">
                  Lo que empezó como cápsulas informativas hoy es una plataforma completa. Únete a la comunidad líder en preparación jurídica en Chile.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => navigate('/login', { state: { mode: 'signup' } })} className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-center shadow-lg shadow-primary/20 hover:scale-105 transition-all">Empezar Prueba Gratis</button>
                  <button onClick={() => navigate('/login')} className="text-slate-900 px-8 py-4 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all text-center">Acceso Miembros</button>
                </div>

              </div>
            </div>
          </div>
        </section >

        {/* Footer */}
        < footer className="bg-slate-50 py-16 border-t border-slate-100" >
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="material-symbols-outlined text-primary text-3xl">balance</span>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">IurisAcademy</span>
            </div>
            <p className="text-slate-500 text-sm max-w-lg mx-auto mb-8">
              La plataforma definitiva para el estudio del Derecho en Chile.
            </p>

            <div className="flex justify-center gap-6 text-slate-400 mb-8 font-bold text-xs uppercase tracking-widest">
              <a href="https://www.tiktok.com/@capsulasdederecho" target="_blank" className="hover:text-primary transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">brand_awareness</span>
                TikTok
              </a>
              <button onClick={() => navigate('/terms')} className="hover:text-primary transition-colors">
                Términos y Condiciones
              </button>
            </div>
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
              © 2026 Capsulas de Derecho. Todos los derechos reservados.
            </div>
          </div>
        </footer >
      </main >
    </div >
  );
};

export default LandingPage;
