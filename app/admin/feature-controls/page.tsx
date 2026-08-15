"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";
import { RefreshCw, Landmark as LandmarkIcon, Banknote, BadgePercent, Newspaper, MessageSquare, ToggleLeft } from "lucide-react";

interface Toggle {
  key: string;
  label: string;
  description: string;
  icon: any;
  iconColor: string;
  bgColor: string;
  warning?: string;
}

const TOGGLES: Toggle[] = [
  {
    key: "nav_schemes_enabled", label: "Schemes Page", icon: LandmarkIcon,
    iconColor: "text-indigo-400", bgColor: "bg-indigo-600/10 border-indigo-500/15",
    description: "Show or hide the Schemes section from public navigation and all scheme listing pages."
  },
  {
    key: "nav_loans_enabled", label: "Loans Page", icon: Banknote,
    iconColor: "text-blue-400", bgColor: "bg-blue-600/10 border-blue-500/15",
    description: "Show or hide the Loans section. When disabled, the Loans link disappears from the navigation bar."
  },
  {
    key: "nav_subsidies_enabled", label: "Subsidies Page", icon: BadgePercent,
    iconColor: "text-emerald-400", bgColor: "bg-emerald-600/10 border-emerald-500/15",
    description: "Show or hide the Subsidies section from the public site and navigation menu."
  },
  {
    key: "nav_news_enabled", label: "News & Updates", icon: Newspaper,
    iconColor: "text-amber-400", bgColor: "bg-amber-600/10 border-amber-500/15",
    description: "Show or hide the News feed section from public navigation and homepage widgets."
  },
  {
    key: "chatbot_enabled", label: "AI Chatbot Sarthi", icon: MessageSquare,
    iconColor: "text-violet-400", bgColor: "bg-violet-600/10 border-violet-500/15",
    description: "Enable or disable the Sarthi AI assistant chatbot on the public site.",
    warning: "Disabling will hide the AI assistant for all citizens."
  },
];

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed bottom-6 right-6 z-[100] bg-[#1a1d27] border border-white/10 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold animate-in slide-in-from-bottom-4">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      {msg}
    </div>
  );
}

export default function FeatureControls() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.push("/admin/login");
  }, [user, loading, router]);

  const fetchSettings = useCallback(async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
    } catch { /* defaults remain */ }
    finally { setFetching(false); }
  }, []);

  useEffect(() => { if (user?.role === "admin") fetchSettings(); }, [user, fetchSettings]);

  const toggle = async (key: string) => {
    const newVal = settings[key] === false ? true : !settings[key];
    setSaving(key);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: newVal }),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(prev => ({ ...prev, [key]: newVal }));
        const label = TOGGLES.find(t => t.key === key)?.label || key;
        setToast(`${label} is now ${newVal ? "enabled" : "disabled"}`);
      } else {
        setToast("Failed: " + (data.error || "Unknown error"));
      }
    } catch { setToast("Network error — try again"); }
    finally { setSaving(null); }
  };

  if (loading || !user || user.role !== "admin") {
    return <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center text-gray-500 text-sm">Verifying access...</div>;
  }

  const enabledCount = TOGGLES.filter(t => settings[t.key] !== false).length;

  return (
    <AdminLayout
      title="Feature Controls"
      subtitle={`${enabledCount} of ${TOGGLES.length} features currently enabled`}
      actions={
        <button onClick={fetchSettings} disabled={fetching}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 transition-all disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${fetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      }
    >
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

      <div className="max-w-2xl space-y-4">
        {/* Info banner */}
        <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-4 flex items-start gap-3 mb-6">
          <ToggleLeft className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white text-sm font-bold mb-1">Live Public Site Controls</p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Toggle features instantly. Changes take effect immediately — the Navbar adjusts automatically.
              Open <a href="/" target="_blank" className="text-indigo-400 underline">the live site</a> in a new tab to preview changes.
            </p>
          </div>
        </div>

        {TOGGLES.map(({ key, label, description, icon: Icon, iconColor, bgColor, warning }) => {
          const enabled = settings[key] !== false;
          const isSaving = saving === key;
          return (
            <div key={key}
              className={`rounded-2xl p-5 border transition-all duration-200 ${enabled ? `${bgColor}` : "bg-red-500/5 border-red-500/15"}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${enabled ? "bg-white/5" : "bg-red-600/10"}`}>
                    <Icon className={`w-5 h-5 ${enabled ? iconColor : "text-red-400"}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h3 className="text-white font-bold text-sm">{label}</h3>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider
                        ${enabled ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                        {enabled ? "LIVE" : "HIDDEN"}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
                    {warning && !enabled && <p className="text-amber-400 text-xs mt-1 font-medium">⚠ {warning}</p>}
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  onClick={() => toggle(key)}
                  disabled={isSaving}
                  aria-label={`Toggle ${label}`}
                  className={`relative flex-shrink-0 h-7 w-12 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0a0d14]
                    ${enabled ? "bg-indigo-600 shadow-lg shadow-indigo-600/20" : "bg-gray-700"}
                    ${isSaving ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
                >
                  <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${enabled ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          );
        })}

        <div className="bg-[#1a1d27] border border-white/5 rounded-2xl p-4 mt-4">
          <p className="text-gray-500 text-xs leading-relaxed">
            <span className="text-white font-bold">How it works: </span>
            The public Navbar fetches these settings and hides disabled links automatically. 
            Only admin accounts can still access disabled pages directly via their URL.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
