import Link from "next/link";
import { FacebookIcon, InstagramIcon, TikTokIcon, YoutubeIcon } from "@/components/ui/SocialIcons";

const SOCIAL_LINKS = [
  { href: process.env.NEXT_PUBLIC_FACEBOOK_URL || "#", label: "Facebook", Icon: FacebookIcon },
  { href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#", label: "Instagram", Icon: InstagramIcon },
  { href: process.env.NEXT_PUBLIC_TIKTOK_URL || "#", label: "TikTok", Icon: TikTokIcon },
  { href: process.env.NEXT_PUBLIC_YOUTUBE_URL || "#", label: "YouTube", Icon: YoutubeIcon },
];

const COLUMNS = [
  {
    title: "Szolgáltatások",
    links: [
      { href: "/konzultacio", label: "Konzultáció" },
      { href: "/csoportos-csaladallitas", label: "Csoportos családállítás" },
      { href: "/kurzusok", label: "Kurzusok" },
      { href: "/ingyenes-meditacio", label: "Ingyenes meditáció" },
    ],
  },
  {
    title: "Rólam",
    links: [
      { href: "/rolam", label: "Rólam" },
      { href: "/kapcsolat", label: "Kapcsolat" },
    ],
  },
  {
    title: "Jogi",
    links: [
      { href: "/aszf", label: "Általános Szerződési Feltételek" },
      { href: "/adatvedelem", label: "Adatvédelmi tájékoztató" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-primary-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2">
            <p className="font-heading text-lg font-bold">Szűcs Sándor</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-primary-200">
              Holisztikus önismereti mentor Budapesten. Egyéni konzultáció,
              csoportos családállítás és önismereti kurzusok azoknak, akik
              készen állnak a változásra.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-white">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-200 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-primary-300">
          © {new Date().getFullYear()} Szűcs Sándor. Minden jog fenntartva. Budapest.
        </div>
      </div>
    </footer>
  );
}
