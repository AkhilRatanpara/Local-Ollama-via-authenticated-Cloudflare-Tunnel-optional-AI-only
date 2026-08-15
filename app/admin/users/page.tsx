"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";
import {
  Search, Trash2, Shield, UserX, UserCheck, AlertTriangle,
  CheckCircle, RefreshCw, Edit3, Mail, MapPin, Calendar, X
} from "lucide-react";

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed bottom-6 right-6 z-[100] bg-[#1a1d27] border border-white/10 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold">
      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {msg}
    </div>
  );
}

function DeleteModal({ target, onCancel, onConfirm }: any) {
  return (
    <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1a1d27] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold">Delete User</h3>
            <p className="text-gray-500 text-xs">This is permanent and irreversible</p>
          </div>
          <button onClick={onCancel}><X className="w-4 h-4 text-gray-600 hover:text-white" /></button>
        </div>
        <p className="text-gray-300 text-sm mb-5">
          Delete <span className="text-white font-bold">"{target.name || target.email}"</span> and all their saved schemes and data?
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-bold transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-all">Delete</button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ target, onCancel, onSave }: any) {
  const [role, setRole] = useState(target.role || "user");
  return (
    <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1a1d27] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-white font-bold">Edit User</h3>
            <p className="text-gray-500 text-xs">{target.email}</p>
          </div>
          <button onClick={onCancel}><X className="w-4 h-4 text-gray-600 hover:text-white" /></button>
        </div>
        <div className="mb-5">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Role</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: "user", label: "User", icon: UserCheck, color: "text-gray-300" },
              { val: "admin", label: "Admin", icon: Shield, color: "text-rose-400" },
              { val: "restricted", label: "Restricted", icon: UserX, color: "text-amber-400" },
            ].map(({ val, label, icon: Icon, color }) => (
              <button key={val} type="button" onClick={() => setRole(val)}
                className={`flex flex-col items-center gap-2 py-3 rounded-xl border transition-all text-xs font-bold ${role === val ? "bg-indigo-600/20 border-indigo-500/40 text-white" : "bg-white/5 border-white/10 text-gray-500 hover:text-white"}`}>
                <Icon className={`w-4 h-4 ${role === val ? "text-indigo-400" : color}`} />
                {label}
              </button>
            ))}
          </div>
          {role === "restricted" && (
            <p className="text-amber-400 text-xs mt-2">⚠ Restricted users cannot access most features.</p>
          )}
          {role === "admin" && (
            <p className="text-rose-400 text-xs mt-2">⚠ Admin users have full portal access.</p>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-bold transition-all">Cancel</button>
          <button onClick={() => onSave(target.id, role)} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default function ManageUsers() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userList, setUserList] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.push("/admin/login");
  }, [user, loading, router]);

  const fetchUsers = useCallback(async () => {
    setDataLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setUserList(data.users || []);
    } catch (e: any) { console.error(e); }
    finally { setDataLoading(false); }
  }, []);

  useEffect(() => { if (user?.role === "admin") fetchUsers(); }, [user, fetchUsers]);

  const updateRole = async (id: string, role: string) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    });
    const data = await res.json();
    if (data.error) { setToast("Error: " + data.error); return; }
    setUserList(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    setEditTarget(null);
    setToast("User role updated");
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/users?id=${deleteTarget.id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.error) { setToast("Error: " + data.error); setDeleteTarget(null); return; }
    setUserList(prev => prev.filter(u => u.id !== deleteTarget.id));
    setDeleteTarget(null);
    setToast("User deleted");
  };

  const filtered = userList.filter(u =>
    !search || (u.name || "").toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    total: userList.length,
    admin: userList.filter(u => u.role === "admin").length,
    restricted: userList.filter(u => u.role === "restricted").length,
    regular: userList.filter(u => !u.role || u.role === "user").length,
  };

  if (loading || !user || user.role !== "admin") return null;

  return (
    <AdminLayout
      title="User Management"
      subtitle={`${filtered.length} of ${userList.length} users`}
      actions={
        <button onClick={fetchUsers} disabled={dataLoading}
          className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${dataLoading ? "animate-spin" : ""}`} /> Refresh
        </button>
      }
    >
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      {deleteTarget && <DeleteModal target={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={doDelete} />}
      {editTarget && <EditModal target={editTarget} onCancel={() => setEditTarget(null)} onSave={updateRole} />}

      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: counts.total, color: "text-indigo-400" },
            { label: "Regular", value: counts.regular, color: "text-gray-300" },
            { label: "Admins", value: counts.admin, color: "text-rose-400" },
            { label: "Restricted", value: counts.restricted, color: "text-amber-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#1a1d27] border border-white/5 rounded-2xl p-4 text-center">
              <p className={`text-3xl font-black mb-1 ${color}`}>{value}</p>
              <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1a1d27] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/40 transition-all" />
        </div>

        {/* Table */}
        <div className="bg-[#1a1d27] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">User</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest hidden md:table-cell">Location</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest hidden lg:table-cell">Joined</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Role</th>
                <th className="text-right px-5 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/3 animate-pulse">
                    <td className="px-5 py-4"><div className="flex gap-3 items-center"><div className="w-8 h-8 bg-white/5 rounded-full" /><div className="h-4 bg-white/5 rounded w-36" /></div></td>
                    <td className="px-4 py-4 hidden md:table-cell"><div className="h-4 bg-white/5 rounded w-24" /></td>
                    <td className="px-4 py-4 hidden lg:table-cell"><div className="h-4 bg-white/5 rounded w-20" /></td>
                    <td className="px-4 py-4"><div className="h-5 bg-white/5 rounded w-14" /></td>
                    <td className="px-5 py-4"><div className="h-8 bg-white/5 rounded w-20 ml-auto" /></td>
                  </tr>
                ))
                : filtered.length === 0
                  ? <tr><td colSpan={5} className="text-center py-16 text-gray-600 text-sm">No users found</td></tr>
                  : filtered.map(u => (
                    <tr key={u.id} className="border-b border-white/3 hover:bg-white/2 transition-all group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/20 flex items-center justify-center text-indigo-300 text-xs font-bold flex-shrink-0">
                            {(u.name || u.email)?.[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-sm font-bold truncate">{u.name || "Unnamed"}</p>
                            <p className="text-gray-500 text-[11px] flex items-center gap-1 truncate"><Mail className="w-3 h-3 flex-shrink-0" />{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-gray-400 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{u.state || "–"}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" />{u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "–"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize
                          ${u.role === "admin" ? "bg-rose-600/15 text-rose-400" : u.role === "restricted" ? "bg-amber-600/15 text-amber-400" : "bg-white/5 text-gray-400"}`}>
                          {u.role === "admin" ? <Shield className="w-3 h-3" /> : u.role === "restricted" ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                          {u.role || "user"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => setEditTarget({ ...u })} title="Edit Role"
                            className="p-2 rounded-lg bg-white/5 hover:bg-indigo-600/20 text-gray-500 hover:text-indigo-400 transition-all">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteTarget(u)} title="Delete" disabled={u.id === user?.id}
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-600/20 text-gray-500 hover:text-red-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
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
