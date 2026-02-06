import React from 'react';
import { useNavigate } from 'react-router-dom';

const Pricing: React.FC = () => {
    const navigate = useNavigate();
    const kofiUrl = "https://ko-fi.com/capsulasdederecho";

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-primary mb-12 transition-colors font-bold group"
                >
                    <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Volver
                </button>

                <div className="text-center mb-10 md:mb-20">
                    <h1 className="text-2xl md:text-5xl font-black text-slate-900 mb-6">Impulsa tu carrera, <br /><span className="text-primary italic">apoya la educación</span></h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        IurisAcademy es un proyecto independiente. Tu apoyo nos permite mantener los servidores, mejorar la IA y llegar a más estudiantes.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-stretch">
                    {/* Plan Gratis */}
                    <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col">
                        <div className="mb-8">
                            <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Marcha Blanca</span>
                            <h3 className="text-2xl font-black text-slate-900 mt-4">Comunidad</h3>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-4xl font-black text-slate-900">$0</span>
                                <span className="text-slate-400 font-bold">/siempre</span>
                            </div>
                        </div>

                        <p className="text-slate-600 leading-relaxed mb-10 text-sm">
                            Acceso completo al glosario y todas las funciones principales. Perfecto para empezar a estudiar derecho hoy mismo.
                        </p>

                        <ul className="space-y-4 mb-12">
                            {['10 Consultas Diarias', 'Glosario Completo de Conceptos Legales', 'Sistema de XP, Niveles y Logros', 'Búsqueda Avanzada', 'Modo Estudio', 'Dark Mode'].map((feature) => (
                                <li key={feature} className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
                                    <span className="text-slate-700 text-sm font-medium">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => navigate('/login')}
                            className="mt-auto w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                        >
                            Empezar Gratis
                        </button>
                    </div>

                    {/* Plan Founder */}
                    <div className="gradient-primary text-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-primary/20 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-gold/20 rounded-full blur-[80px] -ml-24 -mb-24"></div>

                        <div className="relative z-10">
                            <span className="bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Socio Fundador</span>
                            <h3 className="text-2xl font-black mt-4">Founder</h3>
                            <div className="flex flex-col mt-2">
                                <span className="text-4xl font-black">Dona lo que quieras</span>
                                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-accent-gold text-white rounded-xl text-[10px] font-black uppercase tracking-widest w-fit animate-pulse shadow-lg shadow-accent-gold/20">
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    Cualquier monto = 3 meses Founder
                                </div>
                            </div>
                        </div>

                        <p className="text-white/90 leading-relaxed mb-10 text-sm relative z-10 mt-6">
                            Tu aporte mantiene IurisAcademy independiente. Cualquier donación te otorga 3 meses de acceso completo a todas las funciones Premium y el estatus de Socio Fundador.
                        </p>

                        <ul className="space-y-4 mb-12 relative z-10">
                            {[
                                'Acceso y Consultas Ilimitadas',
                                'Todo lo de Comunidad',
                                'Badge especial "Founder" en tu perfil',
                                'Acceso a funciones experimentales',
                                'Agradecimiento en la sección Comunidad',
                                'Voto en prioridad de nuevas features'
                            ].map((feature) => (
                                <li key={feature} className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-accent-gold text-lg mt-0.5">star</span>
                                    <span className="text-white/90 text-sm font-medium">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <a
                            href={kofiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto w-full py-4 bg-white text-primary rounded-2xl font-black text-lg text-center hover:shadow-2xl transition-all relative z-10"
                        >
                            Donar en Ko-fi ☕
                        </a>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-sm text-slate-500 font-medium mb-4">
                        ¿Tienes dudas? Encuentra más información en nuestra{' '}
                        <button className="text-primary font-bold hover:underline">página de inicio</button>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
