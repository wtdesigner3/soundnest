import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { companyInfo } from '@/data/homeData';

const defaultSettings = {
  branding: {
    siteName: 'Soundnest',
    logo: '/images/logo.png',
    favicon: '/images/favicon.png',
    copyright: `© ${new Date().getFullYear()} SOUNDNEST ALL RIGHTS RESERVED`,
  },
  contact: {
    phone: companyInfo.phone,
    phoneRaw: companyInfo.phoneRaw,
    email: companyInfo.email,
    address: companyInfo.address,
    businessHours: 'Mon - Sat: 10:00 AM - 7:00 PM',
  },
  social: {
    whatsapp: companyInfo.whatsapp,
    instagram: companyInfo.instagram,
    facebook: '',
    linkedin: '',
    youtube: '',
    twitter: '',
  },
  codeInjection: {
    headerScripts: '',
    footerScripts: '',
  },
};

export async function GET() {
  try {
    const db = await getDb();
    if (db) {
      const config = await db.collection('website_settings').findOne({ key: 'main_settings' });
      if (config) {
        const { _id, key, ...rest } = config;
        return NextResponse.json({
          branding: { ...defaultSettings.branding, ...(rest.branding || {}) },
          contact: { ...defaultSettings.contact, ...(rest.contact || {}) },
          social: { ...defaultSettings.social, ...(rest.social || {}) },
          codeInjection: { ...defaultSettings.codeInjection, ...(rest.codeInjection || {}) },
        });
      }
    }
  } catch (err) {
    console.error('Error fetching website settings:', err);
  }

  return NextResponse.json(defaultSettings);
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

    await db.collection('website_settings').updateOne(
      { key: 'main_settings' },
      { $set: safeUpdates },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Website settings saved successfully!',
    });
  } catch (error) {
    console.error('Error updating website settings:', error);
    return NextResponse.json({ error: 'Failed to update website settings' }, { status: 500 });
  }
}
