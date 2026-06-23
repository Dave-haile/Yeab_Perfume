import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../lib/api";
import { Lock, Loader2, ShieldAlert } from "lucide-react";
import { safeStorage } from "../../lib/storage";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if already authenticated and redirect
  useEffect(() => {
    const token = safeStorage.getItem("adminToken");
    const userStr = safeStorage.getItem("adminUser");
    if (token && userStr) {
      try {
        JSON.parse(userStr);
        navigate("/admin/dashboard");
      } catch (e) {
        safeStorage.removeItem("adminToken");
        safeStorage.removeItem("adminUser");
      }
    } else if (token || userStr) {
      // Out of sync, clean both to prevent loops
      safeStorage.removeItem("adminToken");
      safeStorage.removeItem("adminUser");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all credentials.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await userService.login(username, password);
      safeStorage.setItem("adminToken", response.token);
      safeStorage.setItem("adminUser", JSON.stringify(response.user));
      
      // Dispatch custom login event for instantaneous route updates
      window.dispatchEvent(new Event("admin-login-success"));
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error("Login failure:", err);
      const errMsg = err.response?.data?.message || err.message || "Incorrect formulation master credentials.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] dark:bg-black p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-black border border-slate-200 dark:border-[#c19253]/25 rounded-xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-slate-100 dark:bg-[#c19253]/10 border border-slate-200 dark:border-[#c19253]/30 rounded-lg flex items-center justify-center mb-4 text-emerald-650 dark:text-[#c19253] shadow-md">
            <Lock size={22} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-[#c19253] tracking-wider font-serif">
            ATELIER CONTROL CENTRE
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 uppercase tracking-widest font-mono">
            Internal Staff & Admin Access
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg flex items-start gap-3 text-red-700 dark:text-red-400 text-xs">
            <ShieldAlert className="flex-shrink-0 mt-0.5" size={16} />
            <div className="flex-1 font-mono tracking-tight leading-relaxed">
              {error}
              <div className="text-[10px] text-red-500/70 mt-1">
                Tip: Default demo usernames are: <span className="underline select-all font-bold">admin</span> or <span className="underline select-all font-bold">staff</span>. Access credentials are: <span className="font-bold">admin</span>.
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-zinc-400 mb-1.5 pl-1">
              Username ID
            </label>
            <input
              type="text"
              autoFocus
              className="w-full px-4 py-3 bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-lg outline-none text-xs font-mono tracking-wider text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-650 focus:border-slate-400 dark:focus:border-[#c19253]/50 focus:ring-1 focus:ring-slate-300 dark:focus:ring-zinc-700 transition-all font-bold"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin or staff"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 dark:text-zinc-400 mb-1.5 pl-1">
              Password PIN
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-lg outline-none text-xs font-mono tracking-wider text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-650 focus:border-slate-400 dark:focus:border-[#c19253]/50 focus:ring-1 focus:ring-slate-300 dark:focus:ring-zinc-700 transition-all font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-slate-900 hover:bg-black dark:bg-[#c19253] dark:hover:bg-[#FAF9F5] text-white dark:text-black rounded-lg text-xs font-bold tracking-widest uppercase transition-all mt-4 flex items-center justify-center gap-2 duration-150 disabled:opacity-50 shadow-md"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                VERIFYING AGENT...
              </>
            ) : (
              "SIGN INTO STATION"
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-400 dark:text-zinc-650 font-mono mt-8">
          Confidential System • Closed Terminal Ingress
        </p>
      </div>
    </div>
  );
}
