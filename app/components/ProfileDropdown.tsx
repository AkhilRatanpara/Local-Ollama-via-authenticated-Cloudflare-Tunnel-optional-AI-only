"use client";

import { useState, useRef, useEffect } from "react";
import { User as UserIcon, Settings, LogOut, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface ProfileDropdownProps {
    user?: any;
    onLogout: () => void;
}

export default function ProfileDropdown({ user, onLogout }: ProfileDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-full py-1 px-2 border border-transparent hover:border-slate-200 hover:bg-white transition-all group shadow-none hover:shadow-sm focus:outline-none"
            >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${user ? 'bg-slate-50 border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:shadow-[0_0_12px_rgba(30,64,175,0.15)]' : 'bg-gradient-to-tr from-slate-100 to-slate-50 border-slate-200 group-hover:border-indigo-200 group-hover:shadow-[0_0_15px_rgba(79,70,229,0.1)]'}`}>
                    <UserIcon size={18} className={user ? "text-slate-500 group-hover:text-blue-700 transition-colors" : "text-slate-400 group-hover:text-indigo-600 transition-colors"} />
                </div>
                
                {user ? (
                    <div className="flex flex-col items-start pr-1 hidden sm:flex">
                        <span className="text-xs font-bold text-slate-800 leading-tight group-hover:text-blue-900 transition-colors">{user.name.split(' ')[0]}</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-start pr-1 hidden sm:flex">
                         <span className="text-sm font-bold text-slate-600 leading-tight group-hover:text-indigo-700 transition-colors">Account</span>
                    </div>
                )}
                
                <ChevronDown size={14} className={`text-slate-400 group-hover:text-blue-600 transition-all duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full right-0 mt-3 w-[280px] bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden z-[100] origin-top-right flex flex-col"
                    >
                        {user ? (
                            <>
                                <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
                                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
                                    <p className="text-sm font-bold text-slate-900 truncate relative z-10">{user.name}</p>
                                    <p className="text-xs text-slate-500 font-medium truncate mt-0.5 relative z-10">{user.email || "No email provided"}</p>
                                    <span className="inline-block mt-2 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider relative z-10">
                                        {user.role || "Beneficiary"}
                                    </span>
                                </div>
                                
                                <div className="p-2 space-y-1 bg-white">
                                    <Link href="/profile" onClick={() => setIsOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 group/item">
                                        <UserIcon size={16} className="text-slate-400 group-hover/item:text-blue-600 group-hover/item:scale-110 transition-all" /> 
                                        My Profile
                                    </Link>
                                    <Link href="/settings" onClick={() => setIsOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 group/item">
                                        <Settings size={16} className="text-slate-400 group-hover/item:text-blue-600 group-hover/item:scale-110 transition-all group-hover/item:rotate-90" /> 
                                        Settings
                                    </Link>
                                </div>
                                
                                <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                                    <button onClick={() => { setIsOpen(false); onLogout(); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group/item">
                                        <LogOut size={16} className="group-hover/item:-translate-x-1 transition-transform" /> 
                                        Log Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-indigo-50/30 to-white text-center flex flex-col items-center">
                                    <div className="w-12 h-12 bg-indigo-100/50 rounded-full flex items-center justify-center mb-3">
                                        <Sparkles className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-1">Welcome to Sangam</h4>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Sign in to access personalized scheme recommendations and saved applications.</p>
                                </div>
                                <div className="p-3 space-y-2 bg-white flex flex-col">
                                    <Link 
                                        href="/login" 
                                        onClick={() => setIsOpen(false)} 
                                        className="w-full py-2.5 bg-blue-800 hover:bg-blue-700 text-white text-sm font-bold rounded-xl text-center shadow-md shadow-blue-800/10 hover:shadow-blue-800/20 transition-all font-sans"
                                    >
                                        Sign In
                                    </Link>
                                    <Link 
                                        href="/register" 
                                        onClick={() => setIsOpen(false)} 
                                        className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-sm font-bold rounded-xl text-center transition-all"
                                    >
                                        Create Account
                                    </Link>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
