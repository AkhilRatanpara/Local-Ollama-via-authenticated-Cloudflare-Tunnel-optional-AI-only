"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";
import ProfileDropdown from "./ProfileDropdown";
import Link from "next/link";
import { motion } from "framer-motion";

const ALL_NAV_LINKS = [
    { name: "Home", path: "/", settingKey: null },
    { name: "Schemes", path: "/schemes", settingKey: "nav_schemes_enabled" },
    { name: "Subsidies", path: "/subsidies", settingKey: "nav_subsidies_enabled" },
    { name: "Loans", path: "/loans", settingKey: "nav_loans_enabled" },
    { name: "News", path: "/news", settingKey: "nav_news_enabled" },
    { name: "About", path: "/about", settingKey: null },
];

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [siteSettings, setSiteSettings] = useState<Record<string, boolean>>({});

    const handleLogout = () => {
        logout();
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 15);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Fetch feature settings from admin API
    useEffect(() => {
        fetch("/api/admin/settings")
            .then(res => res.json())
            .then(data => { if (data.settings) setSiteSettings(data.settings); })
            .catch(() => {}); // silently fail; all links show by default
    }, []);

    const isActive = (path: string) => pathname === path;

    // Filter nav links based on feature settings (default = visible)
    const navLinks = ALL_NAV_LINKS.filter(link => {
        if (!link.settingKey) return true; // Home & About always visible
        return siteSettings[link.settingKey] !== false; // show unless explicitly false
    });

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isScrolled
                    ? "bg-white/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] border-b border-slate-200/50 py-2.5"
                    : "bg-white/40 backdrop-blur-md border-b border-transparent py-4"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-12">
                        {/* Animated Video Logo */}
                        <Link href="/" className="h-full w-40 relative flex items-center justify-center">
                            <video
                                src="/animated-logo.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute h-[145%] w-auto max-w-none object-contain select-none pointer-events-none"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex space-x-8 items-center mt-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    className={`relative px-1 py-1 text-sm font-bold transition-colors duration-300 group ${isActive(link.path) ? "text-blue-800" : "text-slate-600 hover:text-blue-700"
                                        }`}
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    {/* Left-to-Right Underline Animation */}
                                    <span
                                        className={`absolute left-0 -bottom-1 w-full h-[2px] rounded-full transition-all duration-300 ease-out origin-left ${isActive(link.path)
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
                onProfileClick={() => { setIsMobileMenuOpen(false); window.location.href = '/profile' }}
            />
        </>
    );
}

