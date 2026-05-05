"use client";
import { useState } from "react";
import {
  Palette, Users, CreditCard, Plus, Trash2, Mail,
  Check, ChevronDown, Shield, Zap, BarChart2,
} from "lucide-react";

const TABS = [
  { key: "brand", label: "Brand Templates", icon: <Palette size={14} /> },
  { key: "team", label: "Team", icon: <Users size={14} /> },
  { key: "billing", label: "Billing", icon: <CreditCard size={14} /> },
] as const;

type Tab = typeof TABS[number]["key"];

const TEAM_MEMBERS = [
  { name: "Jamie Davis", email: "jamie@agency.com", role: "Admin", avatar: "JD", joined: "Jan 2024" },
  { name: "Sam Rivera", email: "sam@agency.com", role: "Editor", avatar: "SR", joined: "Mar 2024" },
  { name: "Alex Chen", email: "alex@agency.com", role: "Viewer", avatar: "AC", joined: "Apr 2024" },
];

const ROLES = ["Admin", "Editor", "Viewer"];

const ROLE_PERMS: Record<string, string[]> = {
  Admin: ["Full access including billing", "Manage team members", "Generate & edit reports", "View all data"],
  Editor: ["Generate & edit reports", "Manage clients", "View all analytics", "Cannot access billing"],
  Viewer: ["View reports only", "No generation or editing", "Read-only analytics"],
};

const CHART_PALETTES = [
  { id: "pulse", label: "Pulse Default", colors: ["#7C3AED", "#06B6D4", "#10B981", "#F59E0B"] },
  { id: "ocean", label: "Ocean", colors: ["#0EA5E9", "#6366F1", "#8B5CF6", "#22D3EE"] },
  { id: "earth", label: "Earth", colors: ["#D97706", "#059669", "#DC2626", "#7C3AED"] },
  { id: "mono", label: "Monochrome", colors: ["#F0F0F5", "#A0A0B8", "#5A5A78", "#2A2A3A"] },
];

const COVER_LAYOUTS = [
  { id: "centered", label: "Centered Logo" },
  { id: "left", label: "Logo Left" },
  { id: "full", label: "Full Bleed" },
];

