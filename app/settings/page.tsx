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

const Switch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
        type="button"
        onClick={(e) => {
            e.stopPropagation();
            onChange();
        }}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            checked ? "bg-blue-600" : "bg-slate-200"
        }`}
    >
        <motion.span
            animate={{ x: checked ? 20 : 0 }}
            className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out"
        />
    </button>
);

export default function SettingsPage() {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState("preferences");
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
                                                <Switch 
                                                    checked={formState.notificationsEmail} 
                                                    onChange={() => setFormState(p => ({...p, notificationsEmail: !p.notificationsEmail}))} 
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-5 border border-slate-200 rounded-2xl bg-white shadow-sm hover:border-blue-200 transition-colors cursor-pointer group" onClick={() => setFormState(p => ({...p, notificationsSMS: !p.notificationsSMS}))}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 text-slate-600 group-hover:text-blue-600 flex items-center justify-center transition-colors"><Smartphone className="w-4 h-4"/></div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">SMS Updates</p>
                                                        <p className="text-xs text-slate-500 font-medium mt-0.5">Critical application deadlines directly to your phone.</p>
                                                    </div>
                                                </div>
                                                <Switch 
                                                    checked={formState.notificationsSMS} 
                                                    onChange={() => setFormState(p => ({...p, notificationsSMS: !p.notificationsSMS}))} 
                                                />
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
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                            <Shield className="w-6 h-6"/>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 font-heading">Security Settings</h2>
                                            <p className="text-sm text-slate-500 font-medium">Manage your password and account security.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-8 max-w-xl">
                                        {/* Password Change Section */}
                                        <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-9 h-9 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
                                                    <Lock className="w-4 h-4"/>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900">Change Password</h3>
                                                    <p className="text-xs text-slate-500 font-medium">Update your account password securely.</p>
                                                </div>
                                            </div>
                                            <div className="space-y-5">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Current Password</label>
                                                    <input type="password" placeholder="Enter current password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-slate-900 text-sm"/>
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">New Password</label>
                                                    <input type="password" placeholder="Enter new password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-slate-900 text-sm"/>
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Confirm New Password</label>
                                                    <input type="password" placeholder="Re-enter new password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-slate-900 text-sm"/>
                                                </div>
                                                <button className="bg-slate-900 hover:bg-black text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-md transition-all hover:-translate-y-0.5 active:scale-[0.98] w-full mt-1">
                                                    Update Password
                                                </button>
                                            </div>
                                        </div>

                                        {/* Danger Zone */}
                                        <div className="p-6 border-2 border-red-200 rounded-2xl bg-red-50/50">
                                            <div className="flex items-center gap-2 mb-4">
                                                <AlertCircle className="w-4 h-4 text-red-500"/>
                                                <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest">Danger Zone</h3>
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                <div>
                                                    <p className="font-bold text-slate-900 mb-1">Delete Account</p>
                                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Permanently delete your account and all associated data. This action cannot be undone.</p>
                                                </div>
                                                <button className="px-5 py-2.5 bg-white border-2 border-red-300 hover:bg-red-600 hover:text-white hover:border-red-600 text-red-600 font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex-shrink-0">
                                                    Delete Account
                                                </button>
                                            </div>
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
