"use client";

import Image from "next/image";
import Link from "next/link";
import { GraduationCap, ArrowRight, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full bg-[#050b14] border-t border-white/10 overflow-hidden relative text-slate-400">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-3 group relative inline-flex mb-6">
                            <div className="relative w-10 h-10 flex items-center justify-center transition-transform duration-700 ease-out group-hover:rotate-[360deg]">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 rounded-xl blur shadow-lg opacity-40 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative w-[38px] h-[38px] bg-[#050b14] rounded-xl flex items-center justify-center border border-white/20 overflow-hidden">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px]">
                                        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#paint0_linear)"/>
                                        <path d="M2 17L12 22L22 17" stroke="url(#paint1_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M2 12L12 17L22 12" stroke="url(#paint2_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <defs>
                                            <linearGradient id="paint0_linear" x1="2" y1="7" x2="22" y2="7" gradientUnits="userSpaceOnUse"><stop stopColor="#3B82F6"/><stop offset="1" stopColor="#10B981"/></linearGradient>
                                            <linearGradient id="paint1_linear" x1="2" y1="17" x2="22" y2="17" gradientUnits="userSpaceOnUse"><stop stopColor="#6366F1"/><stop offset="1" stopColor="#3B82F6"/></linearGradient>
                                            <linearGradient id="paint2_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse"><stop stopColor="#10B981"/><stop offset="1" stopColor="#6366F1"/></linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                            <span className="font-heading font-black text-2xl tracking-tighter text-white">
                                Sangam
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed mb-6 font-light">
                            Democratizing access to government welfare with state-of-the-art AI-powered discovery and matching.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300">
                                <Github size={18} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 font-heading tracking-wide">Quick Links</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/about" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all focus:outline-none">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all focus:outline-none">Contact</Link></li>
                            <li><Link href="/privacy" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all focus:outline-none">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 font-heading tracking-wide">Resources</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="https://india.gov.in" target="_blank" className="hover:text-emerald-400 hover:translate-x-1 inline-block transition-all focus:outline-none">India.gov.in</a></li>
                            <li><a href="https://digitalindia.gov.in" target="_blank" className="hover:text-emerald-400 hover:translate-x-1 inline-block transition-all focus:outline-none">Digital India</a></li>
                            <li><a href="https://pmindia.gov.in" target="_blank" className="hover:text-emerald-400 hover:translate-x-1 inline-block transition-all focus:outline-none">PMO India</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 font-heading tracking-wide">Stay Updated</h4>
                        <p className="text-xs mb-4">Get the latest scheme updates straight to your inbox.</p>
                        <div className="flex shadow-[0_0_15px_rgba(255,255,255,0.05)] rounded-xl overflow-hidden glass-panel focus-within:ring-2 focus-within:ring-blue-500/50 transition-all focus-within:border-blue-500/50">
                            <input type="email" placeholder="Email Address" className="px-5 py-3 w-full text-sm bg-transparent border-none text-white placeholder-slate-500 focus:outline-none" />
                            <button className="bg-blue-600 text-white px-5 py-3 hover:bg-blue-500 transition-colors flex items-center justify-center">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm gap-4">
                    <p>&copy; 2026 Sangam AI. All rights reserved.</p>
                    <p className="flex items-center gap-1.5 focus:outline-none">Developed with <span className="text-red-500 animate-pulse">❤️</span> in India</p>
                </div>
            </div>
        </footer>
    );
}
