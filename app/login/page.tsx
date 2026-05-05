"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Zap } from "lucide-react";
import { sleep } from "@/lib/utils";

type Tab = "signin" | "request";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="0" y="0" width="8.5" height="8.5" fill="#F25022"/>
    <rect x="9.5" y="0" width="8.5" height="8.5" fill="#7FBA00"/>
    <rect x="0" y="9.5" width="8.5" height="8.5" fill="#00A4EF"/>
    <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [requestEmail, setRequestEmail] = useState("");
  const [requestCompany, setRequestCompany] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await sleep(1600);
    router.push("/dashboard");
  }

  async function handleOAuth(provider: string) {
    setOauthLoading(provider);
    await sleep(1400);
    router.push("/dashboard");
  }

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await sleep(1400);
    setLoading(false);
    setRequestSent(true);
  }

  return (
    <div className="relative min-h-screen mesh-bg grid-bg flex items-center justify-center overflow-hidden">
      {/* Animated mesh orbs */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="mesh-orb-1 absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)" }}
        />
        <div
          className="mesh-orb-2 absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 65%)" }}
        />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-slide-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8 animate-fade-in">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
          >
            <Zap size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <span
            className="text-xl font-bold tracking-tight gradient-text"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Pulse
          </span>
        </div>

        {/* Glass card */}
        <div className="glass rounded-3xl p-8 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-[#111118] mb-8">
            {(["signin", "request"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  fontFamily: "var(--font-body)",
                  background: tab === t ? "#16161F" : "transparent",
                  color: tab === t ? "#F0F0F5" : "#5A5A78",
                  boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" : "none",
                }}
              >
                {t === "signin" ? "Sign In" : "Request Access"}
              </button>
            ))}
          </div>

          {tab === "signin" ? (
            <>
              <h1
                className="text-2xl font-bold text-[#F0F0F5] mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Welcome back
              </h1>
              <p className="text-sm text-[#5A5A78] mb-8" style={{ fontFamily: "var(--font-body)" }}>
                Sign in to your Pulse workspace
              </p>

              {/* OAuth buttons */}
              <div className="flex flex-col gap-3 mb-6">
                {[
                  { key: "google", label: "Continue with Google", icon: <GoogleIcon /> },
                  { key: "microsoft", label: "Continue with Microsoft", icon: <MicrosoftIcon /> },
                ].map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => handleOAuth(key)}
                    disabled={!!oauthLoading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#2A2A3A] bg-[#16161F] text-sm font-medium text-[#A0A0B8] hover:border-[#3A3A50] hover:text-[#F0F0F5] hover:bg-[#1C1C28] transition-all duration-200 disabled:opacity-50"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {oauthLoading === key ? (
                      <Loader2 size={16} className="animate-spin text-[#7C3AED]" />
                    ) : icon}
                    {oauthLoading === key ? "Connecting..." : label}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-[#2A2A3A]" />
                <span className="text-xs text-[#5A5A78]" style={{ fontFamily: "var(--font-mono)" }}>or</span>
                <div className="flex-1 h-px bg-[#2A2A3A]" />
              </div>

              {/* Email / password */}
              <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5A5A78] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@agency.com"
                    className="w-full py-2.5 px-3.5 rounded-xl bg-[#111118] border border-[#2A2A3A] text-sm text-[#F0F0F5] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#7C3AED] transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-[#5A5A78]" style={{ fontFamily: "var(--font-body)" }}>
                      Password
                    </label>
                    <button type="button" className="text-xs text-[#7C3AED] hover:text-[#A78BFA] transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full py-2.5 px-3.5 pr-10 rounded-xl bg-[#111118] border border-[#2A2A3A] text-sm text-[#F0F0F5] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#7C3AED] transition-colors"
                      style={{ fontFamily: "var(--font-body)" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A78] hover:text-[#A0A0B8] transition-colors"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-[0_0_24px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
                  style={{
                    fontFamily: "var(--font-body)",
                    background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                  }}
                >
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> Signing in...</>
                  ) : "Sign in"}
                </button>
              </form>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-[#1E1E2E]">
                {["SOC 2 Type II", "256-bit AES", "GDPR"].map((badge) => (
                  <span
                    key={badge}
                    className="text-[10px] font-medium text-[#3A3A50]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1
                className="text-2xl font-bold text-[#F0F0F5] mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {requestSent ? "Request received" : "Request access"}
              </h1>
              <p className="text-sm text-[#5A5A78] mb-8" style={{ fontFamily: "var(--font-body)" }}>
                {requestSent
                  ? "We'll reach out within 24 hours to get your agency set up."
                  : "Tell us about your agency and we'll get you set up."}
              </p>

              {requestSent ? (
                <div className="flex flex-col items-center gap-4 py-8">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}
                  >
                    <span className="text-3xl">✓</span>
                  </div>
                  <button
                    onClick={() => { setRequestSent(false); setTab("signin"); }}
                    className="text-sm text-[#7C3AED] hover:text-[#A78BFA] transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Back to sign in
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRequest} className="flex flex-col gap-4">
                  {[
                    { label: "Work email", type: "email", value: requestEmail, setter: setRequestEmail, placeholder: "you@agency.com" },
                    { label: "Agency name", type: "text", value: requestCompany, setter: setRequestCompany, placeholder: "Your agency" },
                  ].map(({ label, type, value, setter, placeholder }) => (
                    <div key={label}>
                      <label className="block text-xs font-medium text-[#5A5A78] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                        {label}
                      </label>
                      <input
                        type={type}
                        required
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        placeholder={placeholder}
                        className="w-full py-2.5 px-3.5 rounded-xl bg-[#111118] border border-[#2A2A3A] text-sm text-[#F0F0F5] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#7C3AED] transition-colors"
                        style={{ fontFamily: "var(--font-body)" }}
                      />
                    </div>
                  ))}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-[0_0_24px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 disabled:opacity-70"
                    style={{
                      fontFamily: "var(--font-body)",
                      background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                    }}
                  >
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Sending...</>
                    ) : "Request access"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-[#3A3A50] mt-6" style={{ fontFamily: "var(--font-mono)" }}>
          © 2025 Pulse AI · All rights reserved
        </p>
      </div>
    </div>
  );
}
