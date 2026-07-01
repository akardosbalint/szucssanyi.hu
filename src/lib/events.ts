import { prisma } from "@/lib/prisma";
import { releaseExpiredHolds } from "@/lib/booking";

export async function getEventSpotsLeft(eventId: string) {
  await releaseExpiredHolds();

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      _count: {
        select: { registrations: { where: { status: { in: ["PENDING_PAYMENT", "CONFIRMED"] } } } },
      },
    },
  });

  if (!event) return 0;
  return event.capacity - event._count.registrations;
}
