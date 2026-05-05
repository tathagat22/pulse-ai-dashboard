"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check, Loader2, Upload, ChevronRight, ChevronLeft,
  Wifi, WifiOff, RefreshCw, Plus, X, Zap,
} from "lucide-react";
import { sleep, cn } from "@/lib/utils";

const INDUSTRIES = [
  "E-Commerce", "SaaS", "B2B Tech", "Healthcare", "Finance",
  "Real Estate", "Education", "Media", "Retail", "Agency",
];

const PLATFORMS = [
  {
    key: "ga4",
    name: "Google Analytics 4",
    description: "Website traffic, user behaviour, conversions",
    icon: "G",
    color: "#7C3AED",
  },
  {
    key: "meta",
    name: "Meta Ads",
    description: "Facebook & Instagram ad performance",
    icon: "f",
    color: "#2563EB",
  },
  {
    key: "xads",
    name: "X Ads",
    description: "Twitter/X promoted posts and campaigns",
    icon: "𝕏",
    color: "#E5E7EB",
  },
  {
    key: "googleads",
    name: "Google Ads",
    description: "Search, display, and Shopping campaigns",
    icon: "G",
    color: "#EA4335",
  },
];

const TEMPLATES = [
  { id: "executive", label: "Executive Summary", desc: "High-level KPIs, 2-page brief" },
  { id: "full", label: "Full Performance Report", desc: "All metrics, charts, recommendations" },
  { id: "weekly", label: "Weekly Pulse", desc: "Compact weekly digest, trends-focused" },
];

type ConnectionState = "idle" | "connecting" | "connected" | "failed";

const STEPS = ["Basic Info", "Platform Connections", "Report Config"];

