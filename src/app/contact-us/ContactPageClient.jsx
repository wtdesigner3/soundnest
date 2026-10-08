'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  ShieldCheck,
  Send,
  User,
  Layers,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FaqAccordion from '@/components/FaqAccordion';
import { contactData } from '@/data/contactData';
import styles from './contact.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactPageClient() {
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    fetch('/api/admin/settings/')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSiteSettings(data);
      })
      .catch(() => { });
  }, []);

  const currentPhone = siteSettings?.contact?.phone || contactData.businessInfo.phoneDisplay;
  const currentPhoneRaw = siteSettings?.contact?.phoneRaw || contactData.businessInfo.phone;
  const currentEmail = siteSettings?.contact?.email || contactData.businessInfo.email;
  const currentHours = siteSettings?.contact?.businessHours || contactData.businessInfo.hours;
  const currentAddress = siteSettings?.contact?.address || "Q 24, Block Q, Lajpat Nagar IV, New Delhi, Delhi 110024";

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'Select Service Type',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const faqRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from(headerRef.current, {
        y: 25,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        immediateRender: false,
      });

      // Main grid entrance
      if (leftColRef.current && rightColRef.current) {
        gsap.from(leftColRef.current, {
          scrollTrigger: {
            trigger: leftColRef.current,
            start: 'top 85%',
          },
          x: -30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          immediateRender: false,
        });

        gsap.from(rightColRef.current, {
          scrollTrigger: {
            trigger: rightColRef.current,
            start: 'top 85%',
          },
          x: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          immediateRender: false,
        });
      }

      // FAQ section entrance
      if (faqRef.current) {
        gsap.from(faqRef.current, {
          scrollTrigger: {
            trigger: faqRef.current,
            start: 'top 85%',
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          immediateRender: false,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    if (formData.phone.trim().length < 10) {
      setStatus({ type: 'error', message: 'Please enter a valid phone number (at least 10 digits).' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          serviceType: formData.serviceType === 'Select Service Type' ? 'General Inquiry' : formData.serviceType,
          message: formData.message || 'Demo consultation request from Contact Us page',
          source: 'Contact Us Page',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          type: 'success',
          message: 'Thank you! Your request has been sent successfully. Our team will contact you shortly.',
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          serviceType: 'Select Service Type',
          message: '',
        });
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'Something went wrong. Please call us directly at +91-9049295678.',
        });
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setStatus({
        type: 'error',
        message: 'Network error. Please try again or call us at +91-9049295678.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contactPage} ref={containerRef}>
      <div className={styles.container}>
        {/* Header Title & Subtitle */}
        <div className={styles.headerSection} ref={headerRef}>
          <div className={styles.kickerBadge}>
            <span className={styles.badgePulse} aria-hidden="true" />
            <span>EXPERIENCE STUDIO & INQUIRIES</span>
          </div>

          <h1 className={styles.pageTitle}>
            Connect with <span className={styles.goldGradient}>Soundnest</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Visit our flagship Experience Studio in New Delhi or schedule an on-site villa consultation anywhere across India.
          </p>
        </div>

        {/* Two-Column Grid */}
        <div className={styles.mainGrid}>
          {/* Left Column: Image with Experience Badge & Quick Info Tiles */}
          <div className={styles.imageColumn} ref={leftColRef}>
            <div className={styles.imageCard}>
              <div className={styles.imageWrapper}>
                <Image
                  src={contactData.businessInfo.image}
                  alt={contactData.businessInfo.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 991px) 100vw, 50vw"
                  className={styles.featureImage}
                />
              </div>
              <div className={styles.imageBadge}>
                <Sparkles className={styles.badgeIcon} size={18} />
                <p className={styles.badgeText}>
                  Private 4K HDR & Dolby Atmos Lounge • Delhi Studio
                </p>
              </div>
            </div>

            {/* Quick Contact Information Tiles */}
            <div className={styles.infoTilesGrid}>
              <a href={`tel:${currentPhoneRaw}`} className={styles.infoTile}>
                <div className={styles.infoIconBox}>
                  <Phone size={18} />
                  <span className={styles.livePulseDot} aria-hidden="true" />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Direct Line</span>
                  <span className={styles.infoValue}>{currentPhone}</span>
                </div>
              </a>

              <a href={`mailto:${currentEmail}`} className={styles.infoTile}>
                <div className={styles.infoIconBox}>
                  <Mail size={18} />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Email Inquiries</span>
                  <span className={styles.infoValue}>{currentEmail}</span>
                </div>
              </a>

              <div className={styles.infoTile}>
                <div className={styles.infoIconBox}>
                  <Clock size={18} />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Studio Hours</span>
                  <span className={styles.infoValue}>{currentHours}</span>
                </div>
              </div>

              <div className={styles.infoTile}>
                <div className={styles.infoIconBox}>
                  <MapPin size={18} />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Flagship Studio</span>
                  <span className={styles.infoValue}>{currentAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Luxury Form Terminal */}
          <div className={styles.contentColumn} ref={rightColRef}>
            <div className={styles.formCard}>
              <div className={styles.cardAccentGlow} aria-hidden="true" />

              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Schedule a Private Demo</h2>
                <p className={styles.formSubtitle}>
                  Speak directly with our smart home and acoustic architects to design your system.
                </p>
              </div>

              {status.message && (
                <div
                  className={status.type === 'success' ? styles.successMessage : styles.errorMessage}
                  role="alert"
                >
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.formGrid}>
                <div className={styles.inputWrapper}>
                  <User size={16} className={styles.inputIcon} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name *"
                    required
                    className={styles.inputField}
                    aria-label="Your Name"
                  />
                </div>

                <div className={styles.inputWrapper}>
                  <Mail size={16} className={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address *"
                    required
                    className={styles.inputField}
                    aria-label="Your Email"
                  />
                </div>

                <div className={styles.inputWrapper}>
                  <Phone size={16} className={styles.inputIcon} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number *"
                    minLength={10}
                    maxLength={14}
                    required
                    className={styles.inputField}
                    aria-label="Your Phone Number"
                  />
                </div>

                <div className={styles.inputWrapper}>
                  <Layers size={16} className={styles.inputIcon} />
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className={styles.selectField}
                    aria-label="Select Service Type"
                  >
                    <option value="Select Service Type">Select Service Type</option>
                    {contactData.servicesList.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputWrapper}>
                  <MessageSquare size={16} className={`${styles.inputIcon} ${styles.textareaIcon}`} />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your residence, floor plan, or project timeline..."
                    rows={4}
                    className={styles.textareaField}
                    aria-label="Your Message"
                  />
                </div>

                <button type="submit" disabled={loading} className={styles.submitBtn}>
                  {loading ? (
                    <>
                      <span className={styles.spinner} aria-hidden="true" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Consultation Request</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                {/* 
                <div className={styles.formReassurance}>
                  <CheckCircle2 size={13} className={styles.reassuranceCheck} />
                  <span>Complimentary Site Survey • Zero Obligation • 100% Confidential</span>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section (Architectural Light Canvas) */}
      <section className={styles.faqSectionWrap}>
        <div className={styles.faqInnerContainer}>
          <div className={styles.faqSection} ref={faqRef}>
            <div className={styles.faqHeader}>
              <div className={styles.kickerBadgeLight}>
                <span className={styles.badgePulseGold} aria-hidden="true" />
                <span>FREQUENTLY ASKED QUESTIONS</span>
              </div>
              <h2 className={styles.faqTitleLight}>Everything You Need to Know</h2>
              <p className={styles.faqSubtitleLight}>
                Helpful answers before scheduling your smart home consultation and studio visit.
              </p>
            </div>

            <div className={styles.faqContainerLight}>
              <FaqAccordion faqs={contactData.faqs} theme="light" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
