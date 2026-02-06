import React, { useEffect, useState } from 'react';

interface LevelUpModalProps {
    level: number;
    rank: string;
    onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, rank, onClose }) => {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const particles = Array.from({ length: 20 });

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500">
            {/* Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((_, i) => (
                    <div
                        key={i}
                        className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
                        style={{
                            backgroundColor: i % 2 === 0 ? '#6366f1' : '#f59e0b',
                            '--tw-translate-x': `${(Math.random() - 0.5) * 400}px`,
                            '--tw-translate-y': `${(Math.random() - 0.5) * 400}px`,
                            animation: `particle ${0.5 + Math.random()}s ease-out forwards`,
                            animationDelay: `${Math.random() * 0.2}s`
                        } as any}
                    />
                ))}
            </div>

            <div className={`bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] shadow-2xl relative overflow-hidden p-10 text-center transition-all duration-700 transform ${showContent ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent-gold to-primary"></div>

                <div className="mb-8 relative inline-block">
                    <div className="size-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto animate-level-up">
                        <span className="material-symbols-outlined text-[60px] text-primary fill-1">military_tech</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 size-10 rounded-full bg-accent-gold border-4 border-white dark:border-slate-900 flex items-center justify-center font-black text-white text-sm shadow-lg">
                        {level}
                    </div>
                </div>

                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 italic">¡NUEVO RANGO!</h2>
                <p className="text-gray-400 dark:text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-6">Ascenso en la Carrera Judicial</p>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 mb-8">
                    <p className="text-primary font-black text-xl mb-1">{rank}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest leading-relaxed">
                        Has demostrado un dominio superior. Ahora tienes acceso a mayor prestigio y nuevos desafíos.
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-4 bg-slate-900 dark:bg-primary text-white rounded-2xl font-black text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                    CONTINUAR CAMINO
                </button>
            </div>
        </div>
    );
};

export default LevelUpModal;
