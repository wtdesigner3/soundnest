'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import styles from './TestimonialCarousel.module.css';

export default function TestimonialCarousel({ items = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isDragging = useRef(false);

  // Responsive slidesToShow calculation
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setSlidesToShow(1);
      } else if (width < 1080) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, items.length - slidesToShow);

  // Keep index within bounds if window resizes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay functionality (every 5 seconds)
  useEffect(() => {
    if (isPaused || items.length <= slidesToShow) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, handleNext, items.length, slidesToShow]);

  // Touch Swipe Handlers
  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e) => {
    setIsPaused(true);
    isDragging.current = true;
    touchStartX.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    touchEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsPaused(false);
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  if (!items || items.length === 0) return null;

  const slideWidthPct = 100 / slidesToShow;
  const trackTranslate = -(currentIndex * slideWidthPct);

  return (
    <div
      className={styles.carouselContainer}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        isDragging.current = false;
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer Testimonials"
    >
      <div
        className={styles.carouselViewport}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          className={styles.carouselTrack}
          style={{
            transform: `translateX(${trackTranslate}%)`,
          }}
        >
          {items.map((item, idx) => (
            <div key={item.id || idx} className={styles.carouselSlide}>
              <div className={styles.testimonialCard}>
                <div className={styles.topRow}>
                  <div className={styles.starRating} aria-label={`${item.rating || 5} stars`}>
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <span className={styles.quoteWatermark}>“</span>
                </div>

                <blockquote className={styles.testimonialQuote}>
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                <div className={styles.authorRow}>
                  <Image
                    src={item.avatar || '/images/testimonials/avatar.png'}
                    alt={item.author}
                    width={44}
                    height={44}
                    className={styles.authorAvatar}
                  />
                  <div>
                    <div className={styles.authorName}>{item.author}</div>
                    <div className={styles.authorRole}>
                      <CheckCircle2 size={13} />
                      <span>Verified Client</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Navigation Controls (Always Visible) */}
      <div className={styles.controlsRow}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={handlePrev}
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={20} />
        </button>

        <div className={styles.dotsWrapper}>
          {[...Array(maxIndex + 1)].map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setCurrentIndex(dotIdx)}
              className={`${styles.dot} ${currentIndex === dotIdx ? styles.dotActive : ''}`}
              aria-label={`Go to slide group ${dotIdx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          className={styles.navBtn}
          onClick={handleNext}
          aria-label="Next testimonial"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
