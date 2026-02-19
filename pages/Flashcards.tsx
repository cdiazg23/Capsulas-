import React, { useState, useMemo } from 'react';
import { useConcepts } from '../contexts';
import { useMastery } from '../hooks';

const Flashcards: React.FC = () => {
    const { concepts } = useConcepts();

    const safeConcepts = concepts || [];
    const categories = useMemo(() =>
        Array.from(new Set(safeConcepts.map(c => c.category))),
        [safeConcepts]
    );

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [cardLimit, setCardLimit] = useState<number | 'all'>('all');
    const [excludeMastered, setExcludeMastered] = useState(true);
    const [isStudying, setIsStudying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const { masteredConceptIds } = useMastery();

    const studySet = useMemo(() => {
        if (selectedCategories.length === 0) return [];
        let filtered = safeConcepts.filter(c => selectedCategories.includes(c.category));

        // Filtro de conceptos dominados
        if (excludeMastered) {
            filtered = filtered.filter(c => !masteredConceptIds.includes(c.id));
        }

        // Barajar aleatoriamente
        filtered = [...filtered].sort(() => Math.random() - 0.5);

        // Aplicar límite si no es 'all'
        if (cardLimit !== 'all' && filtered.length > cardLimit) {
            return filtered.slice(0, cardLimit);
        }
        return filtered;
    }, [safeConcepts, selectedCategories, cardLimit, excludeMastered, masteredConceptIds]);

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const startStudying = () => {
        if (studySet.length > 0) {
            setIsStudying(true);
            setCurrentIndex(0);
            setIsFlipped(false);
        }
    };

    const nextCard = () => {
        if (currentIndex < studySet.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setIsFlipped(false);
        }
    };

    const currentCard = studySet[currentIndex];

    if (isStudying && currentCard) {
        return (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black dark:text-white mb-1">Modo Flashcards</h1>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                            Tarjeta {currentIndex + 1} de {studySet.length}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsStudying(false)}
                        className="px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all font-sans"
                    >
                        Salir
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="h-1.5 md:h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${((currentIndex + 1) / studySet.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Flashcard */}
                <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="relative h-[26rem] md:h-96 cursor-pointer mb-8 perspective-1000"
                >
                    <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                        {/* Front */}
                        <div className="absolute w-full h-full backface-hidden">
                            <div className="h-full bg-white dark:bg-slate-900 rounded-3xl border-2 border-gray-100 dark:border-slate-800 p-6 md:p-12 flex flex-col items-center justify-center shadow-xl">
                                <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] md:text-xs font-black uppercase tracking-wider mb-4">
                                    {currentCard.subcategory}
                                </span>
                                <h2 className="text-xl md:text-4xl font-black text-center dark:text-white mb-4 leading-tight">
                                    {currentCard.concept}
                                </h2>
                                <p className="text-[10px] md:text-sm text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest font-mono">
                                    {currentCard.id}
                                </p>
                                <div className="mt-auto pt-6 text-[10px] md:text-sm text-gray-400 dark:text-slate-500 flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-base md:text-lg">touch_app</span>
                                    <span>Toca para ver la definición</span>
                                </div>
                            </div>
                        </div>

                        {/* Back */}
                        <div className="absolute w-full h-full backface-hidden rotate-y-180">
                            <div className="h-full bg-primary text-white rounded-3xl border-2 border-primary p-6 md:p-10 flex flex-col shadow-xl overflow-hidden">
                                <span className="text-[10px] md:text-xs font-black uppercase tracking-wider mb-3 opacity-80 shrink-0">
                                    Definición
                                </span>

                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col justify-center">
                                    <p className="text-sm md:text-lg leading-relaxed mb-6 font-medium">
                                        {currentCard.definitionSimple}
                                    </p>

                                    {currentCard.regulation && (
                                        <div className="pt-4 border-t border-white/20">
                                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                                                Regulación
                                            </p>
                                            <p className="text-xs md:text-sm opacity-90 italic">
                                                {currentCard.regulation}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[10px] md:text-sm opacity-80 shrink-0">
                                    <span className="material-symbols-outlined text-base md:text-lg">touch_app</span>
                                    <span>Toca para volver</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={prevCard}
                        disabled={currentIndex === 0}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl font-black text-xs md:text-sm shadow-sm disabled:opacity-20 transition-all dark:text-white"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        <span>Anterior</span>
                    </button>

                    <div className="text-center hidden lg:block">
                        <p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                            {selectedCategories.slice(0, 2).join(', ')} {selectedCategories.length > 2 ? '...' : ''}
                        </p>
                    </div>

                    <button
                        onClick={nextCard}
                        disabled={currentIndex === studySet.length - 1}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl font-black text-xs md:text-sm shadow-sm disabled:opacity-20 transition-all dark:text-white"
                    >
                        <span>Siguiente</span>
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="mb-10">
                <h1 className="text-4xl font-black mb-2 dark:text-white tracking-tight">Flashcards</h1>
                <p className="text-gray-500 dark:text-slate-400 text-lg">
                    Personaliza tu sesión de estudio para dominar los conceptos legales.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Category Selection */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-8 shadow-sm">
                        <h2 className="text-xl font-black mb-6 dark:text-white flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">category</span>
                            </div>
                            1. Selecciona Categorías
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {categories.map(cat => {
                                const count = safeConcepts.filter(c => c.category === cat).length;
                                const isSelected = selectedCategories.includes(cat);

                                return (
                                    <button
                                        key={cat}
                                        onClick={() => toggleCategory(cat)}
                                        className={`px-5 py-3 rounded-2xl font-black transition-all border-2 text-sm ${isSelected
                                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                            : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border-gray-100 dark:border-slate-800 hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isSelected && (
                                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                            )}
                                            <span>{cat}</span>
                                            <span className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>({count})</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quantity Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-8 shadow-sm">
                            <h2 className="text-xl font-black mb-6 dark:text-white flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-accent-gold/10 flex items-center justify-center text-accent-gold">
                                    <span className="material-symbols-outlined">list_alt</span>
                                </div>
                                2. Cantidad
                            </h2>
                            <div className="flex gap-2">
                                {[5, 10, 20, 'all'].map((limit) => (
                                    <button
                                        key={limit}
                                        onClick={() => setCardLimit(limit as number | 'all')}
                                        className={`flex-1 py-3 rounded-xl font-black transition-all border-2 text-xs ${cardLimit === limit
                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                                            : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 border-gray-100 dark:border-slate-800'
                                            }`}
                                    >
                                        {limit === 'all' ? 'Todos' : limit}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-8 shadow-sm">
                            <h2 className="text-xl font-black mb-6 dark:text-white flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <span className="material-symbols-outlined">verified</span>
                                </div>
                                3. Filtro de Maestría
                            </h2>
                            <button
                                onClick={() => setExcludeMastered(!excludeMastered)}
                                className={`w-full py-3 px-4 rounded-xl font-black transition-all border-2 flex items-center justify-between text-xs ${excludeMastered
                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                    : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 border-gray-100 dark:border-slate-800'
                                    }`}
                            >
                                <span>Excluir ya dominados</span>
                                <span className="material-symbols-outlined">
                                    {excludeMastered ? 'toggle_on' : 'toggle_off'}
                                </span>
                            </button>
                            <p className="text-[10px] text-gray-400 mt-3 font-medium">
                                {excludeMastered
                                    ? 'Solo verás conceptos nuevos o por reforzar.'
                                    : 'Verás todos los conceptos, incluidos los ya dominados.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary & Start */}
                <div className="space-y-6">
                    <div className="bg-primary dark:bg-primary rounded-3xl p-8 text-white shadow-xl shadow-primary/20 sticky top-8">
                        <span className="material-symbols-outlined text-4xl mb-4">analytics</span>
                        <h3 className="text-2xl font-black mb-4">Resumen de Sesión</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-white/70">
                                <span className="text-sm font-bold uppercase tracking-wider">Conceptos</span>
                                <span className="text-xl font-black text-white">{studySet.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-white/70">
                                <span className="text-sm font-bold uppercase tracking-wider">Categorías</span>
                                <span className="text-xl font-black text-white">{selectedCategories.length}</span>
                            </div>
                        </div>

                        <button
                            onClick={startStudying}
                            disabled={studySet.length === 0}
                            className="w-full py-4 bg-white text-primary rounded-2xl font-black text-lg hover:bg-slate-50 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">play_arrow</span>
                            <span>Comenzar Sesión</span>
                        </button>

                        {studySet.length === 0 && (
                            <p className="text-white/60 text-[10px] text-center mt-4 font-black uppercase tracking-widest">
                                Selecciona categorías para empezar
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Flashcards;
