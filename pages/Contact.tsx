import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setSending(true);
            setError(null);

            // Intentar obtener el email de la sesión si no está en el objeto user
            let userEmail = user.email;
            if (!userEmail) {
                const { data: { session } } = await supabase.auth.getSession();
                userEmail = session?.user?.email || '';
            }

            // 1. Guardar en Supabase para registro/histórico
            const { error: insertError } = await supabase
                .from('contact_messages')
                .insert({
                    user_id: user.id,
                    name: user.name,
                    email: userEmail,
                    subject,
                    message
                });

            if (insertError) throw insertError;

            // 2. Enviar Correo via EmailJS
            const serviceId = 'service_0as58l3';
            const templateId = 'template_se9bvu7';
            // Llave corregida (l minúscula en Mlbm5n)
            const publicKey = '5OtmNP2Cco-Mlbm5n';

            if (serviceId && templateId && publicKey) {
                try {
                    const result = await emailjs.send(
                        serviceId,
                        templateId,
                        {
                            name: user.name,
                            email: userEmail || 'No proporcionado',
                            title: subject,
                            message: message,
                            time: new Date().toLocaleString()
                        },
                        publicKey
                    );
                    console.log('✅ EmailJS Success:', result.status, result.text);
                } catch (emailError: any) {
                    console.error('❌ EmailJS Error:', emailError);
                    throw new Error(`EmailJS: ${emailError.text || emailError.message || 'Error al enviar correo'}`);
                }
            }

            setSuccess(true);
            setSubject('');
            setMessage('');
        } catch (err: any) {
            console.error('Error detallado:', err);
            setError(`Error al procesar: ${err.message || 'Error desconocido'}`);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-3">
                    <div className="size-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">mail</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black dark:text-white tracking-tight">Contacto</h1>
                        <p className="text-sm text-slate-500 font-medium">Estamos aquí para ayudarte y escucharte</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-xl shadow-primary/5 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <span className="material-symbols-outlined text-[120px]">contact_support</span>
                </div>

                {success ? (
                    <div className="text-center py-10 animate-in zoom-in-95 duration-300">
                        <div className="size-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl">check_circle</span>
                        </div>
                        <h2 className="text-2xl font-black dark:text-white mb-2">¡Mensaje Enviado!</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                            Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos a la brevedad posible a tu correo <strong>{user?.email}</strong>.
                        </p>
                        <button
                            onClick={() => navigate('/app/dashboard')}
                            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                        >
                            Volver al Dashboard
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Tu Nombre</label>
                            <span className="text-[9px] font-bold text-primary/40 bg-primary/5 px-2 py-0.5 rounded-full">v3.0 - Sistema Directo</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-sm font-bold text-slate-900 dark:text-white mb-8">
                            {user?.name}
                        </div>

                        <div className="space-y-2 mb-6">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Asunto</label>
                            <input
                                required
                                type="text"
                                placeholder="¿En qué podemos ayudarte?"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-xl text-sm font-bold p-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
                            />
                        </div>

                        <div className="space-y-2 mb-8">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">Mensaje</label>
                            <textarea
                                required
                                rows={5}
                                placeholder="Cuéntanos más detalles..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-medium p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white resize-none"
                            ></textarea>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex flex-col gap-1 text-red-600 dark:text-red-400 text-sm">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-lg font-bold">error</span>
                                    <span className="font-bold">Error en el proceso</span>
                                </div>
                                <p className="ml-8 text-xs opacity-80">{error}</p>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed">
                                Al enviar este formulario, aceptas que nuestro equipo reciba tus datos para gestionar tu solicitud.
                            </p>
                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {sending ? (
                                    <>
                                        <div className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        <span>Enviando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Enviar Mensaje</span>
                                        <span className="material-symbols-outlined text-sm">send</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Contact;
