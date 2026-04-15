"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { 
    User, Mail, Phone, MapPin, Building2, Wallet, 
    Users, Briefcase, ChevronRight, Lock, Loader2, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfileDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-slate-50 font-sans">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-600 font-bold tracking-widest uppercase text-sm">Aggregating Identity...</p>
            </div>
        );
    }

    const readinessScore = [
        user.name, user.mobile, user.fatherName, user.motherName, 
        user.income, user.caste, user.occupation, user.address
    ].filter(Boolean).length;
    
    const percentComplete = Math.round((readinessScore / 8) * 100);

    return (
        <main className="min-h-screen pt-28 pb-20 bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Dashboard Header Bar */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-8 border-b border-slate-200">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-heading mb-2">Digital Identity</h1>
                        <p className="text-slate-500 font-medium">Read-only overview of your demographic mapping.</p>
                    </div>
                    <Link href="/settings" className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 shadow-sm rounded-xl font-bold text-slate-700 hover:text-blue-700 hover:border-blue-200 transition-all hover:shadow-md">
                        Modify Matrix <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Profile Completion Card */}
                {percentComplete < 100 && (
                    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-[2rem] shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <svg className="w-16 h-16 transform -rotate-90">
                                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-blue-200" />
                                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="175" strokeDashoffset={175 - (175 * percentComplete) / 100} strokeLinecap="round" className="text-blue-600 transition-all duration-1000" />
                                </svg>
                                <span className="absolute font-black text-blue-900 text-sm">{percentComplete}%</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 font-heading">Profile Incomplete</h3>
                                <p className="text-sm text-slate-600 font-medium max-w-sm">Crucial AI recommendation hooks are missing data. Your scheme match accuracy is reduced.</p>
                            </div>
                        </div>
                        <Link href="/settings" className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all text-center">Complete Identity</Link>
                    </motion.div>
                )}

                <div className="grid md:grid-cols-12 gap-8">
                    
                    {/* Primary Bio Card */}
                    <div className="md:col-span-4 space-y-8">
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl"></div>
                            
                            <div className="w-24 h-24 bg-slate-100 border-4 border-white shadow-md text-slate-400 rounded-full flex items-center justify-center mb-6 relative z-10">
                                <User className="w-10 h-10" />
                                <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full"></div>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-slate-900 mb-1 relative z-10">{user.name || "Unknown Entity"}</h2>
                            <p className="text-slate-500 font-medium mb-6 relative z-10 uppercase tracking-widest text-xs">Citizen Schema 01</p>
                            
                            <div className="w-full space-y-4 relative z-10">
                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <Mail className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                    <div className="text-left overflow-hidden">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Vector</p>
                                        <p className="font-bold text-slate-800 text-sm truncate">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <Phone className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                    <div className="text-left overflow-hidden">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile Node</p>
                                        <p className="font-bold text-slate-800 text-sm truncate">{user.mobile || "Not Supplied"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Immutable Security Notifier */}
                        <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl text-slate-300 flex items-start gap-4">
                            <Lock className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="text-white font-bold mb-1">State Security</h4>
                                <p className="text-sm border-l-2 border-slate-700 pl-3 py-1">Your data is governed by strict ISO localized cryptographic shards natively preventing cross-node leaks.</p>
                            </div>
                        </div>
                    </div>

                    {/* Complex Data Vault */}
                    <div className="md:col-span-8">
                        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-blue-600"/> Background Vault
                                </h3>
                            </div>
                            
                            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                                
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Wallet className="w-3 h-3"/> Financial Status</p>
                                    <div className="font-bold text-lg text-slate-900 border-l-4 border-blue-500 pl-4 py-1.5 bg-slate-50 rounded-r-xl">
                                        {user.income ? user.income.replace(/_/g, ' ').toUpperCase() : "Insufficient Data"}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Briefcase className="w-3 h-3"/> Active Occupation</p>
                                    <div className="font-bold text-lg text-slate-900 border-l-4 border-indigo-500 pl-4 py-1.5 bg-slate-50 rounded-r-xl">
                                        {user.occupation || "Insufficient Data"}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Users className="w-3 h-3"/> Social Segment (Caste)</p>
                                    <div className="font-bold text-lg text-slate-900 border-l-4 border-teal-500 pl-4 py-1.5 bg-slate-50 rounded-r-xl">
                                        {user.caste || "Insufficient Data"}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><MapPin className="w-3 h-3"/> Registered Region</p>
                                    <div className="font-bold text-lg text-slate-900 border-l-4 border-orange-500 pl-4 py-1.5 bg-slate-50 rounded-r-xl">
                                        {user.address || "Insufficient Data"}
                                    </div>
                                </div>

                                <div className="sm:col-span-2 mt-4 pt-8 border-t border-slate-100 flex items-start gap-4">
                                    <AlertCircle className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Family Tree Mapping</p>
                                        <p className="text-sm text-slate-500 mb-2 font-medium">Mapped biological links used for inheritance bounds.</p>
                                        <div className="flex flex-wrap gap-4 mt-4">
                                            <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm inline-flex items-center gap-3">
                                                <span className="text-xs font-bold text-slate-400">PATERNAL:</span>
                                                <span className="font-bold text-slate-900">{user.fatherName || "N/A"}</span>
                                            </div>
                                            <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm inline-flex items-center gap-3">
                                                <span className="text-xs font-bold text-slate-400">MATERNAL:</span>
                                                <span className="font-bold text-slate-900">{user.motherName || "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
