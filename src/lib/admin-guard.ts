import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/** Csak ADMIN szerepkörnek engedélyezett oldalakhoz — szakember role esetén visszairányít. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (session.user.role !== "ADMIN") redirect("/admin");
  return session;
}

/** Bármelyik bejelentkezett staff (admin vagy szakember) számára engedélyezett oldalakhoz. */
export async function requireStaff() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return session;
}
