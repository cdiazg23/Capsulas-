
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { LegalConcept } from '../types';
import { supabase } from '../lib/supabase';

interface IurisBotProps {
    concepts: LegalConcept[];
    onSelectConcept: (concept: LegalConcept) => void;
}

interface Message {
    id: number;
    text: string;
    sender: 'bot' | 'user';
    timestamp: Date;
    relatedConcept?: LegalConcept;
}

const IurisBot: React.FC<IurisBotProps> = ({ concepts, onSelectConcept }) => {
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

    const normalizeText = (text: string) => {
        return text.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Quitar tildes
            .trim();
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userText = inputValue;
        const userMessage: Message = {
            id: Date.now(),
            text: userText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // 1. BUSQUEDA LOCAL (Fallback inmediato)
        const normalizedTerm = normalizeText(userText);
        const noise = ['que', 'es', 'son', 'el', 'la', 'los', 'las', 'un', 'una', 'dime', 'explica', 'sobre', 'define', 'significa'];
        const keywords = normalizedTerm.split(' ').filter(word => !noise.includes(word) && word.length > 2);

        const foundLocal = concepts.find(c => {
            const normalizedConcept = normalizeText(c.concept);
            if (normalizedTerm.includes(normalizedConcept)) return true;
            if (keywords.length > 0 && keywords.every(k => normalizedConcept.includes(k))) return true;
            return false;
        });

        // 2. CONSULTA AL TUTOR PRO (IA con Contexto de la Academia)
        try {
            // Le enviamos a la IA los conceptos más importantes para que los relacione
            const contextText = concepts.slice(0, 10).map(c => `- ${c.concept}: ${c.definitionSimple}`).join('\n');

            // Timeout de 30 segundos para una respuesta de calidad superior
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('TIMEOUT')), 30000)
            );

            const fetchPromise = supabase.functions.invoke('iuris-chat', {
                body: { message: userText, context: contextText }
            });

            const response = await Promise.race([fetchPromise, timeoutPromise]) as any;

            if (response.data?.reply) {
                const botMessage: Message = {
                    id: Date.now() + 1,
                    text: response.data.reply,
                    sender: 'bot',
                    timestamp: new Date(),
                    relatedConcept: foundLocal // Seguiremos vinculando el botón si coincide
                };
                setMessages(prev => [...prev, botMessage]);
            } else {
                throw new Error('FALLO_IA');
            }

        } catch (error: any) {
            console.error('Bot IA Error:', error);

            const botMessage: Message = {
                id: Date.now() + 2,
                text: foundLocal
                    ? `He localizado este concepto en nuestra base de la academia para ti: **${foundLocal.concept}**: ${foundLocal.definitionSimple}`
                    : "No he podido conectar con mi cerebro legal. Por favor, intenta con una pregunta más específica.",
                sender: 'bot',
                timestamp: new Date(),
                relatedConcept: foundLocal
            };
            setMessages(prev => [...prev, botMessage]);
        } finally {
            setIsTyping(false);
        }
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
                <div className="fixed bottom-40 right-6 w-[90vw] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden z-[100] animate-in slide-in-from-bottom-5 duration-300 dark:bg-slate-900 dark:border-slate-800">
                    {/* Header */}
                    <div className="p-5 bg-slate-950 text-white flex items-center gap-3">
                        <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">smart_toy</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-black tracking-tight italic">IurisBot <span className="text-[10px] text-primary ml-1 uppercase bg-primary/20 px-1.5 py-0.5 rounded not-italic">PRO</span></h3>
                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Asistente Legal Inteligente</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-gray-50/50 dark:bg-slate-900/50">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                    ? 'bg-primary text-white rounded-tr-none'
                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-gray-100 dark:border-slate-700 rounded-tl-none font-medium prose dark:prose-invert prose-sm max-w-none'
                                    }`}>
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                                {msg.relatedConcept && (
                                    <button
                                        onClick={() => {
                                            onSelectConcept(msg.relatedConcept!);
                                            setIsOpen(false);
                                        }}
                                        className="mt-2 flex items-center gap-2 px-4 py-2 bg-accent-gold text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-accent-gold/20"
                                    >
                                        <span className="material-symbols-outlined text-sm">visibility</span>
                                        Ver {msg.relatedConcept.concept}
                                    </button>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none flex gap-1">
                                    <div className="size-1.5 bg-gray-300 dark:bg-slate-500 rounded-full animate-bounce"></div>
                                    <div className="size-1.5 bg-gray-300 dark:bg-slate-500 rounded-full animate-bounce delay-100"></div>
                                    <div className="size-1.5 bg-gray-300 dark:bg-slate-500 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex gap-2"
                    >
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Pregúntame algo sobre Derecho..."
                            className="flex-1 bg-gray-50 dark:bg-slate-800 border-transparent rounded-xl text-sm focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary/20 dark:text-white transition-all outline-none px-4 py-2"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="size-10 bg-primary text-white rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-primary-dark transition-colors shrink-0"
                            aria-label="Enviar pregunta"
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
