import { getDb } from '@/lib/mongodb';
import {
  heroSlides,
  aboutData,
  servicesData,
  brandsList,
  testimonialsData,
  ctaBannerData,
  contactSectionData,
} from '@/data/homeData';

export async function getHomeContent() {
  try {
    const db = await getDb();
    if (db) {
      const config = await db.collection('home_content').findOne({ key: 'main_home_config' });
      if (config) {
        const { _id, key, ...rest } = config;
        return {
          heroSlides: rest.heroSlides || heroSlides,
          aboutData: rest.aboutData || aboutData,
          servicesData: rest.servicesData || servicesData,
          brandsList: rest.brandsList || brandsList,
          testimonialsData: rest.testimonialsData || testimonialsData,
          ctaBannerData: rest.ctaBannerData || ctaBannerData,
          contactSectionData: rest.contactSectionData || contactSectionData,
        };
      }
    }
  } catch (err) {
    console.error('Error fetching home content:', err.message);
  }

  return {
    heroSlides,
    aboutData,
    servicesData,
    brandsList,
    testimonialsData,
    ctaBannerData,
    contactSectionData,
  };
}
