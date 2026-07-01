"use client";

import { signOutAction } from "@/actions/auth";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOutAction()}
      className="mt-2 text-xs font-semibold text-neutral-500 hover:text-primary-700"
    >
      Kijelentkezés
    </button>
  );
}
