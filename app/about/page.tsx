"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, HeartHandshake, ShieldCheck, 
  Target, Zap, FileText, CheckCircle2, 
  Users, Briefcase, GraduationCap, ArrowUpRight,
  Eye, Focus
} from "lucide-react";

export default function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, ease: "easeOut" }
  } as const;

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.15 }
  } as const;

  return (
    <main className="w-full pb-0 min-h-screen text-slate-900 selection:bg-indigo-500/30 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex items-center justify-center">
        {/* Soft gradient background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
          <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-blue-100/60 blur-[120px] animate-pulse-glow"></div>
          <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-50/60 blur-[100px] animate-pulse-glow delay-700"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_40%,#000_70%,transparent_100%)]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] font-heading text-slate-900 mb-6 drop-shadow-sm">
            Find Benefits <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-indigo-600">Made for You</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Discover government schemes tailored to your needs with intelligent matching. SANGAM helps you find the right opportunities without confusion or complexity.
          </p>
        </motion.div>
      </section>

      {/* 2. OUR STORY */}
      <section className="py-24 bg-white border-t border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-6">Why SANGAM Exists</h2>
              <div className="space-y-4 text-slate-600 text-lg leading-relaxed font-medium">
                <p>
                  Accessing government schemes should be simple, but in reality, it is often confusing and time-consuming. Many people struggle to find the right information, and as a result, they miss out on opportunities meant for them.
                </p>
                <p>
                  SANGAM was built to solve this problem. By combining technology with a user-first approach, we simplify the way citizens discover and access government benefits.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square md:aspect-[4/3] rounded-[2rem] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,theme(colors.blue.400)_0,transparent_50%)] blur-2xl"></div>
                <Users size={120} strokeWidth={1} className="text-blue-300 relative z-10 drop-shadow-sm" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. OUR PURPOSE */}
      <section className="py-24 bg-slate-50 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mb-8 shadow-sm border border-teal-100">
               <Target size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-6">Our Purpose</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium">
              We aim to make government support more accessible, transparent, and easy to understand. Our focus is to remove barriers and ensure that every citizen can find the benefits they are eligible for.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4. HOW WE WORK */}
      <section className="py-24 bg-white border-t border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 {...fadeInUp} className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">How We Work</motion.h2>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid md:grid-cols-4 gap-8 relative"
          >
            {/* Desktop connector line */}
            <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-100 via-indigo-200 to-teal-100 z-0"></div>

            {[
              { num: "01", title: "Understand Your Needs", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
              { num: "02", title: "Intelligent Matching", icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50" },
              { num: "03", title: "Clear Information", icon: Eye, color: "text-teal-600", bg: "bg-teal-50" },
              { num: "04", title: "Easy Access", icon: ArrowUpRight, color: "text-sky-600", bg: "bg-sky-50" }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 }
                }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className={`w-20 h-20 rounded-full ${step.bg} border-4 border-white shadow-xl flex items-center justify-center mb-6 relative transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl`}>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {step.num}
                  </div>
                  <step.icon size={32} className={step.color} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. WHO WE SERVE */}
      <section className="py-24 bg-slate-50 relative z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <motion.div {...fadeInUp} className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">Who We Serve</h2>
              <p className="text-slate-600 font-medium text-lg">
                SANGAM is designed for everyone. Our goal is to ensure that no one misses out on opportunities due to lack of awareness.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Students", icon: GraduationCap, color: "text-blue-600", bgHover: "group-hover:bg-blue-50", borderHover: "hover:border-blue-300" },
              { title: "Farmers", icon: HeartHandshake, color: "text-teal-600", bgHover: "group-hover:bg-teal-50", borderHover: "hover:border-teal-300" },
              { title: "Job Seekers", icon: Briefcase, color: "text-indigo-600", bgHover: "group-hover:bg-indigo-50", borderHover: "hover:border-indigo-300" },
              { title: "All Citizens", icon: Users, color: "text-sky-600", bgHover: "group-hover:bg-sky-50", borderHover: "hover:border-sky-300" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`group flex flex-col items-center p-8 bg-white rounded-2xl border border-slate-200 transition-all duration-300 hover:shadow-lg ${item.borderHover}`}
              >
                <div className={`w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center mb-4 transition-colors ${item.bgHover}`}>
                  <item.icon size={32} className={`transition-transform duration-300 group-hover:scale-110 ${item.color}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-800 transition-colors">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. OUR APPROACH */}
      <section className="py-24 bg-white border-t border-slate-100 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-8 shadow-sm border border-indigo-100">
               <Focus size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-6">Our Approach</h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              We focus on simplicity, clarity, and efficiency. Instead of overwhelming users with data, we provide meaningful insights that help them make informed decisions quickly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 7. FUTURE VISION */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div {...fadeInUp}>
             <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-6">Looking Ahead</h2>
             <p className="text-xl text-slate-700 leading-relaxed font-medium">
              We are continuously improving SANGAM to make it smarter and more accessible. Our vision is to create a platform where accessing government support becomes effortless for every citizen.
             </p>
          </motion.div>
        </div>
      </section>

      {/* 8. TRUST SECTION */}
      <section className="py-20 bg-slate-900 text-white relative z-10 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 {...fadeInUp} className="text-3xl font-bold font-heading mb-4">Built on Trust</motion.h2>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
            {[
              { text: "Accurate and structured information" },
              { text: "No hidden charges" },
              { text: "Free and accessible for everyone" }
            ].map((trust, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-xl border border-white/10"
              >
                <CheckCircle2 className="text-teal-400 flex-shrink-0" size={20} />
                <span className="text-base font-medium text-slate-200">{trust.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA SECTION */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
        {/* Soft abstract shapes */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-white rounded-[100%] rotate-12 blur-3xl mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] font-heading mb-6 drop-shadow-sm">
              Start Your Journey Today
            </h2>
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium mb-10">
              Explore the benefits designed for you and take the first step towards better opportunities.
            </p>
            <Link 
              href="/schemes" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Explore Schemes <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
