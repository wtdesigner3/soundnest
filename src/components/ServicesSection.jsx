"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Wifi, Building2, Sun, Film, Sparkles } from "lucide-react";
import { servicesData } from "@/data/homeData";
import styles from "./ServicesSection.module.css";

function getServiceIcon(id, title) {
  const str = `${id} ${title}`.toLowerCase();
  if (str.includes("retro")) return <Wifi size={18} />;
  if (str.includes("building")) return <Building2 size={18} />;
  if (str.includes("curtain")) return <Sun size={18} />;
  if (str.includes("cinema") || str.includes("audio")) return <Film size={18} />;
  return <Sparkles size={18} />;
}

export default function ServicesSection({ data = servicesData }) {
  const activeData = data || servicesData;
  const servicesList = activeData.services?.length > 0 ? activeData.services : servicesData.services;

  return (
    <section className={styles.servicesSection} id="services" aria-label="Our Automation Services">
      <div className="container">
        {/* Section Header */}
        <div className={styles.headerWrapper}>
          <div className={styles.kickerBadge}>
            <span className={styles.badgePulse} aria-hidden="true" />
            <span>{activeData.kicker || servicesData.kicker}</span>
          </div>
          <h2 className={styles.title}>{activeData.title || servicesData.title}</h2>
          <p className={styles.subtitle}>
            Precision-engineered automation systems tailored for premier residences, luxury villas, and commercial spaces.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className={styles.cardsGrid}>
          {servicesList.map((service, idx) => (
            <article key={service.id || idx} className={styles.card}>
              <Link href={service.link} className={styles.cardLink} title={service.title}>
                {/* Background Image with Hover Scale */}
                <div className={styles.imageContainer}>
                  <Image
                    src={service.image}
                    alt={`${service.title} - Soundnest Smart Automation`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw"
                    className={styles.cardBgImage}
                    loading="lazy"
                  />
                  {/* Cinematic Dark Gradient Overlay */}
                  <div className={styles.cardOverlay} />
                </div>

                {/* Top Badge: Index Counter & Icon */}
                <div className={styles.cardTopRow}>
                  <span className={styles.cardIndex}>0{idx + 1}</span>
                  <div className={styles.cardIconBox}>
                    {getServiceIcon(service.id, service.title)}
                  </div>
                </div>

                {/* Bottom Content Area */}
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{service.title}</h3>
                  <p className={styles.cardDescription}>{service.description}</p>
                  
                  <div className={styles.cardAction}>
                    <span className={styles.actionText}>Explore Solution</span>
                    <div className={styles.actionArrow}>
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
