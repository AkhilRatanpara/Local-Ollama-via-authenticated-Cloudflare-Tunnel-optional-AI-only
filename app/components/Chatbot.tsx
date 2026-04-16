"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Send, Sparkles, User, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    type?: 'text' | 'recommendation';
    recommendations?: any[];
}

// Converts raw AI text into formatted JSX with paragraphs, bold, bullets, etc.
function FormatMessage({ content }: { content: string }) {
    const formatted = useMemo(() => {
        if (!content) return [];

        const blocks = content.split(/\n/).map(line => line.trim());

        return blocks.map((line, i) => {
            if (!line) return <div key={i} className="h-2" />;

            // Numbered list item (1. Something)
            const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
            if (numberedMatch) {
                return (
                    <div key={i} className="flex gap-2.5 py-1 pl-1">
                        <span className="text-blue-500 font-bold text-xs bg-blue-50 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{numberedMatch[1]}</span>
                        <span className="flex-1">{renderInline(numberedMatch[2])}</span>
                    </div>
                );
            }

            // Bullet list item (- Something or • Something or * Something at start)
            const bulletMatch = line.match(/^[-•\*]\s+(.*)/);
            if (bulletMatch) {
                return (
                    <div key={i} className="flex gap-2.5 py-1 pl-1">
                        <span className="text-blue-400 mt-1.5 shrink-0">•</span>
                        <span className="flex-1">{renderInline(bulletMatch[1])}</span>
                    </div>
                );
            }

            // Heading-like line (starts with # or ##)
            const headingMatch = line.match(/^#{1,3}\s+(.*)/);
            if (headingMatch) {
                return <p key={i} className="font-bold text-slate-900 text-[15px] mt-2 mb-1">{renderInline(headingMatch[1])}</p>;
            }

            // Regular paragraph
            return <p key={i} className="py-0.5">{renderInline(line)}</p>;
        });
    }, [content]);

    return <div className="space-y-0.5">{formatted}</div>;
}

// Handles inline formatting: **bold**, *italic*, `code`
function renderInline(text: string) {
    const parts: (string | React.ReactElement)[] = [];
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
    let lastIndex = 0;
    let match;
    let keyIndex = 0;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }

        if (match[2]) {
            parts.push(<strong key={keyIndex++} className="font-bold text-slate-900">{match[2]}</strong>);
        } else if (match[3]) {
            parts.push(<em key={keyIndex++} className="italic text-slate-700">{match[3]}</em>);
        } else if (match[4]) {
            parts.push(<code key={keyIndex++} className="bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-mono">{match[4]}</code>);
        }

        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
}

export default function FloatingChatbot() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'Hello! I am Saarthi AI, your intelligent guide to government schemes. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsgId = Date.now().toString();
        const userMessage: Message = { id: userMsgId, role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            fetch('/api/ai/intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            }).catch(console.error);

            await new Promise(r => setTimeout(r, 400));
            setIsTyping(true);

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
                    userProfile: user 
                }),
            });

            setIsTyping(false);

            if (!response.ok) throw new Error(response.statusText);

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) return;

            const assistantMsgId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                setMessages(prev => {
                    const lastMsg = prev[prev.length - 1];
                    return [...prev.slice(0, -1), { ...lastMsg, content: lastMsg.content + chunk }];
                });
            }

        } catch (error) {
            console.error('Chat error:', error);
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "Sorry, I encountered an error connecting to the AI service." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="mb-6 w-[94vw] md:w-[520px] h-[75vh] md:h-[700px] max-h-[85vh] bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] flex flex-col border border-slate-200 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 px-5 py-4 text-white flex items-center justify-between shrink-0 shadow-sm relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                                    <Sparkles className="w-5 h-5 text-teal-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-wide">Saarthi AI</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                                        <span className="text-[10px] text-teal-100 font-bold uppercase tracking-wider">Online • Database Connected</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white">
                                    <Minimize2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-red-500/80 transition-colors text-white/80 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto px-5 py-5 bg-slate-50/80 scroll-smooth" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => (
                                    <motion.div 
                                        key={msg.id} 
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.4, ease: 'easeOut' }}
                                        className={`flex mb-5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-sm border ${msg.role === 'user' ? 'bg-blue-800 border-blue-700' : 'bg-white border-slate-200'}`}>
                                                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-indigo-600" />}
                                            </div>
                                            <div className={`rounded-2xl px-5 py-4 shadow-sm leading-relaxed ${msg.role === 'user' 
                                                ? 'bg-blue-800 text-white rounded-tr-sm border border-blue-700/50 text-[14px]' 
                                                : 'bg-white text-slate-700 rounded-tl-sm border border-slate-200/60 text-[14px]'}`}>
                                                {msg.role === 'user' ? (
                                                    msg.content
                                                ) : (
                                                    <FormatMessage content={msg.content} />
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                        className="flex mb-4 justify-start"
                                    >
                                        <div className="flex gap-3 max-w-[85%]">
                                            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-white border border-slate-200 shadow-sm">
                                                <Sparkles className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <div className="rounded-2xl px-5 py-4 bg-white border border-slate-200/60 shadow-sm rounded-tl-sm flex items-center gap-1.5">
                                                <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-slate-400 rounded-full block"></motion.span>
                                                <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-slate-400 rounded-full block"></motion.span>
                                                <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-slate-400 rounded-full block"></motion.span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Form */}
                        <div className="px-5 py-4 bg-white border-t border-slate-100 z-10">
                            <form onSubmit={handleSubmit} className="flex gap-2 relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about any government scheme..."
                                    disabled={loading || isTyping}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-full pl-5 pr-14 py-3.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all disabled:opacity-50 text-slate-800 placeholder-slate-400"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || isTyping || !input.trim()}
                                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-gradient-to-r from-blue-700 to-indigo-600 text-white rounded-full hover:shadow-[0_4px_14px_rgba(30,64,175,0.3)] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center shrink-0 w-10"
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </button>
                            </form>
                            <p className="text-[10px] text-slate-400 mt-3 text-center uppercase tracking-wider font-semibold">AI generated response • Data from Sangam DB</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover="hover"
                    onClick={() => setIsOpen(true)}
                    className="group flex items-center gap-3 bg-gradient-to-r from-blue-800 to-indigo-700 p-4 rounded-full shadow-[0_8px_30px_rgb(30,64,175,0.3)] hover:shadow-[0_12px_40px_rgb(30,64,175,0.4)] transition-all overflow-hidden relative"
                >
                    <motion.div variants={{ hover: { rotate: 20, scale: 1.1 } }} transition={{ duration: 0.3 }} className="relative z-10 flex-shrink-0">
                        <Sparkles className="text-teal-300 w-6 h-6" />
                    </motion.div>
                    
                    <motion.div 
                        variants={{ hover: { width: "auto", opacity: 1, paddingRight: 8, transition: { duration: 0.3, ease: "easeOut" } } }} 
                        initial={{ width: 0, opacity: 0, paddingRight: 0 }}
                        className="relative z-10 overflow-hidden whitespace-nowrap"
                    >
                        <span className="text-white font-bold tracking-wide">Saarthi AI</span>
                    </motion.div>

                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
            )}
        </div>
    );
}
