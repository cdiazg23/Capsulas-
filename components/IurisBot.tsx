
import React, { useState, useRef, useEffect } from 'react';
import { LegalConcept } from '../types';

interface IurisBotProps {
    concepts: LegalConcept[];
}

interface Message {
    id: number;
    text: string;
    sender: 'bot' | 'user';
    timestamp: Date;
}

const IurisBot: React.FC<IurisBotProps> = ({ concepts }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "¡Hola! Soy IurisBot 🤖. Estoy aquí para ayudarte con cualquier duda legal de tus estudios. ¿Qué concepto quieres que te explique hoy?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Lógica de respuesta "IA" simplificada basada en el contexto de los conceptos
        setTimeout(() => {
            const term = inputValue.toLowerCase();
            const foundConcept = concepts.find(c =>
                term.includes(c.concept.toLowerCase()) ||
                c.concept.toLowerCase().includes(term)
            );

            let responseText = "";
            if (foundConcept) {
                responseText = `¡Claro! Relacionado con "${foundConcept.concept}", en derecho chileno se entiende como: ${foundConcept.definitionSimple}. Un ejemplo práctico sería: ${foundConcept.realExample}.`;
            } else if (term.includes('hola') || term.includes('buenos')) {
                responseText = "¡Hola! Un gusto saludarte. ¿En qué tema de Derecho Civil o Procesal estás trabajando hoy?";
            } else if (term.includes('gracias')) {
                responseText = "¡De nada! Sigue dándole duro al estudio. El examen de grado es un maratón, no un sprint. ⚖️";
            } else {
                responseText = "Esa es una excelente pregunta. Mi base de datos actual se enfoca en Derecho Civil y Procesal. Si me hablas de algún concepto de esas áreas, podré ayudarte mejor. ¿Te gustaría saber sobre 'Capacidad' o 'Acto Jurídico'?";
            }

            const botMessage: Message = {
                id: Date.now() + 1,
                text: responseText,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-24 right-6 size-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[100] group"
            >
                <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">
                    {isOpen ? 'close' : 'smart_toy'}
                </span>
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-accent-gold"></span>
                    </span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-40 right-6 w-[90vw] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden z-[100] animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="p-5 bg-slate-900 text-white flex items-center gap-3">
                        <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">smart_toy</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-black tracking-tight">IurisBot <span className="text-[10px] text-primary ml-1 uppercase bg-primary/20 px-1.5 py-0.5 rounded">Beta</span></h3>
                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Asistente Virtual</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-gray-50/50">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                        ? 'bg-primary text-white rounded-tr-none'
                                        : 'bg-white text-slate-700 border border-gray-100 rounded-tl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                                    <div className="size-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                                    <div className="size-1.5 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                                    <div className="size-1.5 bg-gray-300 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="p-4 bg-white border-t border-gray-50 flex gap-2"
                    >
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Pregúntame algo..."
                            className="flex-1 bg-gray-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="size-10 bg-primary text-white rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-primary-dark transition-colors"
                        >
                            <span className="material-symbols-outlined text-xl">send</span>
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default IurisBot;
