import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/payment/"],
    },
    sitemap: "https://hair-genie-wine.vercel.app/sitemap.xml",
  };
}
