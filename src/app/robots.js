import { getSeoSettings } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export default async function robots() {
  const baseUrl = 'https://soundnest.in';

  try {
    const settings = await getSeoSettings();
    // In future or advanced customization, rules can be parsed from settings.robotsTxt
    // Default standard production rules
  } catch (err) {
    console.error('Robots configuration error:', err);
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
