"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronRight, Zap, Settings2, X, Calendar,
  Check, Loader2, FileText, Download, RotateCcw,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { CLIENTS, CHART_DATA, AI_REPORT_COPY, PLATFORM_LABELS } from "@/lib/mock-data";
import { sleep, cn } from "@/lib/utils";

const TONES = ["Professional", "Conversational", "Technical", "Executive"];
const FOCUS_AREAS = ["Traffic", "Conversions", "ROI", "Audience", "Creative Performance"];
const DATE_PRESETS = ["Last 7 Days", "Last 30 Days", "Last Month", "Last Quarter", "Custom"];

const PLATFORMS = [
  { key: "ga4", label: "GA4", color: "#7C3AED", icon: "G" },
  { key: "meta", label: "Meta Ads", color: "#2563EB", icon: "f" },
  { key: "xads", label: "X Ads", color: "#E5E7EB", icon: "𝕏" },
  { key: "googleads", label: "Google Ads", color: "#EA4335", icon: "A" },
] as const;

type GenerationStep = "idle" | "pulling" | "analyzing" | "rendering" | "done";

const GENERATION_STEPS = [
  { key: "pulling", label: "Pulling data from platforms", duration: 1800 },
  { key: "analyzing", label: "Analyzing with Pulse AI", duration: 2500 },
  { key: "rendering", label: "Rendering charts & layout", duration: 1200 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#2A2A3A] bg-[#16161F] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <p className="text-[11px] text-[#5A5A78] mb-2" style={{ fontFamily: "var(--font-mono)" }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[12px] text-[#A0A0B8]" style={{ fontFamily: "var(--font-body)" }}>
            {p.dataKey}: <span className="text-[#F0F0F5] font-semibold">{p.value.toLocaleString()}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function GenerateReportPage() {
  const router = useRouter();
  const [selectedClient, setSelectedClient] = useState(CLIENTS[0].id);
  const [datePreset, setDatePreset] = useState("Last 30 Days");
  const [enabledPlatforms, setEnabledPlatforms] = useState<string[]>(["ga4", "meta", "googleads"]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [selectedFocus, setSelectedFocus] = useState<string[]>(["Traffic", "Conversions", "ROI"]);
  const [customPrompt, setCustomPrompt] = useState("");

  const [genStep, setGenStep] = useState<GenerationStep>("idle");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [streamedText, setStreamedText] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const textRef = useRef(0);

  function togglePlatform(key: string) {
    setEnabledPlatforms((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function toggleFocus(f: string) {
    setSelectedFocus((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }

  async function generate() {
    setGenStep("pulling");
    setCompletedSteps([]);
    setStreamedText("");
    setShowPreview(false);

    for (const step of GENERATION_STEPS) {
      setGenStep(step.key as GenerationStep);
      await sleep(step.duration);
      setCompletedSteps((prev) => [...prev, step.key]);
    }

    // Stream AI text
    setGenStep("done");
    const words = AI_REPORT_COPY.trim().split("");
    textRef.current = 0;
    const interval = setInterval(() => {
      textRef.current += 3;
      setStreamedText(AI_REPORT_COPY.slice(0, textRef.current));
      if (textRef.current >= AI_REPORT_COPY.length) {
        clearInterval(interval);
        setShowPreview(true);
      }
    }, 12);
  }

  async function handleDownload() {
    setDownloading(true);
    await sleep(1600);
    setDownloading(false);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  }

  function reset() {
    setGenStep("idle");
    setCompletedSteps([]);
    setStreamedText("");
    setShowPreview(false);
  }

  const client = CLIENTS.find((c) => c.id === selectedClient) ?? CLIENTS[0];
  const isGenerating = genStep !== "idle" && genStep !== "done";
  const isDone = genStep === "done";

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090E]">
      {/* Left config panel */}
      <div
        className="w-80 flex-shrink-0 flex flex-col border-r border-[#1E1E2E] overflow-y-auto"
        style={{ background: "#0D0D14" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-[#1E1E2E] flex-shrink-0">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#5A5A78] hover:text-[#A0A0B8] hover:bg-[#1C1C28] transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-[13px] font-bold text-[#F0F0F5]" style={{ fontFamily: "var(--font-display)" }}>
            Generate Report
          </span>
        </div>

        <div className="flex flex-col gap-6 p-5 flex-1">
          {/* Client */}
          <div>
            <label className="block text-[10px] font-semibold text-[#3A3A50] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)" }}>
              Client
            </label>
            <div className="flex flex-col gap-1.5">
              {CLIENTS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClient(c.id)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-150 text-left"
                  style={{
                    background: selectedClient === c.id ? "rgba(124,58,237,0.1)" : "#111118",
                    borderColor: selectedClient === c.id ? "rgba(124,58,237,0.25)" : "#2A2A3A",
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ background: c.accentColor }}
                  >
                    {c.logoInitials}
                  </div>
                  <span className="text-[13px] font-medium" style={{ fontFamily: "var(--font-body)", color: selectedClient === c.id ? "#F0F0F5" : "#A0A0B8" }}>
                    {c.name}
                  </span>
                  {selectedClient === c.id && <Check size={13} className="ml-auto text-[#7C3AED]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div>
            <label className="block text-[10px] font-semibold text-[#3A3A50] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)" }}>
              Date Range
            </label>
            <div className="flex flex-col gap-1">
              {DATE_PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setDatePreset(p)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all"
                  style={{
                    fontFamily: "var(--font-body)",
                    background: datePreset === p ? "rgba(124,58,237,0.1)" : "transparent",
                    color: datePreset === p ? "#F0F0F5" : "#5A5A78",
                  }}
                >
                  <Calendar size={12} style={{ color: datePreset === p ? "#7C3AED" : "inherit" }} />
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-[10px] font-semibold text-[#3A3A50] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)" }}>
              Data Sources
            </label>
            <div className="flex flex-col gap-1.5">
              {PLATFORMS.map((p) => {
                const isConnected = client.connections[p.key] === "connected";
                const isEnabled = enabledPlatforms.includes(p.key);
                return (
                  <button
                    key={p.key}
                    onClick={() => isConnected && togglePlatform(p.key)}
                    disabled={!isConnected}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-150 text-left disabled:opacity-40"
                    style={{
                      background: isEnabled && isConnected ? "rgba(16,185,129,0.05)" : "#111118",
                      borderColor: isEnabled && isConnected ? "rgba(16,185,129,0.2)" : "#2A2A3A",
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                      style={{ background: p.color }}
                    >
                      {p.icon}
                    </div>
                    <span className="text-[12px] font-medium text-[#A0A0B8] flex-1" style={{ fontFamily: "var(--font-body)" }}>
                      {p.label}
                    </span>
                    {isConnected ? (
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center transition-all"
                        style={{
                          background: isEnabled ? "linear-gradient(135deg, #7C3AED, #06B6D4)" : "#1C1C28",
                          border: isEnabled ? "none" : "1px solid #3A3A50",
                        }}
                      >
                        {isEnabled && <Check size={9} className="text-white" strokeWidth={3} />}
                      </div>
                    ) : (
                      <span className="text-[9px] text-[#F43F5E]" style={{ fontFamily: "var(--font-mono)" }}>disconnected</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Config button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-[#2A2A3A] hover:border-[#7C3AED] hover:bg-[rgba(124,58,237,0.05)] transition-all group"
          >
            <Settings2 size={15} className="text-[#5A5A78] group-hover:text-[#7C3AED] transition-colors" />
            <span className="text-[12px] font-medium text-[#5A5A78] group-hover:text-[#A0A0B8] transition-colors" style={{ fontFamily: "var(--font-body)" }}>
              AI Configuration
            </span>
            <div className="ml-auto px-2 py-0.5 rounded-md bg-[rgba(124,58,237,0.1)] text-[10px] font-medium text-[#7C3AED]" style={{ fontFamily: "var(--font-mono)" }}>
              {selectedTone}
            </div>
          </button>
        </div>

        {/* Generate button */}
        <div className="p-5 border-t border-[#1E1E2E]">
          {isDone ? (
            <div className="flex flex-col gap-2">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full py-3 rounded-xl text-[13px] font-semibold text-white flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-200 disabled:opacity-70"
                style={{ fontFamily: "var(--font-body)", background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)" }}
              >
                {downloading ? (
                  <><Loader2 size={14} className="animate-spin" /> Generating PDF...</>
                ) : downloaded ? (
                  <><Check size={14} strokeWidth={3} /> Downloaded!</>
                ) : (
                  <><Download size={14} /> Approve & Download PDF</>
                )}
              </button>
              <button
                onClick={reset}
                className="w-full py-2.5 rounded-xl text-[12px] font-medium text-[#5A5A78] hover:text-[#A0A0B8] flex items-center justify-center gap-1.5 transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <RotateCcw size={12} />
                Regenerate
              </button>
            </div>
          ) : (
            <button
              onClick={generate}
              disabled={isGenerating || enabledPlatforms.length === 0}
              className="w-full py-3 rounded-xl text-[13px] font-semibold text-white flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0"
              style={{ fontFamily: "var(--font-body)", background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)" }}
            >
              {isGenerating ? (
                <><Loader2 size={14} className="animate-spin" /> Generating...</>
              ) : (
                <><Zap size={14} strokeWidth={2.5} /> Generate Report</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {genStep === "idle" ? (
          /* Idle state */
          <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center animate-float"
              style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.15))", border: "1px solid rgba(124,58,237,0.2)" }}
            >
              <Zap size={32} style={{ color: "#7C3AED" }} strokeWidth={1.5} />
            </div>
            <div className="text-center max-w-sm">
              <h2 className="text-xl font-bold text-[#F0F0F5] mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Ready to generate
              </h2>
              <p className="text-sm text-[#5A5A78]" style={{ fontFamily: "var(--font-body)" }}>
                Configure your settings on the left, then click Generate Report to pull live data and create an AI-powered report.
              </p>
            </div>
            <div className="flex items-center gap-6 mt-4">
              {["Pull platform data", "AI analysis", "Render PDF"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-[#5A5A78] border border-[#2A2A3A]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-[12px] text-[#5A5A78]" style={{ fontFamily: "var(--font-body)" }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            {/* Generation progress */}
            {isGenerating && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
                <div className="flex flex-col gap-4 w-full max-w-md">
                  {GENERATION_STEPS.map((s, i) => {
                    const isDone = completedSteps.includes(s.key);
                    const isActive = genStep === s.key;
                    return (
                      <div
                        key={s.key}
                        className="flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500"
                        style={{
                          background: isDone ? "rgba(16,185,129,0.05)" : isActive ? "rgba(124,58,237,0.08)" : "#16161F",
                          borderColor: isDone ? "rgba(16,185,129,0.2)" : isActive ? "rgba(124,58,237,0.2)" : "#2A2A3A",
                        }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: isDone ? "rgba(16,185,129,0.15)" : isActive ? "rgba(124,58,237,0.15)" : "#1C1C28",
                          }}
                        >
                          {isDone ? (
                            <Check size={16} className="text-[#10B981]" strokeWidth={2.5} />
                          ) : isActive ? (
                            <Loader2 size={16} className="animate-spin text-[#7C3AED]" />
                          ) : (
                            <span className="text-[12px] font-bold text-[#3A3A50]" style={{ fontFamily: "var(--font-mono)" }}>{i + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className="text-[13px] font-medium"
                            style={{
                              fontFamily: "var(--font-body)",
                              color: isDone ? "#10B981" : isActive ? "#F0F0F5" : "#5A5A78",
                            }}
                          >
                            {s.label}
                          </p>
                          {isActive && (
                            <div className="flex gap-1 mt-2">
                              {enabledPlatforms.map((pk, pi) => {
                                const p = PLATFORMS.find((x) => x.key === pk);
                                return p ? (
                                  <div
                                    key={pk}
                                    className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-bold animate-pulse-dot"
                                    style={{ background: p.color, animationDelay: `${pi * 200}ms` }}
                                  >
                                    {p.icon}
                                  </div>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI streamed output */}
            {isDone && (
              <div className="max-w-3xl mx-auto">
                {/* Streamed text preview */}
                <div
                  className="rounded-2xl border border-[#2A2A3A] p-6 mb-6"
                  style={{ background: "#16161F" }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
                    >
                      <Zap size={12} className="text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-[12px] font-semibold text-[#A0A0B8]" style={{ fontFamily: "var(--font-body)" }}>
                      AI-Generated Analysis
                    </span>
                    <div className="ml-auto px-2 py-0.5 rounded-md bg-[rgba(124,58,237,0.1)] text-[10px] font-medium text-[#7C3AED]" style={{ fontFamily: "var(--font-mono)" }}>
                      {selectedTone}
                    </div>
                  </div>
                  <div
                    className="text-[13px] text-[#A0A0B8] leading-relaxed whitespace-pre-line"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {streamedText}
                    {streamedText.length < AI_REPORT_COPY.length && (
                      <span className="inline-block w-0.5 h-4 bg-[#7C3AED] ml-0.5 animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Chart preview */}
                {showPreview && (
                  <div
                    className="rounded-2xl border border-[#2A2A3A] p-6 animate-slide-up"
                    style={{ background: "#16161F" }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-[14px] font-bold text-[#F0F0F5]" style={{ fontFamily: "var(--font-display)" }}>
                          Sessions & Conversions — {datePreset}
                        </h3>
                        <p className="text-[11px] text-[#5A5A78] mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
                          {client.name} · All connected platforms
                        </p>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={CHART_DATA.slice(0, 30)} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                        <defs>
                          <linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gradConversions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#2A2A3A" strokeOpacity={0.4} vertical={false} />
                        <XAxis
                          dataKey="day"
                          tick={{ fill: "#5A5A78", fontSize: 10, fontFamily: "var(--font-mono)" }}
                          tickLine={false}
                          axisLine={false}
                          interval={4}
                        />
                        <YAxis
                          tick={{ fill: "#5A5A78", fontSize: 10, fontFamily: "var(--font-mono)" }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="sessions" stroke="#7C3AED" strokeWidth={2} fill="url(#gradSessions)" dot={false} />
                        <Area type="monotone" dataKey="conversions" stroke="#06B6D4" strokeWidth={2} fill="url(#gradConversions)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex items-center gap-6 mt-4">
                      {[
                        { label: "Sessions", color: "#7C3AED" },
                        { label: "Conversions", color: "#06B6D4" },
                      ].map(({ label, color }) => (
                        <div key={label} className="flex items-center gap-2">
                          <div className="w-3 h-0.5 rounded-full" style={{ background: color }} />
                          <span className="text-[11px] text-[#5A5A78]" style={{ fontFamily: "var(--font-mono)" }}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Config Drawer */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-30" onClick={() => setDrawerOpen(false)} />
          <div
            className="fixed right-0 top-0 h-full w-96 border-l border-[#2A2A3A] z-40 flex flex-col overflow-y-auto animate-slide-up"
            style={{ background: "#111118" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E2E]">
              <div className="flex items-center gap-2">
                <Settings2 size={15} className="text-[#7C3AED]" />
                <span className="text-[13px] font-bold text-[#F0F0F5]" style={{ fontFamily: "var(--font-display)" }}>
                  AI Configuration
                </span>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="text-[#5A5A78] hover:text-[#A0A0B8] transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-6 p-6">
              {/* Tone */}
              <div>
                <label className="block text-[10px] font-semibold text-[#3A3A50] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>
                  Report Tone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTone(t)}
                      className="py-2.5 px-3 rounded-xl text-[12px] font-medium border transition-all"
                      style={{
                        fontFamily: "var(--font-body)",
                        background: selectedTone === t ? "rgba(124,58,237,0.12)" : "#16161F",
                        borderColor: selectedTone === t ? "rgba(124,58,237,0.3)" : "#2A2A3A",
                        color: selectedTone === t ? "#F0F0F5" : "#5A5A78",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus areas */}
              <div>
                <label className="block text-[10px] font-semibold text-[#3A3A50] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>
                  Focus Areas
                </label>
                <div className="flex flex-wrap gap-2">
                  {FOCUS_AREAS.map((f) => (
                    <button
                      key={f}
                      onClick={() => toggleFocus(f)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all"
                      style={{
                        fontFamily: "var(--font-body)",
                        background: selectedFocus.includes(f) ? "rgba(6,182,212,0.1)" : "#16161F",
                        borderColor: selectedFocus.includes(f) ? "rgba(6,182,212,0.3)" : "#2A2A3A",
                        color: selectedFocus.includes(f) ? "#06B6D4" : "#5A5A78",
                      }}
                    >
                      {selectedFocus.includes(f) && <Check size={10} strokeWidth={3} />}
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom prompt */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-semibold text-[#3A3A50] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
                    Custom Instructions
                  </label>
                  <span className="text-[10px] text-[#3A3A50]" style={{ fontFamily: "var(--font-mono)" }}>
                    {customPrompt.length}/500
                  </span>
                </div>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value.slice(0, 500))}
                  placeholder="Additional context for the AI, e.g. 'Focus on the underperforming video creatives and suggest replacements...'"
                  rows={5}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-[#16161F] border border-[#2A2A3A] text-sm text-[#F0F0F5] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#7C3AED] transition-colors resize-none"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full py-3 rounded-xl text-[13px] font-semibold text-white hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all"
                style={{ fontFamily: "var(--font-body)", background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)" }}
              >
                Apply Configuration
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
