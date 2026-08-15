"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    FileText,
    Gift,
    CheckCircle,
    Files,
    Rocket,
    Building2,
    Globe,
    Download,
    Calculator,
    Loader2,
    ArrowLeft,
    Check
} from "lucide-react";

export default function LoanDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const [loan, setLoan] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('overview');

    // Calculator State
    const [amount, setAmount] = useState(100000);
    const [tenureYears, setTenureYears] = useState(5);

    useEffect(() => {
        const fetchLoanDetails = async () => {
            try {
                const res = await fetch(`/api/schemes/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setLoan(data.scheme);
                    // Pre-fill loan amount if available
                    if (data.scheme.amount) {
                        setAmount(data.scheme.amount);
                    }
                    // Pre-fill tenure if available
                    if (data.scheme.tenureMax) {
                        setTenureYears(Math.round(data.scheme.tenureMax / 12));
                    }
                }
            } catch (err) {
                console.error("Error fetching loan details:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLoanDetails();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-slate-50 font-sans">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-500 font-bold tracking-wider uppercase text-xs">Loading Loan Details...</p>
            </div>
        );
    }

    if (!loan) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
                <h1 className="text-xl font-bold text-slate-800 mb-2">Loan Scheme Not Found 😕</h1>
                <p className="text-slate-500 mb-6 text-sm">The loan scheme you are looking for might have been closed or does not exist.</p>
                <Link href="/loans" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-indigo-700 transition-colors">
                    Back to Loans
                </Link>
            </div>
        );
    }

    // EMI Calculation specific to this scheme
    const interestRate = loan.interestRate || 8.5; // default to 8.5 if not set
    const maxTenureMonths = loan.tenureMax || 60;  // default to 5 years (60 months)
    const maxTenureYears = Math.round(maxTenureMonths / 12);

    const calculateEMI = () => {
        const principal = amount;
        const monthlyRate = interestRate / 12 / 100;
        const totalMonths = tenureYears * 12;

        if (interestRate === 0) return principal / totalMonths;

        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        return emi;
    };

    const emi = calculateEMI();
    const totalRepayable = emi * tenureYears * 12;
    const totalInterest = totalRepayable - amount;

    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-20 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <div className="mb-6 text-xs font-semibold flex items-center gap-2 text-slate-500 uppercase tracking-wider">
                    <Link href="/loans" className="hover:text-indigo-600 transition-colors">Loan Schemes</Link>
                    <span className="text-slate-350">/</span>
                    <span className="text-slate-800 font-bold">{loan.title}</span>
                </div>

                <div className="grid lg:grid-cols-4 gap-8 items-start">

                    {/* Left Column: Navigation (Tabs) */}
                    <div className="hidden lg:block lg:col-span-1 sticky top-24">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                            <div className="p-4 bg-slate-50 border-b border-slate-150">
                                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Navigation</h3>
                            </div>
                            <nav className="flex flex-col p-2 space-y-1">
                                {[
                                    { id: 'overview', label: 'Overview & EMI', icon: FileText },
                                    { id: 'benefits', label: 'Key Benefits', icon: Gift },
                                    { id: 'eligibility', label: 'Eligibility', icon: CheckCircle },
                                    { id: 'documents', label: 'Documents Required', icon: Files },
                                    { id: 'apply', label: 'How to Apply', icon: Rocket }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${activeSection === item.id
                                            ? 'bg-slate-900 text-white shadow-sm'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                            }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Middle Column: Active Content */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Mobile Tabs */}
                        <div className="lg:hidden flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                            {[
                                { id: 'overview', label: 'Overview', icon: FileText },
                                { id: 'benefits', label: 'Benefits', icon: Gift },
                                { id: 'eligibility', label: 'Eligibility', icon: CheckCircle },
                                { id: 'documents', label: 'Documents', icon: Files },
                                { id: 'apply', label: 'Apply', icon: Rocket }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${activeSection === item.id
                                        ? 'bg-slate-900 text-white border-slate-900'
                                        : 'bg-white text-slate-600 border-slate-200'
                                        }`}
                                >
                                    <item.icon className="w-3.5 h-3.5" />
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {activeSection === 'overview' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 relative overflow-hidden animate-in fade-in duration-300">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                                            {loan.category}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-100 text-emerald-700">
                                            Active
                                        </span>
                                        <span className="bg-white text-slate-600 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border border-slate-200 flex items-center gap-1">
                                            <Building2 className="w-3 h-3 text-slate-400" />
                                            {loan.state === "Central" ? "Central Sponsored" : `${loan.state} State`}
                                        </span>
                                    </div>

                                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 mb-4 leading-tight font-heading">
                                        {loan.title}
                                    </h1>

                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6">
                                        <p className="text-slate-600 text-sm leading-relaxed font-medium">
                                            {loan.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-indigo-50/30 p-4 rounded-xl border border-indigo-100/50 text-center">
                                            <div className="text-indigo-400 text-[9px] font-bold uppercase tracking-wider mb-1">Max Loan Amount</div>
                                            <div className="text-lg font-bold text-indigo-900">{loan.shortBenefits || "Up to ₹10 Lakhs"}</div>
                                        </div>
                                        <div className="bg-emerald-50/30 p-4 rounded-xl border border-emerald-100/50 text-center">
                                            <div className="text-emerald-400 text-[9px] font-bold uppercase tracking-wider mb-1">Interest Rate</div>
                                            <div className="text-lg font-bold text-emerald-900">{loan.interestRate ? `${loan.interestRate}% p.a.` : "Floating"}</div>
                                        </div>
                                        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-150 text-center flex flex-col justify-center">
                                            <div className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-1">Sponsor Authority</div>
                                            <div className="text-xs font-bold text-slate-800 leading-tight">{loan.ministry}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Scheme Specific EMI Calculator */}
                                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 animate-in fade-in duration-300">
                                    <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100">
                                        <Calculator className="w-5 h-5 text-indigo-600" />
                                        <h3 className="font-bold text-slate-900 text-base font-heading">Repayment EMI Estimator</h3>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center gap-8">
                                        <div className="md:w-1/2 w-full space-y-5">
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="font-bold text-slate-700 text-xs uppercase tracking-wider">Required Amount</label>
                                                    <span className="text-indigo-600 font-extrabold text-xs bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">₹ {amount.toLocaleString()}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="10000"
                                                    max={loan.amount ? loan.amount * 2 : 2000000}
                                                    step="10000"
                                                    value={amount}
                                                    onChange={(e) => setAmount(Number(e.target.value))}
                                                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                                />
                                                <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-bold">
                                                    <span>₹10,000</span>
                                                    <span>₹{(loan.amount ? loan.amount * 2 : 2000000).toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="font-bold text-slate-700 text-xs uppercase tracking-wider">Tenure Selection</label>
                                                    <span className="text-indigo-600 font-extrabold text-xs bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{tenureYears} Years</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max={maxTenureYears > 0 ? maxTenureYears : 15}
                                                    value={tenureYears}
                                                    onChange={(e) => setTenureYears(Number(e.target.value))}
                                                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                                />
                                                <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-bold">
                                                    <span>1 Year</span>
                                                    <span>{maxTenureYears > 0 ? maxTenureYears : 15} Years (Max)</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:w-1/2 w-full bg-slate-900 text-white rounded-2xl p-6 text-center border border-slate-800">
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Monthly Payment (EMI)</p>
                                            <div className="text-3xl font-bold text-white mb-4">₹ {emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                            
                                            <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-400 uppercase font-semibold">
                                                <div className="bg-white/5 py-1.5 px-2.5 rounded border border-white/5">
                                                    <p className="text-slate-500 mb-0.5">Interest p.a.</p>
                                                    <p className="text-emerald-400 font-bold">{interestRate}%</p>
                                                </div>
                                                <div className="bg-white/5 py-1.5 px-2.5 rounded border border-white/5">
                                                    <p className="text-slate-500 mb-0.5">Total Interest</p>
                                                    <p className="text-white font-bold">₹ {totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'benefits' && (
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 animate-in fade-in duration-300">
                                <h2 className="text-xl font-bold text-slate-950 mb-4 flex items-center gap-2.5 font-heading">
                                    <Gift className="w-5 h-5 text-indigo-600" />
                                    Key Scheme Benefits
                                </h2>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <ul className="space-y-4">
                                        {loan.benefits && loan.benefits.map((benefit: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Check className="w-3 h-3 stroke-[3]" />
                                                </div>
                                                <span className="text-slate-700 font-semibold text-sm leading-relaxed">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeSection === 'eligibility' && (
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 animate-in fade-in duration-300">
                                <h2 className="text-xl font-bold text-slate-950 mb-4 flex items-center gap-2.5 font-heading">
                                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                                    Eligibility Criteria
                                </h2>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                                    <ul className="space-y-4 mb-6">
                                        {loan.eligibility && loan.eligibility.map((criterion: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Check className="w-3 h-3 stroke-[3]" />
                                                </div>
                                                <span className="text-slate-700 font-semibold text-sm leading-relaxed">{criterion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    {/* Parameter Constraints */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-200/60">
                                        {loan.incomeLimit && (
                                            <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Annual Income Cap</p>
                                                <p className="font-bold text-slate-800 text-xs">Under ₹ {loan.incomeLimit.toLocaleString('en-IN')}</p>
                                            </div>
                                        )}
                                        <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Age Restrictions</p>
                                            <p className="font-bold text-slate-800 text-xs">{loan.ageMin || 18} to {loan.ageMax || 65} Years</p>
                                        </div>
                                        {loan.gender && (
                                            <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gender Target</p>
                                                <p className="font-bold text-slate-800 text-xs">{loan.gender === "All" ? "All Genders" : loan.gender}</p>
                                            </div>
                                        )}
                                        {loan.residence && (
                                            <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Residence Target</p>
                                                <p className="font-bold text-slate-800 text-xs">{loan.residence === "Both" ? "Urban & Rural" : loan.residence}</p>
                                            </div>
                                        )}
                                        {loan.collateralRequired !== undefined && (
                                            <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Collateral Required</p>
                                                <p className="font-bold text-slate-800 text-xs">{loan.collateralRequired ? "Yes, Required" : "No (Collateral-Free)"}</p>
                                            </div>
                                        )}
                                        {loan.moratoriumMonths && (
                                            <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Repayment Holiday</p>
                                                <p className="font-bold text-slate-800 text-xs">{loan.moratoriumMonths} Months Grace</p>
                                            </div>
                                        )}
                                        {loan.caste && loan.caste.length > 0 && (
                                            <div className="bg-white p-3 rounded-xl border border-slate-200/50 col-span-2 md:col-span-3">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Eligible Castes</p>
                                                <p className="font-bold text-slate-800 text-xs">{loan.caste.join(", ")}</p>
                                            </div>
                                        )}
                                        {loan.lendingPartners && loan.lendingPartners.length > 0 && (
                                            <div className="bg-white p-3 rounded-xl border border-slate-200/50 col-span-2 md:col-span-3">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Empanelled Lenders</p>
                                                <p className="font-bold text-slate-800 text-xs leading-normal">{loan.lendingPartners.join(", ")}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'documents' && (
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 animate-in fade-in duration-300">
                                <h2 className="text-xl font-bold text-slate-950 mb-4 flex items-center gap-2.5 font-heading">
                                    <Files className="w-5 h-5 text-indigo-600" />
                                    Required Verification Documents
                                </h2>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {loan.documentsRequired && loan.documentsRequired.map((doc: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/50 transition-colors group">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                                                <Download className="w-4 h-4" />
                                            </div>
                                            <span className="font-bold text-xs text-slate-700">{doc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeSection === 'apply' && (
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 animate-in fade-in duration-300">
                                <h2 className="text-xl font-bold text-slate-950 mb-4 flex items-center gap-2.5 font-heading">
                                    <Rocket className="w-5 h-5 text-indigo-600" />
                                    Application Channel
                                </h2>

                                <div className="bg-indigo-900 border border-indigo-950 rounded-2xl p-6 text-center text-white mb-8 shadow-md">
                                    <p className="font-bold text-lg mb-2">Apply Online Nodal Portal</p>
                                    <p className="text-xs text-indigo-200 mb-6 max-w-sm mx-auto">This is a government subsidized scheme. You will be redirected to the official government portal to begin your process.</p>
                                    <a 
                                        href={loan.applicationUrl || "#"} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl font-bold text-sm transition-all shadow-md"
                                    >
                                        Visit Official Nodal Website
                                        <Globe className="w-4 h-4" />
                                    </a>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-900 mx-auto mb-3 italic">1</div>
                                        <p className="font-bold text-xs text-slate-900 mb-1">Verify Demographics</p>
                                        <p className="text-[10px] text-slate-500 leading-snug">Ensure profile matches eligibility criteria exactly</p>
                                    </div>
                                    <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-900 mx-auto mb-3 italic">2</div>
                                        <p className="font-bold text-xs text-slate-900 mb-1">Empanelled Bank</p>
                                        <p className="text-[10px] text-slate-500 leading-snug">Apply directly or through participating lenders</p>
                                    </div>
                                    <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-900 mx-auto mb-3 italic">3</div>
                                        <p className="font-bold text-xs text-slate-900 mb-1">Disbursal Verification</p>
                                        <p className="text-[10px] text-slate-500 leading-snug">Amount is verified and credited direct to account</p>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </main>
    );
}
