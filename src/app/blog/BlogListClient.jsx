'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, Clock, ArrowRight, ChevronLeft, ChevronRight, BookOpen, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './blog.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CATEGORIES = [
  'All',
  'Smart Automation',
  'Audio & Cinema',
  'Smart Lighting',
  'Intercom & Security',
];

const POSTS_PER_PAGE = 9;

export default function BlogListClient({ posts = [] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  // GSAP animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          y: 25,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          immediateRender: false,
        });
      }

      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          immediateRender: false,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [currentPage, activeCategory]);

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === 'All' || post.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  // Reset pagination when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const displayedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const contentEl = document.getElementById('blog-grid');
    if (contentEl) {
      contentEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.blogPage} ref={containerRef}>
      {/* 1. Dark Luxury Hero Banner */}
      <section className={styles.heroSection}>
        <div className={styles.ambientGlow} />
        <div className={`container ${styles.heroContainer}`} ref={headerRef}>
          <div className={styles.kickerBadge}>
            <Sparkles size={14} className={styles.badgeSparkle} />
            <span>KNOWLEDGE ARCHIVE & INSIGHTS</span>
          </div>

          <h1 className={styles.pageTitle}>
            Engineering Insights & <span className={styles.titleGradient}>Smart Living Trends</span>
          </h1>

          <p className={styles.pageSubtitle}>
            Expert guides, architectural standards, and cutting-edge trends in KNX building automation, acoustic engineering, and private cinema systems.
          </p>

          {/* Search & Category Filter Bar */}
          <div className={styles.filterBar}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={18} />
              <input
                type="text"
                placeholder="Search articles on KNX, home cinema, lighting, curtain motors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                aria-label="Search articles"
              />
            </div>

            <div className={styles.categoriesWrapper} role="tablist">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat}
                  className={`${styles.categoryBtn} ${activeCategory === cat ? styles.active : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Architectural Light Articles Grid (Alternating Theme) */}
      <section className={styles.articlesSection} id="blog-grid">
        <div className={`container ${styles.articlesContainer}`}>
          {/* Results Count & Meta */}
          <div className={styles.resultsBar}>
            <div className={styles.resultsCount}>
              <BookOpen size={16} className={styles.resultsIcon} />
              <span>
                Showing <strong>{filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'article' : 'articles'}
                {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
                {searchQuery ? ` matching "${searchQuery}"` : ''}
              </span>
            </div>
          </div>

          {/* Cards Grid */}
          {displayedPosts.length > 0 ? (
            <div className={styles.cardsGrid} ref={gridRef}>
              {displayedPosts.map((post) => (
                <article key={post.slug} className={styles.postCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.dateBadge}>
                      <span className={styles.dateDay}>{post.day}</span>
                      <span className={styles.dateMonth}>{post.month}</span>
                    </div>
                    <span className={styles.categoryTag}>{post.category}</span>
                  </div>

                  <h2 className={styles.postTitle}>
                    <Link href={`/${post.slug}/`} className={styles.titleLink}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className={styles.postExcerpt}>{post.excerpt}</p>

                  <div className={styles.cardFooter}>
                    <span className={styles.readTime}>
                      <Clock size={14} />
                      {post.readTime}
                    </span>
                    <Link href={`/${post.slug}/`} className={styles.continueLink} aria-label={`Read ${post.title}`}>
                      <span>Continue reading</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconBox}>
                <Search size={28} />
              </div>
              <h3 className={styles.emptyTitle}>No matching articles found</h3>
              <p className={styles.emptyDesc}>
                Try adjusting your search query or selecting a different category from above.
              </p>
              <button
                type="button"
                className={styles.resetBtn}
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label="Blog Pagination">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pageBtn}
                aria-label="Previous Page"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`${styles.pageBtn} ${currentPage === pageNum ? styles.activePage : ''}`}
                  aria-current={currentPage === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.pageBtn}
                aria-label="Next Page"
              >
                <ChevronRight size={18} />
              </button>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
}
