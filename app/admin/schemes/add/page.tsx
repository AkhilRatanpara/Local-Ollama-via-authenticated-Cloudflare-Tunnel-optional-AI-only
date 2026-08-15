"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";
import { Plus, Trash2, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

/* ─── DB-aligned constants ─── */
const CATEGORIES = ["Agriculture", "Education", "Health", "Housing", "Employment", "Women & Child", "Business", "Social Welfare", "Energy", "Technology"];
const SCHEME_TYPES = ["Scheme", "Loan", "Subsidy"];
const STATES = ["Central", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry"];
const GENDERS = ["All", "Male", "Female", "Transgender"];
const RESIDENCES = ["Both", "Urban", "Rural"];
const CASTES = ["General", "OBC", "SC", "ST", "EWS"];

// Predefined tag suggestions
const TAG_SUGGESTIONS = [
  "Agriculture", "Farmers", "Women", "Youth", "Students", "Disabled", "BPL",
  "SC/ST", "OBC", "EWS", "Minority", "Senior Citizen", "Rural", "Urban",
  "Self-Employment", "Startup", "MSME", "Housing", "Solar Energy", "Electric Vehicle",
  "Health Insurance", "Scholarship", "Skill Development", "Digital India", "Swachh Bharat",
];

/* ─── Re-usable input classes ─── */
const CLS_INPUT = "w-full bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/40 transition-all";
const CLS_SELECT = CLS_INPUT;
const CLS_TEXTAREA = CLS_INPUT + " resize-none";

/* ─── Field wrapper ─── */
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

/* ─── Bullet list input ─── */
function BulletInput({ label, value, onChange, placeholder }: {
  label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim();
    if (!t || value.includes(t)) return;
    onChange([...value, t]);
    setDraft("");
  };
  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
      {value.length > 0 && (
        <ul className="space-y-1.5 mb-3">
          {value.map((item, i) => (
            <li key={i} className="flex items-start gap-2 bg-[#0f1117] border border-white/10 rounded-xl px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-1.5" />
              <span className="text-gray-200 text-sm flex-1 leading-snug">{item}</span>
              <button onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input type="text" value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder || `Add a ${label.toLowerCase()} point...`}
          className="flex-1 bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/40 transition-all" />
        <button type="button" onClick={add}
          className="px-4 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-sm font-bold rounded-xl border border-indigo-500/20 transition-all flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
    </div>
  );
}

/* ─── Tag picker ─── */
function TagPicker({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [custom, setCustom] = useState("");
  const toggle = (tag: string) => {
    onChange(value.includes(tag) ? value.filter(t => t !== tag) : [...value, tag]);
  };
  const addCustom = () => {
    const t = custom.trim();
    if (!t || value.includes(t)) return;
    onChange([...value, t]);
    setCustom("");
  };
  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tags</label>
      <div className="flex flex-wrap gap-2 mb-3">
        {TAG_SUGGESTIONS.map(tag => (
          <button key={tag} type="button" onClick={() => toggle(tag)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${value.includes(tag) ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/40" : "bg-white/5 text-gray-500 border-white/10 hover:text-white hover:border-white/20"}`}>
            {value.includes(tag) && "✓ "}{tag}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input type="text" value={custom} onChange={e => setCustom(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
          placeholder="Add custom tag..."
          className="flex-1 bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/40 transition-all" />
        <button type="button" onClick={addCustom}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-bold rounded-xl border border-white/10 transition-all">
          + Add
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {value.map(tag => (
            <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600/20 text-indigo-300 text-xs rounded-lg border border-indigo-500/20 font-medium">
              {tag}
              <button onClick={() => onChange(value.filter(t => t !== tag))} className="hover:text-red-400 transition-colors ml-0.5">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Section wrapper ─── */
function Section({ title, color = "border-white/5", children }: { title: string; color?: string; children: React.ReactNode }) {
  return (
    <div className={`bg-[#1a1d27] border rounded-2xl p-6 space-y-5 ${color}`}>
      <h2 className="text-sm font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">{title}</h2>
      {children}
    </div>
  );
}

export default function AddScheme() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state — keys match DB schema exactly
  const [form, setForm] = useState({
    title: "",
    ministry: "",
    description: "",
    category: "Agriculture",
    type: "Scheme",
    state: "Central",
    status: "active",
    // Benefits / money
    amount: "",
    shortBenefits: "",
    applicationUrl: "",
    // Loan-specific (DB columns: interestRate, tenureMax, collateralRequired, moratoriumMonths, interestSubvention)
    interestRate: "",
    tenureMax: "",
    collateralRequired: false,
    moratoriumMonths: "",
    interestSubvention: "",
    // Subsidy-specific (DB columns: subsidyPercentage, subsidyMaxAmount, dbtStatus, vendorEmpanelled)
    subsidyPercentage: "",
    subsidyMaxAmount: "",
    dbtStatus: false,
    vendorEmpanelled: false,
    // Criteria (DB columns: gender, ageMin, ageMax, incomeLimit, residence)
    gender: "All",
    ageMin: "",
    ageMax: "",
    incomeLimit: "",
    residence: "Both",
    // Arrays
    benefits: [] as string[],
    eligibility: [] as string[],
    documentsRequired: [] as string[],
    caste: [] as string[],
    lendingPartners: [] as string[],
    tags: [] as string[],
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.push("/admin/login");
  }, [user, loading, router]);

  const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.title.trim()) { setError("Title is required"); return; }
    setSubmitting(true);
    try {
      // Build payload — only include non-empty values, types must match schema
      const payload: Record<string, any> = {
        title: form.title.trim(),
        ministry: form.ministry.trim(),
        description: form.description.trim(),
        category: form.category,
        type: form.type,
        state: form.state,
        status: form.status,
        gender: form.gender,
        residence: form.residence,
        benefits: form.benefits,
        eligibility: form.eligibility,
        documentsRequired: form.documentsRequired.length ? form.documentsRequired : undefined,
        caste: form.caste.length ? form.caste : undefined,
        tags: form.tags.length ? form.tags : undefined,
      };
      if (form.shortBenefits) payload.shortBenefits = form.shortBenefits.trim();
      if (form.applicationUrl) payload.applicationUrl = form.applicationUrl.trim();
      if (form.amount) payload.amount = parseFloat(form.amount);
      if (form.ageMin) payload.ageMin = parseInt(form.ageMin);
      if (form.ageMax) payload.ageMax = parseInt(form.ageMax);
      if (form.incomeLimit) payload.incomeLimit = parseFloat(form.incomeLimit);

      if (form.type === "Loan") {
        if (form.interestRate) payload.interestRate = parseFloat(form.interestRate);
        if (form.tenureMax) payload.tenureMax = parseInt(form.tenureMax);
        if (form.moratoriumMonths) payload.moratoriumMonths = parseInt(form.moratoriumMonths);
        if (form.interestSubvention) payload.interestSubvention = parseFloat(form.interestSubvention);
        payload.collateralRequired = form.collateralRequired;
        if (form.lendingPartners.length) payload.lendingPartners = form.lendingPartners;
        if (form.shortBenefits) payload.shortBenefits = form.shortBenefits;
      }
      if (form.type === "Subsidy") {
        if (form.subsidyPercentage) payload.subsidyPercentage = parseFloat(form.subsidyPercentage);
        if (form.subsidyMaxAmount) payload.subsidyMaxAmount = parseFloat(form.subsidyMaxAmount);
        payload.dbtStatus = form.dbtStatus;
        payload.vendorEmpanelled = form.vendorEmpanelled;
      }

      const res = await fetch("/api/admin/schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create scheme");
      setSuccess(true);
      setTimeout(() => router.push("/admin/manage"), 1800);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user || user.role !== "admin") return null;

  return (
    <AdminLayout
      title="Add New Scheme"
      subtitle="Fill in the details to publish to the public site"
      actions={
        <Link href="/admin/manage" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 transition-all">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
      }
    >
      {success && (
        <div className="mb-6 bg-emerald-600/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-emerald-300 font-bold text-sm">Scheme published! Redirecting...</span>
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-600/10 border border-red-500/30 rounded-2xl p-4 text-red-300 text-sm font-semibold">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 max-w-5xl">
        {/* ── Basic info ── */}
        <Section title="📋 Basic Information">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Field label="Scheme Title" required>
                <input required value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g., PM Kisan Samman Nidhi" className={CLS_INPUT} />
              </Field>
            </div>
            <Field label="Ministry / Department">
              <input value={form.ministry} onChange={e => set("ministry", e.target.value)} placeholder="e.g., Ministry of Agriculture" className={CLS_INPUT} />
            </Field>
            <Field label="Type" required>
              <select value={form.type} onChange={e => set("type", e.target.value)} className={CLS_SELECT}>
                {SCHEME_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Category" required>
              <select value={form.category} onChange={e => set("category", e.target.value)} className={CLS_SELECT}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="State / Level" required>
              <select value={form.state} onChange={e => set("state", e.target.value)} className={CLS_SELECT}>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={4} placeholder="Full description of the scheme..." className={CLS_TEXTAREA} />
              </Field>
            </div>
            <Field label="Status">
              <select value={form.status} onChange={e => set("status", e.target.value)} className={CLS_SELECT}>
                <option value="active">Active (Live on site)</option>
                <option value="closed">Closed (Hidden from site)</option>
                <option value="upcoming">Upcoming (Coming soon)</option>
              </select>
            </Field>
            <Field label="Short Benefit Summary">
              <input value={form.shortBenefits} onChange={e => set("shortBenefits", e.target.value)} placeholder="e.g., ₹6,000/yr or 30% subsidy" className={CLS_INPUT} />
            </Field>
            <Field label="Amount (₹, numeric)">
              <input type="number" value={form.amount} onChange={e => set("amount", e.target.value)} placeholder="e.g., 6000" className={CLS_INPUT} />
            </Field>
            <Field label="Application URL">
              <input type="url" value={form.applicationUrl} onChange={e => set("applicationUrl", e.target.value)} placeholder="https://..." className={CLS_INPUT} />
            </Field>
          </div>
        </Section>

        {/* ── Loan fields ── */}
        {form.type === "Loan" && (
          <Section title="💸 Loan Details" color="border-blue-500/20">
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Interest Rate (% p.a.)">
                <input type="number" step="0.01" value={form.interestRate} onChange={e => set("interestRate", e.target.value)} placeholder="e.g., 7.5" className={CLS_INPUT} />
              </Field>
              <Field label="Max Tenure (months)">
                <input type="number" value={form.tenureMax} onChange={e => set("tenureMax", e.target.value)} placeholder="e.g., 60" className={CLS_INPUT} />
              </Field>
              <Field label="Moratorium Period (months)">
                <input type="number" value={form.moratoriumMonths} onChange={e => set("moratoriumMonths", e.target.value)} placeholder="e.g., 6" className={CLS_INPUT} />
              </Field>
              <Field label="Interest Subvention (%)">
                <input type="number" step="0.01" value={form.interestSubvention} onChange={e => set("interestSubvention", e.target.value)} placeholder="e.g., 2" className={CLS_INPUT} />
              </Field>
              <Field label="Collateral Required">
                <select value={form.collateralRequired ? "yes" : "no"} onChange={e => set("collateralRequired", e.target.value === "yes")} className={CLS_SELECT}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </Field>
            </div>
            <BulletInput label="Lending Partners / Banks" value={form.lendingPartners} onChange={v => set("lendingPartners", v)} placeholder="e.g., SBI, Bank of Baroda..." />
          </Section>
        )}

        {/* ── Subsidy fields ── */}
        {form.type === "Subsidy" && (
          <Section title="🎯 Subsidy Details" color="border-emerald-500/20">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Subsidy Percentage (%)">
                <input type="number" step="0.1" value={form.subsidyPercentage} onChange={e => set("subsidyPercentage", e.target.value)} placeholder="e.g., 30" className={CLS_INPUT} />
              </Field>
              <Field label="Maximum Subsidy Amount (₹)">
                <input type="number" value={form.subsidyMaxAmount} onChange={e => set("subsidyMaxAmount", e.target.value)} placeholder="e.g., 50000" className={CLS_INPUT} />
              </Field>
              <Field label="DBT (Direct Benefit Transfer)">
                <select value={form.dbtStatus ? "yes" : "no"} onChange={e => set("dbtStatus", e.target.value === "yes")} className={CLS_SELECT}>
                  <option value="yes">Yes — transferred directly to bank</option>
                  <option value="no">No</option>
                </select>
              </Field>
              <Field label="Vendor Empanelment Required">
                <select value={form.vendorEmpanelled ? "yes" : "no"} onChange={e => set("vendorEmpanelled", e.target.value === "yes")} className={CLS_SELECT}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </Field>
            </div>
          </Section>
        )}

        {/* ── Eligibility criteria ── */}
        <Section title="✅ Eligibility Criteria">
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Gender">
              <select value={form.gender} onChange={e => set("gender", e.target.value)} className={CLS_SELECT}>
                {GENDERS.map(g => <option key={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="Residence">
              <select value={form.residence} onChange={e => set("residence", e.target.value)} className={CLS_SELECT}>
                {RESIDENCES.map(r => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Annual Income Limit (₹)">
              <input type="number" value={form.incomeLimit} onChange={e => set("incomeLimit", e.target.value)} placeholder="e.g., 250000" className={CLS_INPUT} />
            </Field>
            <Field label="Minimum Age">
              <input type="number" value={form.ageMin} onChange={e => set("ageMin", e.target.value)} placeholder="e.g., 18" className={CLS_INPUT} />
            </Field>
            <Field label="Maximum Age">
              <input type="number" value={form.ageMax} onChange={e => set("ageMax", e.target.value)} placeholder="e.g., 60" className={CLS_INPUT} />
            </Field>
          </div>
          {/* Caste selection */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Eligible Castes / Categories</label>
            <div className="flex flex-wrap gap-2">
              {CASTES.map(c => (
                <button key={c} type="button"
                  onClick={() => set("caste", form.caste.includes(c) ? form.caste.filter(x => x !== c) : [...form.caste, c])}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${form.caste.includes(c) ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/40" : "bg-white/5 text-gray-500 border-white/10 hover:text-white"}`}>
                  {form.caste.includes(c) && "✓ "}{c}
                </button>
              ))}
              <button type="button" onClick={() => set("caste", form.caste.length === CASTES.length ? [] : [...CASTES])}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-white/5 text-gray-500 border-white/10 hover:text-white transition-all">
                {form.caste.length === CASTES.length ? "Clear all" : "Select all"}
              </button>
            </div>
          </div>
          <BulletInput label="Eligibility Criteria" value={form.eligibility} onChange={v => set("eligibility", v)} placeholder="e.g., Must be a resident farmer of India..." />
        </Section>

        {/* ── Benefits & Docs ── */}
        <Section title="🎁 Benefits & Documents">
          <BulletInput label="Benefits" value={form.benefits} onChange={v => set("benefits", v)} placeholder="e.g., Financial assistance of ₹6,000 per year..." />
          <BulletInput label="Documents Required" value={form.documentsRequired} onChange={v => set("documentsRequired", v)} placeholder="e.g., Aadhaar card, Land record, Bank passbook..." />
        </Section>

        {/* ── Tags ── */}
        <Section title="🏷️ Tags">
          <TagPicker value={form.tags} onChange={v => set("tags", v)} />
        </Section>

        {/* ── Submit ── */}
        <div className="flex gap-4 pt-2">
          <Link href="/admin/manage" className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-bold text-center transition-all border border-white/10">
            Cancel
          </Link>
          <button type="submit" disabled={submitting || success}
            className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-all shadow-lg shadow-indigo-600/20">
            {submitting ? "Publishing..." : success ? "Published! ✓" : "Publish Scheme"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
