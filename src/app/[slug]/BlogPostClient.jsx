'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, User, Clock, Share2, Copy, Check, ChevronRight, ArrowRight, Sparkles, PhoneCall } from 'lucide-react';
import ConsultationModal from '@/components/ConsultationModal';
import styles from './post.module.css';

export default function BlogPostClient({ post, relatedPosts = [] }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://soundnest.in/${post.slug}/`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(post.title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className={styles.articlePage}>
      {/* Top Reading Progress Bar */}
      <div
        className={styles.progressBar}
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <div className={styles.container}>
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumbs} aria-label="Breadcrumbs">
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <Link href="/blog/" className={styles.breadcrumbLink}>
            Blog
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span className={styles.breadcrumbCurrent} aria-current="page">
            {post.title}
          </span>
        </nav>

        {/* Two-Column Layout: Left Content, Right Sidebar */}
        <div className={styles.contentLayout}>
          {/* Left Column: Full Article Details */}
          <main className={styles.mainContent}>
            <header className={styles.articleHeader}>
              <span className={styles.categoryBadge}>{post.category}</span>
              <h1 className={styles.articleTitle}>{post.title}</h1>

              <div className={styles.metaBar}>
                <div className={styles.metaItem}>
                  <User size={16} />
                  <span>By <strong className={styles.authorName}>{post.author}</strong></span>
                </div>
                <div className={styles.metaItem}>
                  <Calendar size={16} />
                  <time dateTime={post.date}>{post.formattedDate}</time>
                </div>
                <div className={styles.metaItem}>
                  <Clock size={16} />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </header>

            {/* Semantic Article Body */}
            <article className={styles.articleBody}>
              <div
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                className="article-rich-text"
              />
            </article>

            {/* Social Share Section */}
            <div className={styles.shareSection}>
              <h2 className={styles.shareTitle}>Share this article:</h2>
              <div className={styles.shareButtons}>
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.shareBtn}
                  aria-label="Share on WhatsApp"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.09c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.13 8.13 0 01-1.25-4.32c0-4.51 3.67-8.18 8.18-8.18 2.18 0 4.24.85 5.78 2.39a8.13 8.13 0 012.4 5.79c0 4.51-3.67 8.17-8.18 8.17zm4.49-6.13c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.23.9 2.42 1.03 2.59.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.17-.48-.29z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.shareBtn}
                  aria-label="Share on LinkedIn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.shareBtn}
                  aria-label="Share on X"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.shareBtn}
                  aria-label="Share on Facebook"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
                  </svg>
                </a>

                {/* Copy Link */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={styles.shareBtn}
                  aria-label="Copy link to clipboard"
                >
                  {copied ? <Check size={18} color="#4ade80" /> : <Copy size={18} />}
                </button>
                {copied && <span className={styles.copiedTooltip}>Link copied!</span>}
              </div>
            </div>

            {/* Bottom Consultation Call to Action with Modal Trigger */}
            <div className={styles.ctaBox}>
              <h2 className={styles.ctaTitle}>Looking to Automate Your Home or Upgrade Your Audio?</h2>
              <p className={styles.ctaText}>
                Soundnest designs and delivers custom home automation, multi-room audio, and private cinema solutions across Delhi NCR and India.
              </p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className={styles.ctaBtn}
              >
                <span>Schedule Private Studio Demo</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </main>

          {/* Right Column: Sticky Sidebar with Related Articles & Consultation CTA */}
          <aside className={styles.sidebar} aria-label="Sidebar">
            <div className={styles.stickySidebar}>
              {/* Sidebar Related Articles Widget */}
              {relatedPosts.length > 0 && (
                <div className={styles.sidebarRelatedCard}>
                  <div className={styles.sidebarHeader}>
                    <h3 className={styles.sidebarTitle}>Related Articles</h3>
                    <Link href="/blog/" className={styles.viewAllLink}>
                      View all
                    </Link>
                  </div>
                  <div className={styles.relatedList}>
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/${related.slug}/`}
                        className={styles.relatedItem}
                      >
                        <span className={styles.relatedItemCategory}>{related.category}</span>
                        <h4 className={styles.relatedItemTitle}>{related.title}</h4>
                        <div className={styles.relatedItemMeta}>
                          <span>{related.formattedDate}</span>
                          <span>{related.readTime}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Sidebar Consultation Widget (Experience Soundnest) */}
              <div className={styles.sidebarCtaCard}>
                <div className={styles.sidebarCtaIcon}>
                  <Sparkles size={24} />
                </div>
                <h3 className={styles.sidebarCtaTitle}>Experience Soundnest</h3>
                <p className={styles.sidebarCtaText}>
                  Book a free one-on-one consultation with our automation engineers or schedule an exclusive studio demo.
                </p>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className={styles.sidebarCtaBtn}
                >
                  <span>Book Free Consultation</span>
                  <ArrowRight size={16} />
                </button>
                <a href="tel:+919049295678" className={styles.sidebarPhoneLink}>
                  <PhoneCall size={14} />
                  <span>+91-9049295678</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Consultation Modal Popup */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
