"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    FileText,
    Gift,
    CheckCircle,
    Files,
    Rocket,
    MapPin,
    Building2,
    Calendar,
    Globe,
    ChevronLeft,
    ChevronRight,
    Download,
    Coins,
    IndianRupee,
    ArrowLeft
} from "lucide-react";
import { LOANS_DATA } from "@/lib/loans-data";

export default function LoanDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const loan = LOANS_DATA.find(l => l.id === id);
    const [activeSection, setActiveSection] = useState('overview');

    if (!loan) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Loan Not Found 😕</h1>
                <p className="text-gray-600 mb-6">The loan scheme you are looking for might have been removed or does not exist.</p>
                <Link href="/loans" className="px-6 py-3 bg-gray-900 text-white rounded-lg font-bold shadow-lg hover:bg-black transition-colors">
                    Browse All Loans
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#f3f0e9] pt-24 pb-20 font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <div className="mb-8 text-sm font-medium flex items-center gap-2">
                    <Link href="/loans" className="text-gray-500 hover:text-gray-900 transition-colors">Financial Assistance</Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-900 font-bold">{loan.title}</span>
                </div>

                <div className="grid lg:grid-cols-4 gap-8 items-start">

                    {/* Left Column: Navigation (Tabs) */}
                    <div className="hidden lg:block lg:col-span-1 sticky top-24">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-100">
                                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Loan Details</h3>
                            </div>
                            <nav className="flex flex-col p-2 space-y-1">
                                {[
                                    { id: 'overview', label: 'Overview & Rates', icon: FileText },
                                    { id: 'benefits', label: 'Key Benefits', icon: Gift },
                                    { id: 'eligibility', label: 'Eligibility Criteria', icon: CheckCircle },
                                    { id: 'documents', label: 'Required Documents', icon: Files },
                                    { id: 'apply', label: 'Apply Now', icon: Rocket }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-left transition-all ${activeSection === item.id
                                            ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/10'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <span className="text-lg"><item.icon className="w-5 h-5" /></span>
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Middle Column: Active Content */}
                    <div className="lg:col-span-3 space-y-8 min-h-[500px]">

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
                                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border ${activeSection === item.id
                                        ? 'bg-gray-900 text-white border-gray-900'
                                        : 'bg-white text-gray-600 border-gray-200'
                                        }`}
                                >
                                    <span><item.icon className="w-4 h-4" /></span>
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {activeSection === 'overview' && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="bg-gray-100 text-gray-900 border border-gray-200 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                        {loan.category}
                                    </span>
                                    <span className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-900 text-white border-gray-900">
                                        Active
                                    </span>
                                    <span className="bg-white text-gray-900 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-gray-200 flex items-center gap-1">
                                        <Building2 className="w-3 h-3" />
                                        Govt. Sponsored
                                    </span>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
                                    {loan.title}
                                </h1>

                                <div className="bg-[#f8f9fa] rounded-2xl p-8 border border-gray-100 mb-8">
                                    <p className="text-lg text-gray-700 leading-relaxed font-medium">
                                        {loan.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-center">
                                        <div className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider mb-2">Max Loan Amount</div>
                                        <div className="text-2xl font-black text-indigo-900">{loan.maxAmount}</div>
                                    </div>
                                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-center">
                                        <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2">Interest Rate</div>
                                        <div className="text-2xl font-black text-emerald-900">{loan.interest}</div>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
                                        <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">Sponsor Body</div>
                                        <div className="text-sm font-bold text-gray-900 leading-tight">{loan.ministry}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'benefits' && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900">
                                        <Gift className="w-5 h-5" />
                                    </span>
                                    Key Benefits
                                </h2>
                                <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-gray-100">
                                    <ul className="space-y-6">
                                        {loan.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-start gap-4">
                                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                                                </div>
                                                <span className="text-gray-700 font-bold text-lg leading-relaxed">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeSection === 'eligibility' && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900">
                                        <CheckCircle className="w-5 h-5" />
                                    </span>
                                    Who can apply?
                                </h2>
                                <div className="space-y-4">
                                    {loan.eligibility.map((criterion, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className="font-bold text-gray-700 text-lg">{criterion}</span>
                                            <CheckCircle className="w-6 h-6 text-gray-900 flex-shrink-0" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeSection === 'documents' && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900">
                                        <Files className="w-5 h-5" />
                                    </span>
                                    Required Documents
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {loan.documents.map((doc, i) => (
                                        <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors group">
                                            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-gray-900 transition-colors">
                                                <Download className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-gray-700">{doc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeSection === 'apply' && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                                        <Rocket className="w-5 h-5" />
                                    </span>
                                    Application Process
                                </h2>

                                <div className="bg-indigo-900 border border-indigo-800 rounded-2xl p-8 text-center text-white mb-10 shadow-xl">
                                    <p className="font-black text-2xl mb-4">Official Application Link</p>
                                    <p className="text-indigo-200 mb-8 max-w-md mx-auto">This is a government-sponsored scheme. You will be redirected to the nodal agency's portal to apply.</p>
                                    <a 
                                        href={loan.applicationUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl font-black text-lg transition-all shadow-xl"
                                    >
                                        Visit Official Website
                                        <Globe className="w-5 h-5" />
                                    </a>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-black text-gray-900 mx-auto mb-4 italic">1</div>
                                        <p className="font-bold text-gray-900 mb-1">KYC Check</p>
                                        <p className="text-xs text-gray-500">Verify your Aadhar & Mobile</p>
                                    </div>
                                    <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-black text-gray-900 mx-auto mb-4 italic">2</div>
                                        <p className="font-bold text-gray-900 mb-1">Submit Docs</p>
                                        <p className="text-xs text-gray-500">Upload business/marksheets</p>
                                    </div>
                                    <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-black text-gray-900 mx-auto mb-4 italic">3</div>
                                        <p className="font-bold text-gray-900 mb-1">Disbursement</p>
                                        <p className="text-xs text-gray-500">Bank transfer after audit</p>
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
