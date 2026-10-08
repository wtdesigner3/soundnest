import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageSquare, CheckCircle2 } from "lucide-react";
import { ctaBannerData, companyInfo } from "@/data/homeData";
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
      
      {/* Cinematic Dual Overlay with Central Ambient Glow */}
      <div className={styles.overlay} />
      <div className={styles.ambientGlow} />

      <div className={styles.content}>
        <div className={styles.kickerBadge}>
          <span className={styles.badgePulse} aria-hidden="true" />
          <span>START YOUR SMART LIVING JOURNEY</span>
        </div>

        <h2 className={styles.title} style={{ whiteSpace: 'pre-line' }}>
          {activeData.title || ctaBannerData.title}
        </h2>

        {/* Value Propositions */}
        <div className={styles.valueRow}>
          <div className={styles.valueItem}>
            <CheckCircle2 size={16} className={styles.checkIcon} />
            <span>Complimentary On-Site Survey</span>
          </div>
          <div className={styles.valueItem}>
            <CheckCircle2 size={16} className={styles.checkIcon} />
            <span>Bespoke 3D & CAD Engineering</span>
          </div>
          <div className={styles.valueItem}>
            <CheckCircle2 size={16} className={styles.checkIcon} />
            <span>Zero-Obligation Project Estimate</span>
          </div>
        </div>

        <div className={styles.ctaBtnWrapper}>
          <Link
            href={activeData.buttonLink || ctaBannerData.buttonLink || '/contact-us/'}
            title="Contact Us"
            className={styles.primaryBtn}
            onClick={(e) => {
              if (onOpenConsultation) {
                e.preventDefault();
                onOpenConsultation();
              }
            }}
          >
            <span>{activeData.buttonText || ctaBannerData.buttonText}</span>
            <ArrowRight size={17} />
          </Link>

          <a
            href={`https://api.whatsapp.com/send?phone=${companyInfo.whatsapp}&text=Hi%20Soundnest%2C%20I%20would%20like%20to%20inquire%20about%20smart%20home%20automation.`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryBtn}
            title="Chat on WhatsApp"
          >
            <MessageSquare size={16} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
