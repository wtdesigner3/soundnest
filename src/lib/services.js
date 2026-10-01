import { getServiceBySlug as getStaticServiceBySlug } from '@/data/servicesData';
import { getDb } from '@/lib/mongodb';

/**
 * Hybrid Service Resolver
 * 1. Checks hardcoded static services first (lightning fast, pre-rendered)
 * 2. If not found, falls back to querying MongoDB Atlas collection 'services'
 *    This allows new services created in Phase 3 Admin CMS to resolve immediately!
 */
export async function getServiceBySlug(slug) {
  if (!slug) return null;
  const cleanSlug = slug.replace(/^\/+|\/+$/g, '');

  const staticFallback = getStaticServiceBySlug(cleanSlug);

  // 1. Dynamic MongoDB Atlas check first (so Admin CMS updates reflect immediately!)
  try {
    const db = await getDb();
    if (db) {
      const service = await db.collection('services').findOne({ slug: cleanSlug });
      if (service) {
        // Remove MongoDB _id to prevent Next.js serialization issues
        const { _id, ...rest } = service;
        // Merge with staticFallback to guarantee all default properties exist
        return {
          ...(staticFallback || {}),
          ...rest,
        };
      }
    }
  } catch (err) {
    console.error(`Error querying dynamic service for slug "${cleanSlug}":`, err.message);
  }

  // 2. Fallback to static servicesData
  return staticFallback;
}
