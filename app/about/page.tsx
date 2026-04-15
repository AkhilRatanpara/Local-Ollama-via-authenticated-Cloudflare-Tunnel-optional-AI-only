"use client";

import { Sparkles, CheckCircle2, HeartHandshake, ShieldCheck, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="w-full pb-20 min-h-screen font-sans">
            {/* Hero Section */}
            <section className="relative w-full pt-40 pb-24 overflow-hidden flex items-center justify-center text-slate-900 border-b border-slate-100">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_40%,#000_70%,transparent_100%)]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-sm font-bold text-blue-700 mb-8 shadow-sm"
                    >
                        <HeartHandshake size={16} />
                        Our Mission
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 drop-shadow-sm font-heading"
                    >
                        Building the <br className="hidden md:block"/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-indigo-600">Last Mile Bridge</span> for Welfare.
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12 font-medium"
                    >
                        Sangam AI was born from a simple observation: India has thousands of welfare schemes, yet millions miss out due to a lack of awareness and complex bureaucracy. We use state-of-the-art AI to solve this information gap permanently.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                <div className="grid md:grid-cols-2 gap-12 items-stretch mb-24">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                        {[
                            { title: "Radical Transparency", desc: "No hidden fees. No brokers. SANGAM is completely free forever for citizens.", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50", border: "group-hover:border-blue-200" },
                            { title: "Universal Accessibility", desc: "Available across multiple platforms, simplifying legal jargon into plain language that anyone can understand.", icon: HeartHandshake, color: "text-teal-600", bg: "bg-teal-50", border: "group-hover:border-teal-200" },
                            { title: "Smart Machine Learning", desc: "Our engine reliably sorts and matches 1.4B people to the exact 2.5K schemes they are eligible for in milliseconds.", icon: Cpu, color: "text-indigo-600", bg: "bg-indigo-50", border: "group-hover:border-indigo-200" }
                        ].map((val, idx) => (
                            <div key={idx} className={`group flex gap-6 p-6 rounded-3xl bg-white border border-slate-200 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 ${val.border}`}>
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${val.bg} ${val.color} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                    <val.icon size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{val.title}</h3>
                                    <p className="text-slate-600 leading-relaxed font-medium">{val.desc}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                        className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl h-full flex flex-col justify-center"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl -ml-16 -mb-16"></div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 mb-6">
                                <Sparkles className="text-teal-300" size={24} />
                                <h2 className="text-3xl font-bold text-white tracking-tight">Our Impact Radius</h2>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-x-8 gap-y-12 mt-4">
                                <div>
                                    <div className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white drop-shadow-sm">50K+</div>
                                    <p className="text-blue-200 font-bold uppercase tracking-wider text-xs">Schemes Discovered</p>
                                </div>
                                <div>
                                    <div className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white drop-shadow-sm">₹12Cr</div>
                                    <p className="text-blue-200 font-bold uppercase tracking-wider text-xs">Benefits Unlocked</p>
                                </div>
                                <div>
                                    <div className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white drop-shadow-sm">100+</div>
                                    <p className="text-blue-200 font-bold uppercase tracking-wider text-xs">Core Team</p>
                                </div>
                                <div>
                                    <div className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white drop-shadow-sm">24/7</div>
                                    <p className="text-blue-200 font-bold uppercase tracking-wider text-xs">AI Assistance Uptime</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Team / Join CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                    className="text-center bg-white border border-slate-200 rounded-[2rem] p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-full bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
                    
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 font-heading">Built for you, <span className="text-blue-700">by passionate builders.</span></h2>
                    <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                        We are a group of dedicated engineers, designers, and policy experts obsessed with creating friction-free digital public infrastructure.
                    </p>
                    <Link href="/register" className="inline-flex items-center gap-2 bg-blue-800 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl shadow-blue-900/20 hover:-translate-y-0.5 hover:bg-blue-700 transition-all text-lg">
                        Create Your Free Profile <CheckCircle2 size={20} />
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
