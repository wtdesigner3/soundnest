"use client";

import Image from "next/image";
import Link from "next/link";
import { ctaBannerData } from "@/data/homeData";
import styles from "./CtaBanner.module.css";

export default function CtaBanner({ onOpenConsultation, data = ctaBannerData }) {
  const activeData = data || ctaBannerData;

  return (
    <section className={styles.ctaSection} id="cta-banner" aria-label="Book a free consultation">
      <div id="cta-banner-bg" className={styles.bgImage}>
        <Image
          src={activeData.backgroundImage || ctaBannerData.backgroundImage}
          alt="Soundnest Smart Living Consultation Experience"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          loading="lazy"
        />
      </div>
      <div className={styles.overlay} />

      <div className={styles.content}>
        <h2 className={styles.title} style={{ whiteSpace: 'pre-line' }}>
          {activeData.title || ctaBannerData.title}
        </h2>

        <div className={styles.ctaBtnWrapper}>
          <Link
            href={activeData.buttonLink || ctaBannerData.buttonLink || '/contact-us/'}
            title="Contact Us"
            className="btn-pill-white"
            onClick={(e) => {
              if (onOpenConsultation) {
                e.preventDefault();
                onOpenConsultation();
              }
            }}
          >
            {activeData.buttonText || ctaBannerData.buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
