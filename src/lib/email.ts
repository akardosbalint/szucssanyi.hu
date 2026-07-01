import nodemailer from "nodemailer";

export function isEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!isEmailConfigured()) {
    throw new Error("SMTP nincs beállítva — lásd .env.example. Élesítés előtt pótlandó.");
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });
  }
  return transporter;
}

const FROM = () => process.env.SMTP_FROM || "Szűcs Sándor <no-reply@szucssanyi.hu>";

/**
 * Minden tranzakciós e-mail ezen keresztül megy — ha nincs SMTP beállítva
 * (fejlesztői környezet, vagy élesítés előtt), csendben kihagyjuk a
 * küldést ahelyett, hogy hibát dobnánk. A foglalás/vásárlás így is
 * létrejön, csak az értesítés marad el.
 */
async function sendMail(options: { to: string; subject: string; html: string }) {
  if (!isEmailConfigured()) {
    console.warn(`[email] SMTP nincs beállítva, kihagyott e-mail: "${options.subject}" -> ${options.to}`);
    return;
  }
  const mailer = getTransporter();
  await mailer.sendMail({ from: FROM(), to: options.to, subject: options.subject, html: options.html });
}

function layout(title: string, bodyHtml: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1c2530;">
      <h1 style="font-size: 20px; color: #26333f;">${title}</h1>
      ${bodyHtml}
      <p style="margin-top: 32px; font-size: 13px; color: #7a7364;">Szűcs Sándor — szucssanyi.hu</p>
    </div>
  `;
}

export async function sendBookingConfirmationEmail(params: {
  customerEmail: string;
  customerName: string;
  practitionerName: string;
  serviceName: string;
  startTimeFormatted: string;
  manageUrl: string;
}) {
  await sendMail({
    to: params.customerEmail,
    subject: "Visszaigazolt időpont — Szűcs Sándor",
    html: layout(
      "Visszaigazoltuk az időpontod!",
      `<p>Szia ${params.customerName}!</p>
       <p><strong>${params.serviceName}</strong> — ${params.practitionerName}<br/>
       Időpont: <strong>${params.startTimeFormatted}</strong></p>
       <p>Ha módosítanod vagy lemondanod kell, itt teheted meg (legalább 24 órával
       az időpont előtt): <a href="${params.manageUrl}">${params.manageUrl}</a></p>`,
    ),
  });
}

export async function sendPractitionerNewBookingEmail(params: {
  practitionerEmail: string;
  customerName: string;
  serviceName: string;
  startTimeFormatted: string;
}) {
  await sendMail({
    to: params.practitionerEmail,
    subject: "Új visszaigazolt foglalás",
    html: layout(
      "Új foglalásod van",
      `<p>${params.customerName} lefoglalta: <strong>${params.serviceName}</strong></p>
       <p>Időpont: <strong>${params.startTimeFormatted}</strong></p>`,
    ),
  });
}

export async function sendBookingCancellationEmail(params: {
  customerEmail: string;
  customerName: string;
  serviceName: string;
  startTimeFormatted: string;
}) {
  await sendMail({
    to: params.customerEmail,
    subject: "Lemondott időpont — Szűcs Sándor",
    html: layout(
      "Lemondtad az időpontod",
      `<p>Szia ${params.customerName}!</p>
       <p>Megerősítjük, hogy a következő időpontot lemondtad: <strong>${params.serviceName}</strong>,
       ${params.startTimeFormatted}.</p>
       <p>Ha szeretnél másik időpontot foglalni, keresd fel újra a foglalási oldalt.</p>`,
    ),
  });
}

export async function sendEventRegistrationConfirmationEmail(params: {
  customerEmail: string;
  customerName: string;
  eventTitle: string;
  startTimeFormatted: string;
  location: string;
  manageUrl: string;
}) {
  await sendMail({
    to: params.customerEmail,
    subject: "Visszaigazolt jelentkezés — Szűcs Sándor",
    html: layout(
      "Visszaigazoltuk a jelentkezésed!",
      `<p>Szia ${params.customerName}!</p>
       <p><strong>${params.eventTitle}</strong><br/>
       Időpont: <strong>${params.startTimeFormatted}</strong><br/>
       Helyszín: ${params.location}</p>
       <p>Ha módosítanod vagy lemondanod kell: <a href="${params.manageUrl}">${params.manageUrl}</a></p>`,
    ),
  });
}

export async function sendEventRegistrationCancellationEmail(params: {
  customerEmail: string;
  customerName: string;
  eventTitle: string;
  startTimeFormatted: string;
}) {
  await sendMail({
    to: params.customerEmail,
    subject: "Lemondott jelentkezés — Szűcs Sándor",
    html: layout(
      "Lemondtad a jelentkezésed",
      `<p>Szia ${params.customerName}!</p>
       <p>Megerősítjük, hogy a következő eseményre szóló jelentkezésedet
       lemondtad: <strong>${params.eventTitle}</strong>, ${params.startTimeFormatted}.</p>`,
    ),
  });
}

export async function sendCoursePurchaseEmail(params: {
  customerEmail: string;
  customerName: string;
  courseTitle: string;
  accessUrl: string;
}) {
  await sendMail({
    to: params.customerEmail,
    subject: `Hozzáférésed a(z) "${params.courseTitle}" kurzushoz`,
    html: layout(
      "Sikeres vásárlás!",
      `<p>Szia ${params.customerName}!</p>
       <p>Örökös hozzáférésed van a(z) <strong>${params.courseTitle}</strong> kurzushoz.</p>
       <p><a href="${params.accessUrl}">${params.accessUrl}</a></p>`,
    ),
  });
}

export async function sendBookingReminderEmail(params: {
  customerEmail: string;
  customerName: string;
  practitionerName: string;
  serviceName: string;
  startTimeFormatted: string;
}) {
  await sendMail({
    to: params.customerEmail,
    subject: "Emlékeztető — holnapi időpontod",
    html: layout(
      "Emlékeztető a holnapi időpontodra",
      `<p>Szia ${params.customerName}!</p>
       <p>Emlékeztetőül: holnap <strong>${params.startTimeFormatted}</strong>-kor
       találkozunk — ${params.serviceName}, ${params.practitionerName}.</p>`,
    ),
  });
}
