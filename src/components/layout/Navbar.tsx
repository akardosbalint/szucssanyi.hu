"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/", label: "Kezdőoldal" },
  { href: "/rolam", label: "Rólam" },
  { href: "/konzultacio", label: "Konzultáció" },
  { href: "/csoportos-csaladallitas", label: "Csoportos családállítás" },
  { href: "/kurzusok", label: "Kurzusok" },
  { href: "/ingyenes-meditacio", label: "Ingyenes meditáció" },
  { href: "/kapcsolat", label: "Kapcsolat" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="font-heading text-lg font-bold text-primary-950">
          Szűcs Sándor
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-primary-700"
                    : "text-neutral-600 hover:text-primary-700",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Button href="/konzultacio" size="md">
            Foglalj konzultációt
          </Button>
        </div>

        <button
          type="button"
          className="-mr-2 p-2 lg:hidden"
          aria-label={open ? "Menü bezárása" : "Menü megnyitása"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-neutral-200 bg-white px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-primary-50 hover:text-primary-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button href="/konzultacio" className="mt-4 w-full" onClick={() => setOpen(false)}>
            Foglalj konzultációt
          </Button>
        </div>
      ) : null}
    </header>
  );
}
