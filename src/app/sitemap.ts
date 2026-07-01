import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://szucssanyi.hu";

const STATIC_ROUTES = [
  "",
  "/rolam",
  "/konzultacio",
  "/csoportos-csaladallitas",
  "/kurzusok",
  "/ingyenes-meditacio",
  "/kapcsolat",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await prisma.course.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
  });

  return [
    ...STATIC_ROUTES.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
    })),
    ...courses.map((course) => ({
      url: `${siteUrl}/kurzusok/${course.slug}`,
      lastModified: course.updatedAt,
    })),
  ];
}
