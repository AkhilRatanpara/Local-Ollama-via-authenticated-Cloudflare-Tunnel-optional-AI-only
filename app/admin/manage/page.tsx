"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "../components/AdminLayout";
import {
  Search, Edit3, Trash2, Eye, EyeOff, Banknote, BadgePercent,
  FileText, Plus, RefreshCw, AlertTriangle, CheckCircle, X
} from "lucide-react";

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed bottom-6 right-6 z-[100] bg-[#1a1d27] border border-white/10 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold">
      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />{msg}
    </div>
  );
}

function DeleteModal({ target, onCancel, onConfirm }: any) {
  return (
    <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1a1d27] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-bold">Delete Permanently?</h3>
            <p className="text-gray-500 text-xs">This cannot be undone</p>
          </div>
          <button onClick={onCancel} className="ml-auto text-gray-600 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <p className="text-gray-300 text-sm mb-5">Delete <span className="text-white font-bold">"{target.title}"</span>? It will be removed from the public site immediately.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-bold transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-all">Delete</button>
        </div>
      </div>
    </div>
  );
}

const TYPE_BADGE: Record<string, string> = {
  Loan: "bg-blue-600/15 text-blue-400",
  Subsidy: "bg-emerald-600/15 text-emerald-400",
  Scheme: "bg-indigo-600/15 text-indigo-400",
};

export default function ManageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.push("/admin/login");
  }, [user, loading, router]);

  const fetchData = useCallback(async () => {
    setDataLoading(true);
    try {
      const res = await fetch("/api/admin/schemes");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setItems(data.schemes || []);
    } catch (e: any) { console.error(e); }
    finally { setDataLoading(false); }
  }, []);

  useEffect(() => { if (user?.role === "admin") fetchData(); }, [user, fetchData]);

  const toggleStatus = async (item: any) => {
    const newStatus = item.status === "active" ? "closed" : "active";
    const res = await fetch("/api/admin/schemes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, status: newStatus }),
    });
    if (res.ok) {
      setItems(prev => prev.map(s => s.id === item.id ? { ...s, status: newStatus } : s));
      setToast(`"${item.title.substring(0, 30)}" → ${newStatus === "active" ? "now LIVE ✓" : "now HIDDEN"}`);
    }
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/schemes?id=${deleteTarget.id}`, { method: "DELETE" });
    if (res.ok) {
      setItems(prev => prev.filter(s => s.id !== deleteTarget.id));
      setToast("Scheme deleted");
    }
    setDeleteTarget(null);
  };

  const filtered = items.filter(s => {
    const okType = typeFilter === "all" || s.type === typeFilter;
    const okSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || (s.category || "").toLowerCase().includes(search.toLowerCase());
    return okType && okSearch;
  });

  if (loading || !user || user.role !== "admin") return null;

  return (
    <AdminLayout
      title="Manage Content"
      subtitle={`${filtered.length} of ${items.length} records`}
      actions={
        <>
          <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 transition-all">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <Link href="/admin/schemes/add" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition-all shadow-lg shadow-indigo-600/20">
            <Plus className="w-3.5 h-3.5" /> Add New
          </Link>
        </>
      }
    >
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      {deleteTarget && <DeleteModal target={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={doDelete} />}

      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Search title or category..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#1a1d27] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/40 transition-all" />
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {["all", "Scheme", "Loan", "Subsidy"].map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border
                  ${typeFilter === t ? "bg-indigo-600 text-white border-indigo-500" : "bg-[#1a1d27] text-gray-400 border-white/10 hover:text-white hover:border-white/20"}`}>
                {t === "all" ? "All" : t}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1a1d27] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Title</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest hidden lg:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest hidden lg:table-cell">State</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Visibility</th>
                <th className="text-right px-5 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/3 animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-white/5 rounded w-48" /></td>
                    <td className="px-4 py-4 hidden md:table-cell"><div className="h-4 bg-white/5 rounded w-16" /></td>
                    <td className="px-4 py-4 hidden lg:table-cell"><div className="h-4 bg-white/5 rounded w-24" /></td>
                    <td className="px-4 py-4 hidden lg:table-cell"><div className="h-4 bg-white/5 rounded w-16" /></td>
                    <td className="px-4 py-4"><div className="h-5 bg-white/5 rounded w-14" /></td>
                    <td className="px-5 py-4"><div className="h-8 bg-white/5 rounded w-20 ml-auto" /></td>
                  </tr>
                ))
                : filtered.length === 0
                  ? <tr><td colSpan={6} className="text-center py-16 text-gray-600 text-sm">No records found</td></tr>
                  : filtered.map(s => (
                    <tr key={s.id} className="border-b border-white/3 hover:bg-white/2 transition-all group">
                      <td className="px-5 py-3.5">
                        <p className="text-white text-sm font-semibold line-clamp-1 group-hover:text-indigo-300 transition-colors">{s.title}</p>
                        <p className="text-gray-600 text-[10px] mt-0.5 line-clamp-1">{s.ministry}</p>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${TYPE_BADGE[s.type] || "bg-white/5 text-gray-400"}`}>
                          {s.type === "Loan" ? <Banknote className="w-3 h-3" /> : s.type === "Subsidy" ? <BadgePercent className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                          {s.type}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className="text-gray-400 text-xs">{s.category}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className="text-gray-500 text-xs">{s.state || "Central"}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button onClick={() => toggleStatus(s)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all
                            ${s.status === "active" ? "bg-emerald-600/15 text-emerald-400 hover:bg-emerald-600/25" : "bg-red-600/15 text-red-400 hover:bg-red-600/25"}`}>
                          {s.status === "active" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {s.status === "active" ? "Live" : "Hidden"}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 justify-end">
                          <Link href={`/admin/schemes/edit/${s.id}`} title="Edit"
                            className="p-2 rounded-lg bg-white/5 hover:bg-indigo-600/20 text-gray-500 hover:text-indigo-400 transition-all">
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>
                          <button onClick={() => setDeleteTarget(s)} title="Delete"
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-600/20 text-gray-500 hover:text-red-400 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
