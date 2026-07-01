"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Külső rendszer (localStorage) szinkronizálása kirendereléskor — nem
    // props/state-ből származtatott állapot, ezért indokolt az effektben.
    if (!window.localStorage.getItem(STORAGE_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  function respond(value: "accepted" | "declined") {
    window.localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-neutral-600">
          Sütiket használunk az oldal működéséhez és a látogatottság méréséhez.{" "}
          <a href="/adatvedelem" className="underline underline-offset-2">
            Bővebben az adatvédelmi tájékoztatóban.
          </a>
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="md" onClick={() => respond("declined")}>
            Csak a szükséges
          </Button>
          <Button variant="primary" size="md" onClick={() => respond("accepted")}>
            Rendben
          </Button>
        </div>
      </div>
    </div>
  );
}
