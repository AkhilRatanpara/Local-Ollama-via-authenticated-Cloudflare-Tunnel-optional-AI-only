"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { MessageCircle, X, Send, Sparkles, Bot, User, Loader2 } from "lucide-react";

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    type?: 'text' | 'recommendation';
    recommendations?: any[];
}

export default function FloatingChatbot() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I am Sangam AI, your intelligent guide to government schemes. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // 1. Analyze Intent
            fetch('/api/ai/intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            }).catch(console.error);

            // 2. Chat Response
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
                    userProfile: user // Pass user profile for context-aware chat
                }),
            });

            if (!response.ok) throw new Error(response.statusText);

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) return;

            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                setMessages(prev => {
                    const lastMsg = prev[prev.length - 1];
                    const newContent = lastMsg.content + chunk;
                    return [...prev.slice(0, -1), { ...lastMsg, content: newContent }];
                });
            }

        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error connecting to the AI service. Please ensure Ollama is running locally." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSmartRecommendations = () => {
        if (!user || loading) return;
        const msg = "Please analyze my profile and recommend the best government schemes for me based on my eligibility.";
        setInput(msg);
        // We can't easily trigger the form submit from here without a ref or moving logic, 
        // but the user can just hit 'Send'. Or better, we just call the chat logic.
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-[100] ${
                    isOpen ? 'bg-black rotate-90 scale-90' : 'bg-gray-900 hover:bg-black hover:scale-110'
                }`}
            >
                {isOpen ? <X className="text-white w-6 h-6" /> : <MessageCircle className="text-white w-6 h-6" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                    </span>
                )}
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl transition-all duration-500 z-[100] flex flex-col border border-gray-200 overflow-hidden ${
                isOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-12 scale-90 pointer-events-none'
            }`}>
                
                {/* Header */}
                <div className="bg-[#111111] p-5 text-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Sangam AI Assistant</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Online</span>
                            </div>
                        </div>
                    </div>
                    {user && (
                        <button 
                            onClick={handleSmartRecommendations}
                            disabled={loading}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                            title="Smart Recommendations"
                        >
                            <Sparkles className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    )}
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-gray-900' : 'bg-gray-200'}`}>
                                    {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-gray-600" />}
                                </div>
                                <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.role === 'user' 
                                    ? 'bg-gray-900 text-white rounded-tr-none' 
                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>
                                    
                                    {msg.type === 'recommendation' && msg.recommendations ? (
                                        <div className="space-y-3">
                                            <p className="font-medium">{msg.content}</p>
                                            <div className="grid gap-2">
                                                {msg.recommendations.map((rec: any, i: number) => (
                                                    <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                        <div className="flex justify-between items-start mb-1 gap-2">
                                                            <div className="font-bold text-xs text-gray-900">{rec.title}</div>
                                                            <div className="text-[10px] font-black text-blue-600 shrink-0">
                                                                {rec.score}%
                                                            </div>
                                                        </div>
                                                        <p className="text-[10px] text-gray-500 mb-2 line-clamp-2">{rec.reason}</p>
                                                        <Link href={`/schemes/${rec.schemeId}`} onClick={() => setIsOpen(false)} className="text-[10px] font-bold text-gray-900 hover:underline">
                                                            View Details →
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        msg.content ? (
                                            <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                                        ) : (
                                            <div className="flex gap-1 py-1">
                                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your question..."
                            disabled={loading}
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-gray-900 text-white p-2.5 rounded-xl hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center shrink-0"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </form>
                    <p className="text-[10px] text-gray-400 mt-2 text-center">AI generated response. Please verify.</p>
                </div>
            </div>
        </>
    );
}
