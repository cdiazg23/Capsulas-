
import React from 'react';

interface PricingPageProps {
    onBack?: () => void;
    onSelectFree: () => void;
}

const Pricing: React.FC<PricingPageProps> = ({ onBack, onSelectFree }) => {
    const kofiUrl = "https://ko-fi.com/capsulasdederecho";

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <div className="max-w-5xl mx-auto">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-500 hover:text-primary mb-12 transition-colors font-bold group"
                    >
                        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        Volver
                    </button>
                )}

                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Impulsa tu carrera, <br /><span className="text-primary italic">apoya la educación</span></h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        IurisAcademy es un proyecto independiente. Tu apoyo nos permite mantener los servidores, mejorar la IA y llegar a más estudiantes.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-stretch">
                    {/* Plan Gratis */}
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col">
                        <div className="mb-8">
                            <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Marcha Blanca</span>
                            <h3 className="text-2xl font-black text-slate-900 mt-4">Comunidad</h3>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-4xl font-black text-slate-900">$0</span>
                                <span className="text-slate-400 font-bold">/siempre</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-10 flex-1">
                            {[
                                { icon: 'check_circle', text: 'Acceso a todo el glosario' },
                                { icon: 'check_circle', text: 'Límite de 10 consultas diarias' },
                                { icon: 'check_circle', text: 'Seguimiento de XP básico' },
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-600">
                                    <span className="material-symbols-outlined text-emerald-500 text-xl">{item.icon}</span>
                                    <span className="font-medium">{item.text}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={onSelectFree}
                            className="w-full py-4 px-6 rounded-2xl border-2 border-slate-100 font-bold text-slate-600 hover:bg-slate-50 transition-all"
                        >
                            Empezar Gratis
                        </button>
                    </div>

                    {/* Plan Donante */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col transform hover:scale-[1.02] transition-all duration-300">
                        {/* Decorative background gradient */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <span className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Recomendado</span>
                                    <h3 className="text-2xl font-black text-white mt-4">Socio Fundador</h3>
                                    <p className="text-slate-400 font-medium">Donación voluntaria</p>
                                </div>
                                <div className="bg-primary/20 text-primary size-12 rounded-2xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl">favorite</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {[
                                    { icon: 'star', text: 'Consultas de IA (Uso Justo)' },
                                    { icon: 'quiz', text: 'Quizzes y Flashcards ilimitados' },
                                    { icon: 'bolt', text: 'Respuesta prioritaria' },
                                    { icon: 'workspace_premium', text: 'Insignia de Socio Fundador' },
                                    { icon: 'rocket_launch', text: 'Acceso anticipado a funciones' },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300">
                                        <span className="material-symbols-outlined text-accent-gold text-xl">{item.icon}</span>
                                        <span className="font-medium">{item.text}</span>
                                    </li>
                                ))}
                            </ul>

                            <p className="text-[10px] text-slate-500 mb-6 italic leading-relaxed">
                                * El uso justo asegura que todos los socios tengan acceso a la IA sin interrupciones. Límite sugerido de 200 consultas/mes.
                            </p>

                            <a
                                href={kofiUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-center w-full py-4 px-6 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
                            >
                                Donar en Ko-fi
                            </a>
                            <p className="text-center text-slate-500 text-[10px] mt-4 font-medium uppercase tracking-widest">Seguro vía PayPal / Stripe</p>
                        </div>
                    </div>
                </div>

                {/* FAQ o Nota adicional */}
                <div className="mt-20 glass p-8 rounded-[2rem] border border-white text-center">
                    <p className="text-slate-600 font-medium">
                        ¿Tienes dudas sobre cómo funcionan las donaciones? <br />
                        Escríbenos directamente a <span className="text-primary font-bold">hola@iusacademy.cl</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
