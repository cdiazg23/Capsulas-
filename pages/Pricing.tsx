import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Pricing: React.FC = () => {
    const navigate = useNavigate();

    const plans = [
        {
            id: 'plan_trimestral',
            name: 'Plan Trimestral',
            price: 24900,
            interval: 'cada 3 meses',
            description: 'Ideal para quienes quieren probar un ciclo corto de estudio.',
            features: [
                'Acceso Ilimitado a Materias',
                'Biblioteca Digital Completa',
                'Flashcards Inteligentes',
                'Aula Iuris & Masterclasses',
                'Comunidad de Estudiantes'
            ],
            recommended: false
        },
        {
            id: 'plan_semestral',
            name: 'Plan Semestral',
            price: 49900,
            interval: 'cada 6 meses',
            description: 'La opción más elegida para acompañar tu semestre académico.',
            features: [
                'Todo lo del Plan Trimestral',
                'Ahorro del 15% vs mensual',
                'Soporte prioritario',
                'Descarga de materiales'
            ],
            recommended: true
        },
        {
            id: 'plan_anual',
            name: 'Plan Anual',
            price: 90000,
            interval: 'cada 12 meses',
            description: 'Dominio total para tu examen de grado y carrera.',
            features: [
                'Todo lo del Plan Semestral',
                'Mejor precio garantizado',
                'Acceso a todos los nuevos módulos',
                'Certificado de membresía'
            ],
            recommended: false
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <Helmet>
                <title>Planes y Precios | IurisAcademy</title>
                <meta name="description" content="Comienza tu prueba gratuita de 3 días. Planes Trimestrales, Semestrales y Anuales para dominar tu examen de grado de Derecho." />
            </Helmet>

            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-primary mb-12 transition-colors font-bold group"
                >
                    <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Volver
                </button>

                <div className="text-center mb-16 md:mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-8">
                        <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
                        <span className="text-[12px] font-bold text-primary uppercase tracking-wider">3 días de prueba gratis en cualquier plan</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8">
                        Domina el Derecho <br />
                        <span className="text-primary italic">Sin Límites</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                        Elige el plan que mejor se adapte a tu ritmo de estudio. Cancela en cualquier momento.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-stretch mb-20">
                    {plans.map((plan) => (
                        <div 
                            key={plan.id}
                            className={`relative flex flex-col p-8 md:p-10 rounded-[3rem] transition-all duration-300 ${
                                plan.recommended 
                                ? 'bg-slate-900 text-white shadow-2xl shadow-primary/20 scale-105 z-10' 
                                : 'bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-primary/20'
                            }`}
                        >
                            {plan.recommended && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                                    Más Elegido
                                </div>
                            )}

                            <div className="mb-10">
                                <h3 className={`text-2xl font-black ${plan.recommended ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mt-4">
                                    <span className="text-5xl font-black">${plan.price.toLocaleString('es-CL')}</span>
                                    <span className={`${plan.recommended ? 'text-slate-400' : 'text-slate-400'} font-bold`}>/ CLP</span>
                                </div>
                                <p className={`text-xs font-bold uppercase tracking-widest mt-2 ${plan.recommended ? 'text-primary' : 'text-primary'}`}>
                                    Cobro {plan.interval}
                                </p>
                            </div>

                            <p className={`${plan.recommended ? 'text-slate-400' : 'text-slate-500'} text-sm leading-relaxed mb-10 min-h-[48px]`}>
                                {plan.description}
                            </p>

                            <ul className="space-y-4 mb-12">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <span className={`material-symbols-outlined text-lg mt-0.5 ${plan.recommended ? 'text-primary' : 'text-primary'}`}>check_circle</span>
                                        <span className={`text-sm font-medium ${plan.recommended ? 'text-slate-300' : 'text-slate-700'}`}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => navigate('/login', { state: { mode: 'signup', planId: plan.id } })}
                                className={`mt-auto w-full py-5 rounded-2xl font-black text-lg transition-all shadow-lg shadow-primary/10 ${
                                    plan.recommended 
                                    ? 'bg-primary text-white hover:bg-primary-dark shadow-primary/25' 
                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                                }`}
                            >
                                Iniciar Prueba de 3 Días
                            </button>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm text-center">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">¿Cómo funciona la prueba gratuita?</h2>
                    <p className="text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
                        Al registrarte, activas automáticamente <strong>3 días de acceso total</strong> a todos los módulos. 
                        Podrás explorar cada rincón de IurisAcademy antes de realizar cualquier pago. Te avisaremos cuando tu prueba esté por terminar.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