const USAGE = [
  { label: "Reports Generated", used: 47, limit: 100, color: "#7C3AED" },
  { label: "AI Tokens", used: 620, limit: 1000, color: "#06B6D4" },
  { label: "Active Clients", used: 3, limit: 10, color: "#10B981" },
  { label: "Storage Used", used: 2.4, limit: 10, color: "#F59E0B", unit: "GB" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("brand");
  const [selectedPalette, setSelectedPalette] = useState("pulse");
  const [selectedLayout, setSelectedLayout] = useState("centered");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Editor");
  const [inviteSent, setInviteSent] = useState(false);
  const [members, setMembers] = useState(TEAM_MEMBERS);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  function sendInvite() {
    if (!inviteEmail.includes("@")) return;
    setInviteSent(true);
    setTimeout(() => setInviteSent(false), 3000);
    setInviteEmail("");
  }

  function removeMember(email: string) {
    setMembers((prev) => prev.filter((m) => m.email !== email));
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#F0F0F5]" style={{ fontFamily: "var(--font-display)" }}>
          Settings
        </h1>
        <p className="text-sm text-[#5A5A78] mt-1" style={{ fontFamily: "var(--font-body)" }}>
          Manage workspace preferences, team access, and billing
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-[#111118] border border-[#1E1E2E] mb-8 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-200"
            style={{
              fontFamily: "var(--font-body)",
              background: activeTab === tab.key ? "#16161F" : "transparent",
              color: activeTab === tab.key ? "#F0F0F5" : "#5A5A78",
              boxShadow: activeTab === tab.key ? "0 1px 3px rgba(0,0,0,0.4)" : "none",
            }}
          >
            <span style={{ color: activeTab === tab.key ? "#A78BFA" : "inherit" }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── BRAND TEMPLATES ── */}
      {activeTab === "brand" && (
        <div className="flex flex-col gap-6 animate-slide-up">
          {/* Cover layout */}
          <div
            className="rounded-2xl border border-[#2A2A3A] p-6"
            style={{ background: "#16161F", boxShadow: "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" }}
          >
            <h2 className="text-sm font-bold text-[#F0F0F5] mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Cover Page Layout
            </h2>
            <p className="text-[11px] text-[#5A5A78] mb-5" style={{ fontFamily: "var(--font-body)" }}>
              Choose how client logos and headers are positioned on the first page.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {COVER_LAYOUTS.map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => setSelectedLayout(layout.id)}
                  className="relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all"
                  style={{
                    background: selectedLayout === layout.id ? "rgba(124,58,237,0.08)" : "#111118",
                    borderColor: selectedLayout === layout.id ? "rgba(124,58,237,0.3)" : "#2A2A3A",
                  }}
                >
                  {/* Mini preview */}
                  <div
                    className="w-full h-16 rounded-lg overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
                  >
                    <div
                      className="h-full flex items-center px-3"
                      style={{
                        justifyContent: layout.id === "centered" ? "center" : layout.id === "left" ? "flex-start" : "center",
                      }}
                    >
                      <div className="w-6 h-6 rounded bg-white/30" />
                    </div>
                  </div>
                  <span className="text-[11px] font-medium" style={{ fontFamily: "var(--font-body)", color: selectedLayout === layout.id ? "#F0F0F5" : "#5A5A78" }}>
                    {layout.label}
                  </span>
                  {selectedLayout === layout.id && (
                    <div
                      className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: "#7C3AED" }}
                    >
                      <Check size={9} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chart color palettes */}
          <div
            className="rounded-2xl border border-[#2A2A3A] p-6"
            style={{ background: "#16161F", boxShadow: "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" }}
          >
            <h2 className="text-sm font-bold text-[#F0F0F5] mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Chart Color Palette
            </h2>
            <p className="text-[11px] text-[#5A5A78] mb-5" style={{ fontFamily: "var(--font-body)" }}>
              Applied to all charts in generated reports. Per-client overrides available in client settings.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {CHART_PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  onClick={() => setSelectedPalette(palette.id)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left"
                  style={{
                    background: selectedPalette === palette.id ? "rgba(124,58,237,0.08)" : "#111118",
                    borderColor: selectedPalette === palette.id ? "rgba(124,58,237,0.3)" : "#2A2A3A",
                  }}
                >
                  <div className="flex gap-1">
                    {palette.colors.map((c) => (
                      <div key={c} className="w-5 h-5 rounded-md" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="text-[12px] font-medium flex-1" style={{ fontFamily: "var(--font-body)", color: selectedPalette === palette.id ? "#F0F0F5" : "#A0A0B8" }}>
                    {palette.label}
                  </span>
                  {selectedPalette === palette.id && <Check size={13} className="text-[#7C3AED]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Default font */}
          <div
            className="rounded-2xl border border-[#2A2A3A] p-6"
            style={{ background: "#16161F", boxShadow: "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" }}
          >
            <h2 className="text-sm font-bold text-[#F0F0F5] mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Report Typography
            </h2>
            <p className="text-[11px] text-[#5A5A78] mb-5" style={{ fontFamily: "var(--font-body)" }}>
              Custom fonts for PDF export. Fallback to Inter if not uploaded.
            </p>
            <div
              className="flex items-center justify-between p-4 rounded-xl border border-dashed border-[#2A2A3A] hover:border-[#7C3AED] transition-colors cursor-pointer"
              style={{ background: "#111118" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1C1C28] flex items-center justify-center">
                  <span className="text-sm font-bold text-[#5A5A78]" style={{ fontFamily: "var(--font-mono)" }}>Aa</span>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#A0A0B8]" style={{ fontFamily: "var(--font-body)" }}>Inter (default)</p>
                  <p className="text-[10px] text-[#3A3A50]" style={{ fontFamily: "var(--font-mono)" }}>Upload custom .woff2 to override</p>
                </div>
              </div>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2A2A3A] text-[11px] text-[#5A5A78] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <Plus size={12} /> Upload font
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="px-6 py-2.5 rounded-xl text-[13px] font-semibold text-white hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all"
              style={{ fontFamily: "var(--font-body)", background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)" }}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* ── TEAM ── */}
      {activeTab === "team" && (
        <div className="flex flex-col gap-6 animate-slide-up">
          {/* Invite */}
          <div
            className="rounded-2xl border border-[#2A2A3A] p-6"
            style={{ background: "#16161F", boxShadow: "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" }}
          >
            <h2 className="text-sm font-bold text-[#F0F0F5] mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Invite Team Member
            </h2>
            <p className="text-[11px] text-[#5A5A78] mb-5" style={{ fontFamily: "var(--font-body)" }}>
              They'll receive an email with a link to join your workspace.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3A3A50]" />
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@agency.com"
                  className="w-full py-2.5 pl-9 pr-3.5 rounded-xl bg-[#111118] border border-[#2A2A3A] text-sm text-[#F0F0F5] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#7C3AED] transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
              <div className="relative">
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="appearance-none py-2.5 pl-3.5 pr-8 rounded-xl bg-[#111118] border border-[#2A2A3A] text-sm text-[#A0A0B8] focus:outline-none focus:border-[#7C3AED] transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {ROLES.map((r) => <option key={r} value={r} style={{ background: "#111118" }}>{r}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5A5A78] pointer-events-none" />
              </div>
              <button
                onClick={sendInvite}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all hover:shadow-[0_0_16px_rgba(124,58,237,0.3)]"
                style={{ fontFamily: "var(--font-body)", background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)" }}
              >
                {inviteSent ? <><Check size={13} strokeWidth={3} /> Sent!</> : "Send Invite"}
              </button>
            </div>
          </div>

          {/* Permission matrix */}
          <div
            className="rounded-2xl border border-[#2A2A3A] p-6"
            style={{ background: "#16161F", boxShadow: "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" }}
          >
            <h2 className="text-sm font-bold text-[#F0F0F5] mb-5" style={{ fontFamily: "var(--font-display)" }}>
              Role Permissions
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {ROLES.map((role) => (
                <div
                  key={role}
                  className="rounded-xl border p-4"
                  style={{ background: "#111118", borderColor: "#2A2A3A" }}
                >
                  <p className="text-[12px] font-bold text-[#F0F0F5] mb-3" style={{ fontFamily: "var(--font-body)" }}>{role}</p>
                  <div className="flex flex-col gap-2">
                    {ROLE_PERMS[role].map((perm) => (
                      <div key={perm} className="flex items-start gap-2">
                        <Check size={11} className="mt-0.5 flex-shrink-0 text-[#10B981]" strokeWidth={3} />
                        <span className="text-[10px] text-[#5A5A78] leading-tight" style={{ fontFamily: "var(--font-body)" }}>{perm}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Members list */}
          <div
            className="rounded-2xl border border-[#2A2A3A]"
            style={{ background: "#16161F", boxShadow: "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E2E]">
              <h2 className="text-sm font-bold text-[#F0F0F5]" style={{ fontFamily: "var(--font-display)" }}>
                Members ({members.length})
              </h2>
            </div>
            <div className="divide-y divide-[#1E1E2E]">
              {members.map((member) => (
                <div key={member.email} className="flex items-center gap-4 px-6 py-4 group">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
                  >
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#F0F0F5]" style={{ fontFamily: "var(--font-body)" }}>{member.name}</p>
                    <p className="text-[11px] text-[#5A5A78]" style={{ fontFamily: "var(--font-mono)" }}>{member.email}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#3A3A50]" style={{ fontFamily: "var(--font-mono)" }}>
                    Joined {member.joined}
                  </div>
                  <div
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold border"
                    style={{
                      fontFamily: "var(--font-mono)",
                      background: member.role === "Admin" ? "rgba(124,58,237,0.1)" : member.role === "Editor" ? "rgba(6,182,212,0.1)" : "rgba(90,90,120,0.15)",
                      color: member.role === "Admin" ? "#A78BFA" : member.role === "Editor" ? "#67E8F9" : "#A0A0B8",
                      borderColor: member.role === "Admin" ? "rgba(124,58,237,0.2)" : member.role === "Editor" ? "rgba(6,182,212,0.2)" : "rgba(90,90,120,0.2)",
                    }}
                  >
                    {member.role}
                  </div>
                  {member.role !== "Admin" && (
                    <button
                      onClick={() => removeMember(member.email)}
                      className="opacity-0 group-hover:opacity-100 text-[#3A3A50] hover:text-[#F43F5E] transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── BILLING ── */}
      {activeTab === "billing" && (
        <div className="flex flex-col gap-6 animate-slide-up">
          {/* Plan */}
          <div
            className="rounded-2xl border p-6 gradient-border"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(6,182,212,0.06) 100%)",
              borderColor: "rgba(124,58,237,0.2)",
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={15} style={{ color: "#7C3AED" }} />
                  <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)", color: "#7C3AED" }}>
                    Current Plan
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#F0F0F5] mb-0.5" style={{ fontFamily: "var(--font-display)" }}>
                  Agency Pro
                </h2>
                <p className="text-[12px] text-[#5A5A78]" style={{ fontFamily: "var(--font-body)" }}>
                  $299/month · Renews June 5, 2025
                </p>
              </div>
              <button
                className="px-4 py-2 rounded-xl border border-[#2A2A3A] text-[12px] font-medium text-[#A0A0B8] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Upgrade Plan
              </button>
            </div>
            <div className="flex items-center gap-4 mt-5 pt-5 border-t border-[rgba(124,58,237,0.1)]">
              {[
                { icon: <BarChart2 size={13} />, text: "100 reports/month" },
                { icon: <Users size={13} />, text: "10 clients" },
                { icon: <Shield size={13} />, text: "SOC 2 Type II" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-[11px] text-[#5A5A78]" style={{ fontFamily: "var(--font-body)" }}>
                  <span style={{ color: "#7C3AED" }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Usage */}
          <div
            className="rounded-2xl border border-[#2A2A3A] p-6"
            style={{ background: "#16161F", boxShadow: "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" }}
          >
            <h2 className="text-sm font-bold text-[#F0F0F5] mb-5" style={{ fontFamily: "var(--font-display)" }}>
              Usage This Month
            </h2>
            <div className="flex flex-col gap-5">
              {USAGE.map((item) => {
                const pct = (item.used / item.limit) * 100;
                const isWarning = pct > 75;
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] font-medium text-[#A0A0B8]" style={{ fontFamily: "var(--font-body)" }}>
                        {item.label}
                      </span>
                      <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: isWarning ? "#F59E0B" : "#5A5A78" }}>
                        {item.used}{item.unit ?? ""} / {item.limit}{item.unit ?? ""}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#1C1C28] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: isWarning
                            ? "linear-gradient(90deg, #F59E0B, #EF4444)"
                            : `linear-gradient(90deg, ${item.color}, ${item.color}AA)`,
                        }}
                      />
                    </div>
                    {isWarning && (
                      <p className="text-[10px] text-[#F59E0B] mt-1" style={{ fontFamily: "var(--font-mono)" }}>
                        Approaching limit — consider upgrading
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Invoices */}
          <div
            className="rounded-2xl border border-[#2A2A3A]"
            style={{ background: "#16161F", boxShadow: "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" }}
          >
            <div className="px-6 py-4 border-b border-[#1E1E2E]">
              <h2 className="text-sm font-bold text-[#F0F0F5]" style={{ fontFamily: "var(--font-display)" }}>
                Recent Invoices
              </h2>
            </div>
            <div className="divide-y divide-[#1E1E2E]">
              {[
                { date: "May 5, 2025", amount: "$299.00", status: "Paid" },
                { date: "Apr 5, 2025", amount: "$299.00", status: "Paid" },
                { date: "Mar 5, 2025", amount: "$299.00", status: "Paid" },
              ].map((inv) => (
                <div key={inv.date} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-[13px] font-medium text-[#A0A0B8]" style={{ fontFamily: "var(--font-body)" }}>
                      Agency Pro — {inv.date}
                    </p>
                    <p className="text-[11px] text-[#3A3A50]" style={{ fontFamily: "var(--font-mono)" }}>invoice_{inv.date.replace(/,\s|\s/g, "_")}.pdf</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-semibold text-[#F0F0F5]" style={{ fontFamily: "var(--font-mono)" }}>{inv.amount}</span>
                    <div
                      className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                      style={{ background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)", fontFamily: "var(--font-mono)" }}
                    >
                      {inv.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
