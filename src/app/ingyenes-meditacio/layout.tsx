import Link from "next/link";
import { CookieConsent } from "@/components/layout/CookieConsent";

export default function FreeMeditationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-neutral-200 bg-white py-5">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/" className="font-heading text-lg font-bold text-primary-950">
            Szűcs Sándor
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-neutral-200 bg-neutral-50 py-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 px-6 text-center text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Szűcs Sándor. Minden jog fenntartva.</p>
          <div className="flex gap-4">
            <Link href="/aszf" className="underline underline-offset-2">
              ÁSZF
            </Link>
            <Link href="/adatvedelem" className="underline underline-offset-2">
              Adatvédelmi tájékoztató
            </Link>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </>
  );
}
