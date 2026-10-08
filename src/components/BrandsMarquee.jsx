"use client";

import Image from "next/image";
import { brandsList } from "@/data/homeData";
import styles from "./BrandsMarquee.module.css";

export default function BrandsMarquee({ brands = brandsList }) {
  const activeBrands = brands && brands.length > 0 ? brands : brandsList;
  // Duplicate list to achieve continuous infinite marquee loop
  const duplicatedBrands = [...activeBrands, ...activeBrands];

  return (
    <section className={styles.brandsSection} aria-label="Brands We Deal In">
      <div className="container">
        <div className={styles.headerWrapper}>
          <div className={styles.kickerBadge}>
            <span className={styles.badgePulse} aria-hidden="true" />
            <span>AUTHORIZED PARTNERS</span>
          </div>
          <h2 className={styles.title}>Brands We Deal In</h2>
          <p className={styles.subtitle}>
            Soundnest is an authorized systems integrator for premier global audio, cinema, and automation manufacturers.
          </p>
        </div>
      </div>

      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {duplicatedBrands.map((brand, idx) => (
            <div key={idx} className={styles.brandCard}>
              <div className={styles.brandImgWrapper}>
                <Image
                  src={brand.image}
                  alt={brand.name || `Authorized Partner Brand ${idx + 1}`}
                  width={150}
                  height={50}
                  className={styles.brandImg}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