export default function NewClientPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Step 1
  const [clientName, setClientName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#7C3AED");
  const [secondaryColor, setSecondaryColor] = useState("#06B6D4");
  const [logoInitials, setLogoInitials] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [logoUploaded, setLogoUploaded] = useState(false);

  // Step 2
  const [connections, setConnections] = useState<Record<string, ConnectionState>>(
    Object.fromEntries(PLATFORMS.map((p) => [p.key, "idle"]))
  );

  // Step 3
  const [selectedTemplate, setSelectedTemplate] = useState("full");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipientInput, setRecipientInput] = useState("");
  const [approvalRequired, setApprovalRequired] = useState(true);

  async function connectPlatform(key: string) {
    setConnections((prev) => ({ ...prev, [key]: "connecting" }));
    await sleep(2000);
    setConnections((prev) => ({ ...prev, [key]: "connected" }));
  }

  function disconnectPlatform(key: string) {
    setConnections((prev) => ({ ...prev, [key]: "idle" }));
  }

  function addRecipient() {
    const email = recipientInput.trim();
    if (email && email.includes("@") && !recipients.includes(email)) {
      setRecipients((prev) => [...prev, email]);
      setRecipientInput("");
    }
  }

  async function handleSave() {
    setSaving(true);
    await sleep(1800);
    router.push("/dashboard");
  }

  const connectedCount = Object.values(connections).filter((v) => v === "connected").length;
  const initials = logoInitials || (clientName ? clientName.slice(0, 2).toUpperCase() : "CL");

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[12px] text-[#5A5A78] hover:text-[#A0A0B8] transition-colors mb-4"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <ChevronLeft size={14} />
          Back to dashboard
        </button>
        <h1 className="text-2xl font-bold text-[#F0F0F5]" style={{ fontFamily: "var(--font-display)" }}>
          New Client
        </h1>
        <p className="text-sm text-[#5A5A78] mt-1" style={{ fontFamily: "var(--font-body)" }}>
          Connect a client workspace and configure reporting
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 flex-shrink-0"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: i < step
                    ? "linear-gradient(135deg, #7C3AED, #06B6D4)"
                    : i === step
                    ? "linear-gradient(135deg, #7C3AED, #06B6D4)"
                    : "#1C1C28",
                  color: i <= step ? "#fff" : "#5A5A78",
                  border: i > step ? "1px solid #2A2A3A" : "none",
                  boxShadow: i === step ? "0 0 16px rgba(124,58,237,0.4)" : "none",
                }}
              >
                {i < step ? <Check size={12} strokeWidth={3} /> : i + 1}
              </div>
              <span
                className="text-[12px] font-medium hidden sm:block"
                style={{
                  fontFamily: "var(--font-body)",
                  color: i === step ? "#F0F0F5" : i < step ? "#A0A0B8" : "#3A3A50",
                }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-3" style={{ background: i < step ? "linear-gradient(90deg, #7C3AED, #06B6D4)" : "#2A2A3A" }} />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div
        className="rounded-2xl border border-[#2A2A3A] p-8"
        style={{ background: "#16161F", boxShadow: "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" }}
      >
        {/* ── STEP 1 ── */}
        {step === 0 && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-[#5A5A78] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                  Client Name *
                </label>
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="w-full py-2.5 px-3.5 rounded-xl bg-[#111118] border border-[#2A2A3A] text-sm text-[#F0F0F5] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#7C3AED] transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A5A78] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-[#111118] border border-[#2A2A3A] text-sm focus:outline-none focus:border-[#7C3AED] transition-colors appearance-none"
                  style={{ fontFamily: "var(--font-body)", color: industry ? "#F0F0F5" : "#3A3A50" }}
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind} style={{ background: "#111118", color: "#F0F0F5" }}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A5A78] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                  Website URL
                </label>
                <input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="acme.com"
                  className="w-full py-2.5 px-3.5 rounded-xl bg-[#111118] border border-[#2A2A3A] text-sm text-[#F0F0F5] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#7C3AED] transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
            </div>

            {/* Logo upload */}
            <div>
              <label className="block text-xs font-medium text-[#5A5A78] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                Client Logo
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); setLogoUploaded(true); }}
                className="relative rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 transition-all duration-200 cursor-pointer"
                style={{
                  borderColor: dragOver ? "#7C3AED" : logoUploaded ? "#10B981" : "#2A2A3A",
                  background: dragOver ? "rgba(124,58,237,0.05)" : logoUploaded ? "rgba(16,185,129,0.05)" : "#111118",
                }}
                onClick={() => setLogoUploaded(true)}
              >
                {logoUploaded ? (
                  <>
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                      style={{ background: primaryColor }}
                    >
                      {initials}
                    </div>
                    <span className="text-xs text-[#10B981]" style={{ fontFamily: "var(--font-mono)" }}>
                      logo.png · 48 KB · auto-resized to 500px
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-[#1C1C28] flex items-center justify-center">
                      <Upload size={18} className="text-[#5A5A78]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-[#A0A0B8]" style={{ fontFamily: "var(--font-body)" }}>
                        Drop your logo here or <span className="text-[#7C3AED]">click to upload</span>
                      </p>
                      <p className="text-[11px] text-[#3A3A50] mt-1" style={{ fontFamily: "var(--font-mono)" }}>
                        PNG, SVG · auto-resized to 500px width
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Brand colors */}
            <div>
              <label className="block text-xs font-medium text-[#5A5A78] mb-3" style={{ fontFamily: "var(--font-body)" }}>
                Brand Colors
              </label>
              <div className="flex items-center gap-6">
                {[
                  { label: "Primary", value: primaryColor, setter: setPrimaryColor },
                  { label: "Secondary", value: secondaryColor, setter: setSecondaryColor },
                ].map(({ label, value, setter }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className="w-10 h-10 rounded-xl border border-[#2A2A3A] cursor-pointer overflow-hidden"
                        style={{ background: value }}
                      >
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => setter(e.target.value)}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#5A5A78]" style={{ fontFamily: "var(--font-body)" }}>{label}</p>
                      <p className="text-[11px] font-medium text-[#A0A0B8]" style={{ fontFamily: "var(--font-mono)" }}>{value.toUpperCase()}</p>
                    </div>
                  </div>
                ))}

                {/* Live preview */}
                <div className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2A2A3A] bg-[#111118]">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[9px] font-bold" style={{ background: primaryColor }}>
                    {initials.slice(0, 1)}
                  </div>
                  <span className="text-[12px] font-medium" style={{ fontFamily: "var(--font-body)", color: primaryColor }}>
                    {clientName || "Preview"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] text-[#5A5A78]" style={{ fontFamily: "var(--font-body)" }}>
                Connect platforms to pull live data into reports.
              </p>
              <span className="text-[11px] font-medium" style={{ fontFamily: "var(--font-mono)", color: connectedCount > 0 ? "#10B981" : "#5A5A78" }}>
                {connectedCount}/4 connected
              </span>
            </div>

            {PLATFORMS.map((platform) => {
              const state = connections[platform.key];
              return (
                <div
                  key={platform.key}
                  className="flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300"
                  style={{
                    background: state === "connected" ? "rgba(16,185,129,0.04)" : "#111118",
                    borderColor: state === "connected" ? "rgba(16,185,129,0.2)" : state === "connecting" ? "rgba(124,58,237,0.2)" : "#2A2A3A",
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-base font-bold flex-shrink-0"
                    style={{ background: platform.color }}
                  >
                    {platform.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#F0F0F5]" style={{ fontFamily: "var(--font-body)" }}>
                      {platform.name}
                    </p>
                    <p className="text-[11px] text-[#5A5A78]" style={{ fontFamily: "var(--font-mono)" }}>
                      {platform.description}
                    </p>
                  </div>

                  {state === "idle" && (
                    <button
                      onClick={() => connectPlatform(platform.key)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium border border-[#2A2A3A] text-[#A0A0B8] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <Wifi size={13} />
                      Connect
                    </button>
                  )}
                  {state === "connecting" && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium text-[#7C3AED]" style={{ fontFamily: "var(--font-body)" }}>
                      <Loader2 size={13} className="animate-spin" />
                      Connecting...
                    </div>
                  )}
                  {state === "connected" && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-[12px] font-medium text-[#10B981]" style={{ fontFamily: "var(--font-body)" }}>
                        <Check size={13} strokeWidth={3} />
                        Connected
                      </div>
                      <button
                        onClick={() => disconnectPlatform(platform.key)}
                        className="text-[#3A3A50] hover:text-[#F43F5E] transition-colors"
                      >
                        <WifiOff size={13} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#1E1E2E] mt-1"
              style={{ background: "rgba(245,158,11,0.04)" }}
            >
              <RefreshCw size={13} className="text-[#F59E0B] flex-shrink-0" />
              <p className="text-[11px] text-[#5A5A78]" style={{ fontFamily: "var(--font-body)" }}>
                OAuth tokens are encrypted and stored server-side. Credentials are never exposed in the browser.
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            {/* Template */}
            <div>
              <label className="block text-xs font-medium text-[#5A5A78] mb-3" style={{ fontFamily: "var(--font-body)" }}>
                Default Report Template
              </label>
              <div className="flex flex-col gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className="flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200"
                    style={{
                      background: selectedTemplate === t.id ? "rgba(124,58,237,0.08)" : "#111118",
                      borderColor: selectedTemplate === t.id ? "rgba(124,58,237,0.3)" : "#2A2A3A",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        borderColor: selectedTemplate === t.id ? "#7C3AED" : "#3A3A50",
                        background: selectedTemplate === t.id ? "#7C3AED" : "transparent",
                      }}
                    >
                      {selectedTemplate === t.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#F0F0F5]" style={{ fontFamily: "var(--font-body)" }}>{t.label}</p>
                      <p className="text-[11px] text-[#5A5A78]" style={{ fontFamily: "var(--font-mono)" }}>{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipients */}
            <div>
              <label className="block text-xs font-medium text-[#5A5A78] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                Report Recipients
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addRecipient()}
                  placeholder="colleague@agency.com"
                  className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#111118] border border-[#2A2A3A] text-sm text-[#F0F0F5] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#7C3AED] transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                />
                <button
                  onClick={addRecipient}
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#2A2A3A] text-[#5A5A78] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
              {recipients.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {recipients.map((r) => (
                    <div
                      key={r}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#2A2A3A] bg-[#1C1C28]"
                    >
                      <span className="text-[11px] text-[#A0A0B8]" style={{ fontFamily: "var(--font-mono)" }}>{r}</span>
                      <button onClick={() => setRecipients((prev) => prev.filter((e) => e !== r))}>
                        <X size={11} className="text-[#5A5A78] hover:text-[#F43F5E] transition-colors" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Approval toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#2A2A3A] bg-[#111118]">
              <div>
                <p className="text-[13px] font-semibold text-[#F0F0F5]" style={{ fontFamily: "var(--font-body)" }}>
                  Require agency approval
                </p>
                <p className="text-[11px] text-[#5A5A78]" style={{ fontFamily: "var(--font-mono)" }}>
                  Reports need review before client delivery
                </p>
              </div>
              <button
                onClick={() => setApprovalRequired(!approvalRequired)}
                className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
                style={{ background: approvalRequired ? "linear-gradient(135deg, #7C3AED, #06B6D4)" : "#2A2A3A" }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300"
                  style={{ left: approvalRequired ? "calc(100% - 22px)" : "2px" }}
                />
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#1E1E2E]">
          <button
            onClick={() => step > 0 ? setStep(step - 1) : router.back()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2A2A3A] text-sm font-medium text-[#5A5A78] hover:text-[#A0A0B8] hover:border-[#3A3A50] transition-all"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <ChevronLeft size={15} />
            {step === 0 ? "Cancel" : "Back"}
          </button>

          {step < 2 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 0 && !clientName.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-40 disabled:hover:translate-y-0"
              style={{ fontFamily: "var(--font-body)", background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)" }}
            >
              Continue
              <ChevronRight size={15} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-70"
              style={{ fontFamily: "var(--font-body)", background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)" }}
            >
              {saving ? (
                <><Loader2 size={15} className="animate-spin" /> Saving...</>
              ) : (
                <><Zap size={15} strokeWidth={2.5} /> Save Client</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
