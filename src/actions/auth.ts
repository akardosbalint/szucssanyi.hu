"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";

export async function authenticateAction(_prevState: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: (formData.get("callbackUrl") as string) || "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Hibás e-mail cím vagy jelszó.";
    }
    throw error;
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
