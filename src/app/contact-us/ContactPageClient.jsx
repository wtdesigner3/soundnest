'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Phone, Mail, Clock, ShieldCheck, Send } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FaqAccordion from '@/components/FaqAccordion';
import { contactData } from '@/data/contactData';
import styles from './contact.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactPageClient() {
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
          <div className={styles.titleWrapper}>
            <span className={styles.line} aria-hidden="true" />
            <h1 className={styles.pageTitle}>{contactData.header.title}</h1>
            <span className={styles.lineRight} aria-hidden="true" />
          </div>
          <p className={styles.pageSubtitle}>{contactData.header.subtitle}</p>
        </div>

        {/* Two-Column Grid */}
        <div className={styles.mainGrid}>
          {/* Left Column: Image with Experience Badge */}
          <div className={styles.imageColumn} ref={leftColRef}>
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
              <ShieldCheck className={styles.badgeIcon} size={28} />
              <p className={styles.badgeText}>
                Experience Bespoke Smart Home & Audio Engineering at Our Studio
              </p>
            </div>
          </div>

          {/* Right Column: Business Info & Lead Form */}
          <div className={styles.contentColumn} ref={rightColRef}>
            {/* Business Hours Card */}
            <div className={styles.businessHoursCard}>
              <h2 className={styles.businessHeading}>
                <Clock size={20} />
                {contactData.businessInfo.heading}
              </h2>
              <div className={styles.hoursText}>
                <div>{contactData.businessInfo.hours}</div>
                <div className={styles.hoursHighlight}>{contactData.businessInfo.closed}</div>
              </div>
              <div className={styles.contactLinks}>
                <a href={`tel:${contactData.businessInfo.phone}`} className={styles.contactLink}>
                  <Phone size={16} />
                  <span>{contactData.businessInfo.phoneDisplay}</span>
                </a>
                <span className={styles.linkDivider} aria-hidden="true">|</span>
                <a href={`mailto:${contactData.businessInfo.email}`} className={styles.contactLink}>
                  <Mail size={16} />
                  <span>{contactData.businessInfo.email}</span>
                </a>
              </div>
            </div>

            {/* Interactive Form */}
            <div className={styles.formCard}>
              <form onSubmit={handleSubmit} className={styles.formGrid}>
                {status.message && (
                  <div
                    className={status.type === 'success' ? styles.successMessage : styles.errorMessage}
                    role="alert"
                  >
                    {status.message}
                  </div>
                )}

                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                    className={styles.inputField}
                    aria-label="Your Name"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className={styles.inputField}
                    aria-label="Your Email"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    minLength={10}
                    maxLength={12}
                    required
                    className={styles.inputField}
                    aria-label="Your Phone Number"
                  />
                </div>

                <div className={styles.inputGroup}>
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

                <div className={styles.inputGroup}>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
                    rows={4}
                    className={styles.textareaField}
                    aria-label="Your Message"
                  />
                </div>

                <button type="submit" disabled={loading} className={styles.submitBtn}>
                  {loading ? (
                    <>
                      <span className={styles.spinner} aria-hidden="true" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className={styles.sectionDivider} aria-hidden="true" />

        {/* FAQs Section */}
        <div className={styles.faqSection} ref={faqRef}>
          <div className={styles.headerSection}>
            <div className={styles.titleWrapper}>
              <span className={styles.line} aria-hidden="true" />
              <h2 className={styles.pageTitle}>FAQs</h2>
              <span className={styles.lineRight} aria-hidden="true" />
            </div>
          </div>

          <FaqAccordion faqs={contactData.faqs} />
        </div>
      </div>
    </div>
  );
}
