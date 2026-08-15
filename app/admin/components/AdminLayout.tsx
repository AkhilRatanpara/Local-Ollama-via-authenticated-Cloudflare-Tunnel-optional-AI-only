"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard, FileText, Users, ToggleLeft, Plus, LogOut,
  ChevronRight, ChevronLeft, Landmark, ExternalLink, Shield
} from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/manage", label: "Manage Content", icon: FileText },
  { href: "/admin/schemes/add", label: "Add Scheme", icon: Plus },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/feature-controls", label: "Feature Controls", icon: ToggleLeft },
];

interface Props {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AdminLayout({ children, title, subtitle, actions }: Props) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white font-sans flex">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-[#0f1117] border-r border-white/5 transition-all duration-300 ease-in-out ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo + toggle */}
        <div className={`flex items-center gap-3 px-4 py-4 border-b border-white/5 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <Landmark className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight">Sangam Admin</p>
              <p className="text-indigo-400 text-[10px] font-medium flex items-center gap-1">
                <Shield className="w-3 h-3" /> Administrator
              </p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {!collapsed && (
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-3 py-2 mt-1">
              Main Menu
            </p>
          )}
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin/dashboard" && pathname?.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium group
                  ${active
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/25 shadow-sm shadow-indigo-500/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                  ${collapsed ? "justify-center" : ""}`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-indigo-400" : ""}`} />
                {!collapsed && <span>{label}</span>}
                {active && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                )}
              </Link>
            );
          })}

          {/* View Live Site */}
          {!collapsed && <div className="pt-3 pb-1 mt-3 border-t border-white/5">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-3 py-1">Preview</p>
          </div>}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="View Live Site"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-600/10 transition-all border border-transparent hover:border-emerald-500/20 ${collapsed ? "justify-center" : ""}`}
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>View Live Site</span>}
          </a>
        </nav>

        {/* Admin user + logout */}
        <div className={`p-3 border-t border-white/5 space-y-2 ${collapsed ? "flex flex-col items-center" : ""}`}>
          {!collapsed && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-8 h-8 rounded-full bg-indigo-600/50 border border-indigo-500/30 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="overflow-hidden flex-1 min-w-0">
                <p className="text-white text-xs font-bold truncate">{user?.name || "Administrator"}</p>
                <p className="text-gray-500 text-[10px] truncate">{user?.email}</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" title="Online" />
            </div>
          )}
          <button
            onClick={() => { logout(); router.push("/admin/login"); }}
            title="Logout"
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-xs font-bold border border-transparent hover:border-red-500/20 ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? "ml-16" : "ml-64"} min-h-screen flex flex-col`}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#0a0d14]/95 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight leading-none">{title}</h1>
            {subtitle && <p className="text-gray-500 text-xs font-medium mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            {actions}
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
