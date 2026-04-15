"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const form = e.target as HTMLFormElement;
        const email = (form.elements[0] as HTMLInputElement).value;
        const password = (form.elements[1] as HTMLInputElement).value;

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Invalid email or password");
            }

            const data = await res.json();
            toast("success", "Welcome Back", `Successfully logged in as ${data.user.name}`);
            login(data.user);
        } catch (err: any) {
            toast("error", "Authentication Failed", err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen py-24 md:py-32 bg-slate-50 flex items-center justify-center px-4 relative overflow-hidden font-sans">
            {/* Abstract Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-50/60 blur-[100px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-50/60 blur-[100px]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(30,64,175,0.1)] border border-slate-200 overflow-hidden relative z-10"
            >
                {/* Header */}
                <div className="p-8 md:p-10 text-center relative border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50">
                    <div className="w-16 h-16 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2 font-heading tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 font-medium">Log in to seamlessly access your tailored recommendations and applications.</p>
                </div>

                {/* Form */}
                <div className="p-8 md:p-10 pt-8">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <div className="flex items-center justify-between pl-1 pr-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">Forgot Password?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-6 bg-blue-800 text-white font-bold py-4 rounded-xl shadow-[0_8px_20px_rgb(30,64,175,0.2)] hover:bg-blue-700 hover:shadow-[0_8px_25px_rgb(30,64,175,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                <>
                                    <span>Access Account</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 relative text-center">
                        <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200"></div>
                        <span className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Or Login With</span>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-slate-700 shadow-sm">
                            <span className="text-xl">G</span> Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-slate-700 shadow-sm">
                            <span className="text-xl text-blue-600">e</span> e-Pramaan
                        </button>
                    </div>

                    <p className="mt-8 text-center text-sm font-medium text-slate-500">
                        Don't have an account? <Link href="/register" className="text-blue-700 font-bold hover:underline">Sign Up safely</Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
