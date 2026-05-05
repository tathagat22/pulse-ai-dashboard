"use client";
import { useRouter } from "next/navigation";
import { FileText, MoreHorizontal, Download, Edit, Copy, Zap } from "lucide-react";
import { useState } from "react";
import { REPORTS } from "@/lib/mock-data";

const STATUS_META = {
  sent: { label: "Sent", bg: "rgba(16,185,129,0.1)", color: "#10B981", border: "rgba(16,185,129,0.25)" },
  scheduled: { label: "Scheduled", bg: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "rgba(245,158,11,0.25)" },
  draft: { label: "Draft", bg: "rgba(90,90,120,0.15)", color: "#A0A0B8", border: "rgba(90,90,120,0.2)" },
};

const PLATFORM_COLORS: Record<string, string> = {
  ga4: "#7C3AED", meta: "#2563EB", xads: "#E5E7EB", googleads: "#EA4335",
};

export default function ReportsPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "sent" | "draft" | "scheduled">("all");

  const filtered = filter === "all" ? REPORTS : REPORTS.filter((r) => r.status === filter);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F0F5]" style={{ fontFamily: "var(--font-display)" }}>Reports</h1>
          <p className="text-sm text-[#5A5A78] mt-1" style={{ fontFamily: "var(--font-body)" }}>All generated and scheduled reports</p>
        </div>
        <button
          onClick={() => router.push("/reports/generate")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all"
          style={{ fontFamily: "var(--font-body)", background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)" }}
        >
          <Zap size={13} strokeWidth={2.5} />
          New Report
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-[#111118] border border-[#1E1E2E] w-fit mb-6">
        {(["all", "sent", "scheduled", "draft"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-lg text-[12px] font-medium capitalize transition-all"
            style={{
              fontFamily: "var(--font-body)",
              background: filter === f ? "#16161F" : "transparent",
              color: filter === f ? "#F0F0F5" : "#5A5A78",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div
        className="rounded-2xl border border-[#2A2A3A]"
        style={{ background: "#16161F", boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
      >
        <div className="divide-y divide-[#1E1E2E]">
          {filtered.map((report) => {
            const statusMeta = STATUS_META[report.status];
            return (
              <div
                key={report.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-[#1C1C28] transition-colors group cursor-pointer"
                onClick={() => router.push(`/reports/${report.id}/preview`)}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.15)" }}>
                  <FileText size={15} className="text-[#7C3AED]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[#A0A0B8] group-hover:text-[#F0F0F5] transition-colors truncate" style={{ fontFamily: "var(--font-body)" }}>
                    {report.title}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-[#3A3A50]" style={{ fontFamily: "var(--font-mono)" }}>{report.clientName}</span>
                    <span className="text-[#2A2A3A]">·</span>
                    <span className="text-[11px] text-[#3A3A50]" style={{ fontFamily: "var(--font-mono)" }}>{report.dateRange}</span>
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-1">
                  {report.platforms.map((p) => (
                    <div key={p} className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[8px] font-bold" style={{ background: PLATFORM_COLORS[p] }}>
                      {p === "ga4" ? "G" : p === "meta" ? "M" : p === "xads" ? "X" : "A"}
                    </div>
                  ))}
                </div>
                <span className="hidden md:block text-[11px] text-[#3A3A50] flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>{report.createdAt}</span>
                <div className="flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ fontFamily: "var(--font-mono)", background: statusMeta.bg, color: statusMeta.color, border: `1px solid ${statusMeta.border}` }}>
                  {statusMeta.label}
                </div>
                <div className="relative flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === report.id ? null : report.id); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#3A3A50] hover:text-[#A0A0B8] hover:bg-[#1C1C28] transition-all opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal size={14} />
                  </button>
                  {menuOpen === report.id && (
                    <div className="absolute right-0 top-8 w-36 rounded-xl border border-[#2A2A3A] bg-[#16161F] shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-20">
                      {[{ label: "Download PDF", icon: <Download size={13} /> }, { label: "Edit", icon: <Edit size={13} /> }, { label: "Duplicate", icon: <Copy size={13} /> }].map(({ label, icon }) => (
                        <button key={label} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] text-[#A0A0B8] hover:text-[#F0F0F5] hover:bg-[#1C1C28] transition-colors first:rounded-t-xl last:rounded-b-xl" style={{ fontFamily: "var(--font-body)" }} onClick={(e) => { e.stopPropagation(); setMenuOpen(null); }}>
                          {icon}{label}
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
