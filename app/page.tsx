"use client";

import Link from "next/link";
import { ArrowRight, Search, Zap, FileText, Bell, Landmark, ShieldCheck, ChevronRight, Play, Star, TrendingUp, Sparkles, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen relative text-slate-200 selection:bg-blue-500/30 font-sans pb-24">

      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-28">

        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          {/* Ambient Glowing Orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px] animate-pulse-glow"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-orange-500/10 blur-[120px] animate-pulse-glow delay-700"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-emerald-500/5 blur-[150px] animate-pulse-glow delay-1000"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between w-full h-full gap-16 pb-20 mt-10 md:mt-0">

          {/* Left Text */}
          <div className="w-full lg:w-1/2 text-left space-y-10 animate-slide-up-fade">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-white/10 shadow-lg text-sm font-medium text-blue-200">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              AI-Powered Government Matchmaking
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] font-heading drop-shadow-sm">
              Empower Your Future <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white animate-gradient">With Sangam AI</span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed font-light">
              Discover and find perfect government benefits that made for you with AI. We simplify the entire process from discovery to application, ensuring you get exactly what you deserve without the paperwork chaos.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Link href={user ? "/schemes" : "/register"} className="group relative px-8 py-4 bg-white text-[#050b14] rounded-full font-bold text-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-2 overflow-hidden hover-glow">
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles size={20} className="text-blue-600" /> Get Started Free
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white via-slate-200 to-white translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Link>
              
              <Link href="/schemes" className="group px-8 py-4 bg-transparent border border-slate-700 text-white rounded-full font-semibold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                <Search size={20} className="group-hover:scale-110 transition-transform" /> 
                Explore Schemes
              </Link>
            </div>

            <div className="flex items-center gap-10 pt-10 border-t border-slate-800/50">
              <div className="animate-slide-up-fade delay-300">
                <div className="text-4xl font-heading font-bold text-white tracking-tight">850<span className="text-blue-500">+</span></div>
                <div className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-wider">Active Schemes</div>
              </div>
              <div className="w-[1px] h-12 bg-slate-800"></div>
              <div className="animate-slide-up-fade delay-500">
                <div className="text-4xl font-heading font-bold text-white tracking-tight">100<span className="text-emerald-500">%</span></div>
                <div className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-wider">Free Access</div>
              </div>
            </div>
          </div>

          {/* Right Visual 3D Showcase */}
          <div className="w-full lg:w-1/2 relative flex justify-center items-center h-[550px] animate-reveal-right delay-200">
            <div className="relative w-full max-w-[550px] aspect-square animate-float-smooth">
              
              {/* Central Glowing Shield / Landmark */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-transform duration-700 ease-out"
                style={{ transform: `translate(-50%, calc(-50% + ${scrollY * -0.08}px))` }}
              >
                <div className="relative flex items-center justify-center">
                  {/* Rotating Border */}
                  <div className="absolute inset-[-40px] rounded-full border border-blue-500/30 border-dashed animate-spin-slow"></div>
                  
                  {/* Inner Glass Orb */}
                  <div className="w-48 h-48 rounded-full glass-card flex items-center justify-center shadow-[0_0_80px_rgba(59,130,246,0.3)] border-blue-500/20 backdrop-blur-xl">
                    <Landmark size={80} className="text-blue-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] stroke-[1]" />
                  </div>
                </div>
              </div>

              {/* Orbiting Elements */}
              {/* Top Right Card */}
              <div className="absolute top-[10%] right-[0%] glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 z-30 animate-float-smooth delay-300 hover:scale-105 transition-transform duration-300 shadow-2xl border-white/10">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <UserCheck className="text-emerald-400" size={24} />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-medium">Match Accuracy</div>
                  <div className="text-xl font-bold text-white">99.9%</div>
                </div>
              </div>

              {/* Bottom Left Card */}
              <div className="absolute bottom-[10%] left-[-5%] glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 z-30 animate-float-smooth delay-700 hover:scale-105 transition-transform duration-300 shadow-2xl border-white/10">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                  <TrendingUp className="text-orange-400" size={24} />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-medium">Daily Updates</div>
                  <div className="text-xl font-bold text-white">Live Data</div>
                </div>
              </div>
              
              {/* Floating stars */}
              <Star className="absolute top-[20%] left-[15%] text-blue-400/50 animate-pulse delay-700" size={20} />
              <Star className="absolute bottom-[30%] right-[10%] text-indigo-400/50 animate-pulse delay-300" size={24} />
              
            </div>
          </div>

        </div>
      </section>

      {/* 2. WHY CHOOSE SANGAM (Glassmorphism Grid) */}
      <section className="relative py-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up-fade">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-700/50 bg-slate-800/30 text-xs font-bold uppercase tracking-widest mb-6 text-slate-300">
              <ShieldCheck size={16} className="text-blue-400" /> Platform Advantages
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">
              A New Era of <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Civic Empowerment</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Driven Matching",
                desc: "Our advanced algorithms analyze your profile against complex parameters to ensure you only see what you qualify for.",
                icon: <Zap size={28} className="text-blue-400" />,
                gradient: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] focus-within:shadow-[0_0_40px_rgba(59,130,246,0.15)] group-hover:border-blue-500/30"
              },
              {
                title: "Real-Time Alerts",
                desc: "Get notified immediately when new schemes are launched or crucial application deadlines are approaching.",
                icon: <Bell size={28} className="text-orange-400" />,
                gradient: "group-hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] group-hover:border-orange-500/30"
              },
              {
                title: "Easy Application Steps",
                desc: "Follow simplified, step-by-step application procedures designed specifically for our project. Apply with absolute confidence and zero friction.",
                icon: <FileText size={28} className="text-emerald-400" />,
                gradient: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] group-hover:border-emerald-500/30"
              }
            ].map((item, i) => (
              <div 
                key={i} 
                className={`group glass-card p-10 rounded-3xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col justify-start relative overflow-hidden ${item.gradient} animate-slide-up-fade custom-delay-${i}`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  {item.icon}
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4 text-white font-heading">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-base">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TRENDING SCHEMES */}
      <section className="relative py-24 mb-10 overflow-hidden">
        {/* Background glow for the section */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full bg-blue-600/5 blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-slate-800/50 pb-8">
            <div className="mb-6 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-white tracking-tight mb-4">Trending Schemes</h2>
              <p className="text-slate-400 text-lg">Top opportunities applied for this week across India.</p>
            </div>
            <Link href="/schemes" className="group flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider px-6 py-3 rounded-full border border-blue-500/20 hover:border-blue-500/50 bg-blue-500/5">
              Explore Catalog 
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Mudra Yojana", cat: "Business", amount: "Up to ₹10L", icon: TrendingUp, color: "text-blue-400", bgGlow: "bg-blue-500/20" },
              { title: "PMAY Urban", cat: "Housing", amount: "Subsidies", icon: Landmark, color: "text-purple-400", bgGlow: "bg-purple-500/20" },
              { title: "PM Kaushal", cat: "Education", amount: "100% Free", icon: Zap, color: "text-orange-400", bgGlow: "bg-orange-500/20" }
            ].map((item, idx) => (
              <Link
                href="/schemes"
                key={idx} 
                className={`group relative h-[380px] rounded-[2rem] overflow-hidden cursor-pointer glass-card border border-slate-700/30 hover:border-slate-500/50 transition-all duration-700 hover:-translate-y-3 block`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Abstract Background Elements inside card */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 ease-out"></div>
                <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full ${item.bgGlow} blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10 w-full h-full">
                  <div className="flex justify-between items-start w-full">
                    <span className="glass-panel px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-300 shadow-sm border border-slate-600/50 backdrop-blur-md">
                      {item.cat}
                    </span>
                    <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-blue-500 group-hover:border-blue-400 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                      <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  <div className="w-full transform group-hover:translate-y-[-10px] transition-transform duration-500">
                    <item.icon size={36} className={`mb-6 ${item.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                    <h3 className="text-3xl font-heading font-bold mb-3 text-white">{item.title}</h3>
                    <div className="flex items-center gap-2">
                       <ShieldCheck size={18} className="text-slate-500" />
                       <span className="text-slate-300 font-medium text-lg">{item.amount} Benefit</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="relative py-28 mx-4 sm:mx-6 lg:mx-8 mb-20 animate-slide-up-fade delay-300">
        <div className="max-w-6xl mx-auto glass-card rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
          
          {/* Inner Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[800px] bg-gradient-to-b from-blue-600/20 to-transparent blur-3xl -z-10"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 tracking-tight text-white drop-shadow-lg">
              Ready to Claim Your Benefits?
            </h2>
            <p className="text-xl text-slate-400 mb-12 font-light">
              Join millions of Indians who have already found their path to prosperity with Sangam AI.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href={user ? "/profile" : "/register"} className="px-10 py-5 bg-white text-[#050b14] rounded-full font-bold text-xl hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] flex items-center justify-center gap-3">
                {user ? "Go to Dashboard" : "Create Free Account"} <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
