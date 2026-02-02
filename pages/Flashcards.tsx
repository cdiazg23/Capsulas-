
import React, { useState, useMemo } from 'react';
import { LegalConcept, UserStats } from '../types';

interface FlashcardsProps {
    concepts: LegalConcept[];
    onBack: () => void;
    onUpdateStats?: (update: Partial<UserStats>) => void;
    onLogActivity?: (type: string, description: string) => void;
}

const Flashcards: React.FC<FlashcardsProps> = ({ concepts, onBack, onUpdateStats, onLogActivity }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [performance, setPerformance] = useState({ mal: 0, ok: 0, bien: 0, excelente: 0 });
    const [isFinished, setIsFinished] = useState(false);
    const [direction, setDirection] = useState(0); // For slide animations
    const [earnedXp, setEarnedXp] = useState(0);

    // Mezclar conceptos aleatoriamente al inicio
    const shuffledConcepts = useMemo(() => {
        return [...concepts].sort(() => Math.random() - 0.5).slice(0, 15); // Aumentado a 15
    }, [concepts]);

    const currentConcept = shuffledConcepts[currentIndex];

    const handleNext = (status: 'mal' | 'ok' | 'bien' | 'excelente') => {
        let xpGain = 0;
        if (status === 'excelente') xpGain = 20;
        else if (status === 'bien') xpGain = 10;
        else if (status === 'ok') xpGain = 5;

        setEarnedXp(prev => prev + xpGain);
        setPerformance(prev => ({ ...prev, [status]: prev[status] + 1 }));

        // Update stats in parent
        if (onUpdateStats) {
            onUpdateStats({ xp: xpGain });
        }

        setDirection(1);

        if (currentIndex < shuffledConcepts.length - 1) {
            setIsFlipped(false);
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setDirection(0);
            }, 250);
        } else {
            // End of session bonus
            const bonus = 50;
            setEarnedXp(prev => prev + bonus);
            if (onUpdateStats) {
                onUpdateStats({ xp: bonus, learnedConcepts: 1 });
            }
            if (onLogActivity) {
                onLogActivity('session', `Completó sesión de 15 flashcards (+50 XP Bono)`);
            }
            setIsFinished(true);
        }
    };

    if (shuffledConcepts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs">Sin contenido disponible</p>
                <button onClick={onBack} className="mt-4 text-primary font-bold hover:underline">Regresar al Inicio</button>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="max-w-2xl mx-auto py-10 text-center animate-in zoom-in duration-500">
                <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800">
                    <div className="size-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-5xl font-black">celebration</span>
                    </div>
                    <h2 className="text-4xl font-black mb-2 text-slate-900 dark:text-white">¡Reto Terminado!</h2>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary text-white rounded-full text-sm font-black mb-8 animate-bounce shadow-lg shadow-primary/30">
                        <span className="material-symbols-outlined text-sm">stars</span>
                        GANASTE +{earnedXp} XP
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">Has repasado {shuffledConcepts.length} conceptos del examen de grado.</p>

                    <div className="grid grid-cols-4 gap-4 mb-12">
                        <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-2xl border border-red-100 dark:border-red-900/30">
                            <p className="text-xl font-black text-red-600 dark:text-red-400">{performance.mal}</p>
                            <p className="text-[9px] font-black uppercase text-red-700/60 dark:text-red-300/60">Mal</p>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                            <p className="text-xl font-black text-orange-600 dark:text-orange-400">{performance.ok}</p>
                            <p className="text-[9px] font-black uppercase text-orange-700/60 dark:text-orange-300/60">Reg.</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-2xl border border-green-100 dark:border-green-900/30">
                            <p className="text-xl font-black text-green-600 dark:text-green-400">{performance.bien}</p>
                            <p className="text-[9px] font-black uppercase text-green-700/60 dark:text-green-300/60">Bien</p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                            <p className="text-xl font-black text-blue-600 dark:text-blue-400">{performance.excelente}</p>
                            <p className="text-[9px] font-black uppercase text-blue-700/60 dark:text-blue-300/60">Exc.</p>
                        </div>
                    </div>

                    <button
                        onClick={onBack}
                        className="w-full py-5 bg-slate-900 dark:bg-primary text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 dark:hover:bg-primary-dark transition-all active:scale-95"
                    >
                        VOLVER AL DASHBOARD
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto py-6 md:py-10 px-4">
            <div className="flex items-center justify-between mb-10">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-primary transition-all">
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Dashboard</span>
                </button>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Progreso</span>
                        <div className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-black">
                            {currentIndex + 1} / {shuffledConcepts.length}
                        </div>
                    </div>
                    <div className="w-40 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-700 ease-out"
                            style={{ width: `${((currentIndex + 1) / shuffledConcepts.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div
                className={`w-full aspect-[4/5] sm:aspect-square md:aspect-[4/3] cursor-pointer transition-all duration-300 ${direction !== 0 ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100'}`}
                style={{ perspective: '2000px' }}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div
                    className="relative w-full h-full transition-transform duration-700"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                >
                    {/* Front: Concept Name */}
                    <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[3rem] p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center text-center overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-indigo-500"></div>

                        <div className="mb-6 flex flex-col items-center gap-2">
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full mb-2">
                                {currentConcept.category} • {currentConcept.subcategory}
                            </span>
                            <span className="text-[11px] font-black text-primary dark:text-primary-light uppercase tracking-[0.3em] opacity-60">Pregunta:</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-4 text-balance">
                            ¿Qué es {currentConcept.concept.toLowerCase().startsWith('el') || currentConcept.concept.toLowerCase().startsWith('la') ? '' : 'el '}{currentConcept.concept}?
                        </h2>

                        <div className="absolute bottom-12 px-6 py-2 bg-slate-50 dark:bg-slate-800 rounded-full text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse border border-slate-100 dark:border-slate-700">
                            Haz click para ver respuesta
                        </div>
                    </div>

                    {/* Back: Detailed Definition */}
                    <div
                        className="absolute inset-0 bg-[#0f172a] dark:bg-slate-950 text-white rounded-[3rem] p-10 shadow-2xl flex flex-col overflow-hidden border border-white/5"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <div className="size-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Definición Técnica</span>
                            </div>
                            <span className="material-symbols-outlined text-white/20 text-3xl">gavel</span>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-1">Concepto:</h3>
                            <p className="text-xl font-black text-white tracking-tight">{currentConcept.concept}</p>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar-dark pr-4 flex flex-col">
                            <div className="relative mb-6">
                                <p className="text-xl md:text-2xl font-bold leading-relaxed tracking-tight text-slate-50 italic">
                                    "{currentConcept.definitionSimple}"
                                </p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
                                <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">lightbulb</span>
                                        Ejemplo Práctico
                                    </p>
                                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                        {currentConcept.realExample}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 grid grid-cols-4 gap-3 opacity-100">
                <button
                    onClick={(e) => { e.stopPropagation(); handleNext('mal'); }}
                    className="flex flex-col items-center gap-2 p-4 bg-[#4a0e0e] border-2 border-[#631717] rounded-2xl hover:bg-[#5a1313] transition-all active:scale-95 group"
                >
                    <span className="material-symbols-outlined text-red-500 text-3xl">sentiment_very_dissatisfied</span>
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">Mal</span>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); handleNext('ok'); }}
                    className="flex flex-col items-center gap-2 p-4 bg-[#4a2f0e] border-2 border-[#633f17] rounded-2xl hover:bg-[#5a3a13] transition-all active:scale-95 group"
                >
                    <span className="material-symbols-outlined text-orange-500 text-3xl">sentiment_neutral</span>
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">OK</span>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); handleNext('bien'); }}
                    className="flex flex-col items-center gap-2 p-4 bg-[#0e3a1e] border-2 border-[#17522a] rounded-2xl hover:bg-[#134926] transition-all active:scale-95 group"
                >
                    <span className="material-symbols-outlined text-green-500 text-3xl">sentiment_satisfied</span>
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">Bien</span>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); handleNext('excelente'); }}
                    className="flex flex-col items-center gap-2 p-4 bg-[#0e1e4a] border-2 border-[#172a63] rounded-2xl hover:bg-[#13265a] transition-all active:scale-95 group"
                >
                    <span className="material-symbols-outlined text-blue-500 text-3xl">sentiment_very_satisfied</span>
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">Excelente</span>
                </button>
            </div>

            <div className={`mt-8 text-center flex flex-col gap-2 transition-opacity duration-500 opacity-100`}>
                <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-xs">touch_app</span>
                    Click en la tarjeta para ver respuesta
                </p>
            </div>
        </div>
    );
};

export default Flashcards;
