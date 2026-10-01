import { getDb } from '@/lib/mongodb';

const DEFAULT_SEO_SETTINGS = {
  robotsTxt: `# Robots.txt for Soundnest
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/

Sitemap: https://soundnest.in/sitemap.xml
`,
  sitemapSettings: {
    defaultChangefreq: 'weekly',
    defaultPriority: 0.8,
    extraUrls: [],
  },
  metaOverrides: [
    {
      path: '/',
      title: 'Best Home Automation Companies in India - Soundnest',
      description: 'Looking for the best home automation companies in India? Soundnest offers top smart home solutions, building automation, and home cinema design.',
      canonical: 'https://soundnest.in/',
    },
    {
      path: '/contact-us/',
      title: 'Contact Us - Soundnest',
      description: 'Have a project in mind or need assistance? Reach out to Soundnest today. Contact our expert team for smart home and automation solutions.',
      canonical: 'https://soundnest.in/contact-us/',
    },
    {
      path: '/blog/',
      title: 'Blogs - Soundnest',
      description: 'Explore the latest insights, smart home tips, KNX automation guides, and home theater trends from the Soundnest engineering team.',
      canonical: 'https://soundnest.in/blog/',
    },
  ],
  customSchemas: [
    {
      id: 'global-localbusiness',
      path: '*',
      schemaType: 'LocalBusiness',
      name: 'Global Soundnest LocalBusiness Schema',
      jsonLd: JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Soundnest',
          image: 'https://soundnest.in/wp-content/uploads/2025/12/logo-1.png',
          telephone: '+91-9049295678',
          email: 'sales@soundnest.in',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Q 24, Block Q, Lajpat Nagar IV',
            addressLocality: 'New Delhi',
            addressRegion: 'Delhi',
            postalCode: '110024',
            addressCountry: 'IN',
          },
          url: 'https://soundnest.in/',
        },
        null,
        2
      ),
      isActive: true,
    },
  ],
  scripts: {
    headerScripts: '',
    footerScripts: '',
    googleAnalyticsId: '',
    gtmId: '',
  },
};

/**
 * Fetch SEO settings from MongoDB Atlas collection 'seo_settings'
 */
export async function getSeoSettings() {
  try {
    const db = await getDb();
    if (!db) return DEFAULT_SEO_SETTINGS;

    const doc = await db.collection('seo_settings').findOne({ key: 'main_seo_config' });
    if (!doc) {
      // Seed default settings on first run
      await db.collection('seo_settings').insertOne({
        key: 'main_seo_config',
        ...DEFAULT_SEO_SETTINGS,
        updatedAt: new Date(),
      });
      return DEFAULT_SEO_SETTINGS;
    }

    return doc;
  } catch (err) {
    console.error('Error fetching SEO settings:', err.message);
    return DEFAULT_SEO_SETTINGS;
  }
}

/**
 * Fetch meta override for a specific path if configured
 */
export async function getPathMetaOverride(pathname) {
  if (!pathname) return null;
  const cleanPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const settings = await getSeoSettings();
  return settings.metaOverrides?.find((m) => m.path === cleanPath) || null;
}

/**
 * Fetch custom JSON-LD schemas for a specific path
 */
export async function getPathSchemas(pathname) {
  const cleanPath = pathname?.endsWith('/') ? pathname : `${pathname}/`;
  const settings = await getSeoSettings();
  return (
    settings.customSchemas?.filter(
      (s) => s.isActive && (s.path === '*' || s.path === cleanPath || s.path === pathname)
    ) || []
  );
}
