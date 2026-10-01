import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import ContactPageClient from './ContactPageClient';
import { contactData } from '@/data/contactData';

export const metadata = {
  title: 'Contact Us - Soundnest',
  description: 'Business hours',
  alternates: {
    canonical: 'https://soundnest.in/contact-us/',
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
    type: 'article',
    title: 'Contact Us - Soundnest',
    description: 'Business hours',
    url: 'https://soundnest.in/contact-us/',
    siteName: 'Soundnest',
    images: [
      {
        url: 'https://soundnest.in/wp-content/uploads/2025/10/home-cinema-audio-video-1.jpg',
        width: 900,
        height: 900,
        alt: 'Soundnest Contact Us',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Soundnest',
    description: 'Business hours',
  },
};

export default function ContactPage() {
  // Generate FAQ schema for Google Rich Results
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: contactData.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // Generate ContactPage & LocalBusiness Schema
  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Us - Soundnest',
    url: 'https://soundnest.in/contact-us/',
    description: 'Business hours',
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://soundnest.in/#website',
      name: 'Soundnest',
      url: 'https://soundnest.in',
    },
    about: {
      '@type': 'LocalBusiness',
      name: 'Soundnest',
      image: 'https://soundnest.in/wp-content/uploads/2025/12/logo-1.png',
      telephone: '+91-9049295678',
      email: 'sales@soundnest.in',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Q 24, Block Q, Lajpat Nagar IV, Lajpat Nagar',
        addressLocality: 'New Delhi',
        addressRegion: 'Delhi',
        postalCode: '110024',
        addressCountry: 'IN',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '10:30',
          closes: '19:00',
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />
      <main id="main-content">
        <ContactPageClient />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
