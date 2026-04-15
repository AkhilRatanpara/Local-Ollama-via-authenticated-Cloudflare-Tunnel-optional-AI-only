"use client";

import Image from "next/image";
import Link from "next/link";
import { GraduationCap, ArrowRight, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full bg-slate-50 border-t border-slate-200 overflow-hidden relative text-slate-600">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-100/50 blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-3 group relative inline-flex mb-6">
                            <div className="relative w-10 h-10 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105">
                                <div className="absolute inset-0 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300"></div>
                                <div className="relative flex items-center justify-center overflow-hidden">
                                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[24px] h-[24px]">
                                        <path d="M6 26C6 14.9543 14.9543 6 26 6" stroke="#1e40af" strokeWidth="4" strokeLinecap="round"/>
                                        <path d="M26 26C14.9543 26 6 17.0457 6 6" stroke="#14b8a6" strokeWidth="4" strokeLinecap="round"/>
                                    </svg>
                                </div>
                            </div>
                            <span className="font-heading font-black text-2xl tracking-tighter text-slate-900 group-hover:text-blue-900 transition-colors">
                                Sangam
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed mb-6 font-medium text-slate-500">
                            Democratizing access to government welfare with state-of-the-art AI-powered discovery and matching.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-blue-50 text-slate-400 hover:text-blue-700 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-blue-50 text-slate-400 hover:text-blue-700 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-blue-50 text-slate-400 hover:text-blue-700 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
                                <Github size={18} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 font-heading tracking-wide">Quick Links</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link href="/about" className="hover:text-blue-700 hover:translate-x-1 inline-block transition-all focus:outline-none">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-700 hover:translate-x-1 inline-block transition-all focus:outline-none">Contact</Link></li>
                            <li><Link href="/privacy" className="hover:text-blue-700 hover:translate-x-1 inline-block transition-all focus:outline-none">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 font-heading tracking-wide">Resources</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><a href="https://india.gov.in" target="_blank" className="hover:text-teal-600 hover:translate-x-1 inline-block transition-all focus:outline-none">India.gov.in</a></li>
                            <li><a href="https://digitalindia.gov.in" target="_blank" className="hover:text-teal-600 hover:translate-x-1 inline-block transition-all focus:outline-none">Digital India</a></li>
                            <li><a href="https://pmindia.gov.in" target="_blank" className="hover:text-teal-600 hover:translate-x-1 inline-block transition-all focus:outline-none">PMO India</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 font-heading tracking-wide">Stay Updated</h4>
                        <p className="text-xs mb-4 text-slate-500 font-medium">Get the latest scheme updates straight to your inbox.</p>
                        <div className="flex bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 transition-all focus-within:border-blue-400">
                            <input type="email" placeholder="Email Address" className="px-5 py-3 w-full text-sm bg-transparent border-none text-slate-900 placeholder-slate-400 focus:outline-none" />
                            <button className="bg-slate-100 text-blue-700 px-5 py-3 hover:bg-blue-50 transition-colors border-l border-slate-200 flex items-center justify-center">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm gap-4 font-medium">
                    <p>&copy; 2026 Sangam AI. All rights reserved.</p>
                    <p className="flex items-center gap-1.5 focus:outline-none">Developed with <span className="text-red-500 animate-pulse">❤️</span> in India</p>
                </div>
            </div>
        </footer>
    );
}
