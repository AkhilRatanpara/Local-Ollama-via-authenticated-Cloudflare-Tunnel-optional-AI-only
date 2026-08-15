"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    GraduationCap,
    Home,
    Sprout,
    HeartPulse,
    Briefcase,
    Coins,
    Users,
    Landmark,
    Loader2,
    Database,
    AlertCircle,
    Lock,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isLocationMatch } from "@/lib/locationMap";


interface Scheme {
    id: string;
    title: string;
    description: string;
    category: string;
    benefits: string[];
    type?: string;
    shortBenefits?: string | null;
    matchScore?: number;
    matchReason?: string;
}

const calculateMatchScoreForSort = (scheme: any, user: Record<string, any>) => {
    if (!user) return 0;
    let score = 0;
    let totalWeights = 0;

    if (scheme.gender && scheme.gender.toLowerCase() !== 'all' && scheme.gender.toLowerCase() !== 'any') {
        totalWeights += 20;
        if (scheme.gender.toLowerCase() === user.gender?.toLowerCase()) score += 20;
    }
    if (scheme.ageMin !== null || scheme.ageMax !== null) {
        totalWeights += 20;
        if (user.dob) {
            const birthDate = new Date(user.dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
            const minMet = scheme.ageMin === null || age >= scheme.ageMin;
            const maxMet = scheme.ageMax === null || age <= scheme.ageMax;
            if (minMet && maxMet) score += 20;
        }
    }
    if (scheme.caste && scheme.caste.length > 0) {
        const schemeCastes = scheme.caste.map((c: any) => c.toLowerCase());
        if (!schemeCastes.includes('all') && !schemeCastes.includes('any')) {
            totalWeights += 20;
            if (user.category && schemeCastes.includes(user.category.toLowerCase())) score += 20;
        }
    }
    // 4. State/Location Match (Weight 20%)
    if (scheme.state && scheme.state.toLowerCase() !== 'central' && scheme.state.toLowerCase() !== 'all india') {
        totalWeights += 20;
        const userLocDetails = [user.village, user.district, user.state].filter(Boolean).join(', ');
        const userLoc = (userLocDetails || user.address || "").toLowerCase();

        if (userLoc) {
            const { match } = isLocationMatch(userLoc, scheme.state);
            if (match) score += 20;
        }
    }
    if (scheme.incomeLimit !== null) {
        totalWeights += 20;
        if (user.income) {
            let userMaxIncome = 999999999;
            const incStr = user.income.toLowerCase();
            if (incStr.includes('below_1_lakh') || incStr.includes('below 1 lakh')) userMaxIncome = 100000;
            else if (incStr.includes('1_to_2.5_lakh') || incStr.includes('1 to 2.5 lakh')) userMaxIncome = 250000;
            else if (incStr.includes('2.5_to_5_lakh') || incStr.includes('2.5 to 5 lakh')) userMaxIncome = 500000;
            else if (incStr.includes('above_5_lakh') || incStr.includes('above 5 lakh')) userMaxIncome = 999999999;
            else if (!isNaN(Number(user.income))) userMaxIncome = Number(user.income);
            if (userMaxIncome <= scheme.incomeLimit) score += 20;
        }
    }
    if (totalWeights === 0) return 100;
    return Math.round((score / totalWeights) * 100);
};

export default function SchemesPage() {
    const { user } = useAuth();
    const [schemes, setSchemes] = useState<Scheme[]>([]);
    const [allRecommendations, setAllRecommendations] = useState<Scheme[]>([]);
    const [recommendations, setRecommendations] = useState<Scheme[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [recLoading, setRecLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"newest" | "az" | "eligibility">("newest");
    const debouncedSearch = useDebounce(searchQuery, 400);
    const schemesSectionRef = useRef<HTMLDivElement>(null);

    // Featured IDs for linking
    const [featuredIds, setFeaturedIds] = useState<{ digital?: string; housing?: string }>({});

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalSchemes, setTotalSchemes] = useState(0);

    // Fetch featured IDs on mount
    useEffect(() => {
        const fetchFeaturedIds = async () => {
            try {
                const res1 = await fetch("/api/schemes?search=Digital India&limit=1");
                const data1 = await res1.json();
                const id1 = data1.schemes?.[0]?.id;

                const res2 = await fetch("/api/schemes?search=PM Awas Yojana (Gramin)&limit=1");
                const data2 = await res2.json();
                const id2 = data2.schemes?.[0]?.id;

                setFeaturedIds({
                    digital: id1,
                    housing: id2
                });
            } catch (e) {
                console.error("Failed to fetch featured scheme IDs", e);
            }
        };
        fetchFeaturedIds();
    }, []);

    // Fetch Schemes with Pagination and Filtering
    useEffect(() => {
        const fetchSchemes = async () => {
            setLoading(true);
            if (debouncedSearch) setIsSearching(true);
            try {
                // Varying items per page: 6 on page 1, 8 on page 2+
                const fetchLimit = sortBy === "eligibility"
                    ? 1000
                    : (currentPage === 1 ? 6 : 8);
                const fetchOffset = sortBy === "eligibility"
                    ? 0
                    : (currentPage === 1 ? 0 : 6 + (currentPage - 2) * 8);

                const query = new URLSearchParams({
                    category: activeCategory !== "All" ? activeCategory : "",
                    limit: fetchLimit.toString(),
                    offset: fetchOffset.toString(),
                    search: debouncedSearch,
                    sort: sortBy === "az" ? "az" : "newest"
                });
                const res = await fetch(`/api/schemes?${query.toString()}`);
                const data = await res.json();
                if (data.schemes) {
                    let finalSchemes = data.schemes;

                    if (sortBy === "eligibility" && user) {
                        finalSchemes = finalSchemes.map((s: any) => ({
                            ...s,
                            matchSortScore: calculateMatchScoreForSort(s, user)
                        })).sort((a: any, b: any) => b.matchSortScore - a.matchSortScore);

                        const count = finalSchemes.length;
                        const calculatedPages = count <= 6 ? 1 : 1 + Math.ceil((count - 6) / 8);
                        setTotalPages(calculatedPages);
                        setTotalSchemes(count);

                        // Client-side slice based on page-specific limits and offsets
                        let sliced = [];
                        if (currentPage === 1) {
                            sliced = finalSchemes.slice(0, 6);
                        } else {
                            const startOffset = 6 + (currentPage - 2) * 8;
                            sliced = finalSchemes.slice(startOffset, startOffset + 8);
                        }
                        setSchemes(sliced);
                    } else {
                        setSchemes(finalSchemes);
                        const count = data.pagination.total;
                        const calculatedPages = count <= 6 ? 1 : 1 + Math.ceil((count - 6) / 8);
                        setTotalPages(calculatedPages);
                        setTotalSchemes(count);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch schemes", error);
            } finally {
                setLoading(false);
                setIsSearching(false);
            }
        };

        fetchSchemes();
    }, [activeCategory, currentPage, debouncedSearch, sortBy, user]);

    // The server has already applied the authoritative eligibility rules. Do not
    // recalculate them differently in the browser, or valid recommendations can disappear.
    const rotateRecommendations = useCallback(() => {
        if (allRecommendations.length === 0) return;

        setRecLoading(true);
        setTimeout(() => {
            const sorted = [...allRecommendations]
                .sort((a: any, b: any) => (b.matchScore || 0) - (a.matchScore || 0));
            setRecommendations(sorted.slice(0, 3));
            setRecLoading(false);
        }, 150);
    }, [allRecommendations]);

    // Fetch Recommendations (Pool of 20)
    const fetchRecommendations = useCallback(async () => {
        if (!user?.id) return;

        setRecLoading(true);
        // Recommendations depend on the current profile, so always ask the
        // server for a fresh result after the profile is saved.
        try {
            const res = await fetch("/api/schemes/recommend");
            if (res.ok) {
                const data = await res.json();
                const pool = data || [];
                setAllRecommendations(pool);
            }
        } catch (error) {
            console.error("Failed to fetch recommendations", error);
        } finally {
            setRecLoading(false);
        }
    }, [user?.id]);

    // Initial Load
    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);

    // Whenever we have a new pool of recommendations, rotate to show 3
    useEffect(() => {
        if (allRecommendations.length > 0) {
            // Only rotate if we don't have recommendations shown yet OR if we just fetched a new pool
            // Actually, we want to rotate on mount if we have data.
            // Since allRecommendations is set on mount (from cache or api), this will trigger.
            // But we don't want to infinite loop.
            // Let's just check if recommendations is empty?
            // No, because user might want to refresh.
            // The rotateRecommendations function relies on allRecommendations.

            // If recommendations are empty, definitely rotate.
            if (recommendations.length === 0) {
                // Inline rotation to avoid double-loading state
                const sorted = [...allRecommendations]
                    .sort((a: any, b: any) => (b.matchScore || 0) - (a.matchScore || 0));
                setRecommendations(sorted.slice(0, 3));
            }
        }
    }, [allRecommendations, recommendations.length]);

    const categoryList = [
        { name: "All", label: "All Schemes", icon: LayoutGrid },
        { name: "Education", label: "Education", icon: GraduationCap },
        { name: "Housing", label: "Housing", icon: Home },
        { name: "Agriculture", label: "Agriculture", icon: Sprout },
        { name: "Healthcare", label: "Health", icon: HeartPulse },
        { name: "Business", label: "Business", icon: Briefcase },
        { name: "Finance", label: "Finance", icon: Coins },
        { name: "Social Welfare", label: "Social", icon: Users }
    ];

    const handleCategoryChange = (val: string) => {
        setActiveCategory(val);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        if (schemesSectionRef.current) {
            const yOffset = -100;
            const element = schemesSectionRef.current;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const getCategoryBadgeStyle = (category: string) => {
        const cat = category?.toLowerCase() || "";
        if (cat.includes("agri")) {
            return "bg-[#d1f7f1] text-[#00877a]";
        }
        if (cat.includes("edu") || cat.includes("scholar")) {
            return "bg-[#e8e5ff] text-[#554dfa]";
        }
        if (cat.includes("health") || cat.includes("care")) {
            return "bg-[#d1f7f1] text-[#00877a]";
        }
        if (cat.includes("entrepreneur") || cat.includes("business") || cat.includes("work")) {
            return "bg-[#e8e5ff] text-[#554dfa]";
        }
        // Default
        return "bg-slate-100 text-slate-600";
    };

    const checkEligibility = (scheme: Scheme) => {
        if (!user) return { eligible: true, text: "Eligible" };
        const score = calculateMatchScoreForSort(scheme, user);
        if (score >= 80) {
            return { eligible: true, text: "Eligible" };
        } else {
            return { eligible: false, text: "Not Eligible" };
        }
    };

    const getGridItems = () => {
        const items = [];
        if (currentPage === 1) {
            // Row 1
            if (schemes[0]) items.push({ type: "local", data: schemes[0] });
            if (schemes[1]) items.push({ type: "local", data: schemes[1] });
            items.push({
                type: "featured",
                id: featuredIds.digital || "",
                title: "Digital Literacy Campaign",
                description: "Empowering rural households with critical digital skills for the modern economy.",
                category: "Technology",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdfPtnB2wjQnhA5vaiEtofszeFkIIU0Nj42zDV5dUhpvEb3V0NNiXPDUkMcuccL3S5IzC-nWN_B_sYV-cAawt1xrb1rOi5bnC-Seg84C7f37IufYu9DL5qolXIHjME1sfLq1cmhzT1vT1xw_OHdhsMGHxJMFLXJQ4KAgHuWtJBNZ9YygFHp4r7BhV1TYg8cJJBYTeN51meSar0RjiZNNP_HWt0RIvMNM2scWf3o-gY3_V1kRswAc32wA"
            });

            // Row 2
            if (schemes[2]) items.push({ type: "local", data: schemes[2] });
            if (schemes[3]) items.push({ type: "local", data: schemes[3] });
            items.push({
                type: "featured",
                id: featuredIds.housing || "",
                title: "PM Awas Yojana (Gramin)",
                description: "Providing sustainable, affordable housing and dignified living spaces for rural families.",
                category: "Housing",
                image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800&auto=format&fit=crop"
            });

            // Row 3
            if (schemes[4]) items.push({ type: "local", data: schemes[4] });
            if (schemes[5]) items.push({ type: "local", data: schemes[5] });
            items.push({ type: "cant-find" });
        } else {
            // Page 2+
            for (let i = 0; i < 8; i++) {
                if (schemes[i]) {
                    items.push({ type: "local", data: schemes[i] });
                }
            }
            items.push({ type: "cant-find" });
        }
        return items;
    };

    return (
        <main className="min-h-screen pb-20 bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">

            {/* 1. HERO SECTION (Premium Light Theme) */}
            <section className="relative w-full pt-32 pb-16 flex items-center justify-center overflow-hidden bg-white border-b border-slate-100">
                {/* Abstract Background Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-50/60 blur-[100px]"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_40%,#000_70%,transparent_100%)]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-sm font-bold text-blue-700 mb-8 shadow-sm"
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        National Portal Database
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-slate-900 font-heading"
                    >
                        Discover Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-indigo-600">Perfect Scheme</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        Access over {totalSchemes > 0 ? totalSchemes + '+' : '110+'} government opportunities perfectly sorted by our AI matching engine. Never miss a benefit again.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-12 relative z-20">

                {/* 2. RECOMMENDATIONS SECTION (Restored Grid/Slider Logic) */}
                {user ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Recommended for You</h2>
                                <button
                                    onClick={rotateRecommendations}
                                    disabled={recLoading}
                                    title="Refresh AI Recommendations"
                                    className={`p-1.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all text-gray-400 hover:text-gray-900 ${recLoading ? 'animate-spin' : ''}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {recLoading ? (
                            <div className="grid md:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white rounded-2xl h-[280px] animate-pulse shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200">
                                        <div className="p-6 h-full flex flex-col justify-between">
                                            <div className="w-1/3 h-6 bg-slate-100 rounded-md mb-4"></div>
                                            <div className="space-y-3">
                                                <div className="w-full h-8 bg-slate-100 rounded-md"></div>
                                                <div className="w-5/6 h-5 bg-slate-50 rounded-md"></div>
                                            </div>
                                            <div className="w-full h-12 bg-slate-100 rounded-xl mt-6"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : recommendations.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', gridAutoRows: '320px' }}>
                                {recommendations.filter(s => checkEligibility(s).eligible).slice(0, 3).map((scheme) => (
                                    <div key={scheme.id} className="bg-white rounded-[2rem] p-5 border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all duration-300 flex flex-col group relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryBadgeStyle(scheme.category)}`}>
                                                {scheme.category}
                                            </span>
                                            {/* Eligibility Badge */}
                                            {(() => {
                                                const { eligible, text } = checkEligibility(scheme);
                                                return eligible ? (
                                                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#d1f7f1]/50 text-[#00877a] border border-[#00877a]/15 text-[10px] font-bold">
                                                        <CheckCircle2 className="w-3.5 h-3.5 fill-[#00877a] text-white" />
                                                        <span>{text}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fce8e6]/60 text-[#c5221f] border border-[#c5221f]/15 text-[10px] font-bold">
                                                        <AlertCircle className="w-3.5 h-3.5 text-[#c5221f]" />
                                                        <span>{text}</span>
                                                    </div>
                                                );
                                            })()}
                                        </div>

                                        <h3 className="font-heading text-xl font-bold tracking-tight text-gray-900 mb-1.5 group-hover:underline decoration-2 underline-offset-4 line-clamp-1">
                                            {scheme.title}
                                        </h3>

                                        <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100 mb-3 flex-grow flex flex-col justify-center">
                                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                                <Sparkles className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" /> AI Insight
                                            </p>
                                            <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-2">
                                                "{scheme.matchReason || "Matched extremely well based on your demographic profile."}"
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                                            <div className="flex flex-col text-left">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">
                                                    {scheme.type === "Loan"
                                                        ? "Loan Limit"
                                                        : (scheme.category?.toLowerCase().includes("health") || scheme.category === "Health")
                                                        ? "Coverage"
                                                        : "Benefit"
                                                    }
                                                </span>
                                                <span className="text-sm font-bold text-gray-900">
                                                    {scheme.shortBenefits || "Welfare Support"}
                                                </span>
                                            </div>
                                            {(() => {
                                                const { eligible } = checkEligibility(scheme);
                                                return eligible ? (
                                                    <Link href={`/schemes/${scheme.id}`} className="bg-black text-white hover:bg-gray-800 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-md">
                                                        <ArrowRight className="w-5 h-5" />
                                                    </Link>
                                                ) : (
                                                    <Link href={`/schemes/${scheme.id}`} className="bg-[#f3f4f6] text-[#9ca3af] hover:bg-gray-200 w-11 h-11 rounded-full flex items-center justify-center border border-gray-100 transition-all duration-300 hover:scale-105 shadow-sm">
                                                        <Lock className="w-4 h-4" />
                                                    </Link>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2rem] border border-blue-100 p-8 text-center flex flex-col justify-center items-center h-[280px]">
                                <AlertCircle className="w-12 h-12 text-blue-300 mb-4" />
                                <h3 className="text-xl font-bold text-slate-800">No AI Recommendations Yet</h3>
                                <p className="text-slate-500 mb-4 max-w-sm mt-2">Complete your profile schema in settings so our engine can detect matches.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden bg-gradient-to-br from-indigo-50/50 to-white border border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center mb-6 relative group">
                            <Lock className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-heading mb-3">AI Scheme Mapping Restricted</h2>
                        <p className="text-slate-500 font-medium max-w-md mx-auto mb-8 leading-relaxed">Our advanced matchmaking engine instantly cross-references your profile deeply across 850+ national schemas. Login to see personalized scheme recommendations.</p>
                        <Link href="/login" className="bg-slate-900 text-white font-bold px-8 py-3.5 rounded-full shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all active:scale-95 flex items-center gap-2">
                            Secure Login <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}

                {/* 3. CATEGORIES SECTION (Refined Professional Design) */}
                <div className="relative">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <h2 className="text-3xl font-[900] text-gray-900 tracking-tight leading-none mb-2">Explore Categories</h2>
                            <p className="text-gray-500 font-bold text-sm">Browse our curated collection</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {categoryList.map((cat) => {
                            const isActive = activeCategory === cat.name;
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.name}
                                    onClick={() => handleCategoryChange(cat.name)}
                                    className={`group flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 border ${isActive
                                        ? 'bg-gray-900 border-gray-900 text-white shadow-md'
                                        : 'bg-white border-gray-200 hover:border-gray-400 text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg mb-3 transition-colors ${isActive ? 'bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'
                                        }`}>
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-900'}`} />
                                    </div>
                                    <span className="text-xs font-bold text-center leading-tight tracking-wide">
                                        {cat.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Moved Search Bar */}
                <div className="mb-12">
                    <div className="relative max-w-2xl mx-auto group">
                        <div className="relative bg-white border-2 border-gray-100 rounded-2xl p-2 flex items-center shadow-lg hover:shadow-xl hover:border-gray-200 transition-all">
                            <div className="ml-4 flex items-center justify-center">
                                {isSearching ? (
                                    <Loader2 className="w-6 h-6 text-gray-900 animate-spin" />
                                ) : (
                                    <Search className="w-6 h-6 text-gray-400" />
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="Search for schemes (e.g. 'Student Scholarship')..."
                                className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 px-4 py-3 text-lg font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="mr-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            )}
                        </div>
                        {debouncedSearch && (
                            <div className="mt-2 text-center">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                    {loading ? "Searching..." : `Showing results for "${debouncedSearch}"`}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. SCHEMES LIST SECTION */}
                <div ref={schemesSectionRef} className="pb-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-gray-200 gap-4">
                        <div className="flex items-center gap-4">

                            <div className="w-1.5 h-8 bg-gray-900 rounded-full"></div>
                            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-4 tracking-tight">
                                {activeCategory === "All" ? "All Schemes" : `${activeCategory}`}
                                <span className="bg-gray-100 text-gray-900 px-3 py-1 rounded-full text-sm font-bold border border-gray-200">
                                    {totalSchemes}
                                </span>
                            </h3>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <span className="text-sm font-bold text-slate-500 whitespace-nowrap">Sort by:</span>
                            <div className="relative w-full sm:w-auto">
                                <select
                                    value={sortBy}
                                    onChange={(e) => {
                                        setSortBy(e.target.value as "newest" | "az" | "eligibility");
                                        setCurrentPage(1);
                                    }}
                                    className="w-full sm:w-auto appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-xl font-bold text-sm shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    <option value="newest">Newest Added</option>
                                    <option value="az">Alphabetical (A-Z)</option>
                                    {user && <option value="eligibility">Highest Eligibility (AI Score)</option>}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map(n => (
                                <div key={n} className="bg-white rounded-3xl h-[320px] animate-pulse border border-slate-200 p-8 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-20 h-6 bg-slate-100 rounded"></div>
                                        <div className="w-16 h-6 bg-slate-100 rounded"></div>
                                    </div>
                                    <div className="w-3/4 h-8 bg-slate-100 rounded mb-4"></div>
                                    <div className="w-full h-16 bg-slate-50 rounded mb-8"></div>
                                    <div className="flex justify-between border-t border-slate-100 pt-6">
                                        <div className="w-24 h-4 bg-slate-100 rounded"></div>
                                        <div className="w-32 h-10 bg-slate-100 rounded-xl"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        schemes.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-300 shadow-sm flex flex-col items-center">
                                <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No Schemes Found</h3>
                                <p className="text-slate-500">We couldn't find any schemes matching "{debouncedSearch}". Try adjusting your filters or search terms.</p>
                            </motion.div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem', gridAutoRows: '320px' }}>
                                {getGridItems().map((item, idx) => {
                                    if (item.type === "local" && item.data) {
                                        const scheme = item.data;
                                        return (
                                            <div key={scheme.id} className="bg-white rounded-[2rem] p-5 border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all duration-300 flex flex-col group relative overflow-hidden">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryBadgeStyle(scheme.category)}`}>
                                                        {scheme.category}
                                                    </span>
                                                    {/* Eligibility Badge */}
                                                    {(() => {
                                                        const { eligible, text } = checkEligibility(scheme);
                                                        return eligible ? (
                                                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#d1f7f1]/50 text-[#00877a] border border-[#00877a]/15 text-[10px] font-bold">
                                                                <CheckCircle2 className="w-3.5 h-3.5 fill-[#00877a] text-white" />
                                                                <span>{text}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fce8e6]/60 text-[#c5221f] border border-[#c5221f]/15 text-[10px] font-bold">
                                                                <AlertCircle className="w-3.5 h-3.5 text-[#c5221f]" />
                                                                <span>{text}</span>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>

                                                <h3 className="font-heading text-xl font-bold tracking-tight text-gray-900 mb-1.5 group-hover:underline decoration-2 underline-offset-4 line-clamp-2">
                                                    {scheme.title}
                                                </h3>

                                                <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-3 font-medium">
                                                    {scheme.description}
                                                </p>

                                                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">
                                                            {scheme.type === "Loan"
                                                                ? "Loan Limit"
                                                                : (scheme.category?.toLowerCase().includes("health") || scheme.category === "Health")
                                                                ? "Coverage"
                                                                : "Benefit"
                                                            }
                                                        </span>
                                                        <span className="text-sm font-bold text-gray-900">
                                                            {scheme.shortBenefits || "Welfare Support"}
                                                        </span>
                                                    </div>
                                                    {(() => {
                                                        const { eligible } = checkEligibility(scheme);
                                                        return eligible ? (
                                                            <Link href={`/schemes/${scheme.id}`} className="bg-black text-white hover:bg-gray-800 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-md">
                                                                <ArrowRight className="w-5 h-5" />
                                                            </Link>
                                                        ) : (
                                                            <Link href={`/schemes/${scheme.id}`} className="bg-[#f3f4f6] text-[#9ca3af] hover:bg-gray-200 w-11 h-11 rounded-full flex items-center justify-center border border-gray-100 transition-all duration-300 hover:scale-105 shadow-sm">
                                                                <Lock className="w-4 h-4" />
                                                            </Link>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        );
                                    } else if (item.type === "featured") {
                                        return (
                                            <div key={`featured-${idx}`} className="relative rounded-[2rem] overflow-hidden group shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between">
                                                <div 
                                                    className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                                                    style={{ backgroundImage: `url('${item.image}')` }}
                                                ></div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 z-10"></div>
                                                <div className="relative z-20 p-8 h-full flex flex-col justify-between flex-grow">
                                                    <span className="bg-white/20 text-white/90 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm self-start">
                                                        Featured Scheme
                                                    </span>
                                                    <div className="mt-auto pt-8">
                                                        <h3 className="text-white font-heading text-xl font-bold tracking-tight mb-2 line-clamp-2">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-white/85 text-sm leading-relaxed mb-6 font-medium line-clamp-3">
                                                            {item.description}
                                                        </p>
                                                        <Link 
                                                            href={item.id ? `/schemes/${item.id}` : "/schemes"} 
                                                            className="bg-white hover:bg-gray-100 text-black px-6 py-2.5 rounded-full font-bold text-xs w-fit transition-all duration-300 hover:scale-105 inline-block text-center shadow-md"
                                                        >
                                                            Apply Now
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else if (item.type === "cant-find") {
                                        return (
                                            <div 
                                                key={`cant-find-${idx}`}
                                                onClick={() => window.dispatchEvent(new CustomEvent("open-chatbot"))}
                                                className="border-2 border-dashed border-gray-200 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#645efb]/40 hover:bg-slate-50/50 transition-all duration-300 overflow-hidden"
                                            >
                                                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-5 group-hover:bg-[#e2dfff] transition-colors">
                                                    <Sparkles className="w-6 h-6 text-gray-400 group-hover:text-[#645efb] transition-colors" />
                                                </div>
                                                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">
                                                    Can't find a scheme?
                                                </h3>
                                                <p className="text-gray-500 text-sm max-w-[200px] leading-relaxed mb-6 font-medium">
                                                    Let our AI assistant find the perfect benefit for you.
                                                </p>
                                                <button className="font-bold text-[#645efb] hover:text-[#554dfa] text-xs flex items-center gap-1 transition-colors">
                                                    Start AI Matcher <Zap className="w-3.5 h-3.5 text-[#645efb] fill-[#645efb]/20" />
                                                </button>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        )
                    )}

                    {/* Pagination */}
                    {/* Refined Pagination / Scroll Animations */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-12 animate-in slide-in-from-bottom-4 duration-500">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all font-bold"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {getPageNumbers().map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all border ${currentPage === pageNum
                                        ? 'bg-gray-900 text-white border-gray-900 shadow-lg scale-110'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-900'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all font-bold"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}


