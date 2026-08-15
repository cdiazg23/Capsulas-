import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useConcepts, useAuth } from '../contexts';
import { useNavigate } from 'react-router-dom';
import { LegalConcept } from '../types';

const RevisedJurisprudence: React.FC = () => {
    const { concepts } = useConcepts();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedConcept, setSelectedConcept] = useState<LegalConcept | null>(null);

    const isAuthorized = user?.role === 'admin' || user?.subscription_status === 'active' || user?.subscription_status === 'trialing';

    // Get unique categories
    const categories = ['all', ...Array.from(new Set(concepts.map(c => c.category).filter(Boolean)))];

    const filteredConcepts = concepts.filter(c => {
        const matchesSearch = c.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.regulation && c.regulation.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (c.definitionSimple && c.definitionSimple.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const activeConcept = selectedConcept || (filteredConcepts.length > 0 ? filteredConcepts[0] : null);

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
            <Helmet>
                <title>Normativa Aplicada y Casos Reales | IurisAcademy</title>
                <meta name="description" content="Fundamentación legal con artículos de los Códigos de Chile y casos de aplicación real para el examen de grado." />
            </Helmet>

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-2xl">gavel</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight dark:text-white uppercase italic">
                            Normativa Aplicada <span className="text-primary not-italic">& Aplicación Real</span>
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            Fundamentación con artículos de los Códigos de la República y resolución de casos prácticos para el examen de grado.
                        </p>
                    </div>
                </div>
            </div>

            {!isAuthorized ? (
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                    <div className="size-20 rounded-3xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center mx-auto mb-8">
                        <span className="material-symbols-outlined text-4xl">lock</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Módulo Premium de Estudio</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 max-w-lg mx-auto">
                        La sección de Normativa Aplicada y Casos Reales te permite estudiar cada concepto con sus artículos legales y situaciones de la vida real.
                        Requiere una suscripción activa o encontrarte en tu periodo de prueba de 3 días.
                    </p>
                    <button
                        onClick={() => navigate('/pricing')}
                        className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-base hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                    >
                        Ver Planes de Acceso
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Panel Izquierdo: Buscador y Lista de Conceptos */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input
                                type="text"
                                placeholder="Buscar por artículo o concepto..."
                                className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold dark:text-white outline-none focus:border-primary transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filtros de Materia */}
                        <div className="flex gap-1.5 overflow-x-auto pb-2 custom-scrollbar">
                            {categories.map((cat, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                                        selectedCategory === cat
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:border-primary/30'
                                    }`}
                                >
                                    {cat === 'all' ? 'Todas las Materias' : cat}
                                </button>
                            ))}
                        </div>

                        {/* Lista de Conceptos Filtrados */}
                        <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1 custom-scrollbar">
                            {filteredConcepts.map(concept => (
                                <div
                                    key={concept.id}
                                    onClick={() => setSelectedConcept(concept)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                                        activeConcept?.id === concept.id
                                            ? 'bg-primary/5 dark:bg-primary/10 border-primary shadow-sm'
                                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                            {concept.category}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                            {concept.id}
                                        </span>
                                    </div>
                                    <h4 className="font-black text-slate-900 dark:text-white text-sm mb-1">
                                        {concept.concept}
                                    </h4>
                                    {concept.regulation && (
                                        <p className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">gavel</span>
                                            <span className="truncate">{concept.regulation}</span>
                                        </p>
                                    )}
                                </div>
                            ))}

                            {filteredConcepts.length === 0 && (
                                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">search_off</span>
                                    <p className="text-sm font-bold text-slate-500">No encontramos conceptos con ese criterio.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel Derecho: Detalle de Normativa Aplicada y Caso Real */}
                    <div className="lg:col-span-7 space-y-6">
                        {activeConcept ? (
                            <>
                                {/* Tarjeta de Normativa Legal */}
                                <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                {activeConcept.category} {activeConcept.subcategory ? `· ${activeConcept.subcategory}` : ''}
                                            </span>
                                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                                {activeConcept.concept}
                                            </h2>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/app/concept/${activeConcept.id}`)}
                                            className="bg-primary/10 text-primary hover:bg-primary hover:text-white p-3 rounded-2xl transition-all flex items-center gap-1 text-xs font-bold"
                                            title="Ver Ficha Técnica Completa"
                                        >
                                            <span className="material-symbols-outlined text-base">visibility</span>
                                            <span>Ficha Completa</span>
                                        </button>
                                    </div>

                                    {/* Regulación Legal */}
                                    <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/80 dark:border-amber-500/20 mb-6">
                                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
                                            <span className="material-symbols-outlined text-base">gavel</span>
                                            <span>Normativa Legal Vigente</span>
                                        </div>
                                        <p className="text-base font-bold text-slate-900 dark:text-white">
                                            {activeConcept.regulation || 'Normativa general y doctrina aplicable.'}
                                        </p>
                                    </div>

                                    {/* Definición Dogmática */}
                                    <div className="mb-6">
                                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                                            Definición Dogmática
                                        </h3>
                                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
                                            {activeConcept.definitionSimple}
                                        </p>
                                    </div>

                                    {/* Aplicación Real / Caso Práctico */}
                                    {activeConcept.realExample && (
                                        <div className="p-6 rounded-2xl bg-blue-50/70 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-900/40">
                                            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-xs font-black uppercase tracking-wider mb-3">
                                                <span className="material-symbols-outlined text-base">lightbulb</span>
                                                <span>Aplicación Real & Caso Práctico</span>
                                            </div>
                                            <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed italic">
                                                "{activeConcept.realExample}"
                                            </p>
                                        </div>
                                    )}
                                </section>

                                {/* Elementos Dogmáticos de Grado */}
                                {activeConcept.keyPoints && activeConcept.keyPoints.length > 0 && (
                                    <section className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
                                        <div className="flex items-center gap-2.5 mb-5">
                                            <span className="material-symbols-outlined text-primary text-xl">fact_check</span>
                                            <h3 className="text-sm font-black uppercase tracking-wider">
                                                Puntos y Requisitos Clave para el Examen
                                            </h3>
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-2.5">
                                            {activeConcept.keyPoints.map((pt, pIdx) => (
                                                <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-300 p-2.5 rounded-xl bg-white/5 border border-white/5">
                                                    <span className="material-symbols-outlined text-emerald-400 text-sm shrink-0 mt-0.5">check_circle</span>
                                                    <span>{pt}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 p-16 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">menu_book</span>
                                <h3 className="text-xl font-bold dark:text-white mb-2">Selecciona un concepto</h3>
                                <p className="text-sm text-slate-500">Selecciona un concepto de la lista izquierda para consultar su normativa y aplicación real.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RevisedJurisprudence;
