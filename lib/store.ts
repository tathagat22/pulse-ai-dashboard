"use client";
import { create } from "zustand";
import { Client, CLIENTS, Report, REPORTS } from "./mock-data";

interface PulseStore {
  activeClientId: string;
  setActiveClient: (id: string) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  clients: Client[];
  reports: Report[];
  activeSection: string;
  setActiveSection: (s: string) => void;
}

export const usePulseStore = create<PulseStore>((set) => ({
  activeClientId: "acme",
  setActiveClient: (id) => set({ activeClientId: id }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  clients: CLIENTS,
  reports: REPORTS,
  activeSection: "dashboard",
  setActiveSection: (s) => set({ activeSection: s }),
}));
