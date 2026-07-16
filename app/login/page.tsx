"use client";
import { useActionState } from "react";
import Image from "next/image";
import { loginAction, type LoginState } from "@/lib/auth-actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="Società Dante Alighieri · Hong Kong" width={220} height={64} className="h-12 w-auto" priority />
        </div>

        <div className="frame bg-white p-7 md:p-8">
          <h1 className="text-2xl font-heading font-bold">Staff sign in</h1>
          <p className="mt-1 text-sm text-ink-muted">Access your dashboard and leave.</p>

          <form action={action} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">Email
              <input name="email" type="email" autoComplete="email" required className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
            </label>
            <label className="block text-sm font-medium">Password
              <input name="password" type="password" autoComplete="current-password" required className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
            </label>

            {state.error && (
              <p className="text-sm text-rosso bg-rosso/10 rounded-lg px-3 py-2">{state.error}</p>
            )}

            <button type="submit" disabled={pending} className="btn btn-primary w-full h-12 disabled:opacity-50">
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-ink-muted">Forgotten your password? Ask Giulia or Bill to reset it.</p>
      </div>
    </main>
  );
}
