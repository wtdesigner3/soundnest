import { useState } from "react";
import Image from "next/image";
import { User, Mail, Phone, Layers, MessageSquare, ArrowRight, Sparkles } from "lucide-react";
import { contactSectionData, serviceTypes, companyInfo } from "@/data/homeData";
import styles from "./ContactSection.module.css";

export default function ContactSection({ data = contactSectionData }) {
  const activeData = data || contactSectionData;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "Select Service Type",
    message: "",
  });
  const [status, setStatus] = useState({ submitting: false, success: false, error: null });

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
          serviceType: formData.serviceType === "Select Service Type" ? "General Inquiry" : formData.serviceType,
          message: formData.message,
          source: "Contact Us Section Form",
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
        setStatus({ submitting: false, success: false, error: data.error || "Failed to send message." });
      }
    } catch {
      setStatus({ submitting: false, success: false, error: "Network error. Please try again." });
    }
  };

  return (
    <section className={styles.contactSection} id="contact" aria-label="Contact Soundnest">
      <div className={styles.ambientGlow} />

      <div className="container">
        <div className={styles.grid}>
          {/* Left Column: Heading, Cinema Demo Visual & Direct Studio Details */}
          <div className={`${styles.leftColumn} contact-animate`}>
            <div className={styles.kickerBadge}>
              <span className={styles.badgePulse} aria-hidden="true" />
              <span>EXPERIENCE STUDIO</span>
            </div>

            <h2 className={styles.title}>{activeData.title || contactSectionData.title}</h2>
            <p className={styles.subtitle}>{activeData.subtitle || contactSectionData.subtitle}</p>

            <div className={styles.imageCard}>
              <div className={styles.imageWrapper}>
                <Image
                  src={activeData.image || contactSectionData.image}
                  alt="Soundnest Home Cinema Audio Video Demo Setup"
                  width={700}
                  height={420}
                  className={styles.demoImg}
                  priority
                />
              </div>
              <div className={styles.demoBadge}>
                <Sparkles size={14} className={styles.demoBadgeIcon} />
                <span>Private 4K HDR & Dolby Atmos Lounge</span>
              </div>
            </div>
          </div>

          {/* Right Column: Luxury Glassmorphic Contact Form */}
          <div className={`${styles.rightColumn} contact-animate`}>
            <div className={styles.formHeader}>
              <h3 className={styles.formTitle}>Schedule Your Demo</h3>
              <p className={styles.formSubtitle}>
                Our senior automation consultants will tailor a private walkthrough for your residence.
              </p>
            </div>

            {status.success ? (
              <div className={styles.successAlert}>
                <div className={styles.successIcon}>✓</div>
                <div>
                  <strong>Demo Request Received!</strong>
                  <p>Our automation specialists will reach out to you within 2 business hours.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                {status.error && (
                  <div className={styles.errorAlert}>{status.error}</div>
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
                    aria-label="Name"
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
                    aria-label="Email"
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
                    aria-label="Phone"
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
                    onChange={handleChange}
                    placeholder="Tell us about your project, timeline, and requirements..."
                    rows={4}
                    className={styles.textareaField}
                    aria-label="Message"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status.submitting}
                  className={styles.submitBtn}
                >
                  <span>{status.submitting ? "Booking Demo..." : "Confirm Demo Request"}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
