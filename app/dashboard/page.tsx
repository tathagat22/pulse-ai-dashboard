"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp, TrendingDown, Users, DollarSign, Target, Activity,
  FileText, MoreHorizontal, Download, Edit, Copy, Zap, Clock, CheckCircle2,
  AlertCircle, RefreshCw, Calendar,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis,
} from "recharts";
import { usePulseStore } from "@/lib/store";
import { CLIENTS, METRICS, SPARKLINES, REPORTS, PLATFORM_LABELS, ConnectionStatus } from "@/lib/mock-data";
import { formatNumber, formatCurrency, cn } from "@/lib/utils";

const STATUS_META: Record<ConnectionStatus, { label: string; color: string; dot: string }> = {
  connected: { label: "Connected", color: "#10B981", dot: "#10B981" },
  disconnected: { label: "Disconnected", color: "#F43F5E", dot: "#F43F5E" },
  syncing: { label: "Syncing", color: "#F59E0B", dot: "#F59E0B" },
};

const REPORT_STATUS_META = {
  sent: { label: "Sent", bg: "rgba(16,185,129,0.1)", color: "#10B981", border: "rgba(16,185,129,0.25)" },
  scheduled: { label: "Scheduled", bg: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "rgba(245,158,11,0.25)" },
  draft: { label: "Draft", bg: "rgba(90,90,120,0.15)", color: "#A0A0B8", border: "rgba(90,90,120,0.2)" },
};

const METRIC_CARDS = [
  {
    key: "sessions",
    label: "Sessions",
    value: formatNumber(METRICS.sessions),
    change: METRICS.sessionsChange,
    icon: <Users size={16} />,
    sparkKey: "sessions",
    chartColor: "#7C3AED",
  },
  {
    key: "conversions",
    label: "Conversions",
    value: formatNumber(METRICS.conversions),
    change: METRICS.conversionsChange,
    icon: <Target size={16} />,
    sparkKey: "conversions",
    chartColor: "#06B6D4",
  },
  {
    key: "spend",
    label: "Ad Spend",
    value: formatCurrency(METRICS.spend),
    change: METRICS.spendChange,
    icon: <DollarSign size={16} />,
    sparkKey: "spend",
    chartColor: "#F59E0B",
  },
  {
    key: "roas",
    label: "Blended ROAS",
    value: `${METRICS.roas}x`,
    change: METRICS.roasChange,
    icon: <Activity size={16} />,
    sparkKey: "roas",
    chartColor: "#10B981",
  },
];

const PLATFORMS: { key: keyof typeof PLATFORM_LABELS; icon: string }[] = [
  { key: "ga4", icon: "G" },
  { key: "meta", icon: "M" },
  { key: "xads", icon: "X" },
  { key: "googleads", icon: "A" },
];

const PLATFORM_COLORS: Record<string, string> = {
  ga4: "#7C3AED", meta: "#2563EB", xads: "#E5E7EB", googleads: "#EA4335",
};

