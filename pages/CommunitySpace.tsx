
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface Feedback {
    id: string;
    user_id: string;
    type: 'query' | 'complaint' | 'suggestion';
    content: string;
    country: string;
    city?: string;
    created_at: string;
    profiles?: {
        full_name: string;
        username: string;
        avatar_url: string;
        role: string;
    };
}

const countries = [
    'Chile', 'Argentina', 'Perú', 'Colombia', 'México', 'Bolivia', 'Ecuador', 'España',
    'Uruguay', 'Paraguay', 'Venezuela', 'Costa Rica', 'Panamá', 'Otros'
];

const forbiddenKeywords = ['insulto1', 'ofensa2', 'basura', 'spam']; // Ejemplos de filtro

const CommunitySpace: React.FC<{ user: User | null }> = ({ user }) => {
    const [messages, setMessages] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [newContent, setNewContent] = useState('');
    const [type, setType] = useState<'query' | 'complaint' | 'suggestion'>('suggestion');
    const [country, setCountry] = useState('Chile');
    const [city, setCity] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('community_feedback')
                .select('*, profiles(full_name, username, avatar_url, role)')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReport = async (id: string) => {
        if (!confirm('¿Deseas reportar este mensaje por contenido inadecuado?')) return;

        try {
            const { error } = await supabase
                .from('community_feedback')
                .update({ is_reported: true })
                .eq('id', id);

            if (error) throw error;
            alert('Mensaje reportado. Los administradores lo revisarán a la brevedad.');
        } catch (error) {
            console.error('Error reporting:', error);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();

        // Filtro de contenido básico
        const hasForbiddenContent = forbiddenKeywords.some(word =>
            newContent.toLowerCase().includes(word.toLowerCase())
        );

        if (hasForbiddenContent) {
            alert('Tu mensaje contiene palabras que no cumplen con nuestras normas de convivencia. Por favor, sé respetuoso.');
            return;
        }

        if (!newContent.trim() || !country.trim()) return;

        try {
            setSending(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { error } = await supabase
                .from('community_feedback')
                .insert({
                    user_id: session.user.id,
                    content: newContent,
                    type,
                    country,
                    city: city?.trim() || null
                });

            if (error) throw error;

            setNewContent('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending feedback:', error);
        } finally {
            setSending(false);
        }
    };

    const getTypeLabel = (t: string) => {
        switch (t) {
            case 'query': return 'Inquietud';
            case 'complaint': return 'Descargo';
            case 'suggestion': return 'Sugerencia';
            default: return t;
        }
    };

    const getTypeColor = (t: string) => {
        switch (t) {
            case 'query': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'complaint': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'suggestion': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            default: return 'bg-slate-100 dark:bg-slate-800';
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-3">
                    <div className="size-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">groups</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black dark:text-white tracking-tight">Espacio de la Comunidad</h1>
                        <p className="text-sm text-slate-500 font-medium">Solo para Socios Fundadores y Administradores</p>
                    </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 p-4 rounded-2xl max-w-sm">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 mb-1">
                        <span className="material-symbols-outlined text-sm font-black">gavel</span>
                        <p className="text-[10px] font-black uppercase tracking-widest">Normas de Convivencia</p>
                    </div>
                    <p className="text-[10px] text-amber-700 dark:text-amber-300 leading-tight">
                        Mantengamos un ambiente de respeto académico. Los mensajes inadecuados serán eliminados y el usuario sancionado.
                    </p>
                </div>
            </div>

            {/* Nuevo Mensaje */}
            <form onSubmit={handleSend} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-primary/5 mb-12">
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Tipo de Mensaje</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as any)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-xl text-sm font-bold p-3 focus:ring-primary/20 dark:text-white"
                        >
                            <option value="suggestion">Sugerencia</option>
                            <option value="query">Inquietud</option>
                            <option value="complaint">Descargo</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">País</label>
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-xl text-sm font-bold p-3 focus:ring-primary/20 dark:text-white"
                        >
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Ciudad</label>
                        <input
                            type="text"
                            placeholder="Ej: Santiago, Lima..."
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-xl text-sm font-bold p-3 focus:ring-primary/20 dark:text-white"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Tu Mensaje</label>
                    <textarea
                        required
                        rows={3}
                        placeholder="Comparte tu sugerencia o inquietud con la comunidad..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-medium p-4 focus:ring-primary/20 dark:text-white resize-none"
                    ></textarea>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={sending}
                        className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
                    >
                        {sending ? 'Enviando...' : 'Publicar'}
                        <span className="material-symbols-outlined text-sm">send</span>
                    </button>
                </div>
            </form>

            {/* Listado de Mensajes */}
            <div className="space-y-6">
                <h3 className="text-xl font-black dark:text-white ml-2 mb-4 flex items-center gap-2">
                    Actividad Reciente
                    {loading && <div className="size-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>}
                </h3>

                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <div key={msg.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 bg-center bg-cover border border-slate-200 dark:border-slate-700"
                                        style={{ backgroundImage: msg.profiles?.avatar_url ? `url("${msg.profiles.avatar_url}")` : undefined }}>
                                        {!msg.profiles?.avatar_url && <span className="material-symbols-outlined text-slate-400 size-full flex items-center justify-center">person</span>}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-black dark:text-white">{msg.profiles?.full_name || 'Usuario'}</p>
                                            <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-widest ${msg.profiles?.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-primary/10 text-primary'}`}>
                                                {msg.profiles?.role}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            {msg.city ? `${msg.city}, ` : ''}{msg.country} • {new Date(msg.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getTypeColor(msg.type)}`}>
                                        {getTypeLabel(msg.type)}
                                    </span>
                                    <button
                                        onClick={() => handleReport(msg.id)}
                                        className="opacity-0 group-hover:opacity-100 size-8 text-slate-300 hover:text-red-500 transition-all flex items-center justify-center"
                                        title="Reportar contenido"
                                    >
                                        <span className="material-symbols-outlined text-lg">flag</span>
                                    </button>
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed ml-1">
                                {msg.content}
                            </p>
                        </div>
                    ))
                ) : !loading && (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <span className="material-symbols-outlined text-5xl text-slate-200 dark:text-slate-800 mb-4 font-thin">forum</span>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aún no hay mensajes. ¡Sé el primero!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunitySpace;
