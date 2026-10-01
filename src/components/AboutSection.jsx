"use client";

import Image from "next/image";
import Link from "next/link";
import { aboutData } from "@/data/homeData";
import styles from "./AboutSection.module.css";

export default function AboutSection({ onOpenConsultation, data = aboutData }) {
  const activeData = data || aboutData;
  const paragraphs =
    activeData.paragraphs && activeData.paragraphs.length > 0
      ? activeData.paragraphs
      : aboutData.paragraphs;

  return (
    <section className={styles.aboutSection} id="about-us" aria-label="About Soundnest">
      <div className={`container ${styles.aboutGrid}`}>
        {/* Left Image */}
        <div className={`${styles.imageWrapper} about-animate`}>
          <Image
            src={activeData.image || aboutData.image}
            alt="Best Home Automation Companies in India - Soundnest Smart Living"
            width={650}
            height={688}
            className={styles.aboutImg}
            loading="lazy"
          />
        </div>

        {/* Right Content */}
        <div className={`${styles.contentWrapper} about-animate`}>
          <span className={styles.kicker}>{activeData.kicker || aboutData.kicker}</span>
          <h1 className={styles.title}>{activeData.title || aboutData.title}</h1>

          <div className={styles.paragraphs}>
            {paragraphs.map((p, idx) => (
              <p key={idx} className={styles.paragraph}>
                {p}
              </p>
            ))}
          </div>

          <div className={styles.ctaWrapper}>
            <Link
              href={activeData.ctaLink || aboutData.ctaLink || '/contact-us/'}
              title="Contact Us"
              className="btn-pill-white"
              onClick={(e) => {
                if (onOpenConsultation) {
                  e.preventDefault();
                  onOpenConsultation();
                }
              }}
            >
              {activeData.ctaText || aboutData.ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
