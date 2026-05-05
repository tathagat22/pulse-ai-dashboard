"use client";
import { useRouter, usePathname } from "next/navigation";
import {
  Zap, LayoutDashboard, Users, BarChart2, FileText,
  Settings, ChevronLeft, Plus, Circle,
} from "lucide-react";
import { usePulseStore } from "@/lib/store";
import { CLIENTS, ConnectionStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<ConnectionStatus, string> = {
  connected: "#10B981",
  disconnected: "#F43F5E",
  syncing: "#F59E0B",
};

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  section: string;
}

const NAV: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={16} />, href: "/dashboard", section: "dashboard" },
  { label: "Clients", icon: <Users size={16} />, href: "/dashboard/clients/new", section: "clients" },
  { label: "Analytics", icon: <BarChart2 size={16} />, href: "/dashboard/reports", section: "analytics" },
  { label: "Reports", icon: <FileText size={16} />, href: "/dashboard/reports", section: "reports" },
  { label: "Settings", icon: <Settings size={16} />, href: "/dashboard/settings", section: "settings" },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, activeClientId, setActiveClient } = usePulseStore();

  const collapsed = sidebarCollapsed;

  function connectedCount(client: typeof CLIENTS[0]) {
    return Object.values(client.connections).filter((v) => v === "connected").length;
  }

  return (
    <aside
      className="relative flex flex-col h-full border-r border-[#1E1E2E] transition-all duration-300 flex-shrink-0"
      style={{
        width: collapsed ? 72 : 264,
        background: "#0D0D14",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-[#1E1E2E] flex-shrink-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
        >
          <Zap size={16} className="text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <span
            className="text-lg font-bold gradient-text tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Pulse
          </span>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full border border-[#2A2A3A] bg-[#16161F] flex items-center justify-center z-10 hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all text-[#5A5A78]"
      >
        <ChevronLeft
          size={12}
          className="transition-transform duration-300"
          style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6">
        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {!collapsed && (
            <span
              className="text-[10px] font-semibold text-[#3A3A50] uppercase tracking-widest px-2 mb-1"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Navigation
            </span>
          )}
          {NAV.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <button
                key={item.section}
                onClick={() => router.push(item.href)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl transition-all duration-150 text-sm font-medium",
                  collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5",
                  isActive
                    ? "text-[#F0F0F5] bg-[rgba(124,58,237,0.12)] border border-[rgba(124,58,237,0.15)]"
                    : "text-[#5A5A78] hover:text-[#A0A0B8] hover:bg-[#1C1C28] border border-transparent"
                )}
                style={{ fontFamily: "var(--font-body)" }}
              >
                <span className={isActive ? "text-[#A78BFA]" : ""}>{item.icon}</span>
                {!collapsed && item.label}
              </button>
            );
          })}
        </nav>

        {/* Clients */}
        <div>
          {!collapsed && (
            <div className="flex items-center justify-between px-2 mb-2">
              <span
                className="text-[10px] font-semibold text-[#3A3A50] uppercase tracking-widest"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Clients
              </span>
              <button
                onClick={() => router.push("/clients/new")}
                className="w-4 h-4 text-[#5A5A78] hover:text-[#7C3AED] transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
          <div className="flex flex-col gap-1">
            {CLIENTS.map((client) => {
              const active = activeClientId === client.id;
              const connected = connectedCount(client);
              return (
                <button
                  key={client.id}
                  onClick={() => setActiveClient(client.id)}
                  title={collapsed ? client.name : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl transition-all duration-150",
                    collapsed ? "px-0 py-2 justify-center" : "px-3 py-2.5",
                    active
                      ? "bg-[#16161F] border border-[#2A2A3A]"
                      : "border border-transparent hover:bg-[#1C1C28]"
                  )}
                >
                  {/* Logo circle */}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ background: client.accentColor }}
                  >
                    {client.logoInitials}
                  </div>
                  {!collapsed && (
                    <div className="flex-1 text-left min-w-0">
                      <div
                        className="text-[13px] font-medium text-[#A0A0B8] truncate leading-none mb-0.5"
                        style={{ fontFamily: "var(--font-body)", color: active ? "#F0F0F5" : undefined }}
                      >
                        {client.name}
                      </div>
                      <div
                        className="text-[10px] text-[#3A3A50]"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {connected}/4 connected
                      </div>
                    </div>
                  )}
                  {!collapsed && (
                    <Circle
                      size={7}
                      fill={STATUS_COLORS[connected === 4 ? "connected" : connected >= 2 ? "syncing" : "disconnected"]}
                      className="flex-shrink-0"
                      style={{ color: STATUS_COLORS[connected === 4 ? "connected" : connected >= 2 ? "syncing" : "disconnected"] }}
                    />
                  )}
                </button>
              );
            })}

            {/* Add client */}
            {!collapsed && (
              <button
                onClick={() => router.push("/clients/new")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-dashed border-[#2A2A3A] text-[#3A3A50] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all duration-200"
              >
                <Plus size={14} />
                <span className="text-[13px] font-medium" style={{ fontFamily: "var(--font-body)" }}>
                  Add client
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: user */}
      <div className="border-t border-[#1E1E2E] p-3">
        <div className={cn("flex items-center gap-3 rounded-xl px-2 py-2", collapsed && "justify-center")}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
          >
            JD
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-[13px] font-medium text-[#A0A0B8] truncate" style={{ fontFamily: "var(--font-body)" }}>
                Jamie Davis
              </div>
              <div className="text-[10px] text-[#3A3A50] truncate" style={{ fontFamily: "var(--font-mono)" }}>
                Admin
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
