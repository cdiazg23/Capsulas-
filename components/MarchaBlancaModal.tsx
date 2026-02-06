import React, { useState, useEffect } from 'react';

const MarchaBlancaModal: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem('iuris_marcha_blanca_seen');
        if (!hasSeen) {
            // Delay slightly for better effect after login
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
        return () => { };
    }, []);

    const handleClose = () => {
        localStorage.setItem('iuris_marcha_blanca_seen', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800 animate-in zoom-in-95 duration-300">

                {/* Header with gradient icon circle */}
                <div className="pt-10 pb-4 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center mb-4 shadow-xl shadow-primary/20">
                        <span className="material-symbols-outlined text-white text-4xl">rocket_launch</span>
                    </div>
                    <h2 className="text-2xl font-black text-center dark:text-white px-8 leading-tight">
                        ¡Bienvenidos a la <span className="text-primary italic">Marcha Blanca</span>!
                    </h2>
                </div>

                {/* Content */}
                <div className="px-10 py-6 text-center space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        Te damos la bienvenida a <strong>Iuris Academy</strong>. Actualmente nos encontramos en fase intensiva de carga de contenidos y optimización.
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                        <p className="text-[13px] text-blue-700 dark:text-blue-300 font-medium">
                            Si detectas errores o tienes sugerencias, agradecemos tu reporte para seguir mejorando.
                            <span className="block mt-2 font-bold text-xs uppercase tracking-wider">
                                💡 Importante:
                            </span>
                            Actualmente, el espacio de comentarios en el <strong>Área de Comunidad</strong> está reservado exclusivamente para nuestros <strong>Socios Fundadores</strong>.
                        </p>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 text-xs italic">
                        "A esta comunidad la construimos entre todos."
                    </p>
                </div>

                {/* Action */}
                <div className="p-8 pt-2">
                    <button
                        onClick={handleClose}
                        className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                        ENTENDIDO, ¡VAMOS A ESTUDIAR!
                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MarchaBlancaModal;
