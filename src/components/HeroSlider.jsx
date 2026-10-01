"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
    }, 6000);

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
      }, 6000);
    }
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
              alt="Soundnest Smart Home Automation Solutions"
              fill
              priority={idx === 0}
              className={styles.slideImage}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Dark Ambient Overlay */}
      <div className={styles.overlay} />

      {/* Content Grid */}
      <div className={`container ${styles.heroContent}`}>
        <div className={styles.heroGrid}>
          {/* Left Text Content */}
          <div className={styles.textContent}>
            <span className={styles.kicker}>
              {activeSlides[currentSlide]?.kicker}
            </span>
            <h2 className={styles.title}>
              {activeSlides[currentSlide]?.title}
            </h2>
            <p className={styles.description}>
              {activeSlides[currentSlide]?.description}
            </p>
            <button
              type="button"
              className="btn-pill-white"
              onClick={onOpenConsultation}
              id="hero-consultation-btn"
            >
              {activeSlides[currentSlide]?.ctaText || "Get Free Consultation"}
            </button>
          </div>

          {/* Right Glassmorphism Form Card */}
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h3 className={styles.formTitle}>Get a Free Quote</h3>
              <p className={styles.formSubtitle}>
                Schedule your personalized smart home walkthrough
              </p>
            </div>

            {status.success ? (
              <div className={styles.successMessage}>
                ✓ Thank you! Your request has been received. Our team will contact you shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                {status.error && (
                  <div className={styles.errorMessage}>{status.error}</div>
                )}

                <div className={styles.formGroup}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name *"
                    required
                    className={styles.inputField}
                    aria-label="Your Name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email *"
                    required
                    className={styles.inputField}
                    aria-label="Your Email"
                  />
                </div>

                <div className={styles.formGroup}>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone *"
                    required
                    className={styles.inputField}
                    aria-label="Your Phone Number"
                  />
                </div>

                <div className={styles.formGroup}>
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

                <div className={styles.formGroup}>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Message (Optional)"
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
                  {status.submitting ? "Submitting..." : "Submit"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Slide Navigation Bullets */}
      <div className={styles.indicators}>
        {activeSlides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`${styles.bullet} ${idx === currentSlide ? styles.activeBullet : ""}`}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
