export type Platform = "ga4" | "meta" | "xads" | "googleads";
export type ConnectionStatus = "connected" | "disconnected" | "syncing";
export type ReportStatus = "sent" | "draft" | "scheduled";

export interface Client {
  id: string;
  name: string;
  industry: string;
  logoInitials: string;
  accentColor: string;
  connections: Record<Platform, ConnectionStatus>;
  website: string;
}

export interface MetricSeries {
  date: string;
  value: number;
}

export interface PlatformMetrics {
  sessions: number;
  sessionsChange: number;
  conversions: number;
  conversionsChange: number;
  spend: number;
  spendChange: number;
  roas: number;
  roasChange: number;
  sparkline: MetricSeries[];
}

export interface Report {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  dateRange: string;
  status: ReportStatus;
  createdAt: string;
  platforms: Platform[];
}

export const CLIENTS: Client[] = [
  {
    id: "acme",
    name: "Acme Corp",
    industry: "E-Commerce",
    logoInitials: "AC",
    accentColor: "#7C3AED",
    website: "acmecorp.com",
    connections: { ga4: "connected", meta: "connected", xads: "disconnected", googleads: "connected" },
  },
  {
    id: "brandify",
    name: "Brandify",
    industry: "SaaS",
    logoInitials: "BR",
    accentColor: "#06B6D4",
    website: "brandify.io",
    connections: { ga4: "connected", meta: "syncing", xads: "connected", googleads: "connected" },
  },
  {
    id: "techlaunch",
    name: "TechLaunch",
    industry: "B2B Tech",
    logoInitials: "TL",
    accentColor: "#10B981",
    website: "techlaunch.dev",
    connections: { ga4: "connected", meta: "disconnected", xads: "disconnected", googleads: "connected" },
  },
];

export const PLATFORM_LABELS: Record<Platform, string> = {
  ga4: "Google Analytics 4",
  meta: "Meta Ads",
  xads: "X Ads",
  googleads: "Google Ads",
};

export const METRICS: PlatformMetrics = {
  sessions: 124_830,
  sessionsChange: 12.4,
  conversions: 3_291,
  conversionsChange: 8.7,
  spend: 48_200,
  spendChange: -3.2,
  roas: 4.8,
  roasChange: 14.1,
  sparkline: [
    { date: "Apr 5", value: 3200 },
    { date: "Apr 8", value: 4100 },
    { date: "Apr 11", value: 3700 },
    { date: "Apr 14", value: 5200 },
    { date: "Apr 17", value: 4800 },
    { date: "Apr 20", value: 6100 },
    { date: "Apr 23", value: 5600 },
    { date: "Apr 26", value: 7200 },
    { date: "Apr 29", value: 6800 },
    { date: "May 2", value: 8100 },
  ],
};

export const SPARKLINES: Record<string, MetricSeries[]> = {
  sessions: [
    { date: "W1", value: 28400 }, { date: "W2", value: 31200 }, { date: "W3", value: 29800 },
    { date: "W4", value: 35600 }, { date: "W5", value: 124830 },
  ],
  conversions: [
    { date: "W1", value: 720 }, { date: "W2", value: 840 }, { date: "W3", value: 790 },
    { date: "W4", value: 920 }, { date: "W5", value: 3291 },
  ],
  spend: [
    { date: "W1", value: 11200 }, { date: "W2", value: 12400 }, { date: "W3", value: 11800 },
    { date: "W4", value: 13200 }, { date: "W5", value: 48200 },
  ],
  roas: [
    { date: "W1", value: 3.8 }, { date: "W2", value: 4.1 }, { date: "W3", value: 3.9 },
    { date: "W4", value: 4.5 }, { date: "W5", value: 4.8 },
  ],
};

