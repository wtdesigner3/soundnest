'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Home,
  Lightbulb,
  Fan,
  Thermometer,
  Tv,
  ToggleLeft,
  LayoutDashboard,
  Leaf,
  ShieldCheck,
  Sliders,
  Zap,
  Wifi,
  Building,
  Volume2,
  Layers,
  Sun,
  Radio,
  Eye,
  Cpu,
  Speaker,
  Projector,
  Activity,
  Film,
  Music,
  CheckCircle2,
  ChevronRight,
  Star,
  ArrowRight,
  PhoneCall,
  Clock,
  ShieldAlert,
  User,
  Mail,
  Phone,
  MessageSquare,
} from 'lucide-react';
import FaqAccordion from '@/components/FaqAccordion';
import ConsultationModal from '@/components/ConsultationModal';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import { brandsList, testimonialsData, serviceTypes } from '@/data/homeData';
import styles from './ServiceTemplate.module.css';

// Dynamic icon mapper for service features
function getServiceIcon(iconName) {
  const props = { size: 24, strokeWidth: 1.75 };
  switch (iconName?.toLowerCase()) {
    case 'wallet':
      return <Zap {...props} />;
    case 'sparkles':
      return <Sparkles {...props} />;
    case 'home':
      return <Home {...props} />;
    case 'lightbulb':
      return <Lightbulb {...props} />;
    case 'fan':
      return <Fan {...props} />;
    case 'thermometer':
      return <Thermometer {...props} />;
    case 'tv':
      return <Tv {...props} />;
    case 'toggle':
      return <ToggleLeft {...props} />;
    case 'dashboard':
      return <LayoutDashboard {...props} />;
    case 'leaf':
      return <Leaf {...props} />;
    case 'shield':
      return <ShieldCheck {...props} />;
    case 'controls':
      return <Sliders {...props} />;
    case 'bolt':
      return <Zap {...props} />;
    case 'wifi':
      return <Wifi {...props} />;
    case 'building':
      return <Building {...props} />;
    case 'volume':
      return <Volume2 {...props} />;
    case 'layers':
      return <Layers {...props} />;
    case 'sun':
      return <Sun {...props} />;
    case 'remote':
      return <Radio {...props} />;
    case 'eye':
      return <Eye {...props} />;
    case 'cpu':
      return <Cpu {...props} />;
    case 'speaker':
      return <Speaker {...props} />;
    case 'projector':
      return <Projector {...props} />;
    case 'wave':
      return <Activity {...props} />;
    case 'film':
      return <Film {...props} />;
    case 'music':
      return <Music {...props} />;
    default:
      return <Sparkles {...props} />;
  }
}

