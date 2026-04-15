"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    User, Bell, Shield, Palette, Save, Moon, Sun, 
    Smartphone, Monitor, Globe, Mail, Lock, UserX,
    Loader2, ChevronDown, CheckCircle, AlertCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function SettingsPage() {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState("account");
    const [isSaving, setIsSaving] = useState(false);
    
    // Form States
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        phone: "",
        fatherName: "",
        motherName: "",
        income: "",
        caste: "",
        occupation: "",
        address: "",

        // Preference states
        theme: "system",
        notificationsEmail: true,
        notificationsSMS: false,
        language: "english"
    });

    useEffect(() => {
        if (user) {
            setFormState(prev => ({
                ...prev,
                name: user.name || "",
                email: user.email || "",
                phone: user.mobile || "",
                fatherName: user.fatherName || "",
                motherName: user.motherName || "",
                income: user.income || "",
                caste: user.caste || "",
                occupation: user.occupation || "",
                address: user.address || "",
            }));
        }
    }, [user]);

    const { toast } = useToast();

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formState.name,
                    email: formState.email,
                    mobile: formState.phone,
                    fatherName: formState.fatherName,
                    motherName: formState.motherName,
                    income: formState.income,
                    caste: formState.caste,
                    occupation: formState.occupation,
                    address: formState.address,
                    theme: formState.theme,
                    notificationsEmail: formState.notificationsEmail,
                    notificationsSMS: formState.notificationsSMS,
                    language: formState.language
                })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to save settings");
            }
            toast("success", "Settings Saved", "Your preferences have been securely updated in the system.");
        } catch (error: any) {
            toast("error", "Update Failed", error.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex flex-col justify-center items-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-600 font-bold tracking-widest uppercase text-sm">Loading Identity Matrix...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex flex-col justify-center items-center px-4 text-center">
                <div className="w-20 h-20 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center mb-6">
                    <Lock className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4 font-heading">Access Restricted</h2>
                <p className="text-slate-500 mb-8 max-w-md">Your session has expired or you are actively browsing as a guest. Please log in to manage your core demographic identity.</p>
                <a href="/login" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-colors">Secure Login</a>
            </div>
        );
    }

    const tabs = [
        { id: "account", label: "Account Details", icon: User },
        { id: "preferences", label: "Preferences", icon: Bell },
        { id: "appearance", label: "Appearance", icon: Palette },
        { id: "security", label: "Security", icon: Shield }
    ];

    return (
        <main className="min-h-screen pb-20 bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            {/* Header */}
            <section className="relative w-full pt-32 pb-12 bg-white border-b border-slate-200 overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-50%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-blue-50/60 blur-[100px]"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-heading mb-2">Platform Settings</h1>
                            <p className="text-slate-500 font-medium text-lg">Manage your identity mappings and communication bridges.</p>
                        </div>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-blue-800 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-[0_8px_20px_rgb(30,64,175,0.2)] hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {isSaving ? "Persisting..." : "Save Configuration"}
                        </button>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Sidebar Nav */}
                    <div className="w-full lg:w-72 flex-shrink-0 space-y-2 relative">
                        <div className="sticky top-28 bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all relative group overflow-hidden ${
                                        activeTab === tab.id 
                                        ? "bg-slate-50 text-slate-900 border border-slate-200/60" 
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${activeTab === tab.id ? 'bg-white shadow-sm text-blue-600' : 'bg-transparent text-slate-400 group-hover:bg-white group-hover:shadow-sm group-hover:text-blue-500'}`}>
                                        <tab.icon className="w-4 h-4" />
                                    </div>
                                    <span className="relative z-10">{tab.label}</span>
                                    {activeTab === tab.id && (
                                        <motion.div layoutId="tab-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-600 rounded-r-full" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden min-h-[600px] relative">
                        <AnimatePresence mode="wait">
                            
                            {/* ACCOUNT TAB */}
                            {activeTab === "account" && (
                                <motion.div key="account" initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-15}} className="p-8 md:p-10">
                                    <div className="mb-10 pb-6 border-b border-slate-100 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                            <User className="w-6 h-6"/>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 font-heading">Core Demographics</h2>
                                            <p className="text-sm text-slate-500 font-medium">This identity is verified across all national AI mappings.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Legal Name</label>
                                            <input 
                                                type="text" 
                                                value={formState.name}
                                                onChange={e => setFormState({...formState, name: e.target.value})}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Email Connection</label>
                                            <input 
                                                type="email" 
                                                value={formState.email}
                                                disabled
                                                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 font-medium cursor-not-allowed opacity-80"
                                            />
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-2 ml-1 flex items-center gap-1"><Lock className="w-3 h-3"/> Immutable Marker</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Mobile Carrier</label>
                                            <div className="flex">
                                                <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-500 font-bold text-sm">+91</span>
                                                <input 
                                                    type="tel" 
                                                    value={formState.phone}
                                                    onChange={e => setFormState({...formState, phone: e.target.value})}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-r-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Postal Address / Region</label>
                                            <input 
                                                type="text" 
                                                value={formState.address}
                                                onChange={e => setFormState({...formState, address: e.target.value})}
                                                placeholder="e.g. Pune, Maharashtra"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                            />
                                        </div>

                                        <div className="md:col-span-2 mt-4 pt-6 border-t border-slate-100 pb-2">
                                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Family & Economics</h3>
                                            <p className="text-xs font-medium text-slate-500">Crucial for state subsidy analysis</p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Father's Name</label>
                                            <input 
                                                type="text" 
                                                value={formState.fatherName}
                                                onChange={e => setFormState({...formState, fatherName: e.target.value})}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Mother's Name</label>
                                            <input 
                                                type="text" 
                                                value={formState.motherName}
                                                onChange={e => setFormState({...formState, motherName: e.target.value})}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Annual Income Bracket</label>
                                            <div className="relative">
                                                <select 
                                                    value={formState.income}
                                                    onChange={e => setFormState({...formState, income: e.target.value})}
                                                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                                >
                                                    <option value="" disabled>Select Income Range...</option>
                                                    <option value="below_1lakh">Below ₹1,00,000</option>
                                                    <option value="1_to_2.5_lakh">₹1,00,000 - ₹2,50,000</option>
                                                    <option value="2.5_to_5_lakh">₹2,50,000 - ₹5,00,000</option>
                                                    <option value="5_to_8_lakh">₹5,00,000 - ₹8,00,000</option>
                                                    <option value="above_8lakh">Above ₹8,00,000</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Social Category (Caste)</label>
                                            <div className="relative">
                                                <select 
                                                    value={formState.caste}
                                                    onChange={e => setFormState({...formState, caste: e.target.value})}
                                                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                                >
                                                    <option value="" disabled>Select Segment...</option>
                                                    <option value="General">General / Unreserved</option>
                                                    <option value="OBC">Other Backward Class (OBC)</option>
                                                    <option value="SC">Scheduled Caste (SC)</option>
                                                    <option value="ST">Scheduled Tribe (ST)</option>
                                                    <option value="EWS">Economically Weaker Section (EWS)</option>
                                                    <option value="Minority">Minority Category</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Primary Occupation</label>
                                            <div className="relative">
                                                <select 
                                                    value={formState.occupation}
                                                    onChange={e => setFormState({...formState, occupation: e.target.value})}
                                                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                                >
                                                    <option value="" disabled>Select Trade/Status...</option>
                                                    <option value="Student">Student / Academic</option>
                                                    <option value="Farmer">Farmer / Agriculture</option>
                                                    <option value="Salaried">Salaried Employee</option>
                                                    <option value="SelfEmployed">Self Employed / Business</option>
                                                    <option value="Unemployed">Unemployed / Seeking Work</option>
                                                    <option value="Other">Other Category</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* PREFERENCES TAB */}
                            {activeTab === "preferences" && (
                                <motion.div key="pref" initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-15}} className="p-8 md:p-10">
                                    <div className="mb-10 pb-6 border-b border-slate-100 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                            <Bell className="w-6 h-6"/>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 font-heading">Application Preferences</h2>
                                            <p className="text-sm text-slate-500 font-medium">Control UX settings and system notifications.</p>
                                        </div>
                                    </div>

                                    <div className="mb-10 max-w-sm">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Localization</h3>
                                        <div className="relative">
                                            <select 
                                                value={formState.language}
                                                onChange={e => setFormState({...formState, language: e.target.value})}
                                                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pr-10 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                            >
                                                <option value="english">🇺🇸 English (US)</option>
                                                <option value="hindi">🇮🇳 Hindi (हिंदी)</option>
                                                <option value="marathi">🇮🇳 Marathi (मराठी)</option>
                                            </select>
                                            <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Notification Bridging</h3>
                                        
                                        <div className="space-y-4 max-w-xl">
                                            <div className="flex items-center justify-between p-5 border border-slate-200 rounded-2xl bg-white shadow-sm hover:border-blue-200 transition-colors cursor-pointer group" onClick={() => setFormState(p => ({...p, notificationsEmail: !p.notificationsEmail}))}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 text-slate-600 group-hover:text-blue-600 flex items-center justify-center transition-colors"><Mail className="w-4 h-4"/></div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">Email Alerts</p>
                                                        <p className="text-xs text-slate-500 font-medium mt-0.5">Automated scheme drops straight into your inbox.</p>
                                                    </div>
                                                </div>
                                                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formState.notificationsEmail ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                                    <motion.div layout className={`w-4 h-4 bg-white rounded-full ${formState.notificationsEmail ? 'translate-x-6' : ''}`}></motion.div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-5 border border-slate-200 rounded-2xl bg-white shadow-sm hover:border-blue-200 transition-colors cursor-pointer group" onClick={() => setFormState(p => ({...p, notificationsSMS: !p.notificationsSMS}))}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 text-slate-600 group-hover:text-blue-600 flex items-center justify-center transition-colors"><Smartphone className="w-4 h-4"/></div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">SMS Updates</p>
                                                        <p className="text-xs text-slate-500 font-medium mt-0.5">Critical application deadlines directly to your phone.</p>
                                                    </div>
                                                </div>
                                                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formState.notificationsSMS ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                                    <motion.div layout className={`w-4 h-4 bg-white rounded-full ${formState.notificationsSMS ? 'translate-x-6' : ''}`}></motion.div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* APPEARANCE TAB */}
                            {activeTab === "appearance" && (
                                <motion.div key="app" initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-15}} className="p-8 md:p-10">
                                    <div className="mb-10 pb-6 border-b border-slate-100 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                                            <Palette className="w-6 h-6"/>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 font-heading">Theme Integration</h2>
                                            <p className="text-sm text-slate-500 font-medium">Control the visual layout rendering mode.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
                                        <button 
                                            onClick={() => setFormState({...formState, theme: "light"})}
                                            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${formState.theme === "light" ? "border-blue-600 bg-blue-50/30" : "border-slate-200 bg-white hover:border-slate-300"}`}
                                        >
                                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 shadow-inner">
                                                <Sun className="w-6 h-6" />
                                            </div>
                                            <span className="font-bold text-slate-900 text-sm tracking-wide">Light Mode</span>
                                        </button>
                                        <button 
                                            // Disabled as the platform strictly migrated to a premium light-UI across the board
                                            className={`p-6 rounded-2xl border-2 border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed flex flex-col items-center gap-4 relative overflow-hidden`}
                                        >
                                            <div className="absolute top-2 right-2 bg-slate-200 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded">Phase 2</div>
                                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 shadow-inner">
                                                <Moon className="w-6 h-6" />
                                            </div>
                                            <span className="font-bold text-slate-900 text-sm tracking-wide">Dark Mode</span>
                                        </button>
                                        <button 
                                            onClick={() => setFormState({...formState, theme: "system"})}
                                            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${formState.theme === "system" ? "border-blue-600 bg-blue-50/30" : "border-slate-200 bg-white hover:border-slate-300"}`}
                                        >
                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shadow-inner">
                                                <Monitor className="w-6 h-6" />
                                            </div>
                                            <span className="font-bold text-slate-900 text-sm tracking-wide">System Sync</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* SECURITY TAB */}
                            {activeTab === "security" && (
                                <motion.div key="sec" initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-15}} className="p-8 md:p-10">
                                    <div className="mb-10 pb-6 border-b border-slate-100 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                                            <Shield className="w-6 h-6"/>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 font-heading">Security Matrix</h2>
                                            <p className="text-sm text-slate-500 font-medium">Manage access and destructive data events.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-8 max-w-xl">
                                        <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50 shadow-sm">
                                            <h3 className="font-bold text-slate-900 mb-1">Rotation Lock</h3>
                                            <p className="text-sm text-slate-500 mb-6">Modify your session credentials.</p>
                                            <div className="space-y-4">
                                                <input type="password" placeholder="Current Password" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors font-medium text-sm"/>
                                                <input type="password" placeholder="New Password" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors font-medium text-sm"/>
                                                <button className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-colors w-full mt-2">Cycle Password Credentials</button>
                                            </div>
                                        </div>

                                        <div className="p-6 border border-red-200 rounded-2xl bg-red-50 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0"><UserX className="w-6 h-6"/></div>
                                                <div>
                                                    <p className="font-bold text-red-900">Total Demolition</p>
                                                    <p className="text-xs text-red-700 font-medium mt-1">Permanently obliterate all your profile and application traces. This cannot be reversed.</p>
                                                </div>
                                            </div>
                                            <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors shadow-sm flex-shrink-0">Erase Data</button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}
