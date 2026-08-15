"use client";

import Link from "next/link";
import { Search, ShieldCheck, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SubsidiesPage() {
    const [subsidies, setSubsidies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchSubsidies = async () => {
            try {
                const res = await fetch("/api/schemes?type=Subsidy&limit=100");
                if (res.ok) {
                    const data = await res.json();
                    setSubsidies(data.schemes || []);
                }
            } catch (err) {
                console.error("Error fetching subsidies:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubsidies();
    }, []);

    const filteredSubsidies = subsidies.filter(subsidy => {
        const query = searchQuery.toLowerCase();
        return (
            subsidy.title.toLowerCase().includes(query) ||
            subsidy.description.toLowerCase().includes(query) ||
            subsidy.category.toLowerCase().includes(query) ||
            (subsidy.tags && subsidy.tags.some((tag: string) => tag.toLowerCase().includes(query)))
        );
    });

    return (
        <main className="min-h-screen pb-20 bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">

            {/* 1. HERO SECTION (Premium Light Theme) */}
            <section className="relative w-full pt-32 pb-16 flex items-center justify-center overflow-hidden bg-white border-b border-slate-100">
                {/* Abstract Background Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-50/40 blur-[100px]"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_40%,#000_70%,transparent_100%)]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">

                    {/* Badge */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700 mb-6 shadow-sm"
                    >
                        <ShieldCheck size={14} className="text-emerald-600" />
                        Government Grant & Subsidy Desk
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4 text-slate-950 font-heading"
                    >
                        Government <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-500">Welfare Subsidies</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-slate-500 text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed font-medium"
                    >
                        Explore capital subsidies, direct benefit transfers, and grant allowances provided by central and state governments (non-repayable aid).
                    </motion.p>

                    {/* Search Bar Visual */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="w-full max-w-xl mx-auto relative group"
                    >
                        <div className="relative bg-white border border-slate-200 rounded-2xl p-1.5 flex items-center shadow-md hover:shadow-lg hover:border-emerald-350 transition-all">
                            <Search className="w-5 h-5 text-slate-400 ml-4 group-focus-within:text-emerald-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search for subsidies (e.g. 'Irrigation')..."
                                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 placeholder-slate-400 px-4 py-2.5 text-base font-semibold"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-sm animate-pulse">
                                Search
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 mt-10 relative z-20">

                {/* 2. SUBSIDIES LIST SECTION */}
                <div>
                    <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
                            <h3 className="text-xl font-bold text-slate-950 flex items-center gap-3 tracking-tight font-heading">
                                Available Subsidies
                                {!isLoading && (
                                    <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-slate-200">
                                        {filteredSubsidies.length}
                                    </span>
                                )}
                            </h3>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-4" />
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Loading Subsidies...</p>
                        </div>
                    ) : filteredSubsidies.length === 0 ? (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-center shadow-sm flex flex-col items-center">
                            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-900 font-bold text-base mb-1">No subsidies found</p>
                            <p className="text-slate-400 text-xs font-medium">Try adjusting your search query.</p>
                        </motion.div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSubsidies.map((subsidy) => (
                                <div key={subsidy.id} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-350 transition-all duration-300 flex flex-col group shadow-sm hover:shadow-md">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="bg-slate-50 text-slate-500 border border-slate-150 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                            {subsidy.category}
                                        </span>
                                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                                            Active
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-950 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors font-heading">
                                        {subsidy.title}
                                    </h3>

                                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 font-medium flex-1">
                                        {subsidy.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mb-5">
                                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-left">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Benefit description</p>
                                            <p className="font-bold text-slate-800 text-sm truncate">{subsidy.shortBenefits || "Non-Repayable Aid"}</p>
                                        </div>
                                        <div className="bg-emerald-50/20 p-3 rounded-xl border border-emerald-100/50 text-left">
                                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-0.5">Nodal Authority</p>
                                            <p className="font-bold text-emerald-700 text-sm truncate">
                                                {subsidy.state === "Central" ? "Central Government" : subsidy.state}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                            {subsidy.dbtStatus ? "Direct DBT Transfer" : "Invoice Discount"}
                                        </span>
                                        <Link 
                                            href={`/subsidies/${subsidy.id}`} 
                                            className="px-4 py-2 border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-lg text-xs font-bold transition-all"
                                        >
                                            View Details & Calculator
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}