export const REPORTS: Report[] = [
  {
    id: "rpt-001",
    clientId: "acme",
    clientName: "Acme Corp",
    title: "Monthly Performance Report — April 2025",
    dateRange: "Apr 1 – Apr 30, 2025",
    status: "sent",
    createdAt: "May 1, 2025",
    platforms: ["ga4", "meta", "googleads"],
  },
  {
    id: "rpt-002",
    clientId: "brandify",
    clientName: "Brandify",
    title: "Weekly Pulse — Week 17",
    dateRange: "Apr 22 – Apr 28, 2025",
    status: "scheduled",
    createdAt: "Apr 29, 2025",
    platforms: ["ga4", "meta", "xads", "googleads"],
  },
  {
    id: "rpt-003",
    clientId: "techlaunch",
    clientName: "TechLaunch",
    title: "Q1 2025 Executive Summary",
    dateRange: "Jan 1 – Mar 31, 2025",
    status: "draft",
    createdAt: "Apr 18, 2025",
    platforms: ["ga4", "googleads"],
  },
  {
    id: "rpt-004",
    clientId: "acme",
    clientName: "Acme Corp",
    title: "Weekly Pulse — Week 16",
    dateRange: "Apr 15 – Apr 21, 2025",
    status: "sent",
    createdAt: "Apr 22, 2025",
    platforms: ["ga4", "meta", "googleads"],
  },
];

export const CHART_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: `Apr ${i + 1}`,
  sessions: Math.floor(3500 + Math.random() * 2000 + Math.sin(i / 3) * 800),
  conversions: Math.floor(80 + Math.random() * 60 + Math.cos(i / 4) * 30),
  spend: Math.floor(1400 + Math.random() * 400 + Math.sin(i / 5) * 200),
}));

export const PLATFORM_BREAKDOWN = [
  { name: "Google Analytics 4", sessions: 52400, conversions: 1420, color: "#7C3AED" },
  { name: "Meta Ads", sessions: 38200, conversions: 980, color: "#06B6D4" },
  { name: "Google Ads", sessions: 34230, conversions: 891, color: "#10B981" },
];

export const AI_REPORT_COPY = `
## Executive Summary

Acme Corp delivered strong performance in April 2025, with **sessions up 12.4%** month-over-month to 124,830 and conversions growing 8.7% to 3,291. The most notable driver was improved paid search efficiency — Google Ads ROAS climbed to **4.8x**, a 14.1% improvement over March. Ad spend was simultaneously trimmed 3.2%, demonstrating healthy optimization momentum.

## Google Analytics 4

Organic traffic grew 18% in April, with the blog channel emerging as the top acquisition source (31% of organic sessions). Bounce rate improved to 42% from 48% in March. The /pricing page saw a 23% lift in time-on-page, suggesting improved copy resonance. Mobile sessions account for 61% of total traffic — mobile conversion rate at 2.1% still trails desktop at 3.4%.

**Insight:** The mobile conversion gap represents the highest-impact optimization opportunity. A/B testing a simplified mobile checkout flow could yield 400–600 additional monthly conversions.

## Meta Ads

Meta campaigns generated $38,200 in sessions at a CPC of $1.12, down from $1.38 in March. The Spring Collection retargeting campaign outperformed prospecting by **2.3x** on ROAS. Video creative drove 68% of conversions despite representing only 40% of spend — a clear signal to reallocate budget toward video formats.

**Insight:** Shifting 20% of static image budget to Reels formats could improve blended Meta ROAS from 3.9x to an estimated 4.5x.

## Google Ads

Search campaigns maintained efficiency with a 4.8x ROAS on $24,100 spend. Brand keywords continue to dominate at 52% of conversions, but competitor conquest campaigns showed promising 2.8x ROAS — above the account average for the first time. Shopping campaigns underperformed at 2.1x ROAS; product feed quality issues may be limiting impression share.

## Recommendations

1. **Prioritize mobile UX optimization** — reduce checkout steps on mobile from 4 to 2; estimated +15% mobile CVR
2. **Scale Meta video creative** — shift 20% of Meta static budget to Reels/Stories formats
3. **Audit Shopping feed** — fix missing GTINs and improve product titles with high-intent keywords
4. **Expand conquest campaigns** — increase Google Ads competitor targeting budget by $2,000/month given 2.8x ROAS
5. **Implement remarketing lists for search** — layer RLSA on top branded campaigns to improve bid efficiency
`;
