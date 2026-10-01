import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import BlogListClient from './BlogListClient';
import { blogPosts } from '@/data/blogData';

export const metadata = {
  title: 'Blog - Soundnest',
  description:
    'Home automation has changed the way people interact with lighting, climate control, security, and other electrical systems inside a property.',
  alternates: {
    canonical: 'https://soundnest.in/blog/',
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
    title: 'Blog - Soundnest',
    description:
      'Home automation has changed the way people interact with lighting, climate control, security, and other electrical systems inside a property.',
    url: 'https://soundnest.in/blog/',
    siteName: 'Soundnest',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Soundnest',
    description:
      'Home automation has changed the way people interact with lighting, climate control, security, and other electrical systems inside a property.',
  },
};

export default function BlogArchivePage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog - Soundnest',
    url: 'https://soundnest.in/blog/',
    description:
      'Home automation has changed the way people interact with lighting, climate control, security, and other electrical systems inside a property.',
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://soundnest.in/#website',
      name: 'Soundnest',
      url: 'https://soundnest.in',
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: blogPosts.map((post, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://soundnest.in/${post.slug}/`,
        name: post.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <Header />
      <main id="main-content">
        <BlogListClient posts={blogPosts} />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
