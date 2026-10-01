import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import BlogPostClient from './BlogPostClient';
import ServiceTemplate from '@/components/ServiceTemplate';
import { blogPosts, getPostBySlug, getRelatedPosts } from '@/data/blogData';
import { getServiceBySlug } from '@/lib/services';

// Pre-render all 23 articles into static HTML at build time for optimal SEO & lightning speed
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  // 1. Check if it's a blog post
  const post = getPostBySlug(slug);
  if (post) {
    return {
      title: `${post.title} - Soundnest`,
      description: post.excerpt.slice(0, 160),
      alternates: {
        canonical: `https://soundnest.in/${post.slug}/`,
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
        title: `${post.title} - Soundnest`,
        description: post.excerpt.slice(0, 160),
        url: `https://soundnest.in/${post.slug}/`,
        siteName: 'Soundnest',
        publishedTime: post.date,
        authors: [post.author],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${post.title} - Soundnest`,
        description: post.excerpt.slice(0, 160),
      },
    };
  }

  // 2. Check if it's a dynamic service (added via MongoDB Admin CMS)
  const service = await getServiceBySlug(slug);
  if (service) {
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
            url: `https://soundnest.in${service.heroImage || '/images/about-us.jpg'}`,
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
      },
    };
  }

  return {
    title: 'Page Not Found - Soundnest',
  };
}

export default async function DynamicSlugPage({ params }) {
  const { slug } = await params;

  // 1. If it's a blog post, render the article detail view
  const post = getPostBySlug(slug);
  if (post) {
    const related = getRelatedPosts(post.slug, 3);
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: post.date,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://soundnest.in/${post.slug}/`,
      },
      author: {
        '@type': 'Person',
        name: post.author,
        url: 'https://soundnest.in',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Soundnest',
        url: 'https://soundnest.in',
        logo: {
          '@type': 'ImageObject',
          url: 'https://soundnest.in/wp-content/uploads/2025/12/logo-1.png',
        },
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <Header />
        <main id="main-content">
          <BlogPostClient post={post} relatedPosts={related} />
        </main>
        <Footer />
        <FloatingActions />
      </>
    );
  }

  // 2. If it's a dynamic service (e.g., added through Admin CMS), render ServiceTemplate
  const service = await getServiceBySlug(slug);
  if (service) {
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
      },
      areaServed: {
        '@type': 'Country',
        name: 'India',
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

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        {service.faqs && service.faqs.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}
        <Header />
        <main id="main-content">
          <ServiceTemplate service={service} />
        </main>
        <Footer />
        <FloatingActions />
      </>
    );
  }

  notFound();
}
