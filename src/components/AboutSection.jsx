import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, ShieldCheck } from "lucide-react";
import { aboutData, companyInfo } from "@/data/homeData";
import styles from "./AboutSection.module.css";

export default function AboutSection({ onOpenConsultation, data = aboutData }) {
  const activeData = data || aboutData;
  const paragraphs =
    activeData.paragraphs && activeData.paragraphs.length > 0
      ? activeData.paragraphs
      : aboutData.paragraphs;

  // The client requested removing the marked block (introductory lead paragraph and the 4 capability cards)
  const visibleParagraphs = paragraphs.length > 1 ? paragraphs.slice(1) : paragraphs;

  return (
    <section className={styles.aboutSection} id="about-us" aria-label="About Soundnest">
      {/* Ambient background lighting */}
      <div className={styles.ambientGlow} />

      <div className={`container ${styles.aboutGrid}`}>
        {/* Left Column: Architectural Media Frame with Floating Stats */}
        <div className={`${styles.imageColumn} about-animate`}>
          <div className={styles.imageCard}>
            <div className={styles.imageWrapper}>
              <Image
                src={activeData.image || aboutData.image}
                alt="Best Home Automation Companies in India - Soundnest Smart Living"
                width={700}
                height={750}
                className={styles.aboutImg}
                priority
              />
            </div>

            {/* Top Glass Badge */}
            <div className={styles.topBadge}>
              <ShieldCheck size={16} className={styles.badgeIcon} />
              <span>Certified KNX & CEDIA Systems</span>
            </div>

            {/* Overlapping Floating Stats Card */}
            <div className={styles.statsCard}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>10+</span>
                <span className={styles.statLabel}>Years Industry Excellence</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statNumber}>500+</span>
                <span className={styles.statLabel}>Luxury Homes Automated</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statNumber}>100%</span>
                <span className={styles.statLabel}>Bespoke Engineering</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Architectural Narrative */}
        <div className={`${styles.contentWrapper} about-animate`}>
          <div className={styles.kickerBadge}>
            <span className={styles.badgePulse} aria-hidden="true" />
            <span>{activeData.kicker || aboutData.kicker}</span>
          </div>

          <h2 className={styles.title}>{activeData.title || aboutData.title}</h2>

          {/* Story Paragraphs */}
          <div className={styles.paragraphs}>
            {visibleParagraphs.map((p, idx) => (
              <p key={idx} className={styles.paragraph}>
                {p}
              </p>
            ))}
          </div>

          {/* Action Row */}
          <div className={styles.ctaRow}>
            <Link
              href={activeData.ctaLink || aboutData.ctaLink || '/contact-us/'}
              title="Contact Us"
              className={styles.primaryBtn}
              onClick={(e) => {
                if (onOpenConsultation) {
                  e.preventDefault();
                  onOpenConsultation();
                }
              }}
            >
              <span>{activeData.ctaText || aboutData.ctaText}</span>
              <ArrowRight size={17} />
            </Link>

            <a
              href={`tel:${companyInfo.phoneRaw}`}
              className={styles.callBadge}
              title={`Call ${companyInfo.name}`}
            >
              <div className={styles.callIconBox}>
                <Phone size={16} />
              </div>
              <div>
                <span className={styles.callLabel}>Speak to an Engineer</span>
                <span className={styles.callNumber}>{companyInfo.phone}</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
