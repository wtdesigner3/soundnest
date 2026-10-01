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

  // 1. Static check
  const staticService = getStaticServiceBySlug(cleanSlug);
  if (staticService) return staticService;

  // 2. Dynamic MongoDB Atlas fallback
  try {
    const db = await getDb();
    if (!db) return null;
    const service = await db.collection('services').findOne({ slug: cleanSlug });
    if (service) {
      // Remove MongoDB _id to prevent serialization issues
      const { _id, ...rest } = service;
      return rest;
    }
  } catch (err) {
    console.error(`Error querying dynamic service for slug "${cleanSlug}":`, err.message);
  }

  return null;
}
