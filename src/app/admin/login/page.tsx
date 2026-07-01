import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin bejelentkezés",
  robots: { index: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="font-heading text-xl font-bold text-primary-950">Admin bejelentkezés</h1>
        <p className="mt-1 text-sm text-neutral-500">Szűcs Sándor — belső felület</p>
        <div className="mt-6">
          <LoginForm callbackUrl={callbackUrl || "/admin"} />
        </div>
      </div>
    </div>
  );
}
