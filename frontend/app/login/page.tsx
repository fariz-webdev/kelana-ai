"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/services/authService";
import { AuroraBackground } from "@/components/velora/aurora-background";
import { ShimmerButton } from "@/components/velora/shimmer-button";
import { BlurFade } from "@/components/velora/blur-fade";
import { AnimatedGradientText } from "@/components/velora/animated-gradient-text";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validate(form: FormState, mode: Mode): FieldErrors {
  const errors: FieldErrors = {};
  if (mode === "register") {
    if (!form.name.trim()) errors.name = "Name is required.";
    else if (form.name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
  }
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email address.";
  if (!form.password) errors.password = "Password is required.";
  else if (form.password.length < 8) errors.password = "Password must be at least 8 characters.";
  if (mode === "register") {
    if (!form.confirmPassword) errors.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) errors.confirmPassword = "Passwords do not match.";
  }
  return errors;
}

/* ── small inline input field ─────────────────────────────────────── */
function AuthField({
  id,
  label,
  icon,
  error,
  children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "flex flex-col gap-1 rounded-2xl px-4 py-3",
          "bg-[var(--surface-1)] border transition-all duration-200",
          "focus-within:border-[var(--brand-via)]/60 focus-within:bg-[var(--surface-2)]",
          error ? "border-red-500/50" : "border-[var(--border)]"
        )}
      >
        <label
          htmlFor={id}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--brand-via)]"
        >
          <span className="text-[var(--brand-via)]">{icon}</span>
          {label}
        </label>
        {children}
      </div>
      {error && <p className="text-xs text-red-400 px-1">{error}</p>}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState<FormState>({
    name: "", email: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [fieldErrors,  setFieldErrors]  = useState<FieldErrors>({});
  const [serverError,  setServerError]  = useState<string | null>(null);
  const [pending,      setPending]      = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setFieldErrors({});
    setServerError(null);
    setShowPassword(false);
    setShowConfirm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    const errors = validate(form, mode);
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }

    setPending(true);
    try {
      if (mode === "login") {
        const { access_token } = await login(form.email, form.password);
        localStorage.setItem("access_token", access_token);
      } else {
        await register(form.name, form.email, form.password);
        const { access_token } = await login(form.email, form.password);
        localStorage.setItem("access_token", access_token);
      }
      router.push("/trips");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  const inputCls = "w-full bg-transparent text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none";

  return (
    <main className="relative min-h-screen bg-[var(--background)] flex items-center justify-center px-4 py-16 overflow-hidden">
      <AuroraBackground intensity="medium" />

      {/* noise overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <BlurFade delay={0.05} className="relative z-10 w-full max-w-md">
        {/* Glass card */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl shadow-2xl shadow-black/50 px-6 sm:px-8 py-8">

          {/* Header */}
          <div className="mb-7 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-[var(--brand-from)]/40 bg-[var(--brand-from)]/10 text-[var(--brand-to)] uppercase tracking-widest mb-4">
              ✦ KelanaAI
            </div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] leading-tight">
              {mode === "login" ? (
                <>Your next adventure{" "}
                  <AnimatedGradientText>awaits.</AnimatedGradientText>
                </>
              ) : (
                <>The world is yours to{" "}
                  <AnimatedGradientText>explore.</AnimatedGradientText>
                </>
              )}
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1.5">
              {mode === "login"
                ? "Sign in and pick up where you left off."
                : "Create an account to start planning."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">

            {/* Name — register only */}
            {mode === "register" && (
              <AuthField id="name" label="Name" icon={<User className="w-3.5 h-3.5" />} error={fieldErrors.name}>
                <input
                  id="name" name="name" type="text"
                  placeholder="e.g. Jane Doe"
                  value={form.name} onChange={handleChange}
                  autoComplete="name"
                  className={inputCls}
                />
              </AuthField>
            )}

            {/* Email */}
            <AuthField id="email" label="Email" icon={<Mail className="w-3.5 h-3.5" />} error={fieldErrors.email}>
              <input
                id="email" name="email" type="email"
                placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                autoComplete="email"
                className={inputCls}
              />
            </AuthField>

            {/* Password */}
            <AuthField id="password" label="Password" icon={<Lock className="w-3.5 h-3.5" />} error={fieldErrors.password}>
              <div className="flex items-center gap-2">
                <input
                  id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password} onChange={handleChange}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className={cn(inputCls, "flex-1")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </AuthField>

            {/* Confirm password — register only */}
            {mode === "register" && (
              <AuthField id="confirmPassword" label="Confirm Password" icon={<Lock className="w-3.5 h-3.5" />} error={fieldErrors.confirmPassword}>
                <div className="flex items-center gap-2">
                  <input
                    id="confirmPassword" name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={form.confirmPassword} onChange={handleChange}
                    autoComplete="new-password"
                    className={cn(inputCls, "flex-1")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                    className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                  >
                    {showConfirm
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </AuthField>
            )}

            {/* Server error */}
            {serverError && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                {serverError}
              </div>
            )}

            {/* Submit */}
            <ShimmerButton
              type="submit"
              disabled={pending}
              className="mt-1 w-full py-3.5 rounded-2xl text-sm"
            >
              {pending
                ? <><Loader2 className="w-4 h-4 animate-spin" />{mode === "login" ? "Signing in…" : "Creating account…"}</>
                : mode === "login" ? "Sign In" : "Create Account"}
            </ShimmerButton>

            {/* Toggle mode */}
            <p className="text-center text-sm text-[var(--muted-foreground)] mt-1">
              {mode === "login" ? (
                <>Don&apos;t have an account?{" "}
                  <button type="button" onClick={() => switchMode("register")}
                    className="text-[var(--primary)] font-medium hover:underline">
                    Register
                  </button>
                </>
              ) : (
                <>Already have an account?{" "}
                  <button type="button" onClick={() => switchMode("login")}
                    className="text-[var(--primary)] font-medium hover:underline">
                    Sign In
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </BlurFade>
    </main>
  );
}
