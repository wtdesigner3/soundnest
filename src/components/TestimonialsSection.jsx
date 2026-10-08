"use client";

import { useRef } from "react";
import Image from "next/image";
import { Star, CheckCircle2, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { testimonialsData } from "@/data/homeData";
import styles from "./TestimonialsSection.module.css";

export default function TestimonialsSection({ data = testimonialsData }) {
  const activeData = data || testimonialsData;
  const items = activeData.items?.length > 0 ? activeData.items : testimonialsData.items;
  const swiperRef = useRef(null);

  return (
    <section className={styles.testimonialsSection} id="testimonials" aria-label="Customer Reviews">
      <div className={styles.ambientGlow} />

      <div className="container">
        {/* Header with Trust Rating */}
        <div className={styles.headerWrapper}>
          <div className={styles.kickerBadge}>
            <span className={styles.badgePulse} aria-hidden="true" />
            <span>{activeData.kicker || testimonialsData.kicker}</span>
          </div>

          <h2 className={styles.title}>{activeData.title || testimonialsData.title}</h2>

          <div className={styles.trustBar}>
            <div className={styles.trustStars} aria-label="5 stars rating">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} className={styles.starFilled} />
              ))}
            </div>
            <span className={styles.trustText}>
              4.9 / 5 Rating across 200+ Smart Home Integrations
            </span>
          </div>
        </div>

        {/* Carousel Slider */}
        <div className={styles.carouselContainer}>
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Autoplay, Pagination]}
            spaceBetween={28}
            slidesPerView={1}
            loop={items.length > 3}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              el: `.${styles.paginationDots}`,
              bulletClass: styles.bullet,
              bulletActiveClass: styles.bulletActive,
            }}
            breakpoints={{
              680: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1080: {
                slidesPerView: 3,
                spaceBetween: 28,
              },
            }}
            className={styles.swiperWrapper}
          >
            {items.map((item, idx) => (
              <SwiperSlide key={item.id || idx} className={styles.swiperSlide}>
                <div className={styles.card}>
                  <div className={styles.cardGlowTop} aria-hidden="true" />

                  <div className={styles.topRow}>
                    <div className={styles.quoteIconBox}>
                      <Quote size={22} className={styles.quoteIcon} />
                    </div>
                    <div className={styles.stars} aria-label={`${item.rating || 5} stars rating`}>
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} size={15} className={styles.starFilled} />
                      ))}
                    </div>
                  </div>

                  <blockquote className={styles.quote}>
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>

                  <footer className={styles.authorRow}>
                    <div className={styles.avatarWrapper}>
                      <Image
                        src={item.avatar}
                        alt={item.author}
                        width={48}
                        height={48}
                        className={styles.avatarImg}
                        loading="lazy"
                      />
                    </div>
                    <div className={styles.authorMeta}>
                      <div className={styles.authorName}>{item.author}</div>
                      <div className={styles.verifiedBadge}>
                        <CheckCircle2 size={13} className={styles.checkIcon} />
                        <span>Verified Client</span>
                      </div>
                    </div>
                  </footer>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Controls & Pagination */}
          <div className={styles.sliderControls}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>

            <div className={styles.paginationDots} />

            <button
              type="button"
              className={styles.navBtn}
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
