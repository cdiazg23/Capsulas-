
import React, { useState, useMemo } from 'react';
import { LegalConcept } from '../types';

interface FlashcardsProps {
    concepts: LegalConcept[];
    onBack: () => void;
}

const Flashcards: React.FC<FlashcardsProps> = ({ concepts, onBack }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [knownCount, setKnownCount] = useState(0);
    const [learningCount, setLearningCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // Mezclar conceptos aleatoriamente al inicio
    const shuffledConcepts = useMemo(() => {
        return [...concepts].sort(() => Math.random() - 0.5).slice(0, 10);
    }, [concepts]);

    const currentConcept = shuffledConcepts[currentIndex];

    const handleNext = (status: 'known' | 'learning') => {
        if (status === 'known') setKnownCount(prev => prev + 1);
        else setLearningCount(prev => prev + 1);

        if (currentIndex < shuffledConcepts.length - 1) {
            setIsFlipped(false);
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
            }, 150);
        } else {
            setIsFinished(true);
        }
    };

    if (shuffledConcepts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-gray-400">No hay conceptos cargados para estudiar.</p>
                <button onClick={onBack} className="mt-4 text-primary font-bold">Volver</button>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="max-w-xl mx-auto py-20 text-center animate-in zoom-in duration-500">
                <div className="size-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <span className="material-symbols-outlined text-5xl">task_alt</span>
                </div>
                <h2 className="text-3xl font-black mb-4">¡Sesión Completada!</h2>
                <p className="text-gray-600 mb-8">Has repasado {shuffledConcepts.length} conceptos clave.</p>

                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                        <p className="text-2xl font-black text-green-600">{knownCount}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-green-700">Dominados</p>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                        <p className="text-2xl font-black text-orange-600">{learningCount}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-orange-700">Por repasar</p>
                    </div>
                </div>

                <button
                    onClick={onBack}
                    className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                >
                    Volver al Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto py-10">
            <div className="flex items-center justify-between mb-12">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Salir</span>
                </button>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tu Progreso</span>
                    <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${((currentIndex + 1) / shuffledConcepts.length) * 100}%` }}
                        ></div>
                    </div>
                    <span className="text-[10px] font-bold text-primary mt-1">{currentIndex + 1} de {shuffledConcepts.length}</span>
                </div>
            </div>

            <div className="perspective-1000">
                <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={`relative w-full aspect-[4/5] sm:aspect-video cursor-pointer transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 bg-primary/5 px-4 py-1.5 rounded-full">Concepto</span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                            {currentConcept.concept}
                        </h2>
                        <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2 text-gray-300">
                            <span className="material-symbols-outlined animate-bounce">touch_app</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">Pulsa para girar</span>
                        </div>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl flex flex-col">
                        <div className="flex justify-between items-start mb-8">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] bg-white/5 px-4 py-1.5 rounded-full">Definición</span>
                            <span className="material-symbols-outlined text-white/20">gavel</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center overflow-y-auto custom-scrollbar pr-2">
                            <p className="text-xl md:text-2xl font-medium leading-relaxed italic">
                                "{currentConcept.definitionSimple}"
                            </p>
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Ejemplo</p>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    {currentConcept.realExample}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`mt-12 grid grid-cols-2 gap-6 transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <button
                    onClick={(e) => { e.stopPropagation(); handleNext('learning'); }}
                    className="flex flex-col items-center gap-2 p-6 bg-white border-2 border-orange-100 rounded-3xl hover:bg-orange-50 transition-all group"
                >
                    <span className="material-symbols-outlined text-orange-400 group-hover:scale-110 transition-transform">refresh</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Repasar luego</span>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); handleNext('known'); }}
                    className="flex flex-col items-center gap-2 p-6 bg-white border-2 border-green-100 rounded-3xl hover:bg-green-50 transition-all group"
                >
                    <span className="material-symbols-outlined text-green-500 group-hover:scale-110 transition-transform">check_circle</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-700">¡Lo domino!</span>
                </button>
            </div>
        </div>
    );
};

export default Flashcards;
