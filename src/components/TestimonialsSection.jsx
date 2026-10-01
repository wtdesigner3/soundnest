"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { testimonialsData } from "@/data/homeData";
import styles from "./TestimonialsSection.module.css";

export default function TestimonialsSection() {
  return (
    <section className={styles.testimonialsSection} id="testimonials" aria-label="Customer Reviews">
      <div className="container">
        {/* Header */}
        <div className={styles.headerWrapper}>
          <span className={styles.kicker}>{testimonialsData.kicker}</span>
          <h2 className={styles.title}>{testimonialsData.title}</h2>
        </div>

        {/* 3 Review Cards */}
        <div className={styles.grid}>
          {testimonialsData.items.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.topRow}>
                <span className={styles.quoteIcon}>“</span>
                <div className={styles.stars} aria-label="5 stars rating">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={17} className={styles.starFilled} />
                  ))}
                </div>
              </div>

              <blockquote className={styles.quote}>
                {item.quote}
              </blockquote>

              <footer className={styles.authorRow}>
                <Image
                  src={item.avatar}
                  alt={item.author}
                  width={46}
                  height={46}
                  className={styles.avatarImg}
                  loading="lazy"
                />
                <div>
                  <div className={styles.authorName}>{item.author}</div>
                  <div className={styles.verifiedBadge}>Verified Customer</div>
                </div>
              </footer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
