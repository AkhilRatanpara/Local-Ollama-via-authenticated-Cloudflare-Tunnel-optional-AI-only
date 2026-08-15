"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Send, Sparkles, User, Minimize2 } from "lucide-react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";

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
    const [isHovered, setIsHovered] = useState(false);
    const bounceControls = useAnimationControls();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    /* ── Bounce loop management ── */
    const startBounce = () => {
        bounceControls.start({
            y: [0, -9, 0],
            transition: {
                duration: 2.6,
                repeat: Infinity,
                ease: [0.45, 0, 0.55, 1],
                repeatType: 'loop',
            }
        });
    };

    // Start bounce on mount + every time chat closes
    useEffect(() => {
        if (isOpen) {
            bounceControls.stop();
            return;
        }
        // Small delay after chat closes so exit animation finishes first
        const t = setTimeout(startBounce, 350);
        return () => clearTimeout(t);
    }, [isOpen]);

    const handleHoverStart = () => {
        if (isOpen) return;
        setIsHovered(true);
        bounceControls.stop();
        // Glide smoothly to rest position
        bounceControls.start({
            y: 0,
            transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
        });
    };

    const handleHoverEnd = () => {
        if (isOpen) return;
        setIsHovered(false);
        // Resume from y:0
        startBounce();
    };

    const openChat = () => {
        setIsHovered(false);
        bounceControls.stop();
        setIsOpen(true);
    };

    const closeChat = () => {
        setIsOpen(false);
        // bounce restarts via useEffect after 350ms
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    useEffect(() => {
        const handleOpen = () => openChat();
        window.addEventListener('open-chatbot', handleOpen);
        return () => window.removeEventListener('open-chatbot', handleOpen);
    }, []);

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
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Sorry, I encountered an error connecting to the AI service.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center justify-end">
            {/* ── Label Pill (slides out to the left when hovered) ── */}
            {!isOpen && (
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            key="saarthi-label"
                            initial={{ width: 0, opacity: 0, x: 20 }}
                            animate={{ width: 'auto', opacity: 1, x: 0 }}
                            exit={{ width: 0, opacity: 0, x: 20 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="mr-3 overflow-hidden shrink-0 pointer-events-none select-none bg-transparent"
                            style={{ background: 'transparent', borderRadius: '9999px' }}
                        >
                            <div style={{ padding: '2px 0', background: 'transparent', borderRadius: '9999px' }} className="bg-transparent">
                                <div
                                    className="flex items-center gap-2.5 px-5 py-2.5 text-sm font-bold text-white shadow-xl"
                                    style={{
                                        background: 'linear-gradient(135deg, #1e3a8a 0%, #4338ca 55%, #0f766e 100%)',
                                        borderRadius: '9999px',
                                        boxShadow: '0 6px 28px rgba(99,102,241,0.55)',
                                        whiteSpace: 'nowrap',
                                        letterSpacing: '0.03em',
                                    }}
                                >
                                    <Sparkles className="w-4 h-4 text-teal-300 shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(94,234,212,0.9))' }} />
                                    Saarthi AI
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* ── Main Interactive Component (Button / Panel) ── */}
            <div className="relative shrink-0">
                {/* Unified morphing container */}
                <motion.div
                    layout
                    animate={isOpen ? { y: 0, scale: 1 } : bounceControls}
                    onHoverStart={handleHoverStart}
                    onHoverEnd={handleHoverEnd}
                    whileTap={isOpen ? undefined : { scale: 0.93 }}
                    onClick={isOpen ? undefined : openChat}
                    className={`${
                        isOpen
                            ? "overflow-hidden w-[94vw] md:w-[520px] h-[75vh] md:h-[680px] max-h-[85vh] bg-white/96 backdrop-blur-xl border border-slate-200/80 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.25)] flex flex-col"
                            : "overflow-visible w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
                    }`}
                    style={{
                        borderRadius: isOpen ? '24px' : '9999px',
                        background: isOpen
                            ? 'rgba(255, 255, 255, 0.98)'
                            : 'linear-gradient(135deg, #1e3a8a 0%, #4338ca 50%, #0f766e 100%)',
                        boxShadow: isOpen
                            ? undefined
                            : isHovered
                            ? '0 14px 40px rgba(67,56,202,0.7)'
                            : '0 8px 28px rgba(67,56,202,0.45)',
                        transition: 'box-shadow 0.3s',
                        transformOrigin: 'bottom right',
                    }}
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="chat-panel"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="w-full h-full flex flex-col"
                            >
                                {/* Header */}
                                <div className="bg-gradient-to-r from-blue-900 to-indigo-800 px-5 py-4 text-white flex items-center justify-between shrink-0 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 shrink-0">
                                            <span className="absolute inset-0 rounded-full bg-teal-400/25 animate-ping" style={{ animationDuration: '2.5s' }} />
                                            <div className="relative w-10 h-10 rounded-full flex items-center justify-center"
                                                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.35) 0%, rgba(20,184,166,0.35) 100%)', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                                                <Sparkles className="w-5 h-5 text-teal-300" style={{ filter: 'drop-shadow(0 0 4px rgba(94,234,212,0.8))' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm tracking-wide">Saarthi AI</h3>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                                                <span className="text-[10px] text-teal-100 font-bold uppercase tracking-wider">Online • Database Connected</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button type="button" onClick={closeChat} className="p-2 rounded-full hover:bg-white/15 transition-colors text-white/70 hover:text-white">
                                            <Minimize2 className="w-4 h-4" />
                                        </button>
                                        <button type="button" onClick={closeChat} className="p-2 rounded-full hover:bg-red-500/70 transition-colors text-white/70 hover:text-white">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto px-5 py-5 bg-slate-50/80"
                                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>
                                    <AnimatePresence initial={false}>
                                        {messages.map((msg) => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                                className={`flex mb-5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-sm border ${msg.role === 'user' ? 'bg-blue-800 border-blue-700' : 'bg-white border-slate-200'}`}>
                                                        {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-indigo-600" />}
                                                    </div>
                                                    <div className={`rounded-2xl px-5 py-4 shadow-sm leading-relaxed text-[14px] ${msg.role === 'user'
                                                        ? 'bg-blue-800 text-white rounded-tr-sm border border-blue-700/50'
                                                        : 'bg-white text-slate-700 rounded-tl-sm border border-slate-200/60'}`}>
                                                        {msg.role === 'user' ? msg.content : <FormatMessage content={msg.content} />}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                        {isTyping && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="flex mb-4 justify-start"
                                            >
                                                <div className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-white border border-slate-200 shadow-sm">
                                                        <Sparkles className="w-4 h-4 text-indigo-600" />
                                                    </div>
                                                    <div className="rounded-2xl px-5 py-4 bg-white border border-slate-200/60 shadow-sm rounded-tl-sm flex items-center gap-1.5">
                                                        <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-slate-400 rounded-full block" />
                                                        <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-slate-400 rounded-full block" />
                                                        <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-slate-400 rounded-full block" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="px-5 py-4 bg-white border-t border-slate-100">
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
                        ) : (
                            <motion.div
                                key="chat-button"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="w-full h-full flex items-center justify-center relative rounded-full"
                            >
                                {/* Outer pulsing ring overlay inside the bouncing button */}
                                <span
                                    className="absolute inset-0 rounded-full animate-ping pointer-events-none"
                                    style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.55) 0%, transparent 70%)', animationDuration: '2.2s' }}
                                />
                                {/* Spinning rainbow border overlay inside the bouncing button */}
                                <span
                                    className="absolute -inset-[3px] rounded-full pointer-events-none"
                                    style={{
                                        background: 'conic-gradient(from var(--sai-a, 0deg), #6366f1, #14b8a6, #a855f7, #6366f1)',
                                        animation: 'saiBorder 3s linear infinite',
                                        opacity: isHovered ? 1 : 0.8,
                                        transition: 'opacity 0.4s',
                                    }}
                                />

                                {/* Glass shine */}
                                <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 33% 28%, rgba(255,255,255,0.3) 0%, transparent 58%)' }} />
                                {/* Rotating sweep */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-0 rounded-full"
                                    style={{ background: 'conic-gradient(from 0deg, transparent, rgba(20,184,166,0.75), transparent)', opacity: 0.28 }}
                                />
                                <motion.div
                                    animate={isHovered ? { scale: 1.25, rotate: 18 } : { scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 320, damping: 16 }}
                                    className="relative z-10"
                                >
                                    <Sparkles className="text-teal-300 w-6 h-6" style={{ filter: 'drop-shadow(0 0 6px rgba(94,234,212,1))' }} />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            <style>{`
                @property --sai-a { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
                @keyframes saiBorder { to { --sai-a: 360deg; } }
            `}</style>
        </div>
    );
}
