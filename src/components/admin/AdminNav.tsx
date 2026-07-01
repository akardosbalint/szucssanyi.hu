"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/admin", label: "Áttekintés", roles: ["ADMIN", "PRACTITIONER"] },
  { href: "/admin/foglalasok", label: "Foglalások", roles: ["ADMIN", "PRACTITIONER"] },
  { href: "/admin/esemenyek", label: "Csoportos családállítás", roles: ["ADMIN"] },
  { href: "/admin/szakemberek", label: "Szakemberek", roles: ["ADMIN"] },
  { href: "/admin/kurzusok", label: "Kurzusok", roles: ["ADMIN"] },
  { href: "/admin/fizetesek", label: "Fizetések", roles: ["ADMIN"] },
  { href: "/admin/ugyfelek", label: "Ügyfelek", roles: ["ADMIN"] },
];

export function AdminNav({
  role,
  horizontal = false,
}: {
  role: "ADMIN" | "PRACTITIONER";
  horizontal?: boolean;
}) {
  const pathname = usePathname();
  const links = LINKS.filter((link) => link.roles.includes(role));

  return (
    <nav className={cn(horizontal ? "flex flex-wrap gap-1" : "flex flex-1 flex-col gap-1 p-4")}>
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-primary-100 text-primary-800" : "text-neutral-600 hover:bg-neutral-100",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
