import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import SiteLayout from "./components/SiteLayout";

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
      <body suppressHydrationWarning className={`${jakarta.variable} ${outfit.variable} font-sans overflow-x-hidden min-h-screen antialiased selection:bg-indigo-500/30 selection:text-indigo-900`}>
        <AuthProvider>
          <ToastProvider>
            {/* SiteLayout conditionally shows Navbar/Footer/Chatbot — hidden on /admin/* */}
            <SiteLayout>
              {children}
            </SiteLayout>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
