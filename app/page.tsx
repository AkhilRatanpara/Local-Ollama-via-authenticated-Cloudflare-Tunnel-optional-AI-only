"use client";

import Link from "next/link";
import { Search, Zap, FileText, Landmark, ShieldCheck, ChevronRight, TrendingUp, Sparkles, UserCheck, ArrowRight, CheckCircle2, Globe2, Building2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function Home() {
  const { user } = useAuth();

  const [scrollY, setScrollY] = useState(0);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth mouse follow effect tailored for Light Theme
  useEffect(() => {
    let mouseX = -1000;
    let mouseY = -1000;
    let cursorX = -1000;
    let cursorY = -1000;
    let isInitialized = false;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isInitialized) {
        cursorX = mouseX;
        cursorY = mouseY;
        isInitialized = true;
        if (cursorRef.current) {
          cursorRef.current.style.opacity = '1';
        }
      }
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <main className="min-h-screen relative text-slate-900 selection:bg-indigo-500/30 font-sans pb-0">

      {/* Smooth Cursor Glow - Light Theme Adaptation */}
      <div 
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-0 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-blue-400/30 via-teal-300/20 to-transparent blur-[160px] mix-blend-normal -ml-[350px] -mt-[350px] opacity-0 transition-opacity duration-700 hidden md:block"
        style={{ willChange: 'transform' }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex items-center justify-center">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Soft Mesh Gradients */}
          <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-blue-100/60 blur-[120px] animate-pulse-glow"></div>
          <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-50/60 blur-[100px] animate-pulse-glow delay-700"></div>
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_40%,#000_70%,transparent_100%)]"></div>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center"
        >
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-bold text-blue-700 mb-8 hover:shadow-md transition-shadow">
            <Sparkles size={16} className="text-teal-500" />
            AI-Powered Government Matchmaking
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] font-heading text-slate-900 mb-6 drop-shadow-sm">
            Your Smart Bridge to <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-indigo-600">Government Benefits.</span>
          </h1>

          {/* Subheading */}
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl leading-relaxed font-medium mb-12">
            Discover, filter, and access government schemes with AI-powered precision. We simplify complex bureaucratic processes into a few clicks.
          </p>



          {/* Stats below search */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12 text-slate-500 text-sm font-semibold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-teal-500" />
              100% Free Access
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-teal-500" />
              850+ Active Schemes
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-teal-500" />
              Verified Authentic Data
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. HOW IT WORKS (Timeline/Steps) */}
      <section className="py-24 bg-white border-t border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">How Sangam Works</h2>
            <p className="text-slate-600 font-medium max-w-xl mx-auto">Three simple steps to unlock the benefits you are eligible for, powered by state-of-the-art AI analysis.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-100 via-indigo-200 to-teal-100 z-0"></div>
            
            {[
              { step: "01", title: "Tell Us About You", desc: "Share basic details like age, occupation, and location through our secure portal.", icon: UserCheck, color: "text-blue-600", bg: "bg-blue-50" },
              { step: "02", title: "AI Precision Match", desc: "Our algorithm filters hundreds of schemes to find the exact ones you qualify for instantly.", icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50" },
              { step: "03", title: "Apply Seamlessly", desc: "Get direct links, required document checklists, and step-by-step guidance to apply.", icon: FileText, color: "text-teal-600", bg: "bg-teal-50" }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center animate-slide-up-fade" style={{ animationDelay: `${idx * 150}ms` }}>
                <div className={`w-24 h-24 rounded-full ${item.bg} border-4 border-white shadow-xl flex items-center justify-center mb-6 relative group transition-transform hover:scale-105`}>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {item.step}
                  </div>
                  <item.icon size={36} className={item.color} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed max-w-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURES (Modern Cards) */}
      <section className="py-24 bg-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">Platform Intelligence</h2>
            <p className="text-slate-600 font-medium max-w-xl mx-auto">Built with premium tech-stack concepts to deliver a flawless, accessible experience to all citizens.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Filtering",
                desc: "Never read through irrelevant PDFs again. We show you exactly what matters.",
                icon: <Search size={28} className="text-blue-700" />,
                accentClasses: "group-hover:border-blue-200 group-hover:shadow-[0_20px_40px_-10px_rgba(30,64,175,0.1)]",
                iconBg: "bg-blue-50 text-blue-700"
              },
              {
                title: "Secure Profile",
                desc: "Your data privacy is our priority. ISO certified standard encryption secures all profiles.",
                icon: <ShieldCheck size={28} className="text-indigo-700" />,
                accentClasses: "group-hover:border-indigo-200 group-hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.1)]",
                iconBg: "bg-indigo-50 text-indigo-700"
              },
              {
                title: "Always Up-To-Date",
                desc: "Government sources are continuously monitored to ensure deadlines and criteria are accurate.",
                icon: <TrendingUp size={28} className="text-teal-700" />,
                accentClasses: "group-hover:border-teal-200 group-hover:shadow-[0_20px_40px_-10px_rgba(20,184,166,0.1)]",
                iconBg: "bg-teal-50 text-teal-700"
              }
            ].map((item, i) => (
              <div 
                key={i} 
                className={`group bg-white border border-slate-200 p-10 rounded-3xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden animate-slide-up-fade ${item.accentClasses}`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className={`w-16 h-16 rounded-2xl ${item.iconBg} flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 font-heading">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-base font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SCHEMES CATEGORIES */}
      <section className="py-24 bg-white relative z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">Explore by Category</h2>
              <p className="text-slate-600 font-medium">Browse curated government schemes grouped by demographic and sector.</p>
            </div>
            <Link href="/schemes" className="mt-6 md:mt-0 group flex items-center gap-2 text-sm font-bold text-blue-800 hover:text-blue-700 transition-colors uppercase tracking-wider px-6 py-3 rounded-full border border-blue-200 hover:border-blue-300 bg-blue-50/50">
              View All 
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Business & MSME", desc: "Subsidies & expansion loans", icon: Building2, color: "text-blue-600", borderHover: "hover:border-blue-300", bgHover: "group-hover:bg-blue-50" },
              { title: "Education", desc: "Scholarships & study aids", icon: Globe2, color: "text-indigo-600", borderHover: "hover:border-indigo-300", bgHover: "group-hover:bg-indigo-50" },
              { title: "Housing & Rural", desc: "PMAY and infrastructure", icon: Landmark, color: "text-teal-600", borderHover: "hover:border-teal-300", bgHover: "group-hover:bg-teal-50" }
            ].map((item, idx) => (
              <Link
                href="/schemes"
                key={idx} 
                className={`group flex items-center p-6 bg-white rounded-2xl border border-slate-200 transition-all duration-300 hover:shadow-lg ${item.borderHover}`}
              >
                <div className={`w-14 h-14 rounded-xl bg-slate-50 flex flex-shrink-0 items-center justify-center mr-5 transition-colors ${item.bgHover}`}>
                  <item.icon size={26} className={item.color} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-800 transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TRUST / IMPACT BANNER */}
      <section className="py-24 bg-blue-900 relative overflow-hidden">
        {/* Banner Graphics */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-50%] right-[-10%] w-[80%] h-[200%] bg-white rounded-[100%] rotate-12 blur-3xl mix-blend-overlay"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            {[
              { num: "₹500Cr+", label: "Benefits Discovered" },
              { num: "2M+", label: "Citizens Empowered" },
              { num: "850+", label: "Active Schemes" },
              { num: "99.9%", label: "Platform Uptime" }
            ].map((stat, i) => (
              <div key={i} className="py-6 md:py-0 px-4">
                <div className="text-4xl md:text-5xl font-black font-heading text-white mb-2">{stat.num}</div>
                <div className="text-blue-200 font-semibold tracking-wide uppercase text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
