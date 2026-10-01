import { getDb } from '@/lib/mongodb';
import { servicesData } from '@/data/servicesData';
import { blogPosts } from '@/data/blogData';
import { getSeoSettings } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const baseUrl = 'https://soundnest.in';

  // 1. Core Static Pages
  const staticRoutes = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact-us/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // 2. Fetch all services (MongoDB Atlas + Fallback)
  let services = servicesData;
  let posts = blogPosts;
  let extraUrls = [];

  try {
    const db = await getDb();
    if (db) {
      const dbServices = await db.collection('services').find({}).toArray();
      if (dbServices.length > 0) services = dbServices;

      const dbPosts = await db.collection('posts').find({}).toArray();
      if (dbPosts.length > 0) posts = dbPosts;
    }

    const settings = await getSeoSettings();
    if (settings?.sitemapSettings?.extraUrls) {
      extraUrls = settings.sitemapSettings.extraUrls;
    }
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
  }

  const serviceRoutes = services.map((s) => ({
    url: `${baseUrl}/${s.slug}/`,
    lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const postRoutes = posts.map((p) => ({
    url: `${baseUrl}/${p.slug}/`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(p.date || Date.now()),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const customRoutes = extraUrls.map((item) => ({
    url: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    lastModified: new Date(),
    changeFrequency: item.changefreq || 'weekly',
    priority: parseFloat(item.priority) || 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes, ...postRoutes, ...customRoutes];
}
