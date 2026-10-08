"use client";

import { useState, useEffect } from "react";
import { X, User, Mail, Phone, Layers, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { serviceTypes } from "@/data/homeData";
import styles from "./ConsultationModal.module.css";

export default function ConsultationModal({ isOpen, onClose, defaultService = "Select Service Type" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: defaultService,
    message: "",
  });
  const [status, setStatus] = useState({ submitting: false, success: false, error: null });

  useEffect(() => {
    if (defaultService) {
      setFormData((prev) => ({ ...prev, serviceType: defaultService }));
    }
  }, [defaultService, isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
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
          serviceType: formData.serviceType === "Select Service Type" ? "General Consultation" : formData.serviceType,
          message: formData.message,
          source: "Consultation Popup Modal",
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
        setStatus({ submitting: false, success: false, error: data.error || "Failed to submit request." });
      }
    } catch {
      setStatus({ submitting: false, success: false, error: "Network error. Please try again." });
    }
  };

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal}>
        {/* Top Accent Glow Laser */}
        <div className={styles.cardAccentGlow} aria-hidden="true" />

        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className={styles.header}>
          <div className={styles.kickerBadge}>
            <span className={styles.badgePulse} aria-hidden="true" />
            <span>PRIVATE WALKTHROUGH & SURVEY</span>
          </div>
          <h2 id="modal-title" className={styles.title}>
            Book Your Free <span className={styles.goldGradient}>Consultation</span>
          </h2>
          <p className={styles.subtitle}>
            Speak directly with our senior automation architects to explore bespoke solutions for your space.
          </p>
        </div>

        {status.success ? (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <div>
              <strong>Consultation Request Received!</strong>
              <p>Our engineering team will contact you shortly to confirm your walkthrough time.</p>
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
                {serviceTypes.map((type, idx) => (
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
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your villa, apartment, or project requirements..."
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
              <span>{status.submitting ? "Booking Consultation..." : "Request Free Consultation"}</span>
              <ArrowRight size={16} />
            </button>

            <div className={styles.formReassurance}>
              <CheckCircle2 size={13} className={styles.reassuranceCheck} />
              <span>Complimentary Site Survey • Zero Obligation • 100% Confidential</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
