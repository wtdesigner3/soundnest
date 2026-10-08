'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  Cpu,
  Layers,
  Sparkles,
  Phone,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Tv,
  Home as HomeIcon,
  ChevronRight,
} from 'lucide-react';
import BrandsMarquee from '@/components/BrandsMarquee';
import CtaBanner from '@/components/CtaBanner';
import ConsultationModal from '@/components/ConsultationModal';
import styles from './about.module.css';

export default function AboutUsClient({ data, companyInfo }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const paragraphs = data?.paragraphs || [];

  const pillars = [
    {
      number: '01',
      icon: <Cpu size={26} />,
      title: 'KNX Open Standard',
      desc: 'Standardized European protocol connecting climate, lighting, and access control across multi-brand devices without vendor lock-in.',
    },
    {
      number: '02',
      icon: <Layers size={26} />,
      title: 'Zero Wall Chipping',
      desc: 'Clean retrofit smart technology that integrates seamlessly into existing electrical junction boxes with no civil disruptions or dust.',
    },
    {
      number: '03',
      icon: <Tv size={26} />,
      title: 'CEDIA Certified Cinemas',
      desc: 'Precision audio-video engineering with Dolby Atmos 9.4.6 acoustic calibration, laser 4K projection, and custom ambient lighting.',
    },
    {
      number: '04',
      icon: <HomeIcon size={26} />,
      title: 'Bespoke Centralization',
      desc: 'One unified interface across wall keypads, mobile apps, and touchscreens tailored specifically to your family’s daily routine.',
    },
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Architectural Blueprint Audit',
      desc: 'We review your floor plans, lighting schedules, and acoustic objectives to engineer an optimal automation topology.',
    },
    {
      step: '02',
      title: 'Schematics & Product Selection',
      desc: 'Detailed electrical wiring diagrams, device specs, and brand integration tailored strictly to your aesthetic and functional goals.',
    },
    {
      step: '03',
      title: 'Precision Turnkey Integration',
      desc: 'Our certified engineers handle cabling, module placement, motor mounting, and smart rack assembly with zero compromise on craftsmanship.',
    },
    {
      step: '04',
      title: 'Calibration & Handover',
      desc: 'Scene fine-tuning, acoustic EQ balancing, comprehensive client walkthrough, and lifetime post-deployment support.',
    },
  ];

  return (
    <div className={styles.aboutPage}>
      {/* 1. HERO SECTION (Dark Luxury) */}
      <section className={styles.heroSection}>
        <div className={styles.ambientGlow} />
        <div className={`container ${styles.heroContainer}`}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumbs">
            <Link href="/" className={styles.breadcrumbLink}>
              Home
            </Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className={styles.breadcrumbCurrent} aria-current="page">
              About Us
            </span>
          </nav>

          <div className={styles.kickerBadge}>
            <Sparkles size={14} className={styles.badgeSparkle} />
            <span>PIONEERING LUXURY SMART LIVING</span>
          </div>

          <h1 className={styles.heroTitle}>
            Engineering Intelligent Spaces,{' '}
            <span className={styles.titleGradient}>Crafted For Absolute Comfort</span>
          </h1>

          <p className={styles.heroSubtitle}>
            India’s premier systems integrator delivering bespoke KNX automation, architectural acoustics, and high-performance private cinema experiences.
          </p>

          <div className={styles.heroMetrics}>
            <div className={styles.metricItem}>
              <span className={styles.metricNum}>10+</span>
              <span className={styles.metricLabel}>Years Industry Excellence</span>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metricItem}>
              <span className={styles.metricNum}>500+</span>
              <span className={styles.metricLabel}>Luxury Homes Automated</span>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metricItem}>
              <span className={styles.metricNum}>100%</span>
              <span className={styles.metricLabel}>Bespoke Engineering</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HERITAGE & VISION (Architectural White Canvas) */}
      <section className={styles.storySection}>
        <div className={`container ${styles.storyGrid}`}>
          {/* Left Column: Image Card with Floating Badges */}
          <div className={styles.imageColumn}>
            <div className={styles.imageCard}>
              <div className={styles.imageWrapper}>
                <Image
                  src={data?.image || '/images/about-us.jpg'}
                  alt="About Soundnest - Best Home Automation Companies in India"
                  width={720}
                  height={760}
                  className={styles.aboutImg}
                  priority
                />
              </div>

              {/* Certified Badge */}
              <div className={styles.floatingCertBadge}>
                <ShieldCheck size={18} className={styles.certIcon} />
                <span>Certified KNX & CEDIA Systems Integrator</span>
              </div>

              {/* Overlapping Floating Stats Card */}
              <div className={styles.floatingStats}>
                <div className={styles.statBox}>
                  <Award size={22} className={styles.statIcon} />
                  <div>
                    <span className={styles.statNum}>Pan-India</span>
                    <span className={styles.statSub}>Presence & Support</span>
                  </div>
                </div>
                <div className={styles.statBoxDivider} />
                <div className={styles.statBox}>
                  <Sliders size={22} className={styles.statIcon} />
                  <div>
                    <span className={styles.statNum}>Turnkey</span>
                    <span className={styles.statSub}>End-to-End Execution</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Content */}
          <div className={styles.contentColumn}>
            <div className={styles.sectionKicker}>
              <span className={styles.pulseDot} />
              <span>{data?.kicker || 'ABOUT SOUNDNEST'}</span>
            </div>

            <h2 className={styles.storyTitle}>{data?.title || 'Best Home Automation Smart Comfort & Efficiency'}</h2>

            <div className={styles.narrativeParagraphs}>
              {paragraphs.map((para, index) => (
                <p key={index} className={styles.paragraph}>
                  {para}
                </p>
              ))}
            </div>

            <div className={styles.ctaRow}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => setIsModalOpen(true)}
              >
                <span>{data?.ctaText || "Let's Connect"}</span>
                <ArrowRight size={17} />
              </button>

              <a
                href={`tel:${companyInfo?.phoneRaw || '+919049295678'}`}
                className={styles.phoneBadge}
                title={`Call ${companyInfo?.name || 'Soundnest'}`}
              >
                <div className={styles.phoneIconBox}>
                  <Phone size={16} />
                </div>
                <div>
                  <span className={styles.phoneLabel}>Speak to an Engineer</span>
                  <span className={styles.phoneNumber}>{companyInfo?.phone || '+91 90492 95678'}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE ENGINEERING STANDARDS (Dark Obsidian Bento) */}
      <section className={styles.standardsSection}>
        <div className={styles.standardsAmbient} />
        <div className={`container ${styles.standardsContainer}`}>
          <div className={styles.sectionHeader}>
            <span className={styles.darkKicker}>PRECISION CAPABILITIES</span>
            <h2 className={styles.darkTitle}>
              Built on High-Performance <span className={styles.titleGradient}>Engineering Standards</span>
            </h2>
            <p className={styles.darkSubtitle}>
              Every system we engineer integrates certified protocols, military-grade reliability, and intuitive human interfaces.
            </p>
          </div>

          <div className={styles.pillarsGrid}>
            {pillars.map((pillar) => (
              <div key={pillar.number} className={styles.pillarCard}>
                <div className={styles.pillarTop}>
                  <div className={styles.pillarIconBox}>{pillar.icon}</div>
                  <span className={styles.pillarNum}>{pillar.number}</span>
                </div>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                <p className={styles.pillarDesc}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EXECUTION METHODOLOGY (Architectural Off-White #f8f9fc) */}
      <section className={styles.processSection}>
        <div className={`container ${styles.processContainer}`}>
          <div className={styles.sectionHeaderLight}>
            <span className={styles.lightKicker}>THE SOUNDNEST JOURNEY</span>
            <h2 className={styles.lightTitle}>
              Four Steps to an <span className={styles.titleGold}>Intelligent Residence</span>
            </h2>
            <p className={styles.lightSubtitle}>
              Our systematic approach guarantees clean project execution, transparent milestones, and zero post-installation headaches.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            {processSteps.map((step) => (
              <div key={step.step} className={styles.stepCard}>
                <span className={styles.stepBadge}>{step.step}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GLOBAL PARTNERS */}
      <section className={styles.partnersSection}>
        <BrandsMarquee />
      </section>

      {/* 6. BOTTOM CONSULTATION BANNER */}
      <CtaBanner onOpenConsultation={() => setIsModalOpen(true)} />

      {/* Consultation Popup Modal */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
