import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentStatus: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const status = searchParams.get('status'); // 'success' | 'failure' | 'pending'

    const getContent = () => {
        switch (status) {
            case 'success':
                return {
                    icon: 'check_circle',
                    color: 'text-emerald-500',
                    bg: 'bg-emerald-50',
                    title: '¡Pago Exitoso!',
                    message: 'Tu suscripción ha sido activada correctamente. Ya puedes disfrutar de todo el contenido premium.',
                    cta: 'Ir al Dashboard',
                    link: '/app/dashboard'
                };
            case 'failure':
                return {
                    icon: 'error',
                    color: 'text-red-500',
                    bg: 'bg-red-50',
                    title: 'Pago Fallido',
                    message: 'Hubo un problema al procesar tu pago. Por favor, intenta nuevamente o utiliza otro medio de pago.',
                    cta: 'Reintentar Pago',
                    link: '/pricing'
                };
            case 'pending':
                return {
                    icon: 'schedule',
                    color: 'text-amber-500',
                    bg: 'bg-amber-50',
                    title: 'Pago Pendiente',
                    message: 'Tu pago está siendo procesado por la plataforma. Te avisaremos en cuanto se confirme la transacción.',
                    cta: 'Ir al Dashboard',
                    link: '/app/dashboard'
                };
            default:
                return {
                    icon: 'help',
                    color: 'text-slate-500',
                    bg: 'bg-slate-50',
                    title: 'Estado Desconocido',
                    message: 'No pudimos determinar el estado de tu pago. Por favor contacta a soporte si crees que hubo un cobro.',
                    cta: 'Volver al Inicio',
                    link: '/'
                };
        }
    };

    const content = getContent();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-xl shadow-slate-200/50 animate-in zoom-in-95 duration-500">
                <div className={`size-24 ${content.bg} ${content.color} rounded-[2rem] flex items-center justify-center mx-auto mb-10`}>
                    <span className="material-symbols-outlined text-5xl fill-0">{content.icon}</span>
                </div>
                
                <h1 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">{content.title}</h1>
                <p className="text-slate-500 font-medium leading-relaxed mb-12">
                    {content.message}
                </p>

                <button
                    onClick={() => navigate(content.link)}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                >
                    {content.cta}
                </button>
                
                <button
                    onClick={() => navigate('/app/billing')}
                    className="mt-6 text-sm font-bold text-slate-400 hover:text-primary transition-all"
                >
                    Gestionar Facturación
                </button>
            </div>
        </div>
    );
};

export default PaymentStatus;
