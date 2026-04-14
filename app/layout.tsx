import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingChatbot from "./components/Chatbot";
import { AuthProvider } from "@/context/AuthContext";

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
    <html lang="en">
      <body className={`${jakarta.variable} ${outfit.variable} font-sans overflow-x-hidden bg-[#050B14] text-slate-200 antialiased selection:bg-blue-500/30 selection:text-blue-200`}>
        <AuthProvider>
          <Navbar />
          <div className="relative w-full overflow-x-hidden">
            {children}
          </div>
          <Footer />
          <FloatingChatbot />
        </AuthProvider>
      </body>
    </html>
  );
}
