import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingChatbot from "./components/Chatbot";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta"
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit"
});

export const metadata: Metadata = {
  title: "Sangam - AI-Powered Scheme Finder",
  description: "Find Government Schemes Tailored for You using AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${jakarta.variable} ${outfit.variable} font-sans overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/40 via-slate-50/20 to-white min-h-screen text-slate-900 antialiased selection:bg-indigo-500/30 selection:text-indigo-900`}>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <div className="relative w-full overflow-x-hidden">
              {children}
            </div>
            <Footer />
            <FloatingChatbot />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
