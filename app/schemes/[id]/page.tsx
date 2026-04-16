"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText, Gift, CheckCircle, Files, Rocket, MapPin,
    AlertCircle, ChevronRight, Globe, Loader2, ArrowLeft, HeartPulse, Building2, Lock
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
    benefits: string;
    eligibility: string;
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
    const breakdown = [];

    // 1. Gender Match (Weight 20%)
    if (scheme.gender && scheme.gender.toLowerCase() !== 'all' && scheme.gender.toLowerCase() !== 'any') {
        totalWeights += 20;
        let met = false;
        if (scheme.gender.toLowerCase() === user.gender?.toLowerCase()) {
            score += 20;
            met = true;
        }
        breakdown.push({ label: "Gender Constraint", req: scheme.gender, userVal: user.gender || "Not Set", met });
    } else if (scheme.gender) {
        breakdown.push({ label: "Gender Constraint", req: "All Genders", userVal: user.gender || "Not Set", met: true });
    }

    // 2. Age Match (Weight 20%)
    if (scheme.ageMin !== null || scheme.ageMax !== null) {
        totalWeights += 20;
        let met = false;
        let userAge: number | string = "Not Set";
        if (user.dob) {
            const birthDate = new Date(user.dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            userAge = age;
            const minMet = scheme.ageMin === null || age >= scheme.ageMin;
            const maxMet = scheme.ageMax === null || age <= scheme.ageMax;
            if (minMet && maxMet) {
                score += 20;
                met = true;
            }
        }
        breakdown.push({
            label: "Age Constraint",
            req: `${scheme.ageMin || '0'} to ${scheme.ageMax || 'Any'} yrs`,
            userVal: userAge === "Not Set" ? "No DOB" : `${userAge} yrs`,
            met
        });
    }

    // 3. Category/Caste Match (Weight 20%)
    if (scheme.caste && scheme.caste.length > 0) {
        const schemeCastes = scheme.caste.map(c => c.toLowerCase());
        if (!schemeCastes.includes('all') && !schemeCastes.includes('any')) {
            totalWeights += 20;
            let met = false;
            if (user.category && schemeCastes.includes(user.category.toLowerCase())) {
                score += 20;
                met = true;
            }
            breakdown.push({ label: "Social Category", req: scheme.caste.join(', '), userVal: user.category || "Not Set", met });
        } else {
            breakdown.push({ label: "Social Category", req: "All Categories", userVal: user.category || "Not Set", met: true });
        }
    }

    // 4. State/Location Match (Weight 20%)
    if (scheme.state && scheme.state.toLowerCase() !== 'central' && scheme.state.toLowerCase() !== 'all india') {
        totalWeights += 20;
        let met = false;
        const userLocDetails = [user.village, user.district, user.state].filter(Boolean).join(', ');
        const userLoc = (userLocDetails || user.address || "").toLowerCase();

        if (userLoc) {
            const { match } = isLocationMatch(userLoc, scheme.state);
            if (match) {
                score += 20;
                met = true;
            }
        }
        breakdown.push({ label: "Geographic Constraint", req: scheme.state, userVal: userLocDetails || user.address || "Not Set", met });
    } else if (scheme.state) {
        const userLocDetails = [user.village, user.district, user.state].filter(Boolean).join(', ');
        breakdown.push({ label: "Geographic Constraint", req: "Central / All India", userVal: userLocDetails || user.address || "Not Set", met: true });
    }

    // 5. Income Match (Weight 20%)
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

            if (userMaxIncome <= scheme.incomeLimit) {
                score += 20;
                met = true;
            }
        }
        breakdown.push({ label: "Income Limit", req: `Up to ₹${scheme.incomeLimit.toLocaleString()}`, userVal: user.income ? user.income.replace(/_/g, ' ').toUpperCase() : "Not Set", met });
    }

    const finalScore = totalWeights === 0 ? 100 : Math.round((score / totalWeights) * 100);
    return { score: finalScore, breakdown };
};

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
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-slate-50 font-sans">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-600 font-bold tracking-wider">LOADING SCHEME SCHEMA</p>
            </div>
        );
    }

    if (error || !scheme) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4 font-sans pt-32">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2 font-heading tracking-tight">Scheme Not Found</h1>
                <p className="text-slate-500 mb-8 max-w-md">The scheme you are looking for might have been recently removed from the database or does not exist.</p>
                <Link href="/schemes" className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold shadow-[0_8px_20px_rgb(0,0,0,0.12)] hover:bg-black transition-all hover:-translate-y-0.5 flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Browse Available Schemes
                </Link>
            </div>
        );
    }

    const sections = [
        { id: 'overview', label: 'Overview', icon: FileText },
        { id: 'benefits', label: 'Benefits Focus', icon: Gift },
        { id: 'eligibility', label: 'Eligibility', icon: CheckCircle },
        { id: 'documents', label: 'Documents', icon: Files }
    ];

    const matchResult = scheme && user ? calculateMatchScore(scheme, user) : null;
    const matchScore = matchResult ? matchResult.score : null;
    const matchBreakdown = matchResult ? matchResult.breakdown : [];

    return (
        <main className="min-h-screen bg-slate-50 pt-28 pb-20 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top Nav */}
                <div className="mb-6 flex items-center gap-2">
                    <Link href="/schemes" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-wider">
                        <ArrowLeft className="w-4 h-4" /> Back to Directory
                    </Link>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* Left Sidebar Nav */}
                    <div className="hidden lg:block lg:col-span-3 sticky top-32">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 overflow-hidden pb-6"
                        >
                            <div className="pt-6 pb-4 px-6">
                                <h3 className="font-bold text-[#0a1a3a] text-[13px] uppercase tracking-[0.15em] flex items-center gap-3">
                                    <Globe className="w-[18px] h-[18px] text-blue-500" /> Blueprint View
                                </h3>
                            </div>
                            <div className="w-full h-px bg-slate-100 mb-4"></div>

                            <nav className="flex flex-col space-y-1">
                                {sections.map((item) => {
                                    const isActive = activeSection === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveSection(item.id)}
                                            className={`w-[92%] flex items-center gap-4 py-3 pl-8 pr-4 rounded-r-2xl text-[15px] font-bold text-left transition-all relative group ${isActive
                                                ? 'bg-[#f2f7fc] text-[#112a72]'
                                                : 'text-[#64748b] hover:bg-[#f8fafc]'
                                                }`}
                                        >
                                            {isActive && (
                                                <motion.div layoutId="sidebar-active" className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-[#2563eb] rounded-r-[6px]" />
                                            )}
                                            <div className={`w-10 h-10 flex-shrink-0 rounded-[12px] flex items-center justify-center transition-colors ${isActive ? 'bg-[#e2edff] text-[#2563eb]' : 'bg-[#f1f5f9] text-[#94a3b8] group-hover:bg-[#e2e8f0] group-hover:text-[#64748b]'}`}>
                                                <item.icon className="w-[18px] h-[18px]" strokeWidth={2.5} />
                                            </div>
                                            <span className="relative z-10">{item.label}</span>
                                        </button>
                                    );
                                })}

                                <div className="pt-6 px-6">
                                    <div className="w-full h-px bg-slate-100 mb-6"></div>
                                    <button
                                        onClick={() => setIsApplyModalOpen(true)}
                                        className="w-full flex justify-center items-center gap-3 py-4 rounded-[14px] text-[15px] font-bold bg-[#1b3481] text-white shadow-md hover:bg-blue-800 transition-all hover:shadow-lg hover:-translate-y-0.5"
                                    >
                                        <Rocket className="w-[18px] h-[18px]" /> Initiate Application
                                    </button>
                                </div>
                            </nav>
                        </motion.div>
                    </div>

                    {/* Main Content Pane */}
                    <div className="lg:col-span-9 space-y-6">

                        {/* Mobile Scrolling Nav */}
                        <div className="lg:hidden flex overflow-x-auto gap-2 pb-2 scrollbar-hide py-2">
                            {sections.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${activeSection === item.id
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                        : 'bg-white text-slate-600 border-slate-200'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" /> {item.label}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 min-h-[600px] relative overflow-hidden"
                            >
                                {/* Abstract BG for the content card */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[80px] -z-0 opacity-50 pointer-events-none"></div>

                                {activeSection === 'overview' && (
                                    <div className="relative z-10">
                                        <div className="flex flex-wrap gap-2 mb-8">
                                            <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                                                <Building2 className="w-3.5 h-3.5" /> {scheme.category}
                                            </span>
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border inline-flex items-center gap-1.5 ${scheme.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                                <div className={`w-2 h-2 rounded-full ${scheme.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
                                                {scheme.status}
                                            </span>
                                            <span className="bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-200 flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {scheme.state === 'Central' ? 'Central Govt' : scheme.state}
                                            </span>
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight font-heading tracking-tight flex-1">
                                                {scheme.title}
                                            </h1>

                                            {matchScore !== null && (
                                                <div className="flex-shrink-0 flex items-center justify-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm group hover:border-blue-200 transition-all cursor-default">
                                                    <div className="relative w-16 h-16 flex items-center justify-center mr-4">
                                                        <svg className="w-16 h-16 transform -rotate-90">
                                                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                                                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="175" strokeDashoffset={175 - (175 * matchScore) / 100} strokeLinecap="round" className={`transition-all duration-1000 ${matchScore >= 80 ? 'text-emerald-500' : matchScore >= 50 ? 'text-amber-500' : 'text-red-500'}`} />
                                                        </svg>
                                                        <span className={`absolute font-black text-sm ${matchScore >= 80 ? 'text-emerald-600' : matchScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                                            {matchScore}%
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Profile Match</p>
                                                        <p className={`font-bold ${matchScore >= 80 ? 'text-emerald-700' : matchScore >= 50 ? 'text-amber-700' : 'text-red-700'}`}>
                                                            {matchScore >= 80 ? 'High Match' : matchScore >= 50 ? 'Partial Match' : 'Low Match'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-slate-50/50 p-6 md:p-8 rounded-2xl border border-slate-200 mb-10 text-slate-700 leading-relaxed font-medium text-lg">
                                            {scheme.description}
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group hover:border-blue-200 transition-colors">
                                                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Benefit Type</div>
                                                <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Financial</div>
                                            </div>
                                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group hover:border-blue-200 transition-colors">
                                                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Mode</div>
                                                <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Online / Direct</div>
                                            </div>
                                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group hover:border-blue-200 transition-colors">
                                                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Sponsor</div>
                                                <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{scheme.ministry || "N/A"}</div>
                                            </div>
                                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group hover:border-blue-200 transition-colors">
                                                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Deadline</div>
                                                <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{scheme.deadline ? new Date(scheme.deadline).toLocaleDateString() : 'Continuous'}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'benefits' && (
                                    <div className="relative z-10 w-full h-full">
                                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                                                <Gift className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 font-heading">Core Benefits</h2>
                                                <p className="text-sm text-slate-500 font-medium">Outcomes mapped directly to this scheme.</p>
                                            </div>
                                        </div>
                                        <ul className="space-y-4">
                                            {scheme.benefits.length > 5 ? scheme.benefits.split('\n').filter(Boolean).map((b, i) => (
                                                <li key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                                                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5"><CheckCircle className="w-4 h-4" /></div>
                                                    <span className="text-slate-700 font-medium text-lg leading-relaxed">{b.replace(/^- /, '')}</span>
                                                </li>
                                            )) : (
                                                <li className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                                                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5"><CheckCircle className="w-4 h-4" /></div>
                                                    <span className="text-slate-700 font-medium text-lg leading-relaxed">{scheme.benefits}</span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {activeSection === 'eligibility' && (
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                                                <HeartPulse className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 font-heading">Demographic Eligibility</h2>
                                                <p className="text-sm text-slate-500 font-medium">{user ? "Cross-referenced with your profile" : "General requirements"}</p>
                                            </div>
                                        </div>

                                        {!user && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 flex items-center justify-between shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <Lock className="text-blue-600 w-5 h-5" />
                                                    <p className="text-blue-900 font-bold text-sm">Log in to let AI automatically calculate your eligibility matrix.</p>
                                                </div>
                                                <Link href="/login" className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-blue-700 transition">Log In</Link>
                                            </div>
                                        )}

                                        {user && matchBreakdown.length > 0 && (
                                            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 mb-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl pointer-events-none"></div>
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
                                                    <h3 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
                                                        <div className="w-2 h-6 bg-blue-600 rounded-full"></div> AI Score Breakdown
                                                    </h3>
                                                    {matchScore !== null && (
                                                        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
                                                            <div className="relative w-12 h-12 flex items-center justify-center">
                                                                <svg className="w-12 h-12 transform -rotate-90">
                                                                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                                                                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="125" strokeDashoffset={125 - (125 * matchScore) / 100} strokeLinecap="round" className={`transition-all duration-1000 ${matchScore >= 80 ? 'text-emerald-500' : matchScore >= 50 ? 'text-amber-500' : 'text-red-500'}`} />
                                                                </svg>
                                                                <span className={`absolute font-black text-[10px] ${matchScore >= 80 ? 'text-emerald-600' : matchScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                                                    {matchScore}%
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight mb-0.5">Total Score</p>
                                                                <p className={`text-sm font-bold leading-none ${matchScore >= 80 ? 'text-emerald-700' : matchScore >= 50 ? 'text-amber-700' : 'text-red-700'}`}>
                                                                    {matchScore >= 80 ? 'Highly Eligible' : matchScore >= 50 ? 'Partially Eligible' : 'Not Eligible'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4 relative z-10">
                                                    {matchBreakdown.map((item: any, idx: number) => (
                                                        <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-between group hover:border-slate-200 transition-colors">
                                                            <div className="flex justify-between items-start mb-3">
                                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm ${item.met ? 'bg-emerald-100 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                                                    {item.met ? <CheckCircle className="w-3.5 h-3.5" /> : <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="flex justify-between items-end">
                                                                    <span className="text-xs text-slate-500 font-medium">Scheme requires:</span>
                                                                    <span className="text-sm font-bold text-slate-800 text-right">{item.req}</span>
                                                                </div>
                                                                <div className="flex justify-between items-end border-t border-slate-200/60 pt-1.5 mt-1.5">
                                                                    <span className="text-xs text-slate-500 font-medium">Your profile:</span>
                                                                    <span className={`text-sm font-bold text-right py-0.5 px-2 rounded ${item.met ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{item.userVal}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <h3 className="text-lg font-bold text-slate-900 mb-4 px-1">Raw Scheme Requirements</h3>
                                        <div className="space-y-4">
                                            {scheme.eligibility.split('\n').filter(Boolean).map((e, i) => (
                                                <div key={i} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                                                    <span className="text-slate-700 font-medium text-lg">{e.replace(/^- /, '')}</span>
                                                </div>
                                            ))}

                                            {scheme.ageMin && (
                                                <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                                                    <span className="text-slate-700 font-medium text-lg">Minimum Age Required</span>
                                                    <span className="bg-white border text-sm font-bold px-3 py-1 rounded-lg shadow-sm">{scheme.ageMin} Years</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'documents' && (
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                                            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shadow-sm">
                                                <Files className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 font-heading">Required Documentation</h2>
                                                <p className="text-sm text-slate-500 font-medium">Gather these files before starting.</p>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {(scheme.documentsRequired && scheme.documentsRequired.length > 0) ? scheme.documentsRequired.map((doc, idx) => (
                                                <div key={idx} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow group">
                                                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-teal-600 transition-colors">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-bold text-slate-700">{doc}</span>
                                                </div>
                                            )) : (
                                                ['Aadhar Card', 'Bank Passbook', 'Passport Photo', 'Income Proof'].map((doc, idx) => (
                                                    <div key={idx} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow group">
                                                        <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-teal-600 transition-colors">
                                                            <FileText className="w-5 h-5" />
                                                        </div>
                                                        <span className="font-bold text-slate-700">{doc}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}

                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Application Modal */}
            <AnimatePresence>
                {isApplyModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsApplyModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden"
                        >
                            <div className="p-8 md:p-10 text-center relative bg-gradient-to-br from-blue-50 to-white">
                                <div className="absolute top-4 right-4 cursor-pointer p-2 text-slate-400 hover:text-slate-700 bg-white rounded-full shadow-sm" onClick={() => setIsApplyModalOpen(false)}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </div>

                                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative">
                                    <Rocket className="w-10 h-10 translate-x-[2px] -translate-y-[2px]" />
                                    <div className="absolute top-1 right-1 w-3 h-3 bg-teal-400 rounded-full shadow-sm animate-pulse" />
                                </div>

                                <h2 className="text-2xl font-black text-slate-900 mb-2 font-heading">Application Protocol</h2>
                                <p className="text-slate-500 font-medium text-sm max-w-sm mx-auto">You will be securely redirected to the official government portal to map this application.</p>
                            </div>

                            <div className="p-8 md:p-10 bg-white">
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-4 text-sm font-bold text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xs">1</div>
                                        <span>Prepare all noted documents</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm font-bold text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xs">2</div>
                                        <span>Register securely on destination portal</span>
                                    </div>
                                </div>

                                <a
                                    href={scheme.applicationUrl || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setIsApplyModalOpen(false)}
                                    className="w-full py-4 bg-blue-800 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3"
                                >
                                    <Globe className="w-5 h-5" /> Proceed to Portal
                                </a>
                                <p className="text-center mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest"><Lock className="inline w-3 h-3 mb-0.5" /> 256-Bit TLS Redirect</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
