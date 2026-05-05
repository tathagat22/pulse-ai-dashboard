"use client";
import { Bell, Search, Zap } from "lucide-react";
import { usePulseStore } from "@/lib/store";
import { CLIENTS } from "@/lib/mock-data";

export function Header() {
  const { activeClientId } = usePulseStore();
  const client = CLIENTS.find((c) => c.id === activeClientId) ?? CLIENTS[0];

  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b border-[#1E1E2E] flex-shrink-0 sticky top-0 z-10"
      style={{ background: "rgba(9,9,14,0.85)", backdropFilter: "blur(20px)" }}
    >
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-sm">
        <div className="relative flex items-center">
          <Search size={14} className="absolute left-3 text-[#3A3A50]" />
          <input
            type="text"
            placeholder="Search reports, clients..."
            className="w-64 py-2 pl-9 pr-3 rounded-xl bg-[#111118] border border-[#2A2A3A] text-[13px] text-[#A0A0B8] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#7C3AED] transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Active client chip */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#2A2A3A] bg-[#16161F]"
        >
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-bold"
            style={{ background: client.accentColor }}
          >
            {client.logoInitials}
          </div>
          <span className="text-[13px] font-medium text-[#A0A0B8]" style={{ fontFamily: "var(--font-body)" }}>
            {client.name}
          </span>
        </div>

        {/* Notification bell */}
        <button className="relative w-9 h-9 rounded-xl border border-[#2A2A3A] bg-[#16161F] flex items-center justify-center text-[#5A5A78] hover:text-[#A0A0B8] hover:border-[#3A3A50] transition-all">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7C3AED]" />
        </button>

        {/* Generate report CTA */}
        <button
          onClick={() => window.location.href = "/reports/generate"}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-200"
          style={{
            fontFamily: "var(--font-body)",
            background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
          }}
        >
          <Zap size={13} strokeWidth={2.5} />
          Generate Report
        </button>
      </div>
    </header>
  );
}
