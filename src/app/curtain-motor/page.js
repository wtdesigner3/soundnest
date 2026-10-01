import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import ServiceTemplate from '@/components/ServiceTemplate';
import { getServiceBySlug } from '@/data/servicesData';
import { notFound } from 'next/navigation';

const SLUG = 'curtain-motor';

export async function generateMetadata() {
  const service = getServiceBySlug(SLUG);
  if (!service) return { title: 'Service - Soundnest' };

  return {
    title: service.title,
    description: service.metaDescription,
    alternates: {
      canonical: `https://soundnest.in/${service.slug}/`,
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    openGraph: {
      locale: 'en_US',
      type: 'website',
      title: service.title,
      description: service.metaDescription,
      url: `https://soundnest.in/${service.slug}/`,
      siteName: 'Soundnest',
      images: [
        {
          url: `https://soundnest.in${service.heroImage}`,
          width: 1200,
          height: 630,
          alt: service.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.title,
      description: service.metaDescription,
      images: [`https://soundnest.in${service.heroImage}`],
    },
  };
}

export default function CurtainMotorPage() {
  const service = getServiceBySlug(SLUG);
  if (!service) notFound();

  // JSON-LD Service & FAQ Schema for Google Rich Snippets
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    name: service.name,
    description: service.metaDescription,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Soundnest',
      url: 'https://soundnest.in',
      telephone: '+91-9049295678',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Q 24, Block Q, Lajpat Nagar IV',
        addressLocality: 'New Delhi',
        addressRegion: 'Delhi',
        postalCode: '110024',
        addressCountry: 'IN',
      },
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Soundnest Smart Solutions',
      itemListElement: service.features.map((f, i) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: f.title,
          description: f.description,
        },
      })),
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs?.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })) || [],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://soundnest.in/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: service.name,
        item: `https://soundnest.in/${service.slug}/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />
      <main id="main-content">
        <ServiceTemplate service={service} />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
