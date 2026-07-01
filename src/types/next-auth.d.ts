import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "ADMIN" | "PRACTITIONER";
    practitionerId: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "PRACTITIONER";
      practitionerId: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "PRACTITIONER";
    practitionerId?: string | null;
  }
}
