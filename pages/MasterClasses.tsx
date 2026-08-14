import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MasterClass } from '../types';
import { fetchMasterClasses } from '../data';
import { useAuth } from '../contexts';

const MasterClasses: React.FC = () => {
    const navigate = useNavigate();
    const [masterClasses, setMasterClasses] = useState<MasterClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<MasterClass | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const loadVideos = async () => {
            setLoading(true);
            const data = await fetchMasterClasses();
            setMasterClasses(data);
            setLoading(false);
        };
        loadVideos();
    }, []);

    const isAuthorized = user?.role === 'admin' || user?.role === 'founder' || user?.subscription_status === 'active' || user?.subscription_status === 'trialing';


    const getEmbedUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            let videoId = '';
            if (urlObj.hostname.includes('youtube.com')) {
                videoId = urlObj.searchParams.get('v') || '';
            } else if (urlObj.hostname === 'youtu.be') {
                videoId = urlObj.pathname.substring(1);
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
        } catch (e) {
            return url;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700">
            <Helmet>
                <title>Aula Iuris - Clases Magistrales | IurisAcademy</title>
                <meta name="description" content="Clases magistrales y cápsulas audiovisuales de alta precisión dogmática para profundizar en el estudio del Derecho." />
            </Helmet>

            <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-xl">movie</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Contenido Exclusivo</span>
                </div>
                <h1 className="text-4xl font-black mb-3 dark:text-white">Aula Iuris</h1>
                <p className="text-gray-500 dark:text-slate-400 max-w-2xl text-lg">
                    Clases magistrales y cápsulas jurídicas de autoría propia para profundizar en el estudio del Derecho.
                </p>
            </div>

            {masterClasses.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-20 text-center border border-dashed border-gray-200 dark:border-slate-800">
                    <span className="material-symbols-outlined text-6xl text-gray-200 dark:text-slate-800 mb-4">video_library</span>
                    <h3 className="text-xl font-bold dark:text-white">Próximamente nuevo contenido</h3>
                    <p className="text-gray-500 dark:text-slate-400">Estamos preparando las primeras clases magistrales para ti.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {masterClasses.map((mc) => (
                        <div
                            key={mc.id}
                            className={`group relative bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${!isAuthorized && 'opacity-85'}`}
                        >
                            <div className="aspect-video relative overflow-hidden">
                                <img
                                    src={mc.thumbnail_url || `https://picsum.photos/seed/${mc.id}/800/450`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt={mc.title}
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    {!isAuthorized ? (
                                        <button
                                            onClick={() => navigate('/pricing')}
                                            className="bg-white/10 hover:bg-white/20 backdrop-blur-xl p-4 rounded-2xl border border-white/20 text-center transition-all group-hover:scale-105"
                                        >
                                            <span className="material-symbols-outlined text-white text-3xl mb-1 block">lock</span>
                                            <span className="text-[10px] text-white font-bold uppercase tracking-wider">Desbloquear</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setSelectedVideo(mc)}
                                            className="size-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-300 pointer-events-auto"
                                        >
                                            <span className="material-symbols-outlined text-3xl fill-1">play_arrow</span>
                                        </button>
                                    )}
                                </div>
                                {mc.duration && (
                                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest">
                                        {mc.duration}
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest">
                                        {mc.category || 'Masterclass'}
                                    </span>

                                    {!isAuthorized && (
                                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-widest">
                                            Premium
                                        </span>
                                    )}

                                </div>
                                <h3 className="text-lg font-black dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">{mc.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                                    {mc.description}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <div className="size-6 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold dark:text-white">
                                            {mc.professor?.[0] || 'I'}
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">{mc.professor || 'Iuris Academy'}</span>
                                    </div>
                                    {isAuthorized ? (
                                        <button
                                            onClick={() => setSelectedVideo(mc)}
                                            className="text-xs font-black text-primary hover:underline"
                                        >
                                            VER AHORA
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => navigate('/pricing')}
                                            className="text-xs font-black text-amber-600 dark:text-amber-400 hover:underline"
                                        >
                                            OBTENER PLAN
                                        </button>
                                    )}

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL VIDEO PLAYER */}
            {selectedVideo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-black w-full max-w-6xl aspect-video rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-6 right-6 z-10 size-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors flex items-center justify-center"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <iframe
                            src={getEmbedUrl(selectedVideo.video_url)}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MasterClasses;
