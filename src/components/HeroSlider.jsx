"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  User,
  Mail,
  Phone,
  Layers,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { heroSlides, serviceTypes } from "@/data/homeData";
import styles from "./HeroSlider.module.css";

export default function HeroSlider({ onOpenConsultation, slides = heroSlides }) {
  const activeSlides = slides && slides.length > 0 ? slides : heroSlides;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "Select Service Type",
    message: "",
  });
  const [status, setStatus] = useState({ submitting: false, success: false, error: null });
  const timerRef = useRef(null);

  // Auto slide interval
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSlides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
      }, 6500);
    }
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setStatus({ submitting: false, success: false, error: "Please fill in all required fields." });
      return;
    }

    setStatus({ submitting: true, success: false, error: null });

    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          serviceType: formData.serviceType === "Select Service Type" ? "Retro Fit Automation" : formData.serviceType,
          message: formData.message,
          source: "Hero Floating Form",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({ submitting: false, success: true, error: null });
        setFormData({
          name: "",
          email: "",
          phone: "",
          serviceType: "Select Service Type",
          message: "",
        });
      } else {
        setStatus({ submitting: false, success: false, error: data.error || "Failed to submit form." });
      }
    } catch {
      setStatus({ submitting: false, success: false, error: "Network error. Please try again." });
    }
  };

  const scrollToServices = () => {
    const el = document.getElementById("services");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderStyledTitle = (title) => {
    if (!title) return null;
    if (title.includes(",")) {
      const parts = title.split(",");
      return (
        <>
          <span>{parts[0]},</span>{" "}
          <span className={styles.goldGradientText}>{parts.slice(1).join(",").trim()}</span>
        </>
      );
    }
    return title;
  };

  return (
    <section className={styles.heroSection} aria-label="Hero Showcase">
      {/* Background Slides */}
      <div className={styles.slidesContainer}>
        {activeSlides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className={`${styles.slide} ${idx === currentSlide ? styles.activeSlide : ""}`}
            aria-hidden={idx !== currentSlide}
          >
            <Image
              src={slide.image}
              alt="Soundnest Luxury Smart Home Automation"
              fill
              priority={idx === 0}
              className={styles.slideImage}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Cinematic Dual-layer Vignette & Ambient Radial Glow */}
      <div className={styles.overlay} />
      <div className={styles.ambientGlow} />
      <div className={styles.ambientLightTop} />

      {/* Content Grid */}
      <div className={`container ${styles.heroContent}`}>
        <div className={styles.heroGrid}>
          {/* Left Text Content */}
          <div className={styles.textContent}>
            <div className={styles.kickerBadge}>
              <span className={styles.badgePulse} aria-hidden="true" />
              <span>{activeSlides[currentSlide]?.kicker || "ALWAYS IN CONTROL"}</span>
            </div>

            <h1 className={styles.title}>
              {renderStyledTitle(activeSlides[currentSlide]?.title)}
            </h1>

            <p className={styles.description}>
              {activeSlides[currentSlide]?.description}
            </p>

            {/* Luxury Trust Micro Pills */}
            <div className={styles.trustPillsRow}>
              <div className={styles.trustPill}>
                <ShieldCheck size={14} className={styles.trustPillIcon} />
                <span>KNX & CEDIA Certified</span>
              </div>
              <div className={styles.trustPill}>
                <Sparkles size={14} className={styles.trustPillIcon} />
                <span>Zero Wall Chipping</span>
              </div>
              <div className={styles.trustPill}>
                <Layers size={14} className={styles.trustPillIcon} />
                <span>Private Dolby Theatres</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.heroActions}>
              <button
                type="button"
                className={styles.primaryCtaBtn}
                onClick={onOpenConsultation}
                id="hero-consultation-btn"
              >
                <span>{activeSlides[currentSlide]?.ctaText || "Get Free Consultation"}</span>
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                className={styles.secondaryCtaBtn}
                onClick={scrollToServices}
              >
                <span>Explore Services</span>
              </button>
            </div>

            {/* Slider Controls with Numbered Progress & Dynamic Fill */}
            <div className={styles.sliderControls}>
              <div className={styles.slideCounter}>
                <span className={styles.counterCurrent}>0{currentSlide + 1}</span>
                <span className={styles.counterDivider}>/</span>
                <span className={styles.counterTotal}>0{activeSlides.length}</span>
              </div>

              <div className={styles.progressBars}>
                {activeSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`${styles.progressBar} ${idx === currentSlide ? styles.progressBarActive : ""}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    <span className={styles.progressFill} />
                  </button>
                ))}
              </div>

              <div className={styles.arrowButtons}>
                <button
                  type="button"
                  onClick={prevSlide}
                  className={styles.arrowBtn}
                  aria-label="Previous Slide"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className={styles.arrowBtn}
                  aria-label="Next Slide"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Glassmorphism Form Card */}
          <div className={styles.formCard}>
            <div className={styles.cardAccentGlow} aria-hidden="true" />

            <div className={styles.formHeader}>
              <div className={styles.formBadge}>
                <span className={styles.badgeLiveDot} aria-hidden="true" />
                <span>PRIORITY ACCESS • AVAILABLE TODAY</span>
              </div>
              <h2 className={styles.formTitle}>Get a Free Quote</h2>
              <p className={styles.formSubtitle}>
                Schedule your personalized smart home walkthrough
              </p>
            </div>

            {status.success ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <div>
                  <strong>Inquiry Submitted!</strong>
                  <p>Our automation engineering team will contact you shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                {status.error && (
                  <div className={styles.errorMessage}>{status.error}</div>
                )}

                <div className={styles.inputWrapper}>
                  <User size={16} className={styles.inputIcon} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    placeholder="Phone Number *"
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
                    onChange={handleInputChange}
                    className={styles.selectField}
                    aria-label="Select Service Type"
                  >
                    <option value="Select Service Type">Select Service Type</option>
                    {serviceTypes.map((type, i) => (
                      <option key={i} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputWrapper}>
                  <MessageSquare size={16} className={`${styles.inputIcon} ${styles.textareaIcon}`} />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your villa, apartment, or project..."
                    rows={3}
                    className={styles.textareaField}
                    aria-label="Your Message"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status.submitting}
                  className={styles.submitBtn}
                >
                  <span>{status.submitting ? "Submitting Request..." : "Request Free Consultation"}</span>
                  <ArrowRight size={16} />
                </button>

                <div className={styles.formReassurance}>
                  <CheckCircle2 size={13} className={styles.reassuranceCheck} />
                  <span>Complimentary Site Survey • Zero Obligation</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
