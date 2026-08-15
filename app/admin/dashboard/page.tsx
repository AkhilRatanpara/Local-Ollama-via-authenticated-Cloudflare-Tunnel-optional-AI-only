"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "../components/AdminLayout";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, CartesianGrid,
} from "recharts";
import {
  TrendingUp, Users, FileText, Banknote, BadgePercent,
  Newspaper, Shield, Plus, Edit3, UserCheck, ToggleLeft,
  ChevronRight, RefreshCw
} from "lucide-react";

const TYPE_COLORS: Record<string, string> = {
  Scheme: "#6366f1",
  Loan: "#3b82f6",
  Subsidy: "#10b981",
};
const CAT_COLORS = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "#1a1d27",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "12px",
  },
  labelStyle: { color: "#9ca3af" },
};

function StatCard({ label, value, sub, icon: Icon, color, subColor = "text-emerald-400" }: any) {
  return (
    <div className="bg-[#1a1d27] border border-white/5 rounded-2xl p-5 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <TrendingUp className="w-3.5 h-3.5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="text-[28px] font-black text-white mb-0.5 leading-none tabular-nums">{value ?? "–"}</p>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      {sub && <p className={`text-[11px] font-semibold ${subColor}`}>{sub}</p>}
    </div>
  );
}

function SectionCard({ title, subtitle, children }: any) {
  return (
    <div className="bg-[#1a1d27] border border-white/5 rounded-2xl p-6">
      <div className="mb-5">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {subtitle && <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [recentSchemes, setRecentSchemes] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.push("/admin/login");
  }, [user, loading, router]);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const [statsRes, schemesRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/schemes"),
        fetch("/api/admin/users"),
      ]);
      if (!statsRes.ok || !schemesRes.ok || !usersRes.ok) throw new Error("API error");
      const [s, sc, u] = await Promise.all([statsRes.json(), schemesRes.json(), usersRes.json()]);
      setStats(s);
      setRecentSchemes((sc.schemes || []).slice(0, 5));
      setRecentUsers((u.users || []).slice(0, 5));
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { if (user?.role === "admin") load(); }, [user, load]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 animate-pulse" />
          <p className="text-gray-500 text-sm">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  const s = stats?.stats || {};
  const typeData = (stats?.typeBreakdown || []).map((t: any) => ({ name: t.type || "Other", value: Number(t.count) }));
  const catData = (stats?.categoryBreakdown || []).slice(0, 9).map((c: any) => ({ name: (c.category || "Other").substring(0, 10), count: Number(c.count) }));
  const monthlyData = (stats?.monthlySchemes || []).map((m: any) => ({ month: m.month, count: Number(m.count) }));

  return (
    <AdminLayout
      title="Dashboard"
      subtitle={`Welcome back, ${user.name || "Administrator"}`}
      actions={
        <button onClick={load} disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 transition-all disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      }
    >
      <div className="space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <StatCard label="Total Users" value={s.totalUsers} sub={`+${s.newUsersThisWeek || 0} this week`} icon={Users} color="bg-indigo-600" />
          <StatCard label="All Schemes" value={s.totalSchemes} icon={FileText} color="bg-blue-600" />
          <StatCard label="Live Schemes" value={s.activeSchemes} icon={FileText} color="bg-violet-600" />
          <StatCard label="Live Loans" value={s.activeLoans} icon={Banknote} color="bg-blue-500" />
          <StatCard label="Subsidies" value={s.activeSubsidies} icon={BadgePercent} color="bg-emerald-600" />
          <StatCard label="Disabled" value={s.disabledSchemes} sub="Hidden from public" icon={Shield} color="bg-red-600" subColor="text-red-400" />
          <StatCard label="News Items" value={s.totalNews} icon={Newspaper} color="bg-amber-600" />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Pie */}
          <SectionCard title="Content by Type" subtitle="Schemes vs Loans vs Subsidies">
            {typeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={typeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} strokeWidth={0}>
                    {typeData.map((entry: any, i: number) => (
                      <Cell key={i} fill={TYPE_COLORS[entry.name] || CAT_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", color: "#9ca3af", paddingTop: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-600 text-sm">No data yet</div>
            )}
          </SectionCard>

          {/* Area */}
          <div className="lg:col-span-2">
            <SectionCard title="Monthly Additions" subtitle="Schemes added over the last 6 months">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fill="url(#areaGrad)" dot={{ fill: "#6366f1", r: 3, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-gray-600 text-sm">No monthly data yet</div>
              )}
            </SectionCard>
          </div>
        </div>

        {/* Bar chart */}
        <SectionCard title="Schemes by Category" subtitle="Distribution across all categories">
          {catData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={catData} barSize={24} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {catData.map((_: any, i: number) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-600 text-sm">No category data yet</div>
          )}
        </SectionCard>

        {/* Recent activity */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Recent Schemes */}
          <SectionCard title="Recent Schemes" subtitle="Latest added content">
            <div className="space-y-2">
              {recentSchemes.length === 0
                ? <p className="text-gray-600 text-sm text-center py-6">No schemes yet</p>
                : recentSchemes.map((s: any) => (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-all">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0
                      ${s.type === "Loan" ? "bg-blue-600/20 text-blue-400" : s.type === "Subsidy" ? "bg-emerald-600/20 text-emerald-400" : "bg-indigo-600/20 text-indigo-400"}`}>
                      {s.type?.[0] || "S"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-bold truncate">{s.title}</p>
                      <p className="text-gray-500 text-[10px]">{s.category} · {s.state}</p>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${s.status === "active" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              <Link href="/admin/manage" className="flex items-center justify-center gap-1 mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-bold py-2 transition-colors">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </SectionCard>

          {/* Recent Users */}
          <SectionCard title="Recent Users" subtitle="Newest registrations">
            <div className="space-y-2">
              {recentUsers.length === 0
                ? <p className="text-gray-600 text-sm text-center py-6">No users yet</p>
                : recentUsers.map((u: any) => (
                  <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-all">
                    <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/20 flex items-center justify-center text-indigo-300 text-xs font-bold flex-shrink-0">
                      {(u.name || u.email)?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-bold truncate">{u.name || "Unnamed"}</p>
                      <p className="text-gray-500 text-[10px] truncate">{u.email}</p>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold capitalize ${u.role === "admin" ? "bg-rose-500/15 text-rose-400" : "bg-white/5 text-gray-500"}`}>
                      {u.role || "user"}
                    </span>
                  </div>
                ))}
              <Link href="/admin/users" className="flex items-center justify-center gap-1 mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-bold py-2 transition-colors">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </SectionCard>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Add Scheme", href: "/admin/schemes/add", icon: Plus, cls: "text-indigo-400 bg-indigo-600/10 border-indigo-500/20 hover:bg-indigo-600/20" },
            { label: "Manage Content", href: "/admin/manage", icon: Edit3, cls: "text-blue-400 bg-blue-600/10 border-blue-500/20 hover:bg-blue-600/20" },
            { label: "Manage Users", href: "/admin/users", icon: UserCheck, cls: "text-emerald-400 bg-emerald-600/10 border-emerald-500/20 hover:bg-emerald-600/20" },
            { label: "Feature Controls", href: "/admin/feature-controls", icon: ToggleLeft, cls: "text-amber-400 bg-amber-600/10 border-amber-500/20 hover:bg-amber-600/20" },
          ].map(({ label, href, icon: Icon, cls }) => (
            <Link key={href} href={href}
              className={`flex flex-col items-center gap-3 p-5 rounded-xl border transition-all text-sm font-bold text-center ${cls}`}>
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
