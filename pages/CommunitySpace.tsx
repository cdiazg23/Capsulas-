import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts';
import { useNavigate } from 'react-router-dom';


interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
    profiles?: {
        full_name: string;
        avatar_url: string;
        role: string;
    };
}

interface Feedback {
    id: string;
    user_id: string;
    type: 'query' | 'complaint' | 'suggestion';
    content: string;
    country: string;
    city?: string;
    created_at: string;
    is_reported: boolean;
    profiles?: {
        full_name: string;
        username: string;
        avatar_url: string;
        role: string;
    };
    comments: Comment[];
}

const countries = [
    'Chile', 'Argentina', 'Perú', 'Colombia', 'México', 'Bolivia', 'Ecuador', 'España',
    'Uruguay', 'Paraguay', 'Venezuela', 'Costa Rica', 'Panamá', 'Otros'
];

const forbiddenKeywords = ['insulto1', 'ofensa2', 'basura', 'spam'];

const CommunitySpace: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Feedback[]>([]);

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [newContent, setNewContent] = useState('');
    const [type, setType] = useState<'query' | 'complaint' | 'suggestion'>('suggestion');
    const [country, setCountry] = useState('Chile');
    const [city, setCity] = useState('');

    // Filters state
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterCountry, setFilterCountry] = useState<string>('all');

    // Comment state
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [commentContent, setCommentContent] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('community_feedback')
                .select(`
                    *,
                    profiles(full_name, username, avatar_url, role),
                    comments:community_comments(
                        *,
                        profiles(full_name, avatar_url, role)
                    )
                `)
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

    const handleSendComment = async (postId: string) => {
        if (!commentContent.trim()) return;

        try {
            setSending(true);
            const { error } = await supabase
                .from('community_comments')
                .insert({
                    post_id: postId,
                    user_id: user?.id,
                    content: commentContent
                });

            if (error) throw error;
            setCommentContent('');
            setReplyingTo(null);
            fetchMessages();
        } catch (error) {
            console.error('Error sending comment:', error);
        } finally {
            setSending(false);
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

    const isAuthorized = user?.role === 'admin' || user?.subscription_status === 'active' || user?.subscription_status === 'trialing';


    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthorized) {
            alert('Solo los usuarios con un plan activo o en prueba gratuita pueden publicar mensajes.');
            return;
        }

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
            const { error } = await supabase
                .from('community_feedback')
                .insert({
                    user_id: user?.id,
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

    const filteredMessages = useMemo(() => {
        return messages.filter(msg => {
            const matchesSearch = msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || msg.type === filterType;
            const matchesCountry = filterCountry === 'all' || msg.country === filterCountry;
            return matchesSearch && matchesType && matchesCountry;
        });
    }, [messages, searchTerm, filterType, filterCountry]);

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
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-3">
                    <div className="size-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">groups</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black dark:text-white tracking-tight">Espacio de la Comunidad</h1>
                        <p className="text-sm text-slate-500 font-medium">Disponible para usuarios con prueba activa o plan vigente</p>
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
            {isAuthorized ? (
                <form onSubmit={handleSend} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-primary/5 mb-12 animate-in zoom-in-95 duration-300">
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
            ) : (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700 text-center mb-12">
                    <span className="material-symbols-outlined text-4xl text-primary/40 mb-3">lock</span>
                    <h3 className="text-lg font-bold dark:text-white mb-2">Función Full</h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                        Este espacio de interacción está habilitado únicamente para usuarios con una <strong>membresía activa</strong> o durante tu periodo de prueba de 3 días.
                    </p>
                    <button 
                        onClick={() => navigate('/pricing')}
                        className="mt-6 text-xs font-black uppercase tracking-widest text-primary hover:underline"
                    >
                        Ver planes disponibles
                    </button>
                </div>
            )}


            {/* Listado de Mensajes con Filtros */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-2">
                    <h3 className="text-xl font-black dark:text-white flex items-center gap-2">
                        Actividad Reciente
                        {loading && <div className="size-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs font-bold outline-none focus:border-primary transition-colors dark:text-white"
                            />
                        </div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:border-primary transition-colors dark:text-white"
                        >
                            <option value="all">Todo tipo</option>
                            <option value="suggestion">Sugerencias</option>
                            <option value="query">Inquietudes</option>
                            <option value="complaint">Descargos</option>
                        </select>
                        <select
                            value={filterCountry}
                            onChange={(e) => setFilterCountry(e.target.value)}
                            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:border-primary transition-colors dark:text-white"
                        >
                            <option value="all">País</option>
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {filteredMessages.length > 0 ? (
                    filteredMessages.map((msg) => (
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
                                                {msg.profiles?.role === 'admin' ? 'Admin' : 'Miembro'}
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
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed ml-1 mb-6">
                                {msg.content}
                            </p>

                            {/* Comments Section */}
                            <div className="ml-1 border-t border-slate-50 dark:border-slate-800 pt-4">
                                {msg.comments && msg.comments.length > 0 && (
                                    <div className="space-y-4 mb-4">
                                        {msg.comments.map(comment => (
                                            <div key={comment.id} className="flex gap-3 animate-in slide-in-from-left-2 duration-300">
                                                <div className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800 bg-center bg-cover flex-shrink-0"
                                                    style={{ backgroundImage: comment.profiles?.avatar_url ? `url("${comment.profiles.avatar_url}")` : undefined }}>
                                                    {!comment.profiles?.avatar_url && <span className="material-symbols-outlined text-slate-300 size-full flex items-center justify-center text-sm">person</span>}
                                                </div>
                                                <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl px-4 py-2">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-black dark:text-white leading-none">{comment.profiles?.full_name}</span>
                                                        <span className={`text-[7px] px-1 py-0.5 rounded uppercase font-black tracking-widest ${comment.profiles?.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-primary/10 text-primary'}`}>
                                                            {comment.profiles?.role === 'admin' ? 'Admin' : 'Miembro'}
                                                        </span>
                                                        <span className="text-[9px] text-slate-400 ml-auto">{new Date(comment.created_at).toLocaleDateString()}</span>

                                                    </div>
                                                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                                                        {comment.content}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {isAuthorized && (
                                    <div className="flex items-center gap-2">
                                        {replyingTo === msg.id ? (
                                            <div className="flex-1 flex gap-2 animate-in zoom-in-95 duration-200">
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    placeholder="Escribe tu respuesta..."
                                                    value={commentContent}
                                                    onChange={(e) => setCommentContent(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSendComment(msg.id)}
                                                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-xs font-medium focus:ring-1 focus:ring-primary/20 dark:text-white"
                                                />
                                                <button
                                                    onClick={() => handleSendComment(msg.id)}
                                                    disabled={sending || !commentContent.trim()}
                                                    className="bg-primary text-white size-8 rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50"
                                                >
                                                    <span className="material-symbols-outlined text-sm">send</span>
                                                </button>
                                                <button
                                                    onClick={() => { setReplyingTo(null); setCommentContent(''); }}
                                                    className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">close</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setReplyingTo(msg.id)}
                                                className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-dark transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary/5"
                                            >
                                                <span className="material-symbols-outlined text-sm font-black">reply</span>
                                                Responder hilo
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
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
