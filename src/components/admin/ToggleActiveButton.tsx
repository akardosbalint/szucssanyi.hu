"use client";

import { useTransition } from "react";
import { cn } from "@/lib/cn";

export function ToggleActiveButton({
  active,
  action,
}: {
  active: boolean;
  action: () => Promise<void> | void;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => action())}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
        active ? "bg-primary-100 text-primary-700" : "bg-neutral-100 text-neutral-500",
      )}
    >
      {active ? "Aktív" : "Inaktív"}
    </button>
  );
}
