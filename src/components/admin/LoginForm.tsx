"use client";

import { useActionState } from "react";
import { authenticateAction } from "@/actions/auth";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [errorMessage, formAction, isPending] = useActionState(authenticateAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">E-mail cím</label>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Jelszó</label>
        <input
          type="password"
          name="password"
          required
          className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800 disabled:opacity-60"
      >
        {isPending ? "Bejelentkezés..." : "Bejelentkezés"}
      </button>
    </form>
  );
}
