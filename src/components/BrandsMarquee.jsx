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
          <h2 className={styles.title}>Brands we deal in</h2>
        </div>
      </div>

      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {duplicatedBrands.map((brand, idx) => (
            <div key={idx} className={styles.brandCard}>
              <Image
                src={brand.image}
                alt={`Soundnest Partner Brand ${idx + 1}`}
                width={170}
                height={60}
                className={styles.brandImg}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
