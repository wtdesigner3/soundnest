"use client";

import Image from "next/image";
import Link from "next/link";
import { servicesData } from "@/data/homeData";
import styles from "./ServicesSection.module.css";

export default function ServicesSection({ data = servicesData }) {
  const activeData = data || servicesData;
  const servicesList = activeData.services?.length > 0 ? activeData.services : servicesData.services;

  return (
    <section className={styles.servicesSection} id="services" aria-label="Our Automation Services">
      <div className="container">
        {/* Section Header */}
        <div className={styles.headerWrapper}>
          <span className={styles.kicker}>{activeData.kicker || servicesData.kicker}</span>
          <h2 className={styles.title}>{activeData.title || servicesData.title}</h2>
        </div>

        {/* Service Cards */}
        <div className={styles.cardsGrid}>
          {servicesList.map((service, idx) => (
            <article key={service.id || idx} className={styles.card}>
              {/* Background Image */}
              <Image
                src={service.image}
                alt={`${service.title} - Soundnest Smart Automation`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw"
                className={styles.cardBgImage}
                loading="lazy"
              />

              {/* Ambient Dark Gradient */}
              <div className={styles.cardOverlay} />

              {/* Content */}
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardDescription}>{service.description}</p>
                <div className={styles.cardButtonWrapper}>
                  <Link
                    href={service.link}
                    title={service.title}
                    className={styles.cardBtn}
                  >
                    View More
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
