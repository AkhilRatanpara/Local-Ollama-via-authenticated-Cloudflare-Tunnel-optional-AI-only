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
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-500 font-bold tracking-wider uppercase text-xs">Loading Profile...</p>
            </div>
        );
    }

    const readinessScore = [
        user.name, user.mobile, user.fatherName, user.motherName,
        user.income, user.category, user.occupation, user.address
    ].filter(Boolean).length;

    const percentComplete = Math.round((readinessScore / 8) * 100);
    const formattedIncome = user.income && Number.isFinite(Number(user.income))
        ? `₹ ${Number(user.income).toLocaleString('en-IN')}`
        : "Not Provided";

    return (
        <main className="min-h-screen pt-28 pb-20 bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Dashboard Header Bar */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-8 border-b border-slate-200">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-950 font-heading mb-2">My Profile</h1>
                        <p className="text-slate-500 text-sm font-medium">A secure overview of your demographic profile for government welfare matching.</p>
                    </div>
                    <Link href="/profile/setup" className="mt-4 md:mt-0 flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 shadow-sm rounded-xl font-bold text-sm text-slate-700 hover:text-indigo-600 hover:border-indigo-200 transition-all hover:shadow-md">
                        Edit Profile <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Profile Completion Card */}
                {percentComplete < 100 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-indigo-50/50 to-indigo-100/30 border border-indigo-100/50 p-6 rounded-2xl shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <svg className="w-16 h-16 transform -rotate-90">
                                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-indigo-100/80" />
                                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="transparent" strokeDasharray="175" strokeDashoffset={175 - (175 * percentComplete) / 100} strokeLinecap="round" className="text-indigo-600 transition-all duration-1000" />
                                </svg>
                                <span className="absolute font-bold text-indigo-950 text-sm">{percentComplete}%</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-950 font-heading">Profile Incomplete</h3>
                                <p className="text-sm text-slate-600 font-medium max-w-sm">Some profile details are missing. Complete your profile details to unlock 100% accurate scheme recommendations.</p>
                            </div>
                        </div>
                        <Link href="/profile/setup" className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition-all text-center">Complete Profile</Link>
                    </motion.div>
                )}

                <div className="grid md:grid-cols-12 gap-8">

                    {/* Primary Bio Card */}
                    <div className="md:col-span-4 space-y-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl"></div>

                            <div className="w-24 h-24 bg-slate-50 border border-slate-100 shadow-sm text-slate-400 rounded-full flex items-center justify-center mb-5 relative z-10">
                                <User className="w-10 h-10 text-slate-500" />
                                <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
                            </div>

                            <h2 className="text-2xl font-bold text-slate-950 mb-1 relative z-10">{user.name || "Anonymous Citizen"}</h2>
                            <p className="text-slate-400 font-semibold mb-6 relative z-10 uppercase tracking-wider text-xs">Citizen Account</p>

                            <div className="w-full space-y-3 relative z-10">
                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100/50">
                                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <div className="text-left overflow-hidden">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                                        <p className="font-semibold text-slate-800 text-sm truncate">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100/50">
                                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <div className="text-left overflow-hidden">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Number</p>
                                        <p className="font-semibold text-slate-800 text-sm truncate">
                                            {user.mobile ? user.mobile.replace(/(\d{5})(\d{5})/, "$1 $2") : "Not Provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Notifier */}
                        <div className="bg-slate-900 p-6 rounded-3xl shadow-lg text-slate-300 flex items-start gap-4">
                            <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-white font-bold text-sm mb-1">Secure Data Protection</h4>
                                <p className="text-xs text-slate-400 border-l-2 border-slate-800 pl-3 py-1 leading-relaxed">
                                    Your personal data is encrypted and stored securely in compliance with national privacy guidelines.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Demographic Details Vault */}
                    <div className="md:col-span-8">
                        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-indigo-600" /> Demographic Profile
                                </h3>
                            </div>

                            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">

                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Wallet className="w-3.5 h-3.5 text-slate-400" /> Annual Family Income
                                    </p>
                                    <div className="font-bold text-lg text-slate-900 border-l-4 border-indigo-500 pl-4 py-1 bg-slate-50/50 rounded-r-xl">
                                        {formattedIncome}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Occupation
                                    </p>
                                    <div className="font-bold text-lg text-slate-900 border-l-4 border-indigo-500 pl-4 py-1 bg-slate-50/50 rounded-r-xl">
                                        {user.occupation || "Not Provided"}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Date of Birth</p>
                                    <div className="font-bold text-lg text-slate-900 border-l-4 border-indigo-500 pl-4 py-1 bg-slate-50/50 rounded-r-xl">
                                        {user.dob ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(user.dob)) : "Not Provided"}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</p>
                                    <div className="font-bold text-lg text-slate-900 border-l-4 border-indigo-500 pl-4 py-1 bg-slate-50/50 rounded-r-xl">
                                        {user.gender || "Not Provided"}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 text-slate-400" /> Social Category
                                    </p>
                                    <div className="font-bold text-lg text-slate-900 border-l-4 border-indigo-500 pl-4 py-1 bg-slate-50/50 rounded-r-xl">
                                        {user.category || "Not Provided"}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location
                                    </p>
                                    <div className="font-bold text-lg text-slate-900 border-l-4 border-indigo-500 pl-4 py-1 bg-slate-50/50 rounded-r-xl truncate">
                                        {[user.village, user.district, user.state]
                                            .filter(Boolean)
                                            .map(s => (s as string).replace(/\b\w/g, c => c.toUpperCase()))
                                            .join(', ') || user.address || "Not Provided"}
                                    </div>
                                </div>

                                <div className="sm:col-span-2 mt-4 pt-6 border-t border-slate-100 flex items-start gap-4">
                                    <AlertCircle className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Family Information</p>
                                        <p className="text-xs text-slate-500 mb-2 font-medium">Household details used for family-level government scholarship and welfare eligibility matches.</p>
                                        <div className="flex flex-wrap gap-4 mt-3">
                                            <div className="bg-white border border-slate-200/80 px-4 py-2 rounded-xl shadow-sm inline-flex items-center gap-3">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Father's Name:</span>
                                                <span className="font-bold text-slate-800 text-xs">{user.fatherName || "N/A"}</span>
                                            </div>
                                            <div className="bg-white border border-slate-200/80 px-4 py-2 rounded-xl shadow-sm inline-flex items-center gap-3">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mother's Name:</span>
                                                <span className="font-bold text-slate-800 text-xs">{user.motherName || "N/A"}</span>
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
