const hufFormatter = new Intl.NumberFormat("hu-HU", {
  style: "currency",
  currency: "HUF",
  maximumFractionDigits: 0,
});

export function formatHUF(amount: number) {
  return hufFormatter.format(amount);
}

const dateFormatter = new Intl.DateTimeFormat("hu-HU", {
  timeZone: "Europe/Budapest",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatDate(date: Date) {
  return dateFormatter.format(date);
}

const timeFormatter = new Intl.DateTimeFormat("hu-HU", {
  timeZone: "Europe/Budapest",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatTime(date: Date) {
  return timeFormatter.format(date);
}

const dateTimeFormatter = new Intl.DateTimeFormat("hu-HU", {
  timeZone: "Europe/Budapest",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDateTime(date: Date) {
  return dateTimeFormatter.format(date);
}
