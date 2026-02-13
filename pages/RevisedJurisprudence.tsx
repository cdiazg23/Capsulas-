import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useConcepts } from '../contexts';
import { RevisedJurisprudence as RevisedJurisprudenceType } from '../types';

const RevisedJurisprudence: React.FC = () => {
    const { concepts } = useConcepts();
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedReport, setSelectedReport] = useState<RevisedJurisprudenceType | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    const filteredConcepts = concepts.filter(c =>
        c.concept.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);

    const handleSelectConcept = async (conceptId: string, conceptName: string) => {
        setLoading(true);
        setSearchTerm('');
        try {
            const { data, error } = await supabase
                .from('revised_jurisprudence')
                .select('*')
                .eq('concept_id', conceptId)
                .maybeSingle();

            if (error) throw error;

            if (data) {
                setSelectedReport(data);
                checkIfSaved(data.id);
            } else {
                // Fallback or "Not found" state
                setSelectedReport({
                    id: 'temp',
                    concept_id: conceptId,
                    concept_name: conceptName,
                    report: 'El informe de jurisprudencia para este concepto está siendo procesado por nuestro equipo legal. Pronto estará disponible con un análisis detallado de fallos recientes.',
                    analysis: 'Análisis pendiente. Nuestro motor de búsqueda está recopilando las sentencias más relevantes de la Corte Suprema y Cortes de Apelaciones para este concepto específico.',
                    created_at: new Date().toISOString()
                });
                setIsSaved(false);
            }
        } catch (error) {
            console.error('Error fetching revised jurisprudence:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkIfSaved = async (reportId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('saved_revised_jurisprudence')
            .select('id')
            .eq('user_id', user.id)
            .eq('report_id', reportId)
            .maybeSingle();

        setIsSaved(!!data);
    };

    const toggleSave = async () => {
        if (!selectedReport || selectedReport.id === 'temp') return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            if (isSaved) {
                await supabase
                    .from('saved_revised_jurisprudence')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('report_id', selectedReport.id);
                setIsSaved(false);
            } else {
                await supabase
                    .from('saved_revised_jurisprudence')
                    .insert({
                        user_id: user.id,
                        report_id: selectedReport.id
                    });
                setIsSaved(true);
            }
        } catch (error) {
            console.error('Error toggling save:', error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <span className="material-symbols-outlined text-2xl">fact_check</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight dark:text-white uppercase italic">Jurisprudencia Pro</h1>
                </div>
                <p className="text-gray-500 dark:text-slate-400 font-medium">Informes detallados y análisis de aplicación exclusivos para Socios Fundadores.</p>
            </div>

            <div className="relative mb-12">
                <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">search</span>
                    <input
                        type="text"
                        placeholder="Busca un concepto para ver su informe de jurisprudencia..."
                        className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border-2 border-transparent focus:border-amber-500/30 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none text-lg font-bold dark:text-white transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {searchTerm && (
                    <div className="absolute top-full left-0 right-0 mt-3 p-4 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800 z-50 animate-in slide-in-from-top-4 duration-300">
                        <div className="space-y-2">
                            {filteredConcepts.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => handleSelectConcept(c.id, c.concept)}
                                    className="w-full text-left p-4 hover:bg-amber-50 dark:hover:bg-amber-500/5 rounded-2xl transition-colors group flex items-center justify-between"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-black text-slate-800 dark:text-slate-200 group-hover:text-amber-600 transition-colors">{c.concept}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{c.category} • {c.subcategory}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-300 group-hover:text-amber-500 translate-x-2 group-hover:translate-x-0 transition-all opacity-0 group-hover:opacity-100">arrow_forward</span>
                                </button>
                            ))}
                            {filteredConcepts.length === 0 && (
                                <p className="p-4 text-center text-gray-400 text-sm italic">No se encontraron conceptos que coincidan.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                    <div className="size-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mb-4"></div>
                    <p className="text-amber-600 font-black uppercase tracking-widest text-xs">Generando Informe Pro...</p>
                </div>
            ) : selectedReport ? (
                <div className="grid lg:grid-cols-12 gap-8 animate-in zoom-in-95 duration-500">
                    <div className="lg:col-span-8 space-y-8">
                        <section className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                <span className="material-symbols-outlined text-[120px] dark:text-white">description</span>
                            </div>

                            <div className="flex items-center justify-between gap-4 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                                        <span className="material-symbols-outlined">gavel</span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black dark:text-white">{selectedReport.concept_name}</h2>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Informe de Jurisprudencia Revisada</p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleSave}
                                    disabled={selectedReport.id === 'temp'}
                                    className={`p-4 rounded-2xl transition-all ${isSaved
                                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500 disabled:opacity-50'}`}
                                >
                                    <span className={`material-symbols-outlined ${isSaved ? 'fill-1' : ''}`}>bookmark</span>
                                </button>
                            </div>

                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap text-lg">
                                    {selectedReport.report}
                                </p>
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <section className="bg-slate-900 dark:bg-slate-800 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 size-40 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-500/30 transition-colors"></div>

                            <div className="flex items-center gap-3 mb-6 relative">
                                <div className="size-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-amber-500 text-2xl">insights</span>
                                </div>
                                <h2 className="text-lg font-black uppercase tracking-tight">Análisis de Aplicación</h2>
                            </div>

                            <div className="relative">
                                <p className="text-slate-300 leading-relaxed font-medium text-sm whitespace-pre-wrap">
                                    {selectedReport.analysis}
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10 relative">
                                <div className="flex items-center gap-2 text-amber-500 mb-2">
                                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Sugerencia Estratégica</p>
                                </div>
                                <p className="text-xs text-slate-400 italic">Este análisis considera las tendencias actuales de los tribunales superiores de justicia chilena.</p>
                            </div>
                        </section>

                        <div className="p-8 bg-amber-50 dark:bg-amber-500/5 rounded-[2.5rem] border-2 border-dashed border-amber-200 dark:border-amber-500/20 text-center">
                            <span className="material-symbols-outlined text-amber-500 text-4xl mb-4">library_add</span>
                            <h3 className="font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Guarda en Biblioteca</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Guarda este informe para tenerlo disponible sin conexión y acceder rápidamente desde tu perfil.</p>
                            <button
                                onClick={toggleSave}
                                disabled={selectedReport.id === 'temp'}
                                className="w-full py-4 bg-white dark:bg-slate-900 border-2 border-amber-500 text-amber-500 font-black text-xs rounded-2xl hover:bg-amber-500 hover:text-white transition-all shadow-lg shadow-amber-500/10 uppercase tracking-widest disabled:opacity-50"
                            >
                                {isSaved ? 'Ya en Biblioteca' : 'Agregar ahora'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="size-24 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-5xl text-slate-200 dark:text-slate-800">search_off</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Selecciona un concepto</h2>
                    <p className="text-slate-500 max-w-sm mx-auto">Comienza buscando cualquier concepto jurídico para visualizar su informe de jurisprudencia revisada.</p>
                </div>
            )}
        </div>
    );
};

export default RevisedJurisprudence;
