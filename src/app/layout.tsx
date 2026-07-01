import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Analytics } from "@/components/layout/Analytics";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://szucssanyi.hu";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Szűcs Sándor | Holisztikus önismereti mentor Budapesten",
    template: "%s | Szűcs Sándor",
  },
  description:
    "Egyéni konzultáció, csoportos családállítás és önismereti kurzusok Budapesten Szűcs Sándorral. Foglalj időpontot online, pár kattintással.",
  openGraph: {
    type: "website",
    locale: "hu_HU",
    siteName: "Szűcs Sándor",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Szűcs Sándor",
  jobTitle: "Holisztikus önismereti mentor",
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Budapest",
    addressCountry: "HU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hu"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
