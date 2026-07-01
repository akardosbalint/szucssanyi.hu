"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { formatHUF } from "@/lib/format";
import { getDummySlotsForDay } from "@/lib/dummy-availability";
import { createDummyBookingAction } from "@/actions/booking-dummy";

type Service = {
  id: string;
  name: string;
  mode: "ONLINE" | "IN_PERSON";
  durationMinutes: number;
  priceHUF: number;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function maxDateKey() {
  const d = new Date();
  d.setDate(d.getDate() + 45);
  return d.toISOString().slice(0, 10);
}

// IDEIGLENES (bemutatási céllal): amíg nincs éles adatbázis/Stripe, ez a
// wizard beépített minta-adatokkal, adatbázis-hívás nélkül működik — lásd
// src/lib/dummy-availability.ts és src/actions/booking-dummy.ts.
export function BookingWizard({
  practitionerSlug,
  services,
  initialServiceId,
  initialErrorMessage,
}: {
  practitionerSlug: string;
  services: Service[];
  initialServiceId?: string;
  initialErrorMessage?: string;
}) {
  const [serviceId, setServiceId] = useState<string | null>(
    initialServiceId ?? (services.length === 1 ? services[0].id : null),
  );
  const [dateKey, setDateKey] = useState<string>("");
  const [slots, setSlots] = useState<string[] | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId) ?? null,
    [serviceId, services],
  );

  function handleServiceSelect(id: string) {
    setServiceId(id);
    setDateKey("");
    setSlots(null);
    setSelectedSlot(null);
  }

  function handleDateChange(value: string) {
    setDateKey(value);
    setSelectedSlot(null);
    if (!value || !serviceId || !selectedService) {
      setSlots(null);
      return;
    }
    setSlots(getDummySlotsForDay(practitionerSlug, selectedService.durationMinutes, value));
  }

  return (
    <div className="space-y-6">
      {initialErrorMessage ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {initialErrorMessage}
        </div>
      ) : null}

      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">1. lépés</p>
        <h2 className="mt-1 font-heading text-lg font-bold text-primary-950">
          Válaszd ki a szolgáltatást
        </h2>
        <div className="mt-4 space-y-2">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => handleServiceSelect(service.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                serviceId === service.id
                  ? "border-primary-500 bg-primary-50"
                  : "border-neutral-200 hover:border-primary-300",
              )}
            >
              <span>
                <span className="font-semibold text-primary-950">{service.name}</span>
                <span className="ml-2 text-neutral-500">
                  {service.mode === "ONLINE" ? "online" : "személyes"}
                </span>
              </span>
              <span className="flex items-center gap-2 font-semibold text-primary-800">
                {formatHUF(service.priceHUF)}
                {serviceId === service.id ? <Check className="h-4 w-4 text-primary-600" /> : null}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {selectedService ? (
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">2. lépés</p>
          <h2 className="mt-1 font-heading text-lg font-bold text-primary-950">
            Válassz napot és időpontot
          </h2>
          <input
            type="date"
            min={todayKey()}
            max={maxDateKey()}
            value={dateKey}
            onChange={(e) => handleDateChange(e.target.value)}
            className="mt-4 rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {dateKey && slots?.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Ezen a napon nincs szabad időpont — próbálj másik dátumot.
              </p>
            ) : null}
            {slots?.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  selectedSlot === slot
                    ? "border-primary-600 bg-primary-600 text-white"
                    : "border-neutral-300 text-primary-800 hover:border-primary-400",
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        </Card>
      ) : null}

      {selectedService && selectedSlot ? (
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">3. lépés</p>
          <h2 className="mt-1 font-heading text-lg font-bold text-primary-950">Add meg az adataid</h2>
          <form action={createDummyBookingAction} className="mt-4 space-y-3">
            <input type="hidden" name="practitionerSlug" value={practitionerSlug} />
            <input type="hidden" name="serviceId" value={selectedService.id} />
            <input type="hidden" name="startTime" value={`${dateKey} ${selectedSlot}`} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                name="customerName"
                required
                placeholder="Teljes neved"
                className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
              <input
                type="tel"
                name="customerPhone"
                required
                placeholder="Telefonszám"
                className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
            <input
              type="email"
              name="customerEmail"
              required
              placeholder="E-mail cím"
              className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            <p className="text-xs text-neutral-500">
              Az időpontot {formatHUF(selectedService.priceHUF)} áron véglegesítjük — a
              foglalás elküldése után e-mailben visszaigazoljuk.
            </p>
            <button
              type="submit"
              className="w-full rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
            >
              Foglalás véglegesítése
            </button>
          </form>
        </Card>
      ) : null}
    </div>
  );
}
