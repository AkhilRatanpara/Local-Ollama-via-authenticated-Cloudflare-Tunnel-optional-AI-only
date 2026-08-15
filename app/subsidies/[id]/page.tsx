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
    Percent,
    Loader2,
    Check
} from "lucide-react";

export default function SubsidyDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const [subsidy, setSubsidy] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('overview');

    // Calculator State
    const [assetCost, setAssetCost] = useState(100000);

    useEffect(() => {
        const fetchSubsidyDetails = async () => {
            try {
                const res = await fetch(`/api/schemes/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setSubsidy(data.scheme);
                    // Pre-fill asset cost if applicable
                    if (data.scheme.amount) {
                        setAssetCost(data.scheme.amount);
                    }
                }
            } catch (err) {
                console.error("Error fetching subsidy details:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubsidyDetails();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-slate-50 font-sans">
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
                <p className="text-slate-500 font-bold tracking-wider uppercase text-xs">Loading Subsidy Details...</p>
            </div>
        );
    }

    if (!subsidy) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
                <h1 className="text-xl font-bold text-slate-800 mb-2">Subsidy Scheme Not Found 😕</h1>
                <p className="text-slate-500 mb-6 text-sm">The subsidy scheme you are looking for might have been closed or does not exist.</p>
                <Link href="/subsidies" className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-emerald-700 transition-colors">
                    Back to Subsidies
                </Link>
            </div>
        );
    }

    // Subsidy Calculation parameters
    const subsidyPercent = subsidy.subsidyPercentage || 0;
    const maxSubsidy = subsidy.subsidyMaxAmount || 0;

    const calculatedSubsidyAmount = subsidyPercent > 0 
        ? (assetCost * subsidyPercent) / 100 
        : (subsidy.amount || 0);

    const actualSubsidyAmount = maxSubsidy > 0 
        ? Math.min(calculatedSubsidyAmount, maxSubsidy) 
        : calculatedSubsidyAmount;

    const netCost = assetCost - actualSubsidyAmount;

    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-20 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <div className="mb-6 text-xs font-semibold flex items-center gap-2 text-slate-500 uppercase tracking-wider">
                    <Link href="/subsidies" className="hover:text-emerald-600 transition-colors">Welfare Subsidies</Link>
                    <span className="text-slate-350">/</span>
                    <span className="text-slate-800 font-bold">{subsidy.title}</span>
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
                                    { id: 'overview', label: 'Overview & Calculator', icon: FileText },
                                    { id: 'benefits', label: 'Key Benefits', icon: Gift },
                                    { id: 'eligibility', label: 'Eligibility', icon: CheckCircle },
                                    { id: 'documents', label: 'Documents Required', icon: Files },
                                    { id: 'apply', label: 'How to Claim', icon: Rocket }
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
                                            {subsidy.category}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-100 text-emerald-700">
                                            Active
                                        </span>
                                        <span className="bg-white text-slate-600 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border border-slate-200 flex items-center gap-1">
                                            <Building2 className="w-3 h-3 text-slate-400" />
                                            {subsidy.state === "Central" ? "Central Sponsored" : `${subsidy.state} State`}
                                        </span>
                                    </div>

                                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 mb-4 leading-tight font-heading">
                                        {subsidy.title}
                                    </h1>

                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6">
                                        <p className="text-slate-600 text-sm leading-relaxed font-medium">
                                            {subsidy.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-emerald-50/30 p-4 rounded-xl border border-emerald-100/50 text-center">
                                            <div className="text-emerald-400 text-[9px] font-bold uppercase tracking-wider mb-1">Financial Benefits</div>
                                            <div className="text-lg font-bold text-emerald-900">{subsidy.shortBenefits || "Direct Grant"}</div>
                                        </div>
                                        <div className="bg-indigo-50/30 p-4 rounded-xl border border-indigo-100/50 text-center">
                                            <div className="text-indigo-400 text-[9px] font-bold uppercase tracking-wider mb-1">Disbursement</div>
                                            <div className="text-lg font-bold text-indigo-900">{subsidy.dbtStatus ? "Direct DBT" : "Invoice Disc."}</div>
                                        </div>
                                        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-150 text-center flex flex-col justify-center">
                                            <div className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-1">Ministry</div>
                                            <div className="text-xs font-bold text-slate-800 leading-tight">{subsidy.ministry}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Net Cost Calculator */}
                                {subsidyPercent > 0 && (
                                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 animate-in fade-in duration-300">
                                        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100">
                                            <Percent className="w-5 h-5 text-emerald-600" />
                                            <h3 className="font-bold text-slate-900 text-base font-heading">Net Cost Calculator</h3>
                                        </div>

                                        <div className="flex flex-col md:flex-row items-center gap-8">
                                            <div className="md:w-1/2 w-full space-y-5">
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="font-bold text-slate-700 text-xs uppercase tracking-wider">Asset / Project Cost</label>
                                                        <span className="text-emerald-600 font-extrabold text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">₹ {assetCost.toLocaleString()}</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="10000"
                                                        max="1000000"
                                                        step="10000"
                                                        value={assetCost}
                                                        onChange={(e) => setAssetCost(Number(e.target.value))}
                                                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                                    />
                                                    <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-bold">
                                                        <span>₹10,000</span>
                                                        <span>₹10,00,000</span>
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl text-xs space-y-2">
                                                    <div className="flex justify-between text-slate-500">
                                                        <span>Base Subsidy rate:</span>
                                                        <span className="font-bold text-slate-700">{subsidyPercent}%</span>
                                                    </div>
                                                    {maxSubsidy > 0 && (
                                                        <div className="flex justify-between text-slate-500">
                                                            <span>Maximum cap:</span>
                                                            <span className="font-bold text-slate-700">₹ {maxSubsidy.toLocaleString('en-IN')}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="md:w-1/2 w-full bg-emerald-950 text-white rounded-2xl p-6 text-center border border-emerald-900">
                                                <p className="text-emerald-350 text-[10px] font-bold uppercase tracking-wider mb-1">Your Net Out-of-Pocket Cost</p>
                                                <div className="text-3xl font-bold text-white mb-4">₹ {netCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                                
                                                <div className="grid grid-cols-2 gap-2 text-[9px] text-emerald-250 uppercase font-semibold">
                                                    <div className="bg-white/5 py-1.5 px-2.5 rounded border border-white/5">
                                                        <p className="text-emerald-400 mb-0.5">Govt. Share</p>
                                                        <p className="text-white font-bold">₹ {actualSubsidyAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                                    </div>
                                                    <div className="bg-white/5 py-1.5 px-2.5 rounded border border-white/5">
                                                        <p className="text-emerald-400 mb-0.5">Discount</p>
                                                        <p className="text-white font-bold">{subsidyPercent}% Off</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeSection === 'benefits' && (
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 animate-in fade-in duration-300">
                                <h2 className="text-xl font-bold text-slate-950 mb-4 flex items-center gap-2.5 font-heading">
                                    <Gift className="w-5 h-5 text-emerald-600" />
                                    Key Scheme Benefits
                                </h2>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <ul className="space-y-4">
                                        {subsidy.benefits && subsidy.benefits.map((benefit: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
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
                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    Eligibility Criteria
                                </h2>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                                    <ul className="space-y-4 mb-6">
                                        {subsidy.eligibility && subsidy.eligibility.map((criterion: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Check className="w-3 h-3 stroke-[3]" />
                                                </div>
                                                <span className="text-slate-700 font-semibold text-sm leading-relaxed">{criterion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    {/* Parameter Constraints */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-200/60">
                                        {subsidy.incomeLimit && (
                                            <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Annual Income Cap</p>
                                                <p className="font-bold text-slate-800 text-xs">Under ₹ {subsidy.incomeLimit.toLocaleString('en-IN')}</p>
                                            </div>
                                        )}
                                        <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Age Restrictions</p>
                                            <p className="font-bold text-slate-800 text-xs">{subsidy.ageMin || 18} to {subsidy.ageMax || 65} Years</p>
                                        </div>
                                        {subsidy.gender && (
                                            <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gender Target</p>
                                                <p className="font-bold text-slate-800 text-xs">{subsidy.gender === "All" ? "All Genders" : subsidy.gender}</p>
                                            </div>
                                        )}
                                        {subsidy.residence && (
                                            <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Residence Target</p>
                                                <p className="font-bold text-slate-800 text-xs">{subsidy.residence === "Both" ? "Urban & Rural" : subsidy.residence}</p>
                                            </div>
                                        )}
                                        {subsidy.dbtStatus !== undefined && (
                                            <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Disbursement Mode</p>
                                                <p className="font-bold text-slate-800 text-xs">{subsidy.dbtStatus ? "Direct Benefit (DBT)" : "Indirect Discount"}</p>
                                            </div>
                                        )}
                                        {subsidy.vendorEmpanelled !== undefined && (
                                            <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Vendor Restrictions</p>
                                                <p className="font-bold text-slate-800 text-xs">{subsidy.vendorEmpanelled ? "Empanelled Vendors Only" : "Any Vendor"}</p>
                                            </div>
                                        )}
                                        {subsidy.caste && subsidy.caste.length > 0 && (
                                            <div className="bg-white p-3 rounded-xl border border-slate-200/50 col-span-2 md:col-span-3">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Eligible Castes</p>
                                                <p className="font-bold text-slate-800 text-xs">{subsidy.caste.join(", ")}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'documents' && (
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 animate-in fade-in duration-300">
                                <h2 className="text-xl font-bold text-slate-950 mb-4 flex items-center gap-2.5 font-heading">
                                    <Files className="w-5 h-5 text-emerald-600" />
                                    Required Verification Documents
                                </h2>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {subsidy.documentsRequired && subsidy.documentsRequired.map((doc: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/50 transition-colors group">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors">
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
                                    <Rocket className="w-5 h-5 text-emerald-600" />
                                    Subsidy Claim Process
                                </h2>

                                <div className="bg-emerald-900 border border-emerald-950 rounded-2xl p-6 text-center text-white mb-8 shadow-md">
                                    <p className="font-bold text-lg mb-2">Apply Online Nodal Portal</p>
                                    <p className="text-xs text-emerald-200 mb-6 max-w-sm mx-auto">This is a government sponsored subsidy. You will be redirected to the official government portal to begin your process.</p>
                                    <a 
                                        href={subsidy.applicationUrl || "#"} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-bold text-sm transition-all shadow-md"
                                    >
                                        Visit Official Nodal Website
                                        <Globe className="w-4 h-4" />
                                    </a>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-900 mx-auto mb-3 italic">1</div>
                                        <p className="font-bold text-xs text-slate-900 mb-1">Empanelled Vendor</p>
                                        <p className="text-[10px] text-slate-500 leading-snug">Verify if purchasing equipment requires an empanelled vendor</p>
                                    </div>
                                    <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-900 mx-auto mb-3 italic">2</div>
                                        <p className="font-bold text-xs text-slate-900 mb-1">Submit Invoice</p>
                                        <p className="text-[10px] text-slate-500 leading-snug">Upload receipt and verification photos to claims division</p>
                                    </div>
                                    <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-900 mx-auto mb-3 italic">3</div>
                                        <p className="font-bold text-xs text-slate-900 mb-1">DBT Audit</p>
                                        <p className="text-[10px] text-slate-500 leading-snug">Subsidy credit is released direct to Aadhaar bank account</p>
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
