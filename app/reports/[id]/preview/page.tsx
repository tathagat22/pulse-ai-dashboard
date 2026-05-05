"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft, Download, Share2, Loader2, Check,
  Zap, BarChart3, TrendingUp, FileText,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { REPORTS, PLATFORM_BREAKDOWN, CHART_DATA, AI_REPORT_COPY } from "@/lib/mock-data";
import { formatNumber, formatCurrency, sleep } from "@/lib/utils";

const METRICS_TABLE = [
  { metric: "Sessions", ga4: "52,400", meta: "38,200", googleads: "34,230" },
  { metric: "Conversions", ga4: "1,420", meta: "980", googleads: "891" },
  { metric: "Spend", ga4: "—", meta: "$18,400", googleads: "$24,100" },
  { metric: "ROAS", ga4: "—", meta: "3.9×", googleads: "4.8×" },
  { metric: "CPC", ga4: "—", meta: "$1.12", googleads: "$0.94" },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#2A2A3A] bg-[#16161F] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <p className="text-[10px] text-[#5A5A78] mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-[12px] font-semibold" style={{ color: p.color, fontFamily: "var(--font-mono)" }}>
          {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function ReportPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params.id as string;

  const report = REPORTS.find((r) => r.id === reportId) ?? REPORTS[0];

  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    await sleep(1800);
    setDownloading(false);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  }

  async function handleShare() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const sections = AI_REPORT_COPY.trim().split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen bg-[#09090E]">
      {/* Sticky toolbar */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-6 h-14 border-b border-[#1E1E2E]"
        style={{ background: "rgba(9,9,14,0.92)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-[12px] text-[#5A5A78] hover:text-[#A0A0B8] transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <ChevronLeft size={14} />
            Back
          </button>
          <div className="w-px h-4 bg-[#2A2A3A]" />
          <span className="text-[12px] text-[#5A5A78] truncate max-w-xs" style={{ fontFamily: "var(--font-body)" }}>
            {report.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#2A2A3A] text-[12px] font-medium text-[#A0A0B8] hover:border-[#3A3A50] hover:text-[#F0F0F5] transition-all"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {copied ? <Check size={13} className="text-[#10B981]" /> : <Share2 size={13} />}
            {copied ? "Copied!" : "Share"}
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold text-white hover:-translate-y-0.5 hover:shadow-[0_0_16px_rgba(124,58,237,0.3)] transition-all disabled:opacity-70"
            style={{ fontFamily: "var(--font-body)", background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)" }}
          >
            {downloading ? (
              <><Loader2 size={13} className="animate-spin" /> Generating...</>
            ) : downloaded ? (
              <><Check size={13} strokeWidth={3} /> Downloaded!</>
            ) : (
              <><Download size={13} /> Download PDF</>
            )}
          </button>
        </div>
      </div>

      {/* A4 Paper area */}
      <div className="flex justify-center py-10 px-4">
        <div
          className="w-full max-w-[794px] rounded-none shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
          style={{ background: "#FFFFFF", color: "#1A1A2E" }}
        >
          {/* Cover Page */}
          <div
            className="relative flex flex-col items-center justify-center text-center overflow-hidden"
            style={{
              height: 360,
              background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
            }}
          >
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Zap size={20} className="text-white" strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>Pulse</span>
              </div>
              <div className="w-16 h-px bg-white/30" />
              <h1 className="text-3xl font-bold text-white max-w-lg" style={{ fontFamily: "var(--font-display)", lineHeight: 1.2 }}>
                {report.title}
              </h1>
              <p className="text-white/70 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                {report.dateRange}
              </p>
              <div
                className="mt-4 px-4 py-1.5 rounded-full text-[11px] font-medium text-white/60"
                style={{ background: "rgba(255,255,255,0.15)", fontFamily: "var(--font-mono)" }}
              >
                Generated by Pulse AI · Confidential
              </div>
            </div>
            {/* Bottom: client info */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-10 py-5 bg-black/20">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  {report.clientName.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-white font-semibold text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  {report.clientName}
                </span>
              </div>
              <span className="text-white/60 text-[11px]" style={{ fontFamily: "var(--font-mono)" }}>
                Prepared by Pulse Agency Suite
              </span>
            </div>
          </div>

          {/* Report body */}
          <div className="px-12 py-10 space-y-10">
            {/* Summary metrics */}
            <div>
              <h2
                className="text-[11px] font-bold uppercase tracking-widest mb-4"
                style={{ fontFamily: "var(--font-mono)", color: "#7C3AED" }}
              >
                Performance Snapshot
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Sessions", value: "124,830", change: "+12.4%" },
                  { label: "Conversions", value: "3,291", change: "+8.7%" },
                  { label: "Ad Spend", value: "$48,200", change: "-3.2%" },
                  { label: "Blended ROAS", value: "4.8×", change: "+14.1%" },
                ].map(({ label, value, change }) => {
                  const isPositive = change.startsWith("+");
                  const isNeutral = label === "Ad Spend";
                  const color = isNeutral ? (isPositive ? "#F43F5E" : "#10B981") : (isPositive ? "#10B981" : "#F43F5E");
                  return (
                    <div key={label} className="border border-gray-100 rounded-xl p-4">
                      <p className="text-[10px] font-medium text-gray-400 mb-1.5 uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>
                        {label}
                      </p>
                      <p className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-display)" }}>
                        {value}
                      </p>
                      <p className="text-[11px] font-semibold" style={{ color, fontFamily: "var(--font-mono)" }}>
                        {change} vs last period
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Content sections */}
            {sections.map((section, i) => {
              const isHeading = section.startsWith("##");
              if (isHeading) {
                const title = section.replace(/^#{1,3}\s/, "");
                return (
                  <div key={i}>
                    <h2
                      className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-2 border-b border-gray-100"
                      style={{ fontFamily: "var(--font-mono)", color: "#7C3AED" }}
                    >
                      {title}
                    </h2>
                  </div>
                );
              }
              if (section.startsWith("**Insight:**")) {
                return (
                  <div
                    key={i}
                    className="rounded-xl p-4 border-l-4 my-4"
                    style={{ background: "rgba(124,58,237,0.05)", borderLeftColor: "#7C3AED" }}
                  >
                    <p className="text-[12px] leading-relaxed text-gray-700" style={{ fontFamily: "var(--font-body)" }}>
                      {section.replace("**Insight:** ", "💡 ")}
                    </p>
                  </div>
                );
              }
              if (section.includes("1.") && section.includes("2.")) {
                const lines = section.split("\n").filter(Boolean);
                return (
                  <div key={i} className="space-y-2">
                    {lines.map((line, li) => (
                      <div key={li} className="flex items-start gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 mt-0.5"
                          style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", fontFamily: "var(--font-mono)" }}
                        >
                          {li + 1}
                        </div>
                        <p className="text-[13px] text-gray-700 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                          {line.replace(/^\d+\.\s\*\*/, "").replace(/\*\*/, "")}
                        </p>
                      </div>
                    ))}
                  </div>
                );
              }
              return (
                <p key={i} className="text-[13px] text-gray-700 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {section.replace(/\*\*/g, "")}
                </p>
              );
            })}

            {/* Performance chart */}
            <div>
              <h2
                className="text-[11px] font-bold uppercase tracking-widest mb-4"
                style={{ fontFamily: "var(--font-mono)", color: "#7C3AED" }}
              >
                30-Day Trend
              </h2>
              <div className="border border-gray-100 rounded-xl p-5">
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={CHART_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="previewSessions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "#9CA3AF", fontSize: 9, fontFamily: "var(--font-mono)" }} tickLine={false} axisLine={false} interval={4} />
                    <YAxis tick={{ fill: "#9CA3AF", fontSize: 9, fontFamily: "var(--font-mono)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="sessions" stroke="#7C3AED" strokeWidth={2} fill="url(#previewSessions)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Platform breakdown bar */}
            <div>
              <h2
                className="text-[11px] font-bold uppercase tracking-widest mb-4"
                style={{ fontFamily: "var(--font-mono)", color: "#7C3AED" }}
              >
                Platform Breakdown
              </h2>
              <div className="border border-gray-100 rounded-xl p-5">
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={PLATFORM_BREAKDOWN} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 80 }}>
                    <CartesianGrid stroke="#F3F4F6" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "#9CA3AF", fontSize: 9, fontFamily: "var(--font-mono)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#6B7280", fontSize: 10, fontFamily: "var(--font-body)" }} tickLine={false} axisLine={false} width={75} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="sessions" radius={[0, 4, 4, 0]}>
                      {PLATFORM_BREAKDOWN.map((entry, index) => (
                        <rect key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metrics table */}
            <div>
              <h2
                className="text-[11px] font-bold uppercase tracking-widest mb-4"
                style={{ fontFamily: "var(--font-mono)", color: "#7C3AED" }}
              >
                Appendix — Raw Metrics
              </h2>
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "#F9FAFB" }}>
                      {["Metric", "Google Analytics 4", "Meta Ads", "Google Ads"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {METRICS_TABLE.map((row, i) => (
                      <tr key={row.metric} style={{ background: i % 2 === 0 ? "#fff" : "#F9FAFB" }}>
                        <td className="px-4 py-3 text-[12px] font-medium text-gray-700 border-b border-gray-50" style={{ fontFamily: "var(--font-body)" }}>
                          {row.metric}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-gray-600 border-b border-gray-50" style={{ fontFamily: "var(--font-mono)" }}>{row.ga4}</td>
                        <td className="px-4 py-3 text-[12px] text-gray-600 border-b border-gray-50" style={{ fontFamily: "var(--font-mono)" }}>{row.meta}</td>
                        <td className="px-4 py-3 text-[12px] text-gray-600 border-b border-gray-50" style={{ fontFamily: "var(--font-mono)" }}>{row.googleads}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-12 py-5 border-t border-gray-100"
            style={{ background: "#F9FAFB" }}
          >
            <div className="flex items-center gap-2">
              <Zap size={12} style={{ color: "#7C3AED" }} />
              <span className="text-[10px] text-gray-400" style={{ fontFamily: "var(--font-mono)" }}>
                Pulse AI · {report.clientName} · {report.dateRange}
              </span>
            </div>
            <span className="text-[10px] text-gray-400" style={{ fontFamily: "var(--font-mono)" }}>
              Confidential — Internal Use Only
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
