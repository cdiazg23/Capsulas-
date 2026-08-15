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
    relatedConcepts?: LegalConcept[];
}

const STARTER_SUGGESTIONS = [
    "¿Qué es la Tradición y sus requisitos?",
    "Diferencia entre Dolo y Culpa",
    "Requisitos del Acto Jurídico",
    "¿Cómo opera la Prescripción?"
];

const IurisBot: React.FC<IurisBotProps> = ({ concepts, onSelectConcept }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "¡Hola! Soy **IurisBot** 🤖, tu tutor jurídico inteligente.\n\nPuedo explicarte conceptos del Código Civil, Procesal y Constitucional, resolver dudas dogmáticas o guiarte en tu preparación para el examen de grado. ¿Qué materia o concepto quieres revisar?",
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
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isTyping, isOpen]);

    const normalizeText = (text: string) => {
        return text.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    };

    const findRelevantConcepts = (query: string, limit = 4): LegalConcept[] => {
        const normalizedTerm = normalizeText(query);
        const noise = ['que', 'es', 'son', 'el', 'la', 'los', 'las', 'un', 'una', 'dime', 'explica', 'sobre', 'define', 'significa', 'cual', 'cuales', 'como', 'funciona', 'diferencia', 'entre', 'para', 'por', 'del'];
        const keywords = normalizedTerm.split(' ').filter(word => !noise.includes(word) && word.length > 2);

        if (keywords.length === 0 && !normalizedTerm) return [];

        const scored = concepts.map(c => {
            let score = 0;
            const normConcept = normalizeText(c.concept || '');
            const normCat = normalizeText(c.category || '');
            const normSub = normalizeText(c.subcategory || '');
            const normDef = normalizeText(c.definitionSimple || '');
            const normReg = normalizeText(c.legalArticle || '');

            if (normConcept === normalizedTerm) score += 120;
            else if (normalizedTerm.includes(normConcept) && normConcept.length > 3) score += 60;
            else if (normConcept.includes(normalizedTerm) && normalizedTerm.length > 3) score += 40;

            keywords.forEach(k => {
                if (normConcept.includes(k)) score += 25;
                if (normCat.includes(k)) score += 12;
                if (normSub.includes(k)) score += 10;
                if (normReg.includes(k)) score += 8;
                if (normDef.includes(k)) score += 5;
            });

            return { concept: c, score };
        });

        return scored
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.concept);
    };

    const handleSend = async (customText?: string) => {
        const textToSend = customText || inputValue;
        if (!textToSend.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            text: textToSend,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        if (!customText) setInputValue('');
        setIsTyping(true);

        // 1. RAG Local: Recuperar los conceptos más relevantes para inyectar contexto
        const relevantConcepts = findRelevantConcepts(textToSend, 4);

        try {
            // Construir contexto enriquecido para la IA
            const contextText = relevantConcepts.length > 0
                ? relevantConcepts.map(c => `- **${c.concept}** (${c.category || 'Derecho'} · ${c.legalArticle || 'Doctrina'}): ${c.definitionSimple} | Ejemplo: ${c.example || 'N/A'}`).join('\n')
                : concepts.slice(0, 8).map(c => `- **${c.concept}**: ${c.definitionSimple}`).join('\n');

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('TIMEOUT')), 15000)
            );

            const fetchPromise = supabase.functions.invoke('iuris-chat', {
                body: { message: textToSend, context: contextText }
            });

            const response = await Promise.race([fetchPromise, timeoutPromise]) as any;

            if (response.data?.reply) {
                const botMessage: Message = {
                    id: Date.now() + 1,
                    text: response.data.reply,
                    sender: 'bot',
                    timestamp: new Date(),
                    relatedConcepts: relevantConcepts.length > 0 ? relevantConcepts : undefined
                };
                setMessages(prev => [...prev, botMessage]);
            } else {
                throw new Error('FALLO_IA');
            }

        } catch (error: any) {
            console.error('Bot IA Error:', error);

            // Fallback Pedagógico Estructurado
            let fallbackText = '';
            if (relevantConcepts.length > 0) {
                const primary = relevantConcepts[0];
                fallbackText = `### 📖 ${primary.concept}\n\n${primary.definitionSimple}\n\n`;
                if (primary.legalArticle) {
                    fallbackText += `* **Regulación Legal:** ${primary.legalArticle}\n`;
                }
                if (primary.category) {
                    fallbackText += `* **Materia:** ${primary.category} ${primary.subcategory ? `(${primary.subcategory})` : ''}\n`;
                }
                if (primary.example) {
                    fallbackText += `\n> **💡 Ejemplo Práctico:** ${primary.example}`;
                }
                if (relevantConcepts.length > 1) {
                    fallbackText += `\n\n*Conceptos afines encontrados en la base:* ${relevantConcepts.slice(1).map(c => `**${c.concept}**`).join(', ')}.`;
                }
            } else {
                fallbackText = "No encontré una coincidencia directa en nuestra base de datos. Prueba buscando términos como *Tradición*, *Dolo*, *Prescripción*, *Contratos* o *Recurso de Apelación*.";
            }

            const botMessage: Message = {
                id: Date.now() + 2,
                text: fallbackText,
                sender: 'bot',
                timestamp: new Date(),
                relatedConcepts: relevantConcepts.length > 0 ? relevantConcepts : undefined
            };
            setMessages(prev => [...prev, botMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleClearChat = () => {
        setMessages([
            {
                id: Date.now(),
                text: "Conversación reiniciada. ¿Qué concepto o duda jurídica deseas explorar?",
                sender: 'bot',
                timestamp: new Date()
            }
        ]);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-24 right-6 size-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[100] group"
                title="Abrir Asistente Jurídico IurisBot"
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
                <div className="fixed bottom-40 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[520px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-[100] animate-in slide-in-from-bottom-5 duration-300 dark:bg-slate-900 dark:border-slate-800">
                    {/* Header */}
                    <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">smart_toy</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-black tracking-tight flex items-center gap-1.5">
                                    IurisBot <span className="text-[10px] text-primary uppercase bg-primary/20 px-1.5 py-0.5 rounded font-black tracking-wider">TUTOR</span>
                                </h3>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex items-center gap-1">
                                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                    Asistente Jurídico Activo
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleClearChat}
                                className="size-8 rounded-lg hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
                                title="Reiniciar conversación"
                            >
                                <span className="material-symbols-outlined text-sm">refresh</span>
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="size-8 rounded-lg hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
                                title="Cerrar chat"
                            >
                                <span className="material-symbols-outlined text-base">close</span>
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                    ? 'bg-primary text-white rounded-tr-none font-medium'
                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none prose dark:prose-invert prose-sm max-w-none'
                                    }`}>
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>

                                {/* Concept Action Chips */}
                                {msg.relatedConcepts && msg.relatedConcepts.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                                        {msg.relatedConcepts.map(c => (
                                            <button
                                                key={c.id}
                                                onClick={() => {
                                                    onSelectConcept(c);
                                                    setIsOpen(false);
                                                }}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-gold text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:scale-105 transition-all shadow-md shadow-accent-gold/20"
                                            >
                                                <span className="material-symbols-outlined text-xs">visibility</span>
                                                <span>Ver {c.concept}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Starter Suggestions */}
                        {messages.length === 1 && !isTyping && (
                            <div className="pt-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Preguntas sugeridas:</p>
                                <div className="grid grid-cols-1 gap-1.5">
                                    {STARTER_SUGGESTIONS.map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSend(suggestion)}
                                            className="text-left text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-2.5 rounded-xl hover:border-primary hover:text-primary transition-all font-medium flex items-center justify-between group"
                                        >
                                            <span>{suggestion}</span>
                                            <span className="material-symbols-outlined text-xs text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all">chevron_right</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                                    <div className="size-2 bg-primary rounded-full animate-bounce"></div>
                                    <div className="size-2 bg-primary/70 rounded-full animate-bounce delay-150"></div>
                                    <div className="size-2 bg-primary/40 rounded-full animate-bounce delay-300"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Bar */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2"
                    >
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Consulta un concepto o materia..."
                            className="flex-1 bg-slate-50 dark:bg-slate-800 border-transparent rounded-xl text-sm focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary/20 dark:text-white transition-all outline-none px-4 py-2.5 placeholder:text-slate-400"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="size-10 bg-primary text-white rounded-xl flex items-center justify-center disabled:opacity-40 hover:bg-primary-dark transition-colors shrink-0 shadow-md shadow-primary/20"
                            aria-label="Enviar pregunta"
                        >
                            <span className="material-symbols-outlined text-lg">send</span>
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default IurisBot;
