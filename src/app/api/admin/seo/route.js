import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { getSeoSettings } from '@/lib/seo';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await getSeoSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
    return NextResponse.json({ error: 'Failed to fetch SEO settings' }, { status: 500 });
  }
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

    await db.collection('seo_settings').updateOne(
      { key: 'main_seo_config' },
      { $set: safeUpdates },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'SEO settings saved successfully',
    });
  } catch (error) {
    console.error('Error updating SEO settings:', error);
    return NextResponse.json({ error: 'Failed to update SEO settings' }, { status: 500 });
  }
}
