import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useConcepts } from '../contexts';

const HERO_BOT_PREVIEWS = [
  {
    question: "¿Cuáles son los requisitos de la Tradición en el Derecho Civil chileno?",
    regulation: "Art. 670 Código Civil",
    answer: "La **Tradición** es un modo de adquirir el dominio derivativo a título singular o universal. Exige la concurrencia copulativa de 4 requisitos:",
    keyPoints: [
      "Tradente dueño con facultad de transferir",
      "Adquirente con capacidad de goce y ejercicio",
      "Consentimiento libre de vicios de ambas partes",
      "Título translaticio de dominio válido (compraventa, donación)",
      "Entrega material o ficta de la cosa"
    ],
    conceptId: "CIV-002",
    conceptName: "Tradición"
  },
  {
    question: "¿Cuál es la diferencia dogmática entre Dolo y Culpa?",
    regulation: "Art. 44 Código Civil",
    answer: "El **dolo** consiste en la intención positiva de inferir injuria o daño a la persona o propiedad de otro. La **culpa** es la falta de diligencia o cuidado debido sin propósito malicioso.",
    keyPoints: [
      "Dolo: intencionalidad dañosa (no se gradúa)",
      "Culpa: negligencia (grave, leve, levísima)",
      "El dolo debe probarse salvo norma expresa",
      "La culpa contractual se presume"
    ],
    conceptId: "CIV-015",
    conceptName: "Dolo vs Culpa"
  },
  {
    question: "¿En qué consiste el Recurso de Apelación y sus plazos?",
    regulation: "Art. 186 y 189 CPC",
    answer: "Es un recurso ordinario interpuesto por la parte agraviada por una resolución judicial, con el objeto de que el tribunal superior jerárquico la enmiende conforme a derecho.",
    keyPoints: [
      "Plazo general: 5 días hábiles",
      "Plazo sentencias definitivas: 10 días",
      "Efectos: suspensivo y devolutivo",
      "Debe contener fundamentos de hecho y derecho"
    ],
    conceptId: "PROC-004",
    conceptName: "Recurso de Apelación"
  }
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeBotIndex, setActiveBotIndex] = useState(0);
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
        <meta name="description" content="La plataforma educativa definitiva para estudiantes y egresados de Derecho en Chile. Glosario dogmático, IurisBot con IA, flashcards y preparación de examen de grado." />
        <meta name="keywords" content="derecho, academia legal, examen de grado chile, iurisacademy, flashcards legales, iurisbot, codigo civil, cpc" />
      </Helmet>

      {/* Navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-6'} `}>
        <div className="max-w-7xl mx-auto px-6">
          <nav className={`flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-300 ${scrolled ? 'glass shadow-lg border-slate-200 bg-white/90 backdrop-blur-md' : 'bg-transparent border-transparent'} `}>
            <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-primary text-white size-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                <span className="material-symbols-outlined text-2xl">balance</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                Iuris<span className="text-primary">Academy</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#iurisbot" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">smart_toy</span>
                IurisBot IA
              </a>
              <button onClick={() => navigate('/pricing')} className="text-sm font-bold text-slate-600 hover:text-primary transition-colors flex items-center gap-1.5">
                <span className="material-symbols-outlined text-lg text-primary">credit_card</span>
                Planes
              </button>
              <a href="#ecosistema" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Ecosistema</a>
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
                    IurisBot IA Tutor Jurídico 24/7
                  </span>
                  <span className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="size-1.5 bg-emerald-500 rounded-full"></span>
                    Ecosistema Legal Seis · Por Carlos Díaz
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Section con IurisBot Showcase Interactivo */}
        <section className="relative pt-14 pb-24 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
              
              {/* Columna Izquierda: Mensaje Principal */}
              <div className="lg:col-span-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/15 mb-6">
                  <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
                  <span className="text-[11px] font-black text-primary uppercase tracking-wider">Tutor IA + 1,154 Conceptos Legales</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.08] mb-6 tracking-tight">
                  Domina tu Grado con <br />
                  <span className="text-primary italic">Inteligencia Artificial</span>
                </h1>

                <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
                  Accede a <strong>IurisBot</strong> (tu tutor jurídico 24/7), flashcards de repetición espaciada, jurisprudencia y cuestionarios diseñados para memorizar y razonar el Derecho en Chile.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
                  <button
                    onClick={() => navigate('/login', { state: { mode: 'signup' } })}
                    className="w-full sm:w-auto bg-primary text-white px-9 py-4 rounded-2xl text-base font-black shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-center"
                  >
                    Activar Prueba Gratis (3 Días)
                  </button>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="w-full sm:w-auto flex items-center justify-center gap-2.5 border-2 border-slate-200 px-8 py-4 rounded-2xl text-base font-bold text-slate-700 hover:bg-slate-50 transition-all group"
                  >
                    <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">credit_card</span>
                    Ver Planes
                  </button>
                </div>

                <div className="flex items-center gap-6 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-max">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/100?img=${i + 25}`} className="size-10 rounded-full border-2 border-white" alt="User" />
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Más de 14.000 estudiantes</p>
                    <p className="text-[11px] text-slate-500 font-medium">Comunidad activa de @capsulasdederecho</p>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Mockup Interactivo de IurisBot */}
              <div className="lg:col-span-6 relative">
                <div className="bg-slate-900 rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-slate-800 text-white relative overflow-hidden">
                  {/* Glow Effects */}
                  <div className="absolute -top-20 -right-20 size-56 bg-primary/25 rounded-full blur-[80px] pointer-events-none"></div>
                  <div className="absolute -bottom-20 -left-20 size-56 bg-accent-gold/15 rounded-full blur-[80px] pointer-events-none"></div>

                  {/* Header de IurisBot */}
                  <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-800 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="size-11 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/40 shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-2xl">smart_toy</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-white text-base tracking-tight">IurisBot PRO</span>
                          <span className="bg-primary/30 text-primary-light text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider border border-primary/40">TUTOR IA</span>
                        </div>
                        <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                          <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          Base dogmática chilena indexada
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-800/90 px-3 py-1 rounded-xl">Demo en Vivo</span>
                  </div>

                  {/* Selector de Consultas de Ejemplo */}
                  <div className="mb-5 relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5">Haz clic para probar una consulta:</p>
                    <div className="flex flex-wrap gap-2">
                      {HERO_BOT_PREVIEWS.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveBotIndex(idx)}
                          className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                            activeBotIndex === idx
                              ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-102'
                              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                          }`}
                        >
                          {item.conceptName}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Conversación Simulada */}
                  <div className="space-y-4 relative z-10">
                    {/* Pregunta del Usuario */}
                    <div className="flex justify-end">
                      <div className="bg-primary text-white text-xs md:text-sm font-semibold p-3.5 rounded-2xl rounded-tr-none max-w-[88%] shadow-md">
                        {HERO_BOT_PREVIEWS[activeBotIndex].question}
                      </div>
                    </div>

                    {/* Respuesta de IurisBot */}
                    <div className="flex justify-start">
                      <div className="bg-slate-800/95 border border-slate-700/80 text-slate-200 text-xs md:text-sm p-4 rounded-2xl rounded-tl-none max-w-[96%] space-y-2.5 shadow-xl backdrop-blur-sm">
                        <div className="flex items-center justify-between text-[11px] font-bold text-accent-gold border-b border-slate-700/60 pb-2">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">menu_book</span>
                            {HERO_BOT_PREVIEWS[activeBotIndex].regulation}
                          </span>
                          <span className="text-slate-400 text-[10px]">Derecho Chileno</span>
                        </div>

                        <p className="leading-relaxed text-slate-300">
                          {HERO_BOT_PREVIEWS[activeBotIndex].answer}
                        </p>

                        <div className="pt-2 border-t border-slate-700/40">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Requisitos / Elementos de Grado:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {HERO_BOT_PREVIEWS[activeBotIndex].keyPoints.map((pt, pIdx) => (
                              <div key={pIdx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                                <span className="material-symbols-outlined text-emerald-400 text-xs shrink-0">check_circle</span>
                                <span className="truncate">{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer de la Tarjeta */}
                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs relative z-10">
                    <span className="text-slate-400 text-[11px]">¿Tienes dudas de tus ramos?</span>
                    <button
                      onClick={() => navigate('/login', { state: { mode: 'signup' } })}
                      className="text-primary-light hover:text-white font-bold inline-flex items-center gap-1 text-[11px] uppercase tracking-wider hover:underline"
                    >
                      <span>Preguntarle a IurisBot</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Badge flotante inferior */}
                <div className="hidden sm:flex absolute -bottom-4 -left-4 bg-white text-slate-900 p-3.5 rounded-2xl shadow-xl border border-slate-100 items-center gap-3">
                  <div className="size-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">psychology</span>
                  </div>
                  <div>
                    <p className="text-xs font-black">RAG Jurídico Especializado</p>
                    <p className="text-[10px] text-slate-500">Respuestas fundamentadas con artículos</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Sección Especial: IurisBot PRO Tutor con IA */}
        <section id="iurisbot" className="py-24 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary-light text-xs font-black uppercase tracking-widest mb-4">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
                Inteligencia Artificial Especializada
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 tracking-tight">
                Conoce a <span className="text-primary italic">IurisBot PRO</span>
              </h2>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                Tu tutor jurídico disponible las 24 horas del día. Diseñado específicamente para resolver dudas dogmáticas, fundamentar con artículos del Código y prepararte para tus interrogaciones.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl hover:border-primary/50 transition-all group">
                <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Explicación Dogmática</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Desglosa instituciones complejas de Derecho Civil, Procesal y Constitucional en explicaciones claras y pedagógicas.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl hover:border-primary/50 transition-all group">
                <div className="size-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">menu_book</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Contexto Normativo</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Cita y conecta cada respuesta con los artículos vigentes de los Códigos de la República y la doctrina más respetada.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl hover:border-primary/50 transition-all group">
                <div className="size-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">touch_app</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Fichas en 1 Clic</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Genera accesos directos automáticos a las fichas completas, flashcards y resúmenes de cada concepto mencionado.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl hover:border-primary/50 transition-all group">
                <div className="size-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">record_voice_over</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Simulador de Grado</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Pídele que te interrogue o te plantee casos prácticos para medir tu dominio antes de rendir tu examen final.
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate('/login', { state: { mode: 'signup' } })}
                className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-base shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
              >
                <span>Probar IurisBot en la Prueba Gratuita</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Public Search Section */}
        <section className="py-24 bg-slate-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-4">Glosario Jurídico Chile</h2>
              <p className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Busca conceptos ahora</p>
              <p className="text-slate-500 max-w-2xl mx-auto">Prueba nuestro buscador gratuito. Accede a definiciones técnicas de más de 1,154 conceptos clave para tu carrera.</p>
            </div>

            <div className="max-w-3xl mx-auto mb-12">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary size-6 transition-colors flex items-center justify-center font-black">search</span>
                <input
                  type="text"
                  placeholder="Ej: Recurso de Casación, Dominio, Femicidio, Tradición..."
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
                  {['Tutor Jurídico IurisBot 24/7', 'Gamificación competitiva y rachas', 'Estadísticas de estudio personalizadas', 'Flashcards con repetición espaciada'].map((item, i) => (
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
                        { icon: 'smart_toy', title: 'IurisBot Consultado', detail: 'Tradición y Título' },
                        { icon: 'quiz', title: 'Quiz Completado', detail: 'Derecho Civil +60 XP' },
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
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
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
        </section>

        {/* Ecosistema Legal Seis */}
        <section id="ecosistema" className="py-20 bg-slate-900 text-white border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-primary text-xs font-black uppercase tracking-[0.3em] block mb-3">Suite LegalTech Chile</span>
              <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">El Ecosistema Legal Seis</h2>
              <p className="text-slate-400 text-base leading-relaxed">
                Herramientas creadas por <strong className="text-white">Carlos Díaz</strong> y diseñadas con la máxima rigurosidad jurídica para optimizar la consulta normativa y el estudio del Derecho.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-8 hover:border-primary/50 transition-all group flex flex-col justify-between">
                <div>
                  <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-2xl">menu_book</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Códigos de Chile</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    Consulta rápida de los 9 códigos de la República de Chile con snapshots oficiales LeyChile BCN y cuadernos organizados por materia.
                  </p>
                </div>
                <a
                  href="https://www.codigosdechile.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-black text-amber-400 hover:text-amber-300 uppercase tracking-wider"
                >
                  <span>Visitar codigosdechile.com</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>

              <div className="bg-primary/10 border-2 border-primary/40 rounded-3xl p-8 relative flex flex-col justify-between shadow-2xl shadow-primary/10">
                <div className="absolute -top-3 right-6 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow">
                  Estudio y Grado
                </div>
                <div>
                  <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
                    <span className="material-symbols-outlined text-2xl">school</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">IurisAcademy</h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    Plataforma inteligente de conceptos jurídicos, flashcards de repetición espaciada, jurisprudencia y preparación integral de examen de grado.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-xs font-black text-primary uppercase tracking-wider">
                  <span>Plataforma Actual</span>
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-8 hover:border-slate-500 transition-all group flex flex-col justify-between">
                <div>
                  <div className="size-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-2xl">balance</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Legal Seis</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    Matriz de innovación tecnológica y legal dedicada a democratizar y modernizar el ejercicio y estudio del Derecho.
                  </p>
                </div>
                <a
                  href="https://www.legalseis.cl"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-wider"
                >
                  <span>Conocer Legal Seis</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Legal Seis */}
        <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800 text-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 pb-12 border-b border-slate-800/80">
              {/* Brand & Slogan */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary text-white size-9 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-xl">balance</span>
                  </div>
                  <span className="text-xl font-black text-white tracking-tight">
                    Iuris<span className="text-primary">Academy</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Plataforma de educación e investigación jurídica integral para estudiantes y egresados de Derecho.
                </p>
                <div className="inline-block bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-300">
                  Producto de <strong className="text-white">Legal Seis</strong>
                </div>
              </div>

              {/* Dirección */}
              <div className="space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-white">Sede Central</p>
                <p className="text-xs text-slate-300 font-bold leading-relaxed">
                  Legal Seis · Edificio Amunátegui<br />
                  <span className="text-slate-400 font-normal">Rosa Rodríguez 1375, Oficina 511<br />Santiago Centro, Chile</span>
                </p>
              </div>

              {/* Contacto Directo */}
              <div className="space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-white">Contacto y Atención</p>
                <ul className="space-y-2 text-xs">
                  <li>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">Teléfono</span>
                    <a href="tel:+56224229863" className="text-slate-300 hover:text-primary transition-colors font-medium">2 2422 9863</a>
                  </li>
                  <li>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">Email de Atención</span>
                    <a href="mailto:contacto@legalseis.cl" className="text-slate-300 hover:text-primary transition-colors font-medium">contacto@legalseis.cl</a>
                  </li>
                  <li>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">Sitio Institucional</span>
                    <a href="https://www.legalseis.cl" target="_blank" rel="noreferrer" className="text-primary hover:underline font-bold inline-flex items-center gap-1">
                      www.legalseis.cl <span className="material-symbols-outlined text-xs">open_in_new</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Ecosistema y Enlaces */}
              <div className="space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-white">Ecosistema & Legal</p>
                <ul className="space-y-2 text-xs">
                  <li>
                    <a href="https://www.codigosdechile.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
                      <span>Códigos de Chile</span>
                      <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.tiktok.com/@capsulasdederecho" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
                      <span>Comunidad @capsulasdederecho</span>
                      <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                    </a>
                  </li>
                  <li>
                    <button onClick={() => navigate('/pricing')} className="hover:text-primary transition-colors">Planes y Precios</button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/terms')} className="hover:text-primary transition-colors">Términos y Condiciones</button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/contact')} className="hover:text-primary transition-colors">Mesa de Ayuda</button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
              <p className="text-[11px] text-slate-500 max-w-xl text-center md:text-left leading-relaxed">
                Herramienta pedagógica independiente de estudio y consulta jurídica. No reemplaza la publicación oficial ni constituye asesoría legal formal.
              </p>
              <div className="text-center md:text-right shrink-0">
                <p className="font-bold text-slate-300 mb-0.5">Desarrollado por Carlos Díaz.</p>
                <p className="text-[10px] text-slate-600">© 2026 Legal Seis. Todos los derechos reservados.</p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
