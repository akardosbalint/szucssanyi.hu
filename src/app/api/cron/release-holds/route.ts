import { NextResponse } from "next/server";
import { releaseExpiredHolds } from "@/lib/booking";

export const runtime = "nodejs";

/**
 * Élesben egy külső ütemező (pl. Vercel Cron vagy cron-job.org) hívja ezt
 * néhány percenként: Authorization: Bearer <CRON_SECRET>. A lejárt
 * "fizetésre vár" foglalásokat/jelentkezéseket amúgy is lustán felszabadítja
 * minden rendelkezésre állás lekérdezés — ez az endpoint plusz védőháló,
 * ha hosszabb ideig nincs publikus lekérdezés egy adott szakemberre.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: "Jogosulatlan." }, { status: 401 });
  }

  await releaseExpiredHolds();

  return NextResponse.json({ ok: true });
}