function SparkChart({ data, color }: { data: { date: string; value: number }[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${color.replace("#", "")})`}
          dot={false}
          activeDot={false}
        />
        <Tooltip
          contentStyle={{ display: "none" }}
          cursor={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { activeClientId } = usePulseStore();
  const client = CLIENTS.find((c) => c.id === activeClientId) ?? CLIENTS[0];
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const connections = client.connections;

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-[#5A5A78] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              Overview
            </span>
            <span className="text-[#2A2A3A]">·</span>
            <span className="text-xs font-medium text-[#5A5A78]" style={{ fontFamily: "var(--font-mono)" }}>
              May 2025
            </span>
          </div>
          <h1
            className="text-2xl font-bold text-[#F0F0F5]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {client.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#2A2A3A] bg-[#16161F]">
            <Calendar size={13} className="text-[#5A5A78]" />
            <span className="text-[12px] text-[#A0A0B8]" style={{ fontFamily: "var(--font-body)" }}>
              Apr 1 – Apr 30, 2025
            </span>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {METRIC_CARDS.map((card, i) => (
          <div
            key={card.key}
            className="rounded-2xl p-5 border border-[#2A2A3A] hover:border-[rgba(124,58,237,0.2)] hover:-translate-y-0.5 transition-all duration-300 animate-slide-up"
            style={{
              background: "#16161F",
              boxShadow: "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
              animationDelay: `${i * 80}ms`,
            }}
          >
            {/* Top row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-[#5A5A78] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
                  {card.label}
                </span>
                <span
                  className="text-2xl font-bold text-[#F0F0F5] tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {card.value}
                </span>
              </div>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${card.chartColor}18`, color: card.chartColor }}
              >
                {card.icon}
              </div>
            </div>

            {/* Sparkline */}
            <div className="-mx-1 mb-3">
              <SparkChart data={SPARKLINES[card.sparkKey]} color={card.chartColor} />
            </div>

            {/* Change badge */}
            <div className="flex items-center gap-1.5">
              {card.change >= 0 ? (
                <TrendingUp size={12} className="text-[#10B981]" />
              ) : (
                <TrendingDown size={12} className="text-[#F43F5E]" />
              )}
              <span
                className="text-[12px] font-semibold"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: card.change >= 0 ? "#10B981" : "#F43F5E",
                }}
              >
                {card.change >= 0 ? "+" : ""}{card.change}%
              </span>
              <span className="text-[11px] text-[#3A3A50]" style={{ fontFamily: "var(--font-body)" }}>
                vs last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom section: Platform health + AI Report status + Recent reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Platform health — takes 2 cols */}
        <div
          className="lg:col-span-2 rounded-2xl p-6 border border-[#2A2A3A] animate-slide-up delay-300"
          style={{
            background: "#16161F",
            boxShadow: "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-sm font-bold text-[#F0F0F5] mb-0.5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Platform Health
              </h2>
              <span className="text-[11px] text-[#5A5A78]" style={{ fontFamily: "var(--font-mono)" }}>
                {Object.values(connections).filter((v) => v === "connected").length}/4 platforms connected
              </span>
            </div>
            <button className="text-[12px] text-[#7C3AED] hover:text-[#A78BFA] transition-colors font-medium" style={{ fontFamily: "var(--font-body)" }}>
              Manage connections
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {PLATFORMS.map(({ key, icon }) => {
              const status = connections[key];
              const meta = STATUS_META[status];
              return (
                <div key={key} className="flex items-center gap-4">
                  {/* Platform icon */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
                    style={{ background: PLATFORM_COLORS[key] }}
                  >
                    {icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-medium text-[#A0A0B8]" style={{ fontFamily: "var(--font-body)" }}>
                        {PLATFORM_LABELS[key]}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {status === "connected" && (
                          <CheckCircle2 size={13} style={{ color: meta.color }} />
                        )}
                        {status === "disconnected" && (
                          <AlertCircle size={13} style={{ color: meta.color }} />
                        )}
                        {status === "syncing" && (
                          <RefreshCw size={13} className="animate-spin" style={{ color: meta.color }} />
                        )}
                        <span
                          className="text-[11px] font-medium"
                          style={{ fontFamily: "var(--font-mono)", color: meta.color }}
                        >
                          {meta.label}
                        </span>
                      </div>
                    </div>

                    {/* Bar */}
                    <div className="h-1.5 rounded-full bg-[#1C1C28] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: status === "connected" ? "100%" : status === "syncing" ? "60%" : "0%",
                          background: status === "connected"
                            ? "linear-gradient(90deg, #7C3AED, #06B6D4)"
                            : status === "syncing"
                            ? "#F59E0B"
                            : "transparent",
                        }}
                      />
                    </div>
                  </div>

                  {/* Action */}
                  {status === "disconnected" && (
                    <button
                      className="text-[11px] font-medium px-2.5 py-1 rounded-lg border border-[#F43F5E]/30 text-[#F43F5E] hover:bg-[#F43F5E]/10 transition-colors flex-shrink-0"
                      style={{ fontFamily: "var(--font-body)" }}
                      onClick={() => router.push("/clients/new")}
                    >
                      Reconnect
                    </button>
                  )}
                  {status === "syncing" && (
                    <span className="text-[11px] text-[#5A5A78] flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
                      ~2 min
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Report status widget */}
        <div
          className="rounded-2xl p-6 border border-[#2A2A3A] flex flex-col animate-slide-up delay-400"
          style={{
            background: "#16161F",
            boxShadow: "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <h2
            className="text-sm font-bold text-[#F0F0F5] mb-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AI Report
          </h2>
          <span className="text-[11px] text-[#5A5A78] mb-6" style={{ fontFamily: "var(--font-mono)" }}>
            Next scheduled generation
          </span>

          {/* Circular progress */}
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1C1C28" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="url(#progress-grad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - 0.73)}
                />
                <defs>
                  <linearGradient id="progress-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-[#F0F0F5]" style={{ fontFamily: "var(--font-display)" }}>73%</span>
                <span className="text-[9px] text-[#5A5A78]" style={{ fontFamily: "var(--font-mono)" }}>data ready</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[12px] text-[#5A5A78]" style={{ fontFamily: "var(--font-mono)" }}>
              <Clock size={12} />
              <span>Next: Mon May 5, 9:00 AM</span>
            </div>

            <button
              onClick={() => router.push("/reports/generate")}
              className="w-full py-3 rounded-xl text-[13px] font-semibold text-white flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-200"
              style={{
                fontFamily: "var(--font-body)",
                background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
              }}
            >
              <Zap size={14} strokeWidth={2.5} />
              Generate Now
            </button>
          </div>
        </div>
      </div>

      {/* Recent reports */}
      <div
        className="mt-4 rounded-2xl border border-[#2A2A3A] animate-slide-up delay-500"
        style={{
          background: "#16161F",
          boxShadow: "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E2E]">
          <div className="flex items-center gap-3">
            <FileText size={15} className="text-[#5A5A78]" />
            <h2 className="text-sm font-bold text-[#F0F0F5]" style={{ fontFamily: "var(--font-display)" }}>
              Recent Reports
            </h2>
          </div>
          <button
            className="text-[12px] text-[#7C3AED] hover:text-[#A78BFA] transition-colors font-medium"
            style={{ fontFamily: "var(--font-body)" }}
            onClick={() => router.push("/dashboard/reports")}
          >
            View all
          </button>
        </div>

        <div className="divide-y divide-[#1E1E2E]">
          {REPORTS.map((report) => {
            const statusMeta = REPORT_STATUS_META[report.status];
            return (
              <div
                key={report.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-[#1C1C28] transition-colors group cursor-pointer"
                onClick={() => router.push(`/reports/${report.id}/preview`)}
              >
                {/* PDF icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.15)" }}
                >
                  <FileText size={15} className="text-[#7C3AED]" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[#A0A0B8] group-hover:text-[#F0F0F5] transition-colors truncate" style={{ fontFamily: "var(--font-body)" }}>
                    {report.title}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-[#3A3A50]" style={{ fontFamily: "var(--font-mono)" }}>
                      {report.clientName}
                    </span>
                    <span className="text-[#2A2A3A]">·</span>
                    <span className="text-[11px] text-[#3A3A50]" style={{ fontFamily: "var(--font-mono)" }}>
                      {report.dateRange}
                    </span>
                  </div>
                </div>

                {/* Platform chips */}
                <div className="hidden lg:flex items-center gap-1">
                  {report.platforms.map((p) => (
                    <div
                      key={p}
                      className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[8px] font-bold"
                      style={{ background: PLATFORM_COLORS[p] }}
                    >
                      {p === "ga4" ? "G" : p === "meta" ? "M" : p === "xads" ? "X" : "A"}
                    </div>
                  ))}
                </div>

                {/* Date */}
                <span className="hidden md:block text-[11px] text-[#3A3A50] flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
                  {report.createdAt}
                </span>

                {/* Status chip */}
                <div
                  className="flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background: statusMeta.bg,
                    color: statusMeta.color,
                    border: `1px solid ${statusMeta.border}`,
                  }}
                >
                  {statusMeta.label}
                </div>

                {/* Actions */}
                <div className="relative flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === report.id ? null : report.id); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#3A3A50] hover:text-[#A0A0B8] hover:bg-[#1C1C28] transition-all opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal size={14} />
                  </button>
                  {menuOpen === report.id && (
                    <div
                      className="absolute right-0 top-8 w-36 rounded-xl border border-[#2A2A3A] bg-[#16161F] shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-20"
                      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
                    >
                      {[
                        { label: "Download PDF", icon: <Download size={13} /> },
                        { label: "Edit", icon: <Edit size={13} /> },
                        { label: "Duplicate", icon: <Copy size={13} /> },
                      ].map(({ label, icon }) => (
                        <button
                          key={label}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] text-[#A0A0B8] hover:text-[#F0F0F5] hover:bg-[#1C1C28] transition-colors first:rounded-t-xl last:rounded-b-xl"
                          style={{ fontFamily: "var(--font-body)" }}
                          onClick={(e) => { e.stopPropagation(); setMenuOpen(null); }}
                        >
                          {icon}
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
