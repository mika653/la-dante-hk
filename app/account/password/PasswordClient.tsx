"use client";
import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { changePasswordAction, type PasswordState } from "@/lib/account-actions";

export default function PasswordClient({ name, email }: { name: string; email: string }) {
  const [state, action, pending] = useActionState<PasswordState, FormData>(changePasswordAction, {});

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="Società Dante Alighieri · Hong Kong" width={220} height={64} className="h-12 w-auto" priority />
        </div>

        <div className="frame bg-white p-7 md:p-8">
          <h1 className="text-2xl font-heading font-bold inline-flex items-center gap-2">
            <KeyRound size={20} /> Change password
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Signed in as <b className="text-ink">{name}</b> · {email}
          </p>

          <form action={action} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">Current password
              <input name="current" type="password" autoComplete="current-password" required
                className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
            </label>
            <label className="block text-sm font-medium">New password
              <input name="next" type="password" autoComplete="new-password" required minLength={10}
                className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
              <span className="mt-1 block text-xs text-ink-muted font-normal">At least 10 characters.</span>
            </label>
            <label className="block text-sm font-medium">Confirm new password
              <input name="confirm" type="password" autoComplete="new-password" required minLength={10}
                className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" />
            </label>

            {state.error && <p className="text-sm text-rosso bg-rosso/10 rounded-lg px-3 py-2">{state.error}</p>}
            {state.ok && <p className="text-sm text-green-800 bg-green-100 rounded-lg px-3 py-2">{state.ok}</p>}

            <button type="submit" disabled={pending} className="btn btn-primary w-full h-12 disabled:opacity-50">
              {pending ? "Saving…" : "Change password"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm">
          <Link href="/leave" className="text-ink-muted hover:text-ink inline-flex items-center gap-1.5">
            <ArrowLeft size={14} /> Back to staff leave
          </Link>
        </p>
      </div>
    </main>
  );
}
