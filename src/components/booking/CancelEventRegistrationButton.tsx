"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { cancelEventRegistrationAction } from "@/actions/events";

export function CancelEventRegistrationButton({ manageToken }: { manageToken: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [confirming, setConfirming] = useState(false);

  if (result) {
    return (
      <p className={result.ok ? "text-sm text-primary-700" : "text-sm text-red-600"}>
        {result.message}
      </p>
    );
  }

  if (!confirming) {
    return (
      <Button variant="outline" onClick={() => setConfirming(true)}>
        Lemondom a jelentkezésem
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <p className="text-sm text-neutral-600">Biztosan lemondod?</p>
      <Button
        variant="primary"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => setResult(await cancelEventRegistrationAction(manageToken)))
        }
      >
        Igen, lemondom
      </Button>
      <Button variant="ghost" onClick={() => setConfirming(false)}>
        Mégse
      </Button>
    </div>
  );
}
