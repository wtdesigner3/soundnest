import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import ConsultationModal from '@/components/ConsultationModal';
import BlogPostClient from './BlogPostClient';
import { blogPosts, getPostBySlug, getRelatedPosts } from '@/data/blogData';

// Pre-render all 23 articles into static HTML at build time for optimal SEO & lightning speed
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found - Soundnest',
    };
  }

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

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = getRelatedPosts(post.slug, 3);

  // Schema.org Article / BlogPosting markup for Google search engine rich results
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
      <ConsultationModal />
    </>
  );
}
