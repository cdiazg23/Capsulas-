import React, { useState, useMemo } from 'react';
import { LegalConcept } from '../types';

interface QuizProps {
    concept: LegalConcept;
    onClose: () => void;
    onComplete: (xp: number) => void;
}

interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
}

const Quiz: React.FC<QuizProps> = ({ concept, onClose, onComplete }) => {
    const [currentView, setCurrentView] = useState<'intro' | 'questions' | 'result'>('intro');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);

    const quizQuestions = useMemo<Question[]>(() => {
        return [
            {
                question: `¿Cuál es la definición correcta de "${concept.concept}"?`,
                options: [
                    concept.definitionSimple,
                    "Es una manifestación de voluntad que no produce efectos jurídicos.",
                    "Es un contrato donde solo una de las partes resulta obligada.",
                    "Es la pérdida de un derecho por el transcurso del tiempo."
                ].sort(() => Math.random() - 0.5),
                correctAnswer: 0 // Will be updated after sort
            },
            {
                question: `Respecto a ${concept.concept}, ¿cuál es un ejemplo real de su aplicación?`,
                options: [
                    concept.realExample,
                    "El pago de una multa de tránsito sin haber cometido la infracción.",
                    "La celebración de un contrato sin objeto ni causa real.",
                    "La extinción de una deuda por mera liberalidad del acreedor."
                ].sort(() => Math.random() - 0.5),
                correctAnswer: 0
            },
            {
                question: `¿Dónde se encuentra regulado principalmente el concepto de ${concept.concept}?`,
                options: [
                    concept.regulation,
                    "En el Código de Comercio, Art. 1",
                    "En la Ley de Juntas de Vecinos",
                    "En el Reglamento de Tránsito"
                ].sort(() => Math.random() - 0.5),
                correctAnswer: 0
            }
        ].map(q => {
            const correctText = q.options.includes(concept.definitionSimple) ? concept.definitionSimple :
                q.options.includes(concept.realExample) ? concept.realExample : concept.regulation;
            return { ...q, correctAnswer: q.options.indexOf(correctText) };
        });
    }, [concept]);

    const handleNext = () => {
        if (selectedOption === null) return;

        let newScore = score;
        if (selectedOption === quizQuestions[currentQuestionIndex].correctAnswer) {
            newScore = score + 1;
            setScore(newScore);
        }

        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
            setSelectedOption(null);
        } else {
            setCurrentView('result');
        }
    };

    const handleFinish = () => {
        if (score === 3) {
            onComplete(100);
        } else if (score === 2) {
            onComplete(60);
        } else if (score === 1) {
            onComplete(30);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

                {currentView === 'intro' && (
                    <div className="p-10 text-center">
                        <div className="size-20 bg-accent-gold/10 text-accent-gold rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl">quiz</span>
                        </div>
                        <h2 className="text-2xl font-black mb-4">Desafío de 3 Preguntas</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Responde correctamente sobre <span className="text-slate-900 font-bold">"{concept.concept}"</span> para demostrar tu dominio y ganar XP.
                        </p>
                        <button
                            onClick={() => setCurrentView('questions')}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                        >
                            Comenzar Desafío
                        </button>
                        <button onClick={onClose} className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors mt-2">
                            Ahora no
                        </button>
                    </div>
                )}

                {currentView === 'questions' && (
                    <div className="p-10">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex gap-1">
                                {quizQuestions.map((_, idx) => (
                                    <div key={idx} className={`h-1.5 w-6 rounded-full transition-all ${idx <= currentQuestionIndex ? 'bg-primary' : 'bg-gray-100'}`}></div>
                                ))}
                            </div>
                            <span className="text-[10px] font-black uppercase text-gray-400">Pregunta {currentQuestionIndex + 1} de 3</span>
                        </div>
                        <h2 className="text-xl font-black mb-8 leading-tight min-h-[3.5rem]">
                            {quizQuestions[currentQuestionIndex].question}
                        </h2>
                        <div className="space-y-4 mb-10">
                            {quizQuestions[currentQuestionIndex].options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedOption(idx)}
                                    className={`w-full p-4 rounded-2xl border-2 text-left text-sm font-medium transition-all ${selectedOption === idx
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-gray-100 hover:border-gray-200 text-slate-600'
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={selectedOption === null}
                            onClick={handleNext}
                            className={`w-full py-4 rounded-2xl font-black shadow-lg transition-all ${selectedOption === null
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-primary text-white shadow-primary/20 hover:bg-primary-dark'
                                }`}
                        >
                            {currentQuestionIndex === quizQuestions.length - 1 ? 'Finalizar' : 'Siguiente Pregunta'}
                        </button>
                    </div>
                )}

                {currentView === 'result' && (
                    <div className="p-10 text-center">
                        <div className={`size-20 rounded-full flex items-center justify-center mx-auto mb-6 ${score >= 2 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                            <span className="material-symbols-outlined text-4xl">
                                {score === 3 ? 'military_tech' : score >= 2 ? 'verified' : 'running_with_errors'}
                            </span>
                        </div>
                        <h2 className="text-2xl font-black mb-2">
                            {score === 3 ? '¡Perfección Total!' : score === 2 ? '¡Muy bien!' : 'Necesitas repasar'}
                        </h2>
                        <p className="text-gray-500 mb-8">
                            Has acertado <span className="text-slate-900 font-bold">{score} de 3</span> preguntas sobre {concept.concept}.
                        </p>
                        {score > 0 && (
                            <div className="bg-primary/5 p-4 rounded-2xl mb-8 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-primary">emoji_events</span>
                                <span className="text-primary font-black">
                                    +{score === 3 ? '100' : score === 2 ? '60' : '30'} XP Ganados
                                </span>
                            </div>
                        )}
                        <button
                            onClick={handleFinish}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl"
                        >
                            {score > 0 ? 'Reclamar Recompensa' : 'Cerrar y Reintentar'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Quiz;
