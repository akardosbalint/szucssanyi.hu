"use client";

import { useTransition } from "react";

export function DeleteButton({
  action,
  confirmMessage = "Biztosan törlöd?",
}: {
  action: () => unknown;
  confirmMessage?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm(confirmMessage))
          startTransition(async () => {
            await action();
          });
      }}
      className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-60"
    >
      Törlés
    </button>
  );
}
