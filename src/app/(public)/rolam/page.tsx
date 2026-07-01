import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PersonAvatar } from "@/components/ui/PersonAvatar";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon,
} from "@/components/ui/SocialIcons";

export const metadata: Metadata = {
  title: "Rólam",
  description:
    "Ismerd meg Szűcs Sándort, holisztikus önismereti mentort — a történetét, a módszertanát és azt, miért csinálja ezt a munkát.",
};

const CREDENTIALS = [
  { value: "2000+", label: "egyéni ülés" },
  { value: "3", label: "önismereti kurzus" },
  { value: "Budapest", label: "online és személyes ülések" },
];

const SOCIAL_LINKS = [
  { href: process.env.NEXT_PUBLIC_FACEBOOK_URL || "#", label: "Facebook", Icon: FacebookIcon },
  { href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#", label: "Instagram", Icon: InstagramIcon },
  { href: process.env.NEXT_PUBLIC_TIKTOK_URL || "#", label: "TikTok", Icon: TikTokIcon },
  { href: process.env.NEXT_PUBLIC_YOUTUBE_URL || "#", label: "YouTube", Icon: YoutubeIcon },
];

export default function AboutPage() {
  return (
    <>
      <Section variant="dark" className="pb-16 pt-20 sm:pt-28">
        <Badge className="bg-white/10 text-white">Rólam</Badge>
        <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-center">
          <PersonAvatar name="Szűcs Sándor" size={96} className="text-2xl" />
          <div>
            <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
              Szűcs Sándor vagyok, holisztikus önismereti mentor.
            </h1>
            <p className="mt-3 max-w-xl text-primary-200">
              Budapesten dolgozom, online és személyes ülésekkel — azzal a
              céllal, hogy tisztábban láss magadra, és nyugodtabban hozd meg a
              döntéseidet.
            </p>
          </div>
        </div>
      </Section>

      <Section variant="light" narrow>
        <div className="space-y-6 text-lg leading-relaxed text-neutral-700">
          <p>
            Nem véletlenül csinálom ezt a munkát. Én magam is végigjártam azt
            az utat, amin most sok ügyfelem jár: a szorongást, az ismétlődő
            párkapcsolati mintákat, azt az érzést, hogy valami nem stimmel, de
            nem tudom pontosan, mi. A saját önismereti munkám adta meg a
            nyelvet és az eszközöket ahhoz, hogy másoknak is segíthessek
            ugyanezen keresztülmenni — gyorsabban, mint ahogy én tettem.
          </p>
          <p>
            Nem terapeutaként dolgozom, hanem kísérőként: nem adok kész
            válaszokat, hanem olyan kérdéseket és gyakorlatokat, amik
            segítenek magadtól rátalálni arra, ami neked most a legtöbbet
            segít. A módszertanom a családállítás, a szomatikus (test-alapú)
            munka és a strukturált önismereti beszélgetés ötvözete —
            attól függően alakítom, hogy mi hozott el hozzám.
          </p>
          <p>
            Fontos számomra, hogy amit csinálok, az mérhető és valós legyen —
            nem ígérek gyors megoldást, de azt igen, hogy komolyan veszlek, és
            együtt megtaláljuk, mi az, ami most téged visszahúz.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-4">
          {CREDENTIALS.map((item) => (
            <Card key={item.label} className="text-center">
              <p className="font-heading text-2xl font-bold text-primary-700 sm:text-3xl">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-neutral-500 sm:text-sm">{item.label}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section variant="muted" narrow className="text-center">
        <h2 className="font-heading text-2xl font-bold text-primary-950">
          Kövess a közösségi médiában
        </h2>
        <p className="mt-2 text-neutral-600">
          Rendszeresen osztok meg gondolatokat és rövid gyakorlatokat.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          {SOCIAL_LINKS.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary-700 shadow-sm shadow-neutral-900/5 transition-colors hover:bg-primary-50"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </Section>

      <Section variant="dark" className="text-center">
        <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
          Beszéljünk arról, mi visz most téged előre.
        </h2>
        <Button href="/konzultacio" size="lg" className="mt-6">
          Foglalj konzultációt
        </Button>
      </Section>
    </>
  );
}
