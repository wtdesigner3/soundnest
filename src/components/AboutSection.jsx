"use client";

import Image from "next/image";
import Link from "next/link";
import { aboutData } from "@/data/homeData";
import styles from "./AboutSection.module.css";

export default function AboutSection({ onOpenConsultation }) {
  return (
    <section className={styles.aboutSection} id="about-us" aria-label="About Soundnest">
      <div className={`container ${styles.aboutGrid}`}>
        {/* Left Image */}
        <div className={`${styles.imageWrapper} about-animate`}>
          <Image
            src={aboutData.image}
            alt="Best Home Automation Companies in India - Soundnest Smart Living"
            width={650}
            height={688}
            className={styles.aboutImg}
            loading="lazy"
          />
        </div>

        {/* Right Content */}
        <div className={`${styles.contentWrapper} about-animate`}>
          <span className={styles.kicker}>{aboutData.kicker}</span>
          <h1 className={styles.title}>{aboutData.title}</h1>

          <div className={styles.paragraphs}>
            <p className={styles.paragraph}>
              Our company was started with a vision of making technology easily accessible to every Indian household. Today, we are recognized among the <strong>Best Home Automation Companies in India</strong>, delivering innovative automation and audio-video solutions for both residential and commercial spaces.
            </p>
            <p className={styles.paragraph}>
              We are a leading systems integrator working in the domain of Automation and Audio Video Solutions, providing top-notch services across India. Our expertise includes KNX-based Automation, Premium Wireless/Retro-Fit Automation, Home Theaters, Multi-Room Audio Systems, and a wide range of advanced AV solutions.
            </p>
            <p className={styles.paragraph}>
              As one of the <strong>Best Home Automation Companies in India</strong>, we support our clients throughout their digital transformation journey. Our services include end-to-end solution design, product selection, system integration, programming, and implementation.
            </p>
            <p className={styles.paragraph}>
              Our top priority is crafting solutions that are a perfect amalgamation of our technological offerings and the unique requirements of each client. By combining innovation, reliability, and customer-centric design, we ensure seamless smart living and intelligent automation experiences for homes and businesses across India.
            </p>
          </div>

          <div className={styles.ctaWrapper}>
            <Link
              href={aboutData.ctaLink}
              title="Contact Us"
              className="btn-pill-white"
              onClick={(e) => {
                if (onOpenConsultation) {
                  e.preventDefault();
                  onOpenConsultation();
                }
              }}
            >
              {aboutData.ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
