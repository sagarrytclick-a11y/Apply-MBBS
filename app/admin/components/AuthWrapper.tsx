"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { SITE_IDENTITY } from "@/app/config/site_identity";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [adminUser, setAdminUser] = useState("Admin");

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/session", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.authenticated) {
        setIsAuthenticated(true);
        setAdminUser(data.user?.username || "Admin");
        return true;
      }

      setIsAuthenticated(false);
      return false;
    } catch {
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        await checkSession();
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [checkSession]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Invalid username or password"
        );
        setIsAuthenticated(false);
        return;
      }

      // Confirm httpOnly cookie was actually stored before unlocking dashboard
      const ok = await checkSession();
      if (!ok) {
        setError(
          "Signed in, but session cookie was not saved. Allow cookies for this site and try again."
        );
        setIsAuthenticated(false);
        return;
      }

      setAdminUser(data.user?.username || username.trim() || "Admin");
      setPassword("");
      router.refresh();
    } catch {
      setError("Unable to sign in. Check your connection and try again.");
      setIsAuthenticated(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    setIsAuthenticated(false);
    setAdminUser("Admin");
    setUsername("");
    setPassword("");
    setError("");
    setIsLoading(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } catch {
      // still force local logout
    }

    await checkSession();
    setIsLoading(false);
    setIsLoggingOut(false);
    router.replace("/admin");
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary font-body">
        <div className="border-b border-white/10 px-4 py-4">
          <div className="mx-auto flex h-10 max-w-7xl items-center justify-between">
            <div className="h-10 w-40 animate-pulse rounded-[12px] bg-white/10" />
            <div className="h-9 w-24 animate-pulse rounded-[12px] bg-white/10" />
          </div>
        </div>
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
          <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-[16px] border border-white/10 bg-white/5"
              />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-[16px] border border-white/10 bg-white/5" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary px-4 font-body text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-white/5 blur-[100px]" />
        </div>

        <div className="relative w-full max-w-md">
          <div className="rounded-[20px] border border-white/10 bg-[#13284f]/95 p-7 shadow-[0_16px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={SITE_IDENTITY.logo.primary}
                  alt={SITE_IDENTITY.name}
                  className="h-full w-full rounded-full object-contain"
                />
              </div>
              <p className="mb-1 font-body text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
                {SITE_IDENTITY.name}
              </p>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-white">
                Admin Login
              </h1>
              <p className="mt-2 font-body text-xs text-white/50">
                Use your admin username and password
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="relative">
                <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-white/35" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-[12px] border border-white/12 bg-primary/60 py-3.5 pl-10 pr-3 font-body text-sm text-white outline-none transition placeholder:text-white/35 focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                  placeholder="Username"
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-white/35" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[12px] border border-white/12 bg-primary/60 py-3.5 pl-10 pr-11 font-body text-sm text-white outline-none transition placeholder:text-white/35 focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-accent"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {error && (
                <div className="rounded-[12px] border border-red-400/30 bg-red-500/10 px-3.5 py-3 font-body text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-[12px] bg-accent py-3.5 font-body text-sm font-bold text-white transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary font-body text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-primary/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white p-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SITE_IDENTITY.logo.primary}
                alt={SITE_IDENTITY.name}
                className="h-full w-full rounded-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-display text-sm font-extrabold tracking-wide text-white">
                Admin Dashboard
              </h1>
              <p className="font-body text-xs text-white/50">{SITE_IDENTITY.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="font-body text-xs text-white/80">{adminUser}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-2 rounded-[12px] border border-white/10 bg-white/5 px-3.5 py-2 font-body text-xs font-semibold text-white/75 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200 disabled:opacity-50"
            >
              <FaSignOutAlt />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
