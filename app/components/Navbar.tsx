"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";
import ProfileDropdown from "./ProfileDropdown";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
    };

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 15);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Schemes", path: "/schemes" },
        { name: "Loans", path: "/loans" },
        { name: "News", path: "/news" },
        { name: "About", path: "/about" },
    ];

    return (
        <>
            <motion.nav 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
                    isScrolled 
                        ? "bg-white/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] border-b border-slate-200/50 py-2.5" 
                        : "bg-white/40 backdrop-blur-md border-b border-transparent py-4"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-12">
                        {/* Premium Logo */}
                        <Link href="/" className="flex items-center gap-3 group relative">
                            <div className="relative w-10 h-10 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110">
                                {/* Subtle Logo Glow */}
                                <div className="absolute inset-0 bg-blue-400/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-xl group-hover:bg-blue-200 transition-colors duration-300 shadow-sm border border-slate-200/50"></div>
                                <div className="relative flex items-center justify-center overflow-hidden z-10">
                                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px] drop-shadow-sm">
                                        <path d="M6 26C6 14.9543 14.9543 6 26 6" stroke="#1e40af" strokeWidth="4" strokeLinecap="round"/>
                                        <path d="M26 26C14.9543 26 6 17.0457 6 6" stroke="#14b8a6" strokeWidth="4" strokeLinecap="round"/>
                                    </svg>
                                </div>
                            </div>
                            <span className="font-heading font-black text-2xl tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors drop-shadow-sm">
                                Sangam
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex space-x-8 items-center mt-1">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.path} 
                                    href={link.path} 
                                    className={`relative px-1 py-1 text-sm font-bold transition-colors duration-300 group ${
                                        isActive(link.path) ? "text-blue-800" : "text-slate-600 hover:text-blue-700"
                                    }`}
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    {/* Left-to-Right Underline Animation */}
                                    <span 
                                        className={`absolute left-0 -bottom-1 w-full h-[2px] rounded-full transition-all duration-300 ease-out origin-left ${
                                            isActive(link.path) 
                                                ? "bg-blue-700 scale-x-100" 
                                                : "bg-blue-500 scale-x-0 group-hover:scale-x-100 opacity-50 group-hover:opacity-100"
                                        }`}
                                    ></span>
                                </Link>
                            ))}
                            {user?.role === "admin" && (
                                <Link href="/admin/dashboard" className="px-4 py-2 rounded-lg text-xs font-bold text-red-600 hover:text-red-700 bg-red-50/80 hover:bg-red-100/80 transition-all border border-red-200/50 hover:shadow-sm">
                                    Admin Panel
                                </Link>
                            )}
                        </div>

                        {/* Right Side Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            <ProfileDropdown user={user} onLogout={handleLogout} />
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden items-center gap-4">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="p-2 rounded-xl transition-colors text-slate-600 hover:text-blue-800 hover:bg-slate-100"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Sidebar Components */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                user={user}
                onProfileClick={() => {setIsMobileMenuOpen(false); window.location.href = '/profile'}}
            />
        </>
    );
}
