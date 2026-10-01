import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
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

export async function GET() {
  try {
    const db = await getDb();
    if (db) {
      const config = await db.collection('home_content').findOne({ key: 'main_home_config' });
      if (config) {
        const { _id, key, ...rest } = config;
        return NextResponse.json({
          heroSlides: rest.heroSlides || heroSlides,
          aboutData: rest.aboutData || aboutData,
          servicesData: rest.servicesData || servicesData,
          brandsList: rest.brandsList || brandsList,
          testimonialsData: rest.testimonialsData || testimonialsData,
          ctaBannerData: rest.ctaBannerData || ctaBannerData,
          contactSectionData: rest.contactSectionData || contactSectionData,
        });
      }
    }
  } catch (err) {
    console.error('Error fetching home content from DB:', err);
  }

  // Fallback to static homeData defaults
  return NextResponse.json({
    heroSlides,
    aboutData,
    servicesData,
    brandsList,
    testimonialsData,
    ctaBannerData,
    contactSectionData,
  });
}

export async function PUT(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updates = await request.json();
    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    const { _id, key, ...safeUpdates } = updates;
    safeUpdates.updatedAt = new Date();

    await db.collection('home_content').updateOne(
      { key: 'main_home_config' },
      { $set: safeUpdates },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Home page content saved successfully!',
    });
  } catch (error) {
    console.error('Error updating home content:', error);
    return NextResponse.json({ error: 'Failed to update home content' }, { status: 500 });
  }
}
