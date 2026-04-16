"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { stateDistrictMap } from "@/lib/locationMap";

interface UserProfile {
    name: string;
    email: string;
    mobile: string;
    dob: string;
    gender: string;
    category: string;
    income: string;
    occupation: string;
    role: string;
    state: string;
    district: string;
    village: string;
    aadhar: string;
    pan: string;
    fatherName: string;
    fatherProfession: string;
    motherName: string;
    motherProfession: string;
    documents: string[];
    appliedSchemes: any[];
    savedSchemes: any[];
    caste: string;
    address: string;
}

export default function ProfileSetupPage() {
    const router = useRouter();
    const { user: authUser, setUser: setAuthUser } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [user, setUser] = useState<UserProfile>({
        name: "", email: "", mobile: "", dob: "", gender: "", category: "General",
        income: "", occupation: "", role: "User", state: "", district: "", village: "", aadhar: "", pan: "",
        fatherName: "", fatherProfession: "", motherName: "", motherProfession: "",
        documents: [], appliedSchemes: [], savedSchemes: [], caste: "", address: ""
    });

    useEffect(() => {
        if (authUser) {
            setUser(prev => ({
                ...prev,
                ...(authUser as any),
                mobile: (authUser as any).mobile || "",
                dob: (authUser as any).dob || "",
                gender: (authUser as any).gender || "",
                category: (authUser as any).category || "",
                income: (authUser as any).income || "",
                occupation: (authUser as any).occupation || "",
                state: (authUser as any).state || "",
                district: (authUser as any).district || "",
                village: (authUser as any).village || "",
                aadhar: (authUser as any).aadhar || "",
                pan: (authUser as any).pan || "",
                fatherName: (authUser as any).fatherName || "",
                fatherProfession: (authUser as any).fatherProfession || "",
                motherName: (authUser as any).motherName || "",
                motherProfession: (authUser as any).motherProfession || "",
                role: (authUser as any).role || "User",
                documents: (authUser as any).documents || [],
                appliedSchemes: (authUser as any).appliedSchemes || [],
                savedSchemes: (authUser as any).savedSchemes || [],
                caste: (authUser as any).caste || "",
                address: (authUser as any).address || ""
            }));
        }
    }, [authUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/user/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            });

            if (!res.ok) throw new Error("Failed to update profile");

            const data = await res.json();
            setAuthUser(data.user);
            alert("Profile Setup Complete!");
            router.push("/profile");
        } catch (error) {
            console.error(error);
            alert("Error saving profile");
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const steps = [
        { title: "Personal Details", icon: "👤", desc: "Basic information about you" },
        { title: "Family Details", icon: "👨‍👩‍👧", desc: "Parents and background" },
        { title: "Contact & Location", icon: "📞", desc: "Reachability and address" },
        { title: "Identity Docs", icon: "🆔", desc: "Verification documents" },
        { title: "Financial Status", icon: "💰", desc: "Income and occupation" }
    ];

    return (
        <main className="min-h-screen pt-32 pb-20 bg-slate-50 flex justify-center items-center px-4">
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row border border-slate-200 min-h-[650px]">

                {/* Sidebar Navigation */}
                <div className="w-full md:w-1/3 bg-slate-900 text-white p-8 flex flex-col relative overflow-y-auto">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_400px_at_50%_-100px,#1e3a8a30,transparent)]"></div>

                    <div className="relative z-10 flex-col flex h-full justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold mb-3 tracking-tight font-heading">Digital Setup</h1>
                            <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">Verify your demographic vector to unlock personalized scheme mapping.</p>

                            <div className="space-y-6">
                                {steps.map((step, idx) => {
                                    const isActive = currentStep === idx + 1;
                                    const isPassed = currentStep > idx + 1;
                                    return (
                                        <div key={idx} className={`flex items-start gap-4 transition-all duration-300 ${isActive ? "opacity-100 scale-105" : "opacity-40 hover:opacity-60"}`}>
                                            <div className={`mt-1 w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-lg font-bold transition-all shadow-lg ${isActive ? "bg-blue-600 text-white shadow-blue-500/20" : isPassed ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-500"}`}>
                                                {isPassed ? "✓" : step.icon}
                                            </div>
                                            <div>
                                                <div className={`font-bold text-sm ${isActive ? "text-white" : "text-slate-300"}`}>{step.title}</div>
                                                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">{isPassed ? "Verified" : step.desc.split(' ')[0]}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                                <span>Sequence Progress</span>
                                <span>{Math.round((currentStep / 5) * 100)}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgb(59,130,246,0.5)]" style={{ width: `${(currentStep / 5) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sliding Form Content Container */}
                <div className="w-full md:w-2/3 flex flex-col bg-gray-50/50 relative overflow-hidden">
                    <div className="flex-1 overflow-x-hidden relative">
                        {/* The Sliding Track */}
                        <div className="flex h-full transition-transform duration-700 ease-in-out w-[500%]" style={{ transform: `translateX(-${(currentStep - 1) * 20}%)` }}>

                            {/* Slide 1: Personal */}
                            <div className="w-[20%] h-full p-8 md:p-12 overflow-y-auto">
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Personal Details</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Full Identity Name</label>
                                        <input name="name" value={user.name} onChange={handleInputChange} className="w-full h-14 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 shadow-sm transition-all" />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Birth Date Node</label>
                                            <input type="date" name="dob" value={user.dob} onChange={handleInputChange} className="w-full h-14 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 shadow-sm transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Gender Schema</label>
                                            <select name="gender" value={user.gender} onChange={handleInputChange} className="w-full h-14 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 shadow-sm transition-all">
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Social Category Vector</label>
                                            <select name="category" value={user.category} onChange={handleInputChange} className="w-full h-14 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 shadow-sm transition-all">
                                                <option value="General">General</option>
                                                <option value="OBC">OBC</option>
                                                <option value="SC">SC</option>
                                                <option value="ST">ST</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Caste (Optional)</label>
                                            <input name="caste" value={user.caste} onChange={handleInputChange} placeholder="E.g. Rajput, Brahmin" className="w-full h-14 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 shadow-sm transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Slide 2: Family */}
                            <div className="w-[20%] h-full p-8 md:p-12 overflow-y-auto">
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Family Background</h2>
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Father Identity</label>
                                            <input name="fatherName" value={user.fatherName} onChange={handleInputChange} className="w-full h-14 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 shadow-sm transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Paternal Profession</label>
                                            <input name="fatherProfession" value={user.fatherProfession} onChange={handleInputChange} placeholder="E.g. Farmer, Teacher" className="w-full h-14 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 shadow-sm transition-all" />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-10 mt-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Mother Identity</label>
                                            <input name="motherName" value={user.motherName} onChange={handleInputChange} className="w-full h-14 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 shadow-sm transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Maternal Profession</label>
                                            <input name="motherProfession" value={user.motherProfession} onChange={handleInputChange} placeholder="E.g. Homemaker, Nurse" className="w-full h-14 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 shadow-sm transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Slide 3: Contact */}
                            <div className="w-[20%] h-full p-8 md:p-12 overflow-y-auto">
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Contact & Location</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Email Connection</label>
                                        <input type="email" name="email" value={user.email} onChange={handleInputChange} className="w-full h-14 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 shadow-sm transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Mobile Node</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm tracking-widest">+91</span>
                                            <input type="tel" name="mobile" value={user.mobile} onChange={handleInputChange} className="w-[94%] h-14 pl-14 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 shadow-sm transition-all" />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">State</label>
                                            <select name="state" value={user.state} onChange={(e) => setUser(prev => ({ ...prev, state: e.target.value, district: "" }))} className="w-full h-14 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 shadow-sm transition-all">
                                                <option value="">Select State</option>
                                                {Object.keys(stateDistrictMap).sort().map(state => (
                                                    <option key={state} value={state}>{state.replace(/\b\w/g, c => c.toUpperCase())}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">District</label>
                                            <select name="district" value={user.district} disabled={!user.state} onChange={handleInputChange} className="w-full h-14 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                                <option value="">Select District</option>
                                                {user.state && stateDistrictMap[user.state.toLowerCase()] && Array.from(new Set(stateDistrictMap[user.state.toLowerCase()])).sort().map(dist => (
                                                    <option key={dist} value={dist}>{dist.replace(/\b\w/g, c => c.toUpperCase())}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Village / City Area</label>
                                        <input name="village" value={user.village} onChange={handleInputChange} placeholder="E.g. Wadhwan" className="w-full h-14 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 shadow-sm transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Postal Address Marker</label>
                                        <textarea name="address" value={user.address} onChange={(e: any) => handleInputChange(e)} placeholder="House no, Street Name, Area" rows={3} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 shadow-sm transition-all resize-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Slide 4: Identity */}
                            <div className="w-[20%] h-full p-8 md:p-12 overflow-y-auto">
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Identity Documents</h2>
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Aadhaar Mapping ID</label>
                                            <input name="aadhar" value={user.aadhar} onChange={handleInputChange} placeholder="XXXX XXXX XXXX" className="w-full h-14 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 shadow-sm transition-all uppercase" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">PAN Identity Key</label>
                                            <input name="pan" value={user.pan} onChange={handleInputChange} placeholder="ABCDE1234F" className="w-full h-14 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 shadow-sm transition-all uppercase" />
                                        </div>
                                    </div>
                                    <div className="w-[94%] mt-6 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 hover:bg-white hover:border-blue-200 transition-all">
                                        <div className="text-4xl mb-3">📄</div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cryptographic Shard Upload</label>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mb-4">Attach PII verified documents for state validation.</p>
                                        <input type="file" multiple onChange={(e) => {
                                            if (e.target.files) {
                                                const fileNames = Array.from(e.target.files).map(f => f.name);
                                                setUser(prev => ({ ...prev, documents: fileNames }));
                                            }
                                        }} className="w-full max-w-xs mx-auto block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#111] file:text-white hover:file:bg-black cursor-pointer transition-all" />
                                    </div>
                                </div>
                            </div>

                            {/* Slide 5: Financial */}
                            <div className="w-[20%] h-full p-8 md:p-12 overflow-y-auto">
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Financial Status</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Annual Economic Status</label>
                                        <input type="number" name="income" value={user.income} onChange={handleInputChange} placeholder="e.g. 250000" className="w-full h-14 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 shadow-sm transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Primary Occupation Trade</label>
                                        <select name="occupation" value={user.occupation} onChange={handleInputChange} className="w-full h-14 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 shadow-sm transition-all">
                                            <option value="">Select Occupation</option>
                                            <option value="Farmer">Farmer</option>
                                            <option value="Student">Student</option>
                                            <option value="Business">Business Owner</option>
                                            <option value="Employed">Salaried / Self Employed</option>
                                            <option value="Unemployed">Unemployed</option>
                                            <option value="Housewife">Homemaker</option>
                                        </select>
                                    </div>

                                    <div className="p-6 bg-[#111] text-white rounded-2xl shadow-xl mt-8 relative overflow-hidden">
                                        <div className="absolute -right-4 -top-4 text-6xl opacity-20 transform rotate-12">✨</div>
                                        <h4 className="font-bold text-xl mb-2 relative z-10">You're all set!</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed relative z-10">We've gathered all the details needed to map you to government benefits. Click finish to analyze your eligibility.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="bg-white border-t border-slate-100 p-6 flex justify-between items-center z-10">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={`px-8 py-3 rounded-xl font-bold transition-all ${currentStep === 1 ? "opacity-0 pointer-events-none" : "text-slate-500 bg-slate-50 hover:bg-slate-100 active:scale-95 border border-slate-200"}`}
                        >
                            ← Previous
                        </button>

                        {currentStep < 5 ? (
                            <button onClick={nextStep} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                                Continue Sequence <span>→</span>
                            </button>
                        ) : (
                            <button onClick={handleSave} disabled={isLoading} className="px-10 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:bg-black transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                                {isLoading ? "Persisting Data..." : "Finalize Mapping ✨"}
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </main>
    );
}
