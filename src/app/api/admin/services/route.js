import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { servicesData as fallbackServices } from '@/data/servicesData';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await getDb();
    if (!db) {
      return NextResponse.json({ services: fallbackServices });
    }

    const services = await db
      .collection('services')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ services });
  } catch (error) {
    console.error('API Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      slug,
      title,
      metaDescription,
      h1,
      heroSubtitle,
      badge = 'SOUNDNEST SMART SOLUTIONS',
      features = [],
      faqs = [],
      gallery = [],
      heroImage = '/images/services/retrofit.jpg',
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Service Name and URL Slug are required' },
        { status: 400 }
      );
    }

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    const collection = db.collection('services');

    // Check if slug already exists
    const existing = await collection.findOne({ slug: cleanSlug });
    if (existing) {
      return NextResponse.json(
        { error: `Service with slug "${cleanSlug}" already exists.` },
        { status: 409 }
      );
    }

    const newService = {
      name: name.trim(),
      slug: cleanSlug,
      title: title || `${name} in India - Soundnest`,
      metaDescription:
        metaDescription ||
        `Looking for the best ${name.toLowerCase()} in India? Contact Soundnest for custom design and integration.`,
      h1: h1 || name,
      heroSubtitle:
        heroSubtitle ||
        `Discover premium ${name.toLowerCase()} solutions tailored for modern living and intelligent control.`,
      badge,
      heroImage,
      experienceKicker: 'SOUNDNEST EXPERIENCE',
      experienceTitle: `Why Choose Soundnest ${name}?`,
      experienceSubtitle: 'Engineered for luxury, reliability, and precision control.',
      experienceDescription: `We combine world-class hardware with personalized integration to deliver unparalleled ${name.toLowerCase()} experiences.`,
      experiencePoints: [
        {
          title: 'Custom Engineering',
          description: 'Designed specifically for your architectural layout and lifestyle preferences.',
          icon: 'sparkles',
        },
        {
          title: 'Future-Ready Platform',
          description: 'Modular hardware that easily integrates with whole-home automation protocols.',
          icon: 'home',
        },
        {
          title: 'Zero Complications',
          description: 'Complete end-to-end turnkey installation and dedicated warranty-backed maintenance.',
          icon: 'shield',
        },
      ],
      featuresKicker: 'WHAT WE OFFER',
      featuresTitle: 'Intelligent Capabilities',
      features: features.length > 0 ? features : [
        {
          title: 'Smart Centralized Controls',
          description: 'Manage effortlessly from mobile app, touch keypads, or voice commands.',
          icon: 'controls',
        },
        {
          title: 'Energy Efficiency',
          description: 'Intelligent automation schedules that reduce energy consumption and maximize comfort.',
          icon: 'leaf',
        },
      ],
      processKicker: 'OUR PROCESS',
      processTitle: `Pinnacle of ${name}`,
      processSubtitle: 'Turnkey design, hardware selection, and precision calibration.',
      processParagraphs: [
        `Soundnest provides complete turnkey consultation and deployment for ${name.toLowerCase()}. Our certified engineers ensure every detail is calibrated to perfection.`,
        'We invite you to experience our solutions firsthand and discover how smart technology elevates your spaces.',
      ],
      gallery: gallery.length > 0 ? gallery : [
        { url: '/images/slider-3.jpg', title: 'Smart App Control' },
        { url: '/images/services/retrofit.jpg', title: 'Modular Integration' },
        { url: '/images/about-us.jpg', title: 'Architectural Design' },
      ],
      faqs: faqs.length > 0 ? faqs : [
        {
          question: `How long does it take to implement ${name.toLowerCase()}?`,
          answer: 'Typical residential installations are completed within 3 to 7 working days depending on the project scope.',
        },
        {
          question: 'Is after-sales support provided?',
          answer: 'Yes, all Soundnest systems include full manufacturer warranties and our dedicated priority customer support.',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await collection.insertOne(newService);

    return NextResponse.json({
      success: true,
      message: `Service "${newService.name}" created successfully!`,
      service: newService,
    });
  } catch (error) {
    console.error('API Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
