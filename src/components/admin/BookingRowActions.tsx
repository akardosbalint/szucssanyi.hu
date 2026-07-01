"use client";

import { useTransition } from "react";
import { adminCancelBookingAction, adminMarkBookingCompletedAction } from "@/actions/admin/bookings";

export function BookingRowActions({ bookingId, status }: { bookingId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  if (status !== "CONFIRMED") return null;

  return (
    <div className="flex gap-3">
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await adminMarkBookingCompletedAction(bookingId);
          })
        }
        className="text-xs font-semibold text-primary-700 hover:underline"
      >
        Lezajlott
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirm("Biztosan lemondod ezt a foglalást?")) {
            startTransition(async () => {
              await adminCancelBookingAction(bookingId);
            });
          }
        }}
        className="text-xs font-semibold text-red-600 hover:underline"
      >
        Lemondás
      </button>
    </div>
  );
}
