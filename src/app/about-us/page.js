import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import AboutUsClient from './AboutUsClient';
import { aboutData, companyInfo } from '@/data/homeData';

export const metadata = {
  title: 'About Us - Soundnest Smart Living & Automation',
  description:
    'Soundnest is a premier systems integrator in India specializing in KNX building automation, retro-fit smart homes, custom home cinemas, and multi-room audio systems.',
  alternates: {
    canonical: 'https://soundnest.in/about-us/',
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
    title: 'About Us - Soundnest Smart Living & Automation',
    description:
      'Discover Soundnest, India’s leading automation systems integrator delivering bespoke KNX automation, architectural lighting, and Dolby Atmos private cinema.',
    url: 'https://soundnest.in/about-us/',
    siteName: 'Soundnest',
    images: [
      {
        url: 'https://soundnest.in/images/about-us.jpg',
        width: 1200,
        height: 630,
        alt: 'About Soundnest Home Automation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Soundnest Smart Living',
    description:
      'Premier smart home automation and acoustic engineering across India.',
    images: ['https://soundnest.in/images/about-us.jpg'],
  },
};

export default function AboutUsPage() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Soundnest',
    url: 'https://soundnest.in',
    logo: 'https://soundnest.in/images/logo.png',
    description:
      'Soundnest provides luxury home automation, KNX building systems, curtain motorization, and private home cinema engineering across India.',
    telephone: companyInfo.phone,
    email: companyInfo.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: companyInfo.address,
      addressCountry: 'IN',
    },
    sameAs: [
      'https://www.instagram.com/soundnest.in/',
      'https://www.facebook.com/soundnest.in/',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Header />
      <main id="main-content">
        <AboutUsClient data={aboutData} companyInfo={companyInfo} />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
