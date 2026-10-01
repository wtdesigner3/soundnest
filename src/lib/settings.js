import { getDb } from '@/lib/mongodb';
import { companyInfo } from '@/data/homeData';

export async function getWebsiteSettings() {
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

  try {
    const db = await getDb();
    if (db) {
      const config = await db.collection('website_settings').findOne({ key: 'main_settings' });
      if (config) {
        return {
          branding: { ...defaultSettings.branding, ...(config.branding || {}) },
          contact: { ...defaultSettings.contact, ...(config.contact || {}) },
          social: { ...defaultSettings.social, ...(config.social || {}) },
          codeInjection: { ...defaultSettings.codeInjection, ...(config.codeInjection || {}) },
        };
      }
    }
  } catch (err) {
    console.error('Error fetching website settings from DB:', err.message);
  }

  return defaultSettings;
}