export default function ServiceTemplate({ service }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dynamicHome, setDynamicHome] = useState(null);
  const [dynamicSettings, setDynamicSettings] = useState(null);

  useEffect(() => {
    fetch('/api/admin/home/')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setDynamicHome(data);
      })
      .catch(() => {});

    fetch('/api/admin/settings/')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setDynamicSettings(data);
      })
      .catch(() => {});
  }, []);

  const currentBrands = dynamicHome?.brands || brandsList;
  const currentTestimonials = dynamicHome?.testimonials || testimonialsData;
  const whatsappNumber = dynamicSettings?.social?.whatsapp || '919049295678';

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: service?.name || 'Retro Fit Automation',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState({
    submitting: false,
    success: false,
    error: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.phone.trim()) {
      setSubmitStatus({
        submitting: false,
        success: false,
        error: 'Please fill in all required fields (Name, Email, Phone).',
      });
      return;
    }

    setSubmitStatus({ submitting: true, success: false, error: null });

    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          source: `Service Page Hero: ${service.name}`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitStatus({ submitting: false, success: true, error: null });
        setFormState({
          name: '',
          email: '',
          phone: '',
          serviceType: service?.name || 'Retro Fit Automation',
          message: '',
        });
      } else {
        setSubmitStatus({
          submitting: false,
          success: false,
          error: data.error || 'Failed to submit request. Please try again.',
        });
      }
    } catch {
      setSubmitStatus({
        submitting: false,
        success: false,
        error: 'Network error. Please check your connection and try again.',
      });
    }
  };

  if (!service) return null;

  return (
    <div className={styles.pageContainer}>
      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li className={styles.breadcrumbSeparator} aria-hidden="true">
            /
          </li>
          <li>
            <Link href="/#services">Services</Link>
          </li>
          <li className={styles.breadcrumbSeparator} aria-hidden="true">
            /
          </li>
          <li className={styles.breadcrumbCurrent} aria-current="page">
            {service.name}
          </li>
        </ol>
      </nav>

      {/* ==================================================================
          Hero Section with Background Image & Direct Lead Form
          ================================================================== */}
      <section className={styles.heroSectionWrapper}>
        <div className={styles.heroBgMedia}>
          <Image
            src={service.heroBgImage || service.heroImage || '/images/service-1-bg.jpg'}
            alt={`${service.name} Background`}
            fill
            priority
            sizes="100vw"
            className={styles.heroBgImg}
          />
          <div className={styles.heroOverlay} />
        </div>

        <div className={styles.heroGlow} aria-hidden="true" />

        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
          {service.badge && (
            <div className={styles.badge}>
              <Sparkles size={14} />
              <span>{service.badge}</span>
            </div>
          )}

          <h1 className={styles.heroTitle}>{service.h1}</h1>

          <p className={styles.heroSubtitle}>{service.heroSubtitle}</p>

          <div className={styles.pillList}>
            <div className={styles.pillItem}>
              <CheckCircle2 size={16} className={styles.pillIcon} />
              <span>100% Turnkey Solution</span>
            </div>
            <div className={styles.pillItem}>
              <Clock size={16} className={styles.pillIcon} />
              <span>Quick Deployment</span>
            </div>
            <div className={styles.pillItem}>
              <ShieldAlert size={16} className={styles.pillIcon} />
              <span>Manufacturer Warranty</span>
            </div>
          </div>

          <div className={styles.heroActions}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => setIsModalOpen(true)}
              id="hero-book-consultation-btn"
            >
              <PhoneCall size={18} />
              <span>Book Free Consultation</span>
            </button>
            <a href="#features" className={styles.secondaryBtn}>
              <span>Explore Features</span>
              <ChevronRight size={16} />
            </a>
          </div>
        </div>

        {/* Hero Quick Consultation Form */}
        <div className={styles.heroFormCard}>
          <div className={styles.cardAccentGlow} aria-hidden="true" />
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Book Free Consultation</h2>
            <p className={styles.formSubtitle}>
              Connect with our automation engineers for a custom quote & site plan.
            </p>
          </div>

          {submitStatus.success ? (
            <div className={styles.successAlert}>
              <strong>✓ Consultation Booked!</strong>
              <p>Thank you! Our automation specialist will get in touch with you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className={styles.heroForm} noValidate>
              {submitStatus.error && (
                <div className={styles.errorAlert}>{submitStatus.error}</div>
              )}

              <div className={styles.inputWrapper}>
                <User size={16} className={styles.inputIcon} />
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  placeholder="Full Name *"
                  required
                  className={styles.formInput}
                  aria-label="Full Name"
                />
              </div>

              <div className={styles.inputWrapper}>
                <Phone size={16} className={styles.inputIcon} />
                <input
                  type="tel"
                  name="phone"
                  value={formState.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number *"
                  required
                  className={styles.formInput}
                  aria-label="Phone Number"
                />
              </div>

              <div className={styles.inputWrapper}>
                <Mail size={16} className={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  placeholder="Email Address *"
                  required
                  className={styles.formInput}
                  aria-label="Email Address"
                />
              </div>

              <div className={styles.inputWrapper}>
                <Layers size={16} className={styles.inputIcon} />
                <select
                  name="serviceType"
                  value={formState.serviceType}
                  onChange={handleInputChange}
                  className={styles.formSelect}
                  aria-label="Select Service Type"
                >
                  <option value={service.name}>{service.name}</option>
                  {serviceTypes
                    .filter((t) => t !== service.name)
                    .map((type, idx) => (
                      <option key={idx} value={type}>
                        {type}
                      </option>
                    ))}
                </select>
              </div>

              <div className={styles.inputWrapper}>
                <MessageSquare size={16} className={`${styles.inputIcon} ${styles.textareaIcon}`} />
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleInputChange}
                  placeholder="City / Project Requirements (Optional)"
                  rows={2}
                  className={styles.formTextarea}
                  aria-label="Project Notes"
                />
              </div>

              <button
                type="submit"
                disabled={submitStatus.submitting}
                className={styles.formSubmitBtn}
              >
                <span>{submitStatus.submitting ? 'Submitting...' : 'Book Free Consultation'}</span>
                <ArrowRight size={16} />
              </button>

              <div className={styles.formPrivacy}>
                <CheckCircle2 size={13} className={styles.reassuranceCheck} />
                <span>Complimentary Site Survey • 100% Confidential</span>
              </div>
            </form>
          )}
        </div>
        </div>
      </section>

      {/* ==================================================================
          SOUNDNEST EXPERIENCE (Why Choose Us) - Alternating Light Luxury Section
          ================================================================== */}
      {service.experiencePoints && service.experiencePoints.length > 0 && (
        <section className={`${styles.sectionWrapper} ${styles.sectionLight}`}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionKicker}>{service.experienceKicker}</span>
              <h2 className={styles.sectionTitle}>{service.experienceTitle}</h2>
              {service.experienceDescription && (
                <p className={styles.sectionSubtitle}>{service.experienceDescription}</p>
              )}
            </div>

            <div className={styles.experienceGrid}>
              {service.experiencePoints.map((point, index) => (
                <div key={index} className={styles.experienceCard}>
                  <div className={styles.cardIconBox}>
                    {getServiceIcon(point.icon)}
                  </div>
                  <h3 className={styles.cardTitle}>{point.title}</h3>
                  <p className={styles.cardText}>{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================================================================
          FEATURE MATRIX GRID
          ================================================================== */}
      {service.features && service.features.length > 0 && (
        <section id="features" className={styles.sectionWrapper}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionKicker}>{service.featuresKicker}</span>
              <h2 className={styles.sectionTitle}>{service.featuresTitle}</h2>
              <p className={styles.sectionSubtitle}>
                Precision-engineered capabilities tailored for comfort, luxury, and intuitive control.
              </p>
            </div>

            <div className={styles.featuresGrid}>
              {service.features.map((feature, idx) => (
                <div key={idx} className={styles.featureCard}>
                  {feature.image && (
                    <div className={styles.featureCardBg}>
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={styles.featureCardImg}
                      />
                      <div className={styles.featureCardOverlay} />
                    </div>
                  )}
                  <div className={styles.featureCardContent}>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================================================================
          OUR PROCESS / DEEP DIVE SHOWCASE & GALLERY - Alternating Light Alt Section
          ================================================================== */}
      <section className={`${styles.sectionWrapper} ${styles.sectionLightAlt}`}>
        <div className={styles.sectionInner}>
          <div className={styles.processGrid}>
            <div className={styles.processContent}>
              <span className={styles.sectionKicker}>{service.processKicker}</span>
              <h2 className={styles.processHeading}>{service.processTitle}</h2>
              {service.processSubtitle && (
                <h3 className={styles.processSubheading}>{service.processSubtitle}</h3>
              )}

              {service.processParagraphs?.map((para, pIdx) => (
                <p key={pIdx} className={styles.processBodyText}>
                  {para}
                </p>
              ))}

              <ul className={styles.processHighlights}>
                <li className={styles.processHighlightItem}>
                  <CheckCircle2 size={18} className={styles.checkIcon} />
                  <span>Custom engineering schematics & cable planning</span>
                </li>
                <li className={styles.processHighlightItem}>
                  <CheckCircle2 size={18} className={styles.checkIcon} />
                  <span>Certified KNX & Control4 automation programmers</span>
                </li>
                <li className={styles.processHighlightItem}>
                  <CheckCircle2 size={18} className={styles.checkIcon} />
                  <span>Lifetime after-sales service & dedicated technical support</span>
                </li>
              </ul>

              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => setIsModalOpen(true)}
              >
                <span>Speak with an Engineer</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Showcase Visual Gallery */}
            {service.gallery && service.gallery.length > 0 && (
              <div className={styles.galleryGrid}>
                {service.gallery.slice(0, 5).map((item, gIdx) => (
                  <div key={gIdx} className={styles.galleryItem}>
                    <Image
                      src={item.url}
                      alt={item.title || service.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={styles.galleryImg}
                    />
                    <div className={styles.galleryCaption}>{item.title}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================================================================
          AUTHORIZED BRANDS MARQUEE - Alternating Light Section
          ================================================================== */}
      <section className={`${styles.sectionWrapper} ${styles.sectionLight}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>PARTNERSHIPS</span>
            <h2 className={styles.sectionTitle}>Brands We Deal In</h2>
            <p className={styles.sectionSubtitle}>
              Soundnest is an authorized systems integrator for the world’s most prestigious automation and audio-visual manufacturers.
            </p>
          </div>

          <div className={styles.brandsWrapper}>
            <div className={styles.brandsTrack}>
              {[...(currentBrands || []), ...(currentBrands || [])].map((brand, bIdx) => (
                <div key={bIdx} className={styles.brandLogoBox}>
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={100}
                    height={40}
                    className={styles.brandImg}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          CLIENT TESTIMONIALS - Alternating Light Alt Section
          ================================================================== */}
      <section className={`${styles.sectionWrapper} ${styles.sectionLightAlt}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>{currentTestimonials?.kicker}</span>
            <h2 className={styles.sectionTitle}>{currentTestimonials?.title}</h2>
          </div>

          <TestimonialCarousel items={currentTestimonials?.items || []} />
        </div>
      </section>

      {/* ==================================================================
          FREQUENTLY ASKED QUESTIONS - Alternating Light Section
          ================================================================== */}
      {service.faqs && service.faqs.length > 0 && (
        <section className={`${styles.sectionWrapper} ${styles.sectionLight}`}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionKicker}>FAQ</span>
              <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
              <p className={styles.sectionSubtitle}>
                Clear answers to common questions about {service.name.toLowerCase()} design, integration, and timelines.
              </p>
            </div>

            <div style={{ maxWidth: '860px', margin: '0 auto' }}>
              <FaqAccordion faqs={service.faqs} />
            </div>
          </div>
        </section>
      )}

      {/* ==================================================================
          BOTTOM CONSULTATION CTA BANNER
          ================================================================== */}
      <div className={styles.ctaBannerWrapper}>
        <div className={styles.ctaCard}>
          <div className={styles.cardAccentGlow} aria-hidden="true" />
          <div className={styles.ctaCardGlow} aria-hidden="true" />
          <h2 className={styles.ctaTitle}>Ready to Upgrade Your Living Experience?</h2>
          <p className={styles.ctaSubtitle}>
            Our engineers are ready to design a tailored {service.name.toLowerCase()} system for your villa, apartment, or commercial space.
          </p>
          <div className={styles.ctaButtons}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => setIsModalOpen(true)}
              id="cta-bottom-consultation-btn"
            >
              <PhoneCall size={18} />
              <span>Book Free Consultation</span>
            </button>
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hi%20Soundnest%2C%20I%20am%20interested%20in%20your%20services`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryBtn}
            >
              <span>Chat on WhatsApp</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Reusable Consultation Popup Modal */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultService={service.name}
      />
    </div>
  );
}
