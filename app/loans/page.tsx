"use client";

import Link from "next/link";
import { Search, Calculator, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function LoansPage() {
    const [loans, setLoans] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Calculator State
    const [amount, setAmount] = useState(500000);
    const [tenure, setTenure] = useState(5);
    const [rate, setRate] = useState(8.5);

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const res = await fetch("/api/schemes?type=Loan&limit=100");
                if (res.ok) {
                    const data = await res.json();
                    setLoans(data.schemes || []);
                }
            } catch (err) {
                console.error("Error fetching loans:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLoans();
    }, []);

    const calculateEMI = () => {
        const principal = amount;
        const r = rate / 12 / 100;
        const n = tenure * 12;

        if (rate === 0) return principal / n;

        const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        return emi;
    };

    const monthlyEMI = calculateEMI();
    const totalAmount = monthlyEMI * tenure * 12;
    const totalInterest = totalAmount - amount;

    const filteredLoans = loans.filter(loan => {
        const query = searchQuery.toLowerCase();
        return (
            loan.title.toLowerCase().includes(query) ||
            loan.description.toLowerCase().includes(query) ||
            loan.category.toLowerCase().includes(query) ||
            (loan.tags && loan.tags.some((tag: string) => tag.toLowerCase().includes(query)))
        );
    });

    return (
        <main className="min-h-screen pb-20 bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">

            {/* 1. HERO SECTION (Premium Light Theme) */}
            <section className="relative w-full pt-32 pb-16 flex items-center justify-center overflow-hidden bg-white border-b border-slate-100">
                {/* Abstract Background Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-50/50 blur-[100px]"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_40%,#000_70%,transparent_100%)]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">

                    {/* Badge */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 mb-6 shadow-sm"
                    >
                        <ShieldCheck size={14} className="text-indigo-600" />
                        Financial Assistance Division
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4 text-slate-950 font-heading"
                    >
                        Government <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-indigo-500">Loan Schemes</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-slate-500 text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed font-medium"
                    >
                        Find and apply for government-sponsored low-interest loans, credit subventions, and business funding opportunities securely.
                    </motion.p>

                    {/* Search Bar Visual */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="w-full max-w-xl mx-auto relative group"
                    >
                        <div className="relative bg-white border border-slate-200 rounded-2xl p-1.5 flex items-center shadow-md hover:shadow-lg hover:border-indigo-300 transition-all">
                            <Search className="w-5 h-5 text-slate-400 ml-4 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search for loan schemes (e.g. 'Mudra')..."
                                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 placeholder-slate-400 px-4 py-2.5 text-base font-semibold"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm">
                                Search
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 mt-10 relative z-20">

                {/* 2. LOANS LIST SECTION */}
                <div>
                    <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                            <h3 className="text-xl font-bold text-slate-950 flex items-center gap-3 tracking-tight font-heading">
                                Available Loans
                                {!isLoading && (
                                    <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-slate-200">
                                        {filteredLoans.length}
                                    </span>
                                )}
                            </h3>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Loading Loans...</p>
                        </div>
                    ) : filteredLoans.length === 0 ? (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-center shadow-sm flex flex-col items-center">
                            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-900 font-bold text-base mb-1">No loan schemes found</p>
                            <p className="text-slate-400 text-xs font-medium">Try adjusting your search query.</p>
                        </motion.div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredLoans.map((loan) => (
                                <div key={loan.id} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300/80 transition-all duration-300 flex flex-col group shadow-sm hover:shadow-md">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="bg-slate-50 text-slate-500 border border-slate-150 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                            {loan.category}
                                        </span>
                                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                            Active
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-950 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors font-heading">
                                        {loan.title}
                                    </h3>

                                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 font-medium flex-1">
                                        {loan.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mb-5">
                                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-left">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Benefit details</p>
                                            <p className="font-bold text-slate-800 text-sm truncate">{loan.shortBenefits || "Low-Interest Loan"}</p>
                                        </div>
                                        <div className="bg-indigo-50/30 p-3 rounded-xl border border-indigo-100/50 text-left">
                                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Interest Rate</p>
                                            <p className="font-bold text-indigo-700 text-sm">
                                                {loan.interestRate ? `${loan.interestRate}% p.a.` : "Floating Rate"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            {loan.state === "Central" ? "Central Scheme" : loan.state}
                                        </span>
                                        <Link 
                                            href={`/loans/${loan.id}`} 
                                            className="px-4 py-2 border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-lg text-xs font-bold transition-all"
                                        >
                                            Details & Calculator
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. CALCULATOR SECTION */}
                <div className="pt-8">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-slate-950 font-heading mb-2">General Repayment Estimator</h2>
                        <p className="text-slate-500 text-xs font-semibold">Simulate potential monthly EMIs and interest rates before applying.</p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-150">
                        <div className="flex flex-col lg:flex-row items-center gap-10">
                            <div className="lg:w-1/2 w-full space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="font-bold text-slate-700 text-sm">Loan Amount</label>
                                        <span className="text-indigo-600 font-extrabold text-sm bg-indigo-50/60 px-3 py-1 rounded-lg border border-indigo-150">₹ {amount.toLocaleString()}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10000"
                                        max="2000000"
                                        step="10000"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-bold">
                                        <span>₹10k</span>
                                        <span>₹20L</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="font-bold text-slate-700 text-sm">Repayment Tenure (Years)</label>
                                        <span className="text-indigo-600 font-extrabold text-sm bg-indigo-50/60 px-3 py-1 rounded-lg border border-indigo-150">{tenure} Years</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="15"
                                        value={tenure}
                                        onChange={(e) => setTenure(Number(e.target.value))}
                                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-bold">
                                        <span>1 Yr</span>
                                        <span>15 Yrs</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="font-bold text-slate-700 text-sm">Interest Rate (% p.a.)</label>
                                        <span className="text-indigo-600 font-extrabold text-sm bg-indigo-50/60 px-3 py-1 rounded-lg border border-indigo-150">{rate}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="4"
                                        max="18"
                                        step="0.1"
                                        value={rate}
                                        onChange={(e) => setRate(Number(e.target.value))}
                                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-bold">
                                        <span>4%</span>
                                        <span>18%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-1/2 w-full bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2rem] p-8 text-white text-center shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

                                <div className="relative z-10 flex flex-col items-center justify-center">
                                    <Calculator className="w-8 h-8 text-indigo-400 mb-3" />
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Estimated Monthly Payment</p>
                                    <div className="text-4xl font-extrabold mb-5 tracking-tight">₹ {monthlyEMI.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                    
                                    <div className="flex justify-center gap-4 text-[10px] text-indigo-300 font-semibold uppercase tracking-wider mb-6 bg-white/5 py-1.5 px-4 rounded-full border border-white/5">
                                        <span>Principal: ₹{(amount / 100000).toFixed(2)}L</span>
                                        <span className="opacity-30">•</span>
                                        <span>Interest: ₹{(totalInterest / 100000).toFixed(2)}L</span>
                                    </div>

                                    <div className="text-center text-xs text-slate-500 leading-normal">
                                        Note: This is an estimated monthly payment. The actual interest rate, fees, and repayment schedules will vary per government scheme and bank policies.
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
