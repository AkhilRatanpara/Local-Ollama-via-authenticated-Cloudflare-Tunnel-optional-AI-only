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
    Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Scheme {
    id: string;
    title: string;
    description: string;
    category: string;
    benefits: string;
    matchScore?: number;
    matchReason?: string;
}

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
    const debouncedSearch = useDebounce(searchQuery, 400);
    const schemesSectionRef = useRef<HTMLDivElement>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalSchemes, setTotalSchemes] = useState(0);
    const limit = 6; // Items per page

    // Fetch Schemes with Pagination and Filtering
    useEffect(() => {
        const fetchSchemes = async () => {
            setLoading(true);
            if (debouncedSearch) setIsSearching(true);
            try {
                const query = new URLSearchParams({
                    category: activeCategory !== "All" ? activeCategory : "",
                    page: currentPage.toString(),
                    limit: limit.toString(),
                    search: debouncedSearch
                });
                const res = await fetch(`/api/schemes?${query.toString()}`);
                const data = await res.json();
                if (data.schemes) {
                    setSchemes(data.schemes);
                    setTotalPages(data.pagination.totalPages);
                    setTotalSchemes(data.pagination.total);
                }
            } catch (error) {
                console.error("Failed to fetch schemes", error);
            } finally {
                setLoading(false);
                setIsSearching(false);
            }
        };

        fetchSchemes();
    }, [activeCategory, currentPage, debouncedSearch]);

    // Randomize 3 schemes from the pool
    const rotateRecommendations = useCallback(() => {
        if (allRecommendations.length === 0) return;

        setRecLoading(true);
        // Simulate a small delay for better UX (so user sees the refresh happen)
        setTimeout(() => {
            const shuffled = [...allRecommendations].sort(() => 0.5 - Math.random());
            setRecommendations(shuffled.slice(0, 3));
            setRecLoading(false);
        }, 400);
    }, [allRecommendations]);

    // Fetch Recommendations (Pool of 20)
    const fetchRecommendations = useCallback(async (forceRefresh = false) => {
        if (!user?.id) return;

        setRecLoading(true);
        // Artificial Delay for UX (10 seconds) - Ensure this runs every time
        await new Promise(resolve => setTimeout(resolve, 10000));

        const cacheKey = `recs_pool_${user.id}`;

        // 1. Try to load from Local Storage first
        if (!forceRefresh) {
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                try {
                    const parsed = JSON.parse(cachedData);
                    // 24 hour cache for the pool
                    if ((Date.now() - parsed.timestamp) < 86400000) {
                        setAllRecommendations(parsed.data);
                        setRecLoading(false);
                        return; // Found in cache
                    }
                } catch (e) {
                    localStorage.removeItem(cacheKey);
                }
            }
        }

        // 2. Fetch from API if no cache or force refresh
        try {
            const res = await fetch("/api/schemes/recommend");
            if (res.ok) {
                const data = await res.json();
                const pool = data || [];
                setAllRecommendations(pool);
                localStorage.setItem(cacheKey, JSON.stringify({
                    data: pool,
                    timestamp: Date.now()
                }));
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
                const shuffled = [...allRecommendations].sort(() => 0.5 - Math.random());
                setRecommendations(shuffled.slice(0, 3));
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
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recommendations.slice(0, 3).map((scheme) => (
                                    <div key={scheme.id} className="relative group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm transition-all hover:border-gray-400 hover:shadow-md overflow-hidden">

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded border border-gray-200 uppercase tracking-wider">{scheme.category}</span>

                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:underline decoration-2 underline-offset-4">{scheme.title}</h3>
                                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-6">
                                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><HeartPulse size={12}/> AI Insight</p>
                                                <p className="text-sm text-slate-700 font-medium leading-relaxed">"{scheme.matchReason || "Matched extremely well based on your demographic profile."}"</p>
                                            </div>
                                            <Link href={`/schemes/${scheme.id}`} className="block w-full text-center py-3 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold rounded-xl text-sm transition-all shadow-sm">
                                                View Details
                                            </Link>
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
                    <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-6">
                        <div className="flex items-center gap-4">

                            <div className="w-1.5 h-8 bg-gray-900 rounded-full"></div>
                            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-4 tracking-tight">
                                {activeCategory === "All" ? "All Schemes" : `${activeCategory}`}
                                <span className="bg-gray-100 text-gray-900 px-3 py-1 rounded-full text-sm font-bold border border-gray-200">
                                    {totalSchemes}
                                </span>
                            </h3>
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
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-300 shadow-sm flex flex-col items-center">
                                <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No Schemes Found</h3>
                                <p className="text-slate-500">We couldn't find any schemes matching "{debouncedSearch}". Try adjusting your filters or search terms.</p>
                            </motion.div>
                        ) : (
                        <div className="grid md:grid-cols-2 gap-6 mb-12">
                            {schemes.map((scheme) => (
                                <div key={scheme.id} className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-400 transition-all duration-300 flex flex-col group shadow-sm hover:shadow-md">
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                            {scheme.category}
                                        </span>
                                        <span className="bg-gray-900 text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                            Active
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:underline decoration-2 underline-offset-4">
                                        {scheme.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                                        {scheme.description}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-gray-900"></span>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Benefits Available</span>
                                        </div>
                                        <Link href={`/schemes/${scheme.id}`} className="px-6 py-2.5 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white rounded-lg text-sm font-bold transition-all">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
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


