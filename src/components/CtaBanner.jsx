"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageSquare, Compass, ShieldCheck, Cpu } from "lucide-react";
import { ctaBannerData, companyInfo } from "@/data/homeData";
import styles from "./CtaBanner.module.css";

export default function CtaBanner({ onOpenConsultation, data = ctaBannerData }) {
  const activeData = data || ctaBannerData;

  return (
    <section className={styles.ctaSection} id="cta-banner" aria-label="Book a free consultation">
      {/* Parallax Background */}
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

      {/* Atmospheric Vignette & Central Ambient Glow */}
      <div className={styles.overlay} />
      <div className={styles.ambientGlow} />

      <div className={`container ${styles.container}`}>
        {/* Floating Architectural Master Card */}
        <div className={styles.ctaCard}>
          <div className={styles.cardAccentGlow} aria-hidden="true" />

          <div className={styles.cardGrid}>
            {/* Left Column: Heading, Proposition & CTAs */}
            <div className={styles.textCol}>
              <div className={styles.kickerBadge}>
                <span className={styles.badgePulse} aria-hidden="true" />
                <span>START YOUR SMART LIVING JOURNEY</span>
              </div>

              <h2 className={styles.title}>
                Ready to experience life in a{" "}
                <span className={styles.goldGradient}>smart home?</span>
                <br />
                Book a free consultation now!
              </h2>

              <p className={styles.description}>
                Step into the future of luxury living. Our certified automation engineers tailor bespoke lighting scenes, whole-home audio, and centralized KNX climate control for premier villas and residences.
              </p>

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
                  <span>{activeData.buttonText || ctaBannerData.buttonText || "Let's Connect"}</span>
                  <ArrowRight size={17} />
                </Link>

                <a
                  href={`https://api.whatsapp.com/send?phone=${companyInfo.whatsapp}&text=Hi%20Soundnest%2C%20I%20would%20like%20to%20inquire%20about%20smart%20home%20automation.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.secondaryBtn}
                  title="Chat on WhatsApp"
                >
                  <span className={styles.waDot} aria-hidden="true" />
                  <MessageSquare size={16} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              <div className={styles.guaranteeText}>
                <span>✦ Complimentary On-Site Survey • Zero Obligation • 100% Confidential</span>
              </div>
            </div>

            {/* Right Column: 3 Luxury Pillar Micro-Cards */}
            <div className={styles.pillarsCol}>
              <div className={styles.pillarCard}>
                <div className={styles.pillarNumber}>01</div>
                <div className={styles.pillarContent}>
                  <div className={styles.pillarHeader}>
                    <Compass size={17} className={styles.pillarIcon} />
                    <h3 className={styles.pillarTitle}>Bespoke 3D & CAD Engineering</h3>
                  </div>
                  <p className={styles.pillarDesc}>
                    Tailored wiring schematics and architectural layout mapping for flawless integration.
                  </p>
                </div>
              </div>

              <div className={styles.pillarCard}>
                <div className={styles.pillarNumber}>02</div>
                <div className={styles.pillarContent}>
                  <div className={styles.pillarHeader}>
                    <ShieldCheck size={17} className={styles.pillarIcon} />
                    <h3 className={styles.pillarTitle}>Complimentary On-Site Survey</h3>
                  </div>
                  <p className={styles.pillarDesc}>
                    In-depth walkthrough of your villa, penthouse, or residence with senior engineers.
                  </p>
                </div>
              </div>

              <div className={styles.pillarCard}>
                <div className={styles.pillarNumber}>03</div>
                <div className={styles.pillarContent}>
                  <div className={styles.pillarHeader}>
                    <Cpu size={17} className={styles.pillarIcon} />
                    <h3 className={styles.pillarTitle}>Zero-Obligation Project Estimate</h3>
                  </div>
                  <p className={styles.pillarDesc}>
                    Transparent itemized budgeting and timeline breakdown tailored to your scope.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
