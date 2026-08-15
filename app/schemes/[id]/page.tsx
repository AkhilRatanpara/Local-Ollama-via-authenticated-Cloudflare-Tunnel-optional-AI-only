"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText, Gift, CheckCircle, Files, Rocket, MapPin,
    AlertCircle, ChevronRight, Globe, Loader2, ArrowLeft, HeartPulse, Building2, Lock,
    LayoutGrid, Star, ShieldCheck, ArrowRight, Sparkles, CreditCard, Monitor, Landmark, Calendar, Check, User, X
} from "lucide-react";
import { isLocationMatch } from "@/lib/locationMap";

interface Scheme {
    id: string;
    title: string;
    ministry: string;
    description: string;
    category: string;
    type: string;
    state: string;
    benefits: string[];
    eligibility: string[];
    documentsRequired: string[];
    amount: number | null;
    gender: string;
    ageMin: number | null;
    ageMax: number | null;
    incomeLimit: number | null;
    caste: string[];
    residence: string;
    deadline: string | null;
    status: string;
    applicationUrl: string | null;
    tags: string[];
}

const calculateMatchScore = (scheme: Scheme, user: Record<string, any>) => {
    if (!user) return null;
    let score = 0;
    let totalWeights = 0;
    const breakdown: any[] = [];

    if (scheme.gender && scheme.gender.toLowerCase() !== 'all' && scheme.gender.toLowerCase() !== 'any') {
        totalWeights += 20;
        let met = false;
        if (scheme.gender.toLowerCase() === user.gender?.toLowerCase()) { score += 20; met = true; }
        breakdown.push({ label: "Gender Constraint", req: scheme.gender, userVal: user.gender || "Not Set", met });
    } else if (scheme.gender) {
        breakdown.push({ label: "Gender Constraint", req: "All Genders", userVal: user.gender || "Not Set", met: true });
    }

    if (scheme.ageMin !== null || scheme.ageMax !== null) {
        totalWeights += 20;
        let met = false;
        let userAge: number | string = "Not Set";
        if (user.dob) {
            const birthDate = new Date(user.dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
            userAge = age;
            const minMet = scheme.ageMin === null || age >= scheme.ageMin;
            const maxMet = scheme.ageMax === null || age <= scheme.ageMax;
            if (minMet && maxMet) { score += 20; met = true; }
        }
        breakdown.push({ label: "Age Constraint", req: `${scheme.ageMin || '0'} to ${scheme.ageMax || 'Any'} yrs`, userVal: userAge === "Not Set" ? "No DOB" : `${userAge} yrs`, met });
    }

    if (scheme.caste && scheme.caste.length > 0) {
        const schemeCastes = scheme.caste.map(c => c.toLowerCase());
        if (!schemeCastes.includes('all') && !schemeCastes.includes('any')) {
            totalWeights += 20;
            let met = false;
            if (user.category && schemeCastes.includes(user.category.toLowerCase())) { score += 20; met = true; }
            breakdown.push({ label: "Social Category", req: scheme.caste.join(', '), userVal: user.category || "Not Set", met });
        } else {
            breakdown.push({ label: "Social Category", req: "All Categories", userVal: user.category || "Not Set", met: true });
        }
    }

    if (scheme.state && scheme.state.toLowerCase() !== 'central' && scheme.state.toLowerCase() !== 'all india') {
        totalWeights += 20;
        let met = false;
        const userLocDetails = [user.village, user.district, user.state].filter(Boolean).join(', ');
        const userLoc = (userLocDetails || user.address || "").toLowerCase();
        if (userLoc) { const { match } = isLocationMatch(userLoc, scheme.state); if (match) { score += 20; met = true; } }
        breakdown.push({ label: "Geographic Constraint", req: scheme.state, userVal: userLocDetails || user.address || "Not Set", met });
    } else if (scheme.state) {
        const userLocDetails = [user.village, user.district, user.state].filter(Boolean).join(', ');
        breakdown.push({ label: "Geographic Constraint", req: "Central / All India", userVal: userLocDetails || user.address || "Not Set", met: true });
    }

    if (scheme.incomeLimit !== null) {
        totalWeights += 20;
        let met = false;
        if (user.income) {
            let userMaxIncome = 999999999;
            const incStr = user.income.toLowerCase();
            if (incStr.includes('below_1_lakh') || incStr.includes('below 1 lakh')) userMaxIncome = 100000;
            else if (incStr.includes('1_to_2.5_lakh') || incStr.includes('1 to 2.5 lakh')) userMaxIncome = 250000;
            else if (incStr.includes('2.5_to_5_lakh') || incStr.includes('2.5 to 5 lakh')) userMaxIncome = 500000;
            else if (incStr.includes('above_5_lakh') || incStr.includes('above 5 lakh')) userMaxIncome = 999999999;
            else if (!isNaN(Number(user.income))) userMaxIncome = Number(user.income);
            if (userMaxIncome <= scheme.incomeLimit) { score += 20; met = true; }
        }
        breakdown.push({ label: "Income Limit", req: `Up to Rs.${scheme.incomeLimit.toLocaleString()}`, userVal: user.income ? user.income.replace(/_/g, ' ').toUpperCase() : "Not Set", met });
    }

    const finalScore = totalWeights === 0 ? 100 : Math.round((score / totalWeights) * 100);
    return { score: finalScore, breakdown };
};

const getCategoryColor = (category: string) => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("agri")) return { light: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
    if (cat.includes("edu")) return { light: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" };
    if (cat.includes("health")) return { light: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" };
    if (cat.includes("business") || cat.includes("msme") || cat.includes("entrepreneurship")) return { light: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" };
    if (cat.includes("house") || cat.includes("rural")) return { light: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
    if (cat.includes("finance") || cat.includes("loan")) return { light: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" };
    return { light: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" };
};

const getMockBeneficiaries = (scheme: any) => {
    const title = (scheme.title || "").toLowerCase();
    if (title.includes("kisan") || title.includes("samman")) return "120M+";
    if (title.includes("awas") || title.includes("housing")) return "11.8M+";
    if (title.includes("ayushman") || title.includes("health")) return "500M+";
    if (title.includes("scholarship") || title.includes("matric")) return "4.5M+";
    if (title.includes("credit") || title.includes("loan") || title.includes("msme")) return "2.5M+";
    return "1.2M+";
};

const getMockFundDisbursed = (scheme: any) => {
    const title = (scheme.title || "").toLowerCase();
    if (title.includes("kisan") || title.includes("samman")) return "Rs.2.6L Cr";
    if (title.includes("awas") || title.includes("housing")) return "Rs.1.8L Cr";
    if (title.includes("ayushman") || title.includes("health")) return "Rs.6,400 Cr";
    if (title.includes("scholarship") || title.includes("matric")) return "Rs.2,500 Cr";
    if (title.includes("credit") || title.includes("loan") || title.includes("msme")) return "Rs.50,000 Cr";
    return "Rs.1,200 Cr";
};

const BENEFIT_TITLES = ["Financial Assistance", "Direct Benefit Transfer", "Aadhaar Linked Security", "Support Programme", "Additional Provision", "Extended Coverage"];

export default function SchemeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user } = useAuth();
    const [scheme, setScheme] = useState<Scheme | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState('overview');
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    useEffect(() => {
        const fetchScheme = async () => {
            try {
                const res = await fetch(`/api/schemes/${id}`);
                if (!res.ok) throw new Error("Scheme not found");
                const data = await res.json();
                setScheme(data.scheme);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchScheme();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-[#f7f8fc] font-sans">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-500 font-semibold text-sm">Loading scheme details...</p>
            </div>
        );
    }

    if (error || !scheme) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f8fc] text-center px-4 font-sans pt-32">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2 font-heading">Scheme Not Found</h1>
                <p className="text-slate-500 mb-8 max-w-md">The scheme you are looking for might have been removed or does not exist.</p>
                <Link href="/schemes" className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold shadow-md hover:bg-black transition-all flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Browse Schemes
                </Link>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutGrid },
        { id: 'benefits', label: 'Core Benefits', icon: Gift },
        { id: 'eligibility', label: 'Eligibility', icon: ShieldCheck },
        { id: 'documents', label: 'Documents', icon: FileText },
    ];

    const matchResult = scheme && user ? calculateMatchScore(scheme, user) : null;
    const matchScore = matchResult ? matchResult.score : null;
    const matchBreakdown = matchResult ? matchResult.breakdown : [];
    const catColor = getCategoryColor(scheme.category);

    const scoreColor = matchScore === null ? "text-slate-400" : matchScore >= 80 ? "text-emerald-600" : matchScore >= 50 ? "text-amber-600" : "text-red-600";
    const scoreBg = matchScore === null ? "" : matchScore >= 80 ? "bg-emerald-50 border-emerald-200" : matchScore >= 50 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";
    const scoreRing = matchScore === null ? "text-slate-200" : matchScore >= 80 ? "text-emerald-500" : matchScore >= 50 ? "text-amber-500" : "text-red-500";
    const scoreLabel = matchScore === null ? "" : matchScore >= 80 ? "Highly Eligible" : matchScore >= 50 ? "Partially Eligible" : "Not Eligible";

    return (
        <main className="min-h-screen bg-[#f7f8fc] font-sans text-slate-900">

            {/* ── STICKY HEADER AREA ── */}
            <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30 pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Back + Badges + Title row */}
                    <div className="pt-6 pb-4">
                        <Link href="/schemes" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest mb-4">
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
                        </Link>

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${catColor.light} ${catColor.text} border ${catColor.border}`}>
                                        {scheme.category}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {scheme.state === 'Central' ? 'Central Govt.' : scheme.state}
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight font-heading tracking-tight">
                                    {scheme.title}
                                </h1>
                                {scheme.ministry && (
                                    <p className="text-sm text-slate-400 font-semibold mt-2 flex items-center gap-1.5">
                                        <Landmark className="w-3.5 h-3.5" /> {scheme.ministry}
                                    </p>
                                )}
                            </div>

                            {/* Stats pill + Apply button */}
                            <div className="flex items-center gap-4 shrink-0">
                                <div className="hidden md:flex items-center gap-7 bg-slate-50 border border-slate-200 rounded-2xl px-7 py-4">
                                    {matchScore !== null ? (
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-12 h-12 flex items-center justify-center">
                                                <svg className="w-12 h-12 -rotate-90">
                                                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3.5" fill="transparent" className="text-slate-100" />
                                                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3.5" fill="transparent" strokeDasharray="125" strokeDashoffset={125 - (125 * matchScore) / 100} strokeLinecap="round" className={scoreRing} />
                                                </svg>
                                                <span className={`absolute font-black text-[10px] ${scoreColor}`}>{matchScore}%</span>
                                            </div>
                                            <span className="text-sm font-bold text-slate-600">AI Match</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Lock className="w-5 h-5 text-slate-300" />
                                            <span className="text-sm font-bold text-slate-400">Login for match</span>
                                        </div>
                                    )}
                                    <div className="w-px h-8 bg-slate-200" />
                                    <div className="text-center">
                                        <p className="text-lg font-black text-slate-800">{getMockBeneficiaries(scheme)}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Beneficiaries</p>
                                    </div>
                                    <div className="w-px h-8 bg-slate-200" />
                                    <div className="text-center">
                                        <p className="text-lg font-black text-slate-800">{getMockFundDisbursed(scheme)}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Disbursed</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsApplyModalOpen(true)}
                                    className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition-all active:scale-95 focus:outline-none"
                                >
                                    Apply Now <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── TAB BAR ── */}
                    <div className="flex items-center gap-0.5 overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeSection === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveSection(tab.id)}
                                    className={`flex items-center gap-2 px-5 py-3 text-sm font-bold transition-all duration-200 whitespace-nowrap border-b-2 focus:outline-none ${isActive
                                        ? 'text-indigo-700 border-indigo-600 bg-indigo-50/50'
                                        : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── MAIN BODY ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* ── SIDEBAR ── */}
                    <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 sticky top-44">

                        {/* Quick Info Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Scheme Details</p>
                            <div className="space-y-4">
                                {[
                                    { icon: CreditCard, label: "Benefit Type", value: scheme.type || "Financial" },
                                    { icon: Monitor, label: "Application Mode", value: "Online / CSC" },
                                    { icon: Calendar, label: "Deadline", value: scheme.deadline ? new Date(scheme.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Ongoing' },
                                    ...(scheme.gender ? [{ icon: User, label: "Gender", value: scheme.gender.charAt(0).toUpperCase() + scheme.gender.slice(1) }] : []),
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                                            <Icon className="w-4 h-4 text-indigo-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                                            <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Help Card */}
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-indigo-600" />
                                <span className="text-xs font-black text-indigo-800 uppercase tracking-wider">Need Help?</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium mb-3">
                                Our AI assistant can guide you through the application step by step.
                            </p>
                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent("open-chatbot"))}
                                className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 transition-colors focus:outline-none"
                            >
                                Ask Sangam AI <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* ── MAIN CONTENT ── */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-5"
                            >
                                {/* ── OVERVIEW ── */}
                                {activeSection === 'overview' && (
                                    <>
                                        {/* Description */}
                                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">About This Scheme</h2>
                                            <p className="text-slate-700 text-base leading-relaxed font-medium">{scheme.description}</p>
                                        </div>

                                        {/* Meta Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { icon: CreditCard, label: "Benefit Type", value: scheme.type || "Financial" },
                                                { icon: Monitor, label: "Mode", value: "Online / CSC" },
                                                { icon: Landmark, label: "Ministry", value: scheme.ministry || "Govt. of India" },
                                                { icon: Calendar, label: "Deadline", value: scheme.deadline ? new Date(scheme.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Ongoing' },
                                            ].map(({ icon: Icon, label, value }) => (
                                                <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Icon className="w-3.5 h-3.5 text-indigo-400" />
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                                                    </div>
                                                    <p className="text-sm font-extrabold text-slate-800 line-clamp-2">{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Benefits */}
                                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">Program Benefits</h2>
                                            <div className="space-y-3">
                                                {scheme.benefits && scheme.benefits.map((b, idx) => {
                                                    const cleaned = b.trim();
                                                    if (!cleaned) return null;
                                                    return (
                                                        <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all">
                                                            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-800 text-sm mb-0.5">{BENEFIT_TITLES[idx] || `Benefit ${idx + 1}`}</p>
                                                                <p className="text-slate-500 text-xs leading-relaxed font-medium">{cleaned}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                                }
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* ── CORE BENEFITS ── */}
                                {activeSection === 'benefits' && (
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10">
                                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                                <Gift className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900 font-heading">Core Benefits</h2>
                                                <p className="text-sm text-slate-500 font-medium mt-0.5">All outcomes mapped to this scheme.</p>
                                            </div>
                                        </div>
                                        <ul className="space-y-3">
                                            {scheme.benefits && scheme.benefits.map((b, i) => (
                                                <li key={i} className="flex items-start gap-4 p-5 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
                                                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                                        <CheckCircle className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-slate-700 font-semibold text-sm leading-relaxed">{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* ── ELIGIBILITY ── */}
                                {activeSection === 'eligibility' && (
                                    <>
                                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                                            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-100">
                                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                                                    <ShieldCheck className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-slate-900 font-heading">Eligibility Requirements</h2>
                                                    <p className="text-sm text-slate-500 font-medium mt-0.5">{user ? "Cross-referenced with your profile" : "General eligibility criteria"}</p>
                                                </div>
                                            </div>

                                            {!user && (
                                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                                    <div className="flex items-start sm:items-center gap-3">
                                                        <Lock className="text-blue-600 w-5 h-5 shrink-0" />
                                                        <p className="text-blue-900 font-semibold text-sm">Log in to let AI automatically calculate your personal eligibility score.</p>
                                                    </div>
                                                    <Link href="/login" className="bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg hover:bg-blue-700 transition shrink-0">Log In</Link>
                                                </div>
                                            )}

                                            <div className="space-y-4">
                                                <div className="space-y-2.5">
                                                    {scheme.eligibility && scheme.eligibility.map((e, i) => (
                                                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                                                            <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                                                <Check className="w-3 h-3 stroke-[3]" />
                                                            </div>
                                                            <span className="text-slate-700 font-medium text-sm leading-relaxed">{e}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Parameter Constraints Grid */}
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-200">
                                                    {scheme.incomeLimit && (
                                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                                                            <p className="text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Annual Income Cap</p>
                                                            <p className="font-bold text-slate-800 text-xs">Under ₹ {scheme.incomeLimit.toLocaleString('en-IN')}</p>
                                                        </div>
                                                    )}
                                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                                                        <p className="text-[9px] font-bold text-slate-455 uppercase tracking-wider mb-1">Age Restrictions</p>
                                                        <p className="font-bold text-slate-800 text-xs">{scheme.ageMin || 18} to {scheme.ageMax || 65} Years</p>
                                                    </div>
                                                    {scheme.gender && (
                                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                                                            <p className="text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Gender Target</p>
                                                            <p className="font-bold text-slate-800 text-xs">{scheme.gender === "All" || scheme.gender === "any" ? "All Genders" : scheme.gender}</p>
                                                        </div>
                                                    )}
                                                    {scheme.residence && (
                                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                                                            <p className="text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Residence Target</p>
                                                            <p className="font-bold text-slate-800 text-xs">{scheme.residence === "Both" || scheme.residence === "any" ? "Urban & Rural" : scheme.residence}</p>
                                                        </div>
                                                    )}
                                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                                                        <p className="text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Sponsor Authority</p>
                                                        <p className="font-bold text-slate-800 text-xs">{scheme.state === "Central" ? "Central Govt" : `${scheme.state} State`}</p>
                                                    </div>
                                                    {scheme.caste && scheme.caste.length > 0 && (
                                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 col-span-2 md:col-span-3">
                                                            <p className="text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-1">Target social categories</p>
                                                            <p className="font-bold text-slate-800 text-xs">{scheme.caste.join(", ")}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI Score Breakdown */}
                                        {user && matchBreakdown.length > 0 && (
                                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                                                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-1.5 h-7 bg-indigo-600 rounded-full" />
                                                        <h3 className="text-lg font-bold text-slate-900 font-heading">AI Score Breakdown</h3>
                                                    </div>
                                                    {matchScore !== null && (
                                                        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${scoreBg}`}>
                                                            <div className="relative w-10 h-10 flex items-center justify-center">
                                                                <svg className="w-10 h-10 -rotate-90">
                                                                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3.5" fill="transparent" className="text-slate-100" />
                                                                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3.5" fill="transparent"
                                                                        strokeDasharray="100" strokeDashoffset={100 - matchScore}
                                                                        strokeLinecap="round" className={scoreRing} />
                                                                </svg>
                                                                <span className={`absolute font-black text-[9px] ${scoreColor}`}>{matchScore}%</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Score</p>
                                                                <p className={`text-sm font-bold ${scoreColor}`}>{scoreLabel}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {matchBreakdown.map((item: any, idx: number) => (
                                                        <div key={idx} className={`rounded-xl border p-5 ${item.met ? 'bg-emerald-50/40 border-emerald-100' : 'bg-red-50/40 border-red-100'}`}>
                                                            <div className="flex items-center justify-between mb-4">
                                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${item.met ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                                                                    {item.met ? <CheckCircle className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2.5">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs text-slate-500 font-medium">Scheme requires:</span>
                                                                    <span className="text-sm font-bold text-slate-800">{item.req}</span>
                                                                </div>
                                                                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                                                                    <span className="text-xs text-slate-500 font-medium">Your profile:</span>
                                                                    <span className={`text-sm font-bold px-2 py-0.5 rounded-lg ${item.met ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}`}>
                                                                        {item.userVal}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* ── DOCUMENTS ── */}
                                {activeSection === 'documents' && (
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10">
                                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                                            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shrink-0">
                                                <Files className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900 font-heading">Required Documentation</h2>
                                                <p className="text-sm text-slate-500 font-medium mt-0.5">Gather these before starting your application.</p>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-3 mb-6">
                                            {(scheme.documentsRequired && scheme.documentsRequired.length > 0
                                                ? scheme.documentsRequired
                                                : ['Aadhaar Card', 'Bank Passbook', 'Passport Photo', 'Income Proof']
                                            ).map((doc, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all group">
                                                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-teal-600 group-hover:border-teal-200 transition-colors shrink-0">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Document {idx + 1}</p>
                                                        <p className="font-bold text-slate-700 text-sm">{doc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                            <p className="text-sm text-amber-800 font-semibold leading-relaxed">
                                                Ensure all documents are attested and up to date. Missing documents may delay or reject your application.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* ── APPLY MODAL ── */}
            <AnimatePresence>
                {isApplyModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsApplyModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
                        >
                            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 text-center relative">
                                <button onClick={() => setIsApplyModalOpen(false)} className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors focus:outline-none">
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Rocket className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-xl font-black text-white mb-1 font-heading">Apply for This Scheme</h2>
                                <p className="text-blue-100 text-sm font-medium">You will be redirected to the official government portal.</p>
                            </div>
                            <div className="p-7">
                                <div className="space-y-3 mb-6">
                                    {[
                                        "Prepare all required documents listed in the Documents tab",
                                        "Register on the official government portal",
                                        "Fill and submit the application form",
                                    ].map((text, n) => (
                                        <div key={n} className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                            <div className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-black shrink-0">{n + 1}</div>
                                            <span>{text}</span>
                                        </div>
                                    ))}
                                </div>
                                <a
                                    href={scheme.applicationUrl || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setIsApplyModalOpen(false)}
                                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Globe className="w-4 h-4" /> Proceed to Official Portal
                                </a>
                                <p className="text-center mt-3 text-xs font-semibold text-slate-400">
                                    <Lock className="inline w-3 h-3 mb-0.5 mr-1" />256-Bit TLS Secure Redirect
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
