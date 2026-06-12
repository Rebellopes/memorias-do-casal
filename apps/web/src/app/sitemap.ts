import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/historia`, lastModified: new Date() },
    { url: `${baseUrl}/sobre`, lastModified: new Date() },
    { url: `${baseUrl}/galeria`, lastModified: new Date() },
    { url: `${baseUrl}/musica`, lastModified: new Date() },
    { url: `${baseUrl}/dedicatorias`, lastModified: new Date() },
  ];
}
