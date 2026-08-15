"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingChatbot from "./Chatbot";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith("/admin");

    if (isAdminRoute) {
        // Admin pages: dark background, no public site chrome
        return (
            <div className="min-h-screen bg-[#0a0d14]">
                {children}
            </div>
        );
    }

    return (
        <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/40 via-slate-50/20 to-white min-h-screen text-slate-900">
            <Navbar />
            <div className="relative w-full overflow-x-hidden">
                {children}
            </div>
            <Footer />
            <FloatingChatbot />
        </div>
    );
}
