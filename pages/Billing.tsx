import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts';

const Billing: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const getStatusBadge = () => {
        switch (user?.subscription_status) {
            case 'trialing':
                return { text: 'Período de Prueba', classes: 'bg-primary/10 text-primary border-primary/20' };
            case 'active':
                return { text: 'Suscripción Activa', classes: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
            case 'expired':
                return { text: 'Suscripción Expirada', classes: 'bg-red-50 text-red-600 border-red-100' };
            case 'canceled':
                return { text: 'Cancelada', classes: 'bg-slate-100 text-slate-500 border-slate-200' };
            default:
                return { text: 'Sin Plan', classes: 'bg-slate-100 text-slate-500 border-slate-200' };
        }
    };

    const badge = getStatusBadge();

    const plans = [
        { id: 'plan_trimestral', name: 'Trimestral', price: 24900 },
        { id: 'plan_semestral', name: 'Semestral', price: 49900 },
        { id: 'plan_anual', name: 'Anual', price: 90000 },
    ];

    const currentPlanName = plans.find(p => p.id === user?.plan_id)?.name || 'Ninguno';

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <Helmet>
                <title>Mi Plan y Facturación | IurisAcademy</title>
                <meta name="description" content="Detalles de tu suscripción actual, días de prueba y gestión de planes en IurisAcademy." />
            </Helmet>

            <div className="mb-10">
                <h1 className="text-3xl font-black dark:text-white mb-2 tracking-tight">Mi Plan y Facturación</h1>
                <p className="text-slate-500 font-medium">Gestiona tu suscripción y métodos de pago.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
                {/* Current Status Card */}
                <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-primary/5">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Estado Actual</p>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${badge.classes}`}>
                                {badge.text}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Plan Actual</p>
                            <p className="text-xl font-black dark:text-white">{currentPlanName}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {user?.subscription_status === 'trialing' && user?.trial_ends_at && (
                            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="material-symbols-outlined text-primary">schedule</span>
                                    <p className="font-bold text-slate-900 dark:text-white">Tu prueba gratuita termina pronto</p>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                    Tienes acceso total hasta el <span className="font-black">{new Date(user.trial_ends_at).toLocaleDateString()}</span>. 
                                    Elige un plan antes de esta fecha para no perder el acceso a tus flashcards y progreso.
                                </p>
                                <button
                                    onClick={() => navigate('/pricing')}
                                    className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                                >
                                    Elegir Plan Ahora
                                </button>
                            </div>
                        )}

                        {user?.subscription_status === 'active' && user?.current_period_end && (
                            <div className="flex justify-between items-center py-4 border-t border-slate-50 dark:border-slate-800">
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Próxima Renovación</p>
                                <p className="text-sm font-black dark:text-white">{new Date(user.current_period_end).toLocaleDateString()}</p>
                            </div>
                        )}
                        
                        <div className="pt-6 flex flex-wrap gap-4">
                            <button 
                                onClick={() => navigate('/pricing')}
                                className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-slate-800 transition-all"
                            >
                                Cambiar de Plan
                            </button>
                            {user?.subscription_status === 'active' && (
                                <button className="px-6 py-3 border border-slate-200 text-slate-500 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                                    Cancelar Suscripción
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Info */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                            <span className="material-symbols-outlined text-primary mb-4">verified_user</span>
                            <h4 className="font-black mb-2 tracking-tight">Pago Seguro</h4>
                            <p className="text-[10px] text-slate-400 leading-relaxed">
                                Procesamos tus pagos mediante Mercado Pago o Webpay con encriptación de nivel bancario.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800">
                        <h4 className="font-black dark:text-white text-sm mb-4">Ayuda</h4>
                        <div className="space-y-4">
                            <button className="flex items-center gap-3 text-xs font-bold text-slate-500 hover:text-primary transition-all">
                                <span className="material-symbols-outlined text-sm">mail</span>
                                Contactar Soporte
                            </button>
                            <button className="flex items-center gap-3 text-xs font-bold text-slate-500 hover:text-primary transition-all">
                                <span className="material-symbols-outlined text-sm">description</span>
                                Términos de Uso
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoices Placeholder */}
            <div>
                <h3 className="text-xl font-black dark:text-white mb-6">Historial de Pagos</h3>
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-slate-200 dark:text-slate-800 mb-4">receipt_long</span>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No hay boletas disponibles todavía</p>
                </div>
            </div>
        </div>
    );
};

export default Billing;
