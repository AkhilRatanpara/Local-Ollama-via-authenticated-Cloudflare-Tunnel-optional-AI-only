"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { 
    Search, 
    LayoutGrid, 
    Bell, 
    Zap, 
    CheckCircle, 
    Info,
    Calendar,
    ArrowRight,
    Loader2,
    Database,
    AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function NewsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [isSearching, setIsSearching] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");
    const [dbNews, setDbNews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const staticNews = [
        {
            id: "1",
            title: "New Subsidy for Electric Tractors Announced",
            date: "2 Hours Ago",
            category: "Agriculture",
            icon: "🚜",
            description: "The Ministry of Agriculture has officially increased the subsidy cap for electric farm equipment to 40% to promote sustainable farming."
        },
        {
            id: "2",
            title: "PM Mudra Loan Limit Increased to ₹20 Lakhs",
            date: "Yesterday",
            category: "Business",
            icon: "💰",
            description: "RBI has approved doubling the maximum loan limit under PM Mudra Yojana for existing borrowers with a good credit history."
        },
        {
            id: "3",
            title: "Scholarship Deadline Extended to March 31st",
            date: "2 Days Ago",
            category: "Education",
            icon: "📚",
            description: "National Scholarship Portal announces extension for all post-matric applications due to high demand from rural areas."
        },
        {
            id: "4",
            title: "Digital Health ID Now Mandatory for Insurance",
            date: "3 Days Ago",
            category: "Health",
            icon: "🏥",
            description: "New guidelines require ABHA ID linkage for all cashless hospitalization claims starting from the next fiscal year."
        },
        {
            id: "5",
            title: "Solar Rooftop Scheme Subsidy Doubled",
            date: "Last Week",
            category: "Energy",
            icon: "☀️",
            description: "PM Suryodaya Yojana to offer up to ₹78,000 subsidy for 3kW installations, aiming to power 1 crore households."
        }
    ];

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch("/api/news");
                if (res.ok) {
                    const data = await res.json();
                    setDbNews(data);
                }
            } catch (err) {
                console.error("Error fetching news:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, []);

    // Handle searching state for UI feedback
    useEffect(() => {
        if (searchQuery !== debouncedSearch) {
            setIsSearching(true);
        } else {
            setIsSearching(false);
        }
    }, [searchQuery, debouncedSearch]);

    // Format relative time
    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        return date.toLocaleDateString();
    };

    const combinedNews = [
        ...dbNews.map(item => ({
            ...item,
            date: formatTime(item.createdAt),
            // Map icons based on category if needed
        })),
        ...staticNews
    ];

    const categoryList = [
        { name: "All", icon: LayoutGrid },
        { name: "Agriculture", icon: Zap },
        { name: "Business", icon: Zap },
        { name: "Education", icon: Zap },
        { name: "Health", icon: Zap },
        { name: "Energy", icon: Zap }
    ];

    const filteredNews = combinedNews.filter(news => {
        const matchesSearch = news.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                             news.description.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesCategory = activeCategory === "All" || news.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <main className="min-h-screen pb-20 bg-slate-50 font-sans text-slate-900">
            {/* 1. HERO SECTION (Premium Light Theme) */}
            <section className="relative w-full pt-32 pb-16 flex items-center justify-center overflow-hidden bg-white border-b border-slate-100">
                {/* Abstract Background Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-50/60 blur-[100px]"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_40%,#000_70%,transparent_100%)]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
                    {/* Badge */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-sm font-bold text-blue-700 mb-8 shadow-sm"
                    >
                        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                        Government Spotlight
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-slate-900 font-heading"
                    >
                        Stay <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-teal-600">Informed</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
                    >
                        The latest updates on policy changes, deadline extensions, and critical government announcements directly from authorized sources.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-12 relative z-20">
                
                {/* 2. STATS / QUICK INFO (Adapted style) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Today's Updates", value: "12", icon: Bell },
                        { label: "Trending Topics", value: "5", icon: Zap },
                        { label: "Active Subsidies", value: "48", icon: CheckCircle },
                        { label: "Live States", value: "28", icon: Info },
                    ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:-translate-y-1 transition-all hover:shadow-md">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                    <Icon className="w-5 h-5 text-blue-700" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900 leading-tight">{stat.value}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 3. CATEGORY & SEARCH */}
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex gap-2 p-1 bg-white rounded-xl border border-gray-200 overflow-x-auto no-scrollbar">
                            {categoryList.map((cat) => (
                                <button
                                    key={cat.name}
                                    onClick={() => setActiveCategory(cat.name)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                                        activeCategory === cat.name
                                            ? "bg-gray-900 text-white shadow-md"
                                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        <div className="relative group flex-1 max-w-md">
                            <div className="relative bg-white border border-gray-200 rounded-xl flex items-center shadow-sm hover:border-gray-400 transition-all">
                                <div className="ml-4 flex items-center justify-center">
                                    {isSearching ? (
                                        <Loader2 className="w-4 h-4 text-gray-900 animate-spin" />
                                    ) : (
                                        <Search className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search news articles..."
                                    className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 px-4 py-2.5 text-sm font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. NEWS LIST */}
                <div className="pb-12">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-1.5 h-8 bg-gray-900 rounded-full"></div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                            Latest Updates
                            <span className="ml-4 bg-gray-100 text-gray-900 px-3 py-1 rounded-full text-sm font-bold border border-gray-200">
                                {filteredNews.length}
                            </span>
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        {isLoading ? (
                            [1, 2, 3, 4].map(n => (
                                <div key={n} className="bg-white rounded-3xl h-64 animate-pulse border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col justify-between">
                                    <div className="w-1/4 h-6 bg-slate-100 rounded"></div>
                                    <div className="w-full h-8 bg-slate-100 rounded mb-2"></div>
                                    <div className="w-2/3 h-5 bg-slate-50 rounded"></div>
                                    <div className="w-full h-12 bg-slate-100 rounded-xl mt-4"></div>
                                </div>
                            ))
                        ) : filteredNews.length === 0 ? (
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="col-span-full py-16 bg-white rounded-3xl border border-dashed border-slate-300 text-center shadow-sm flex flex-col items-center">
                                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-900 font-bold text-lg mb-2">No updates found</p>
                                <p className="text-slate-500 font-medium">Try adjusting your filters or checking back later.</p>
                            </motion.div>
                        ) : filteredNews.map((news) => (
                            <div key={news.id} className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 transition-all duration-300 flex flex-col group shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(30,64,175,0.1)] hover:-translate-y-1 relative overflow-hidden">
                                {/* Category Badge */}
                                <div className="flex justify-between items-start mb-6">
                                    <span className="bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                        {news.category}
                                    </span>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <Calendar className="w-3 h-3" />
                                        {news.date}
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:underline decoration-2 underline-offset-4 font-heading">
                                    {news.title}
                                </h3>
                                
                                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                                    {news.description}
                                </p>

                                {/* Footer */}
                                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{news.icon}</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verified Update</span>
                                    </div>
                                    <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-800 text-white hover:bg-blue-700 rounded-xl text-sm font-bold transition-all shadow-sm">
                                        Read More <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

