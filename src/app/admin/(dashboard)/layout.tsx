import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { SignOutButton } from "@/components/admin/SignOutButton";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="hidden w-64 shrink-0 border-r border-neutral-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-neutral-200 px-6 py-5">
          <Link href="/admin" className="font-heading text-lg font-bold text-primary-950">
            Szűcs Sándor
          </Link>
          <p className="text-xs text-neutral-500">Admin felület</p>
        </div>
        <AdminNav role={session.user.role} />
        <div className="mt-auto border-t border-neutral-200 px-6 py-4">
          <p className="truncate text-xs text-neutral-500">{session.user.email}</p>
          <SignOutButton />
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 lg:hidden">
          <Link href="/admin" className="font-heading text-lg font-bold text-primary-950">
            Szűcs Sándor admin
          </Link>
          <SignOutButton />
        </header>
        <div className="border-b border-neutral-200 bg-white px-6 py-3 lg:hidden">
          <AdminNav role={session.user.role} horizontal />
        </div>
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
