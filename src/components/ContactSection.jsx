"use client";

import { useState } from "react";
import Image from "next/image";
import { contactSectionData, serviceTypes } from "@/data/homeData";
import styles from "./ContactSection.module.css";

export default function ContactSection() {
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
      <div className="container">
        <div className={styles.grid}>
          {/* Left Column: Heading, Subtitle & Home Cinema Demo Visual */}
          <div className={`${styles.leftColumn} contact-animate`}>
            <h2 className={styles.title}>{contactSectionData.title}</h2>
            <p className={styles.subtitle}>{contactSectionData.subtitle}</p>

            <div className={styles.imageWrapper}>
              <Image
                src={contactSectionData.image}
                alt="Soundnest Home Cinema Audio Video Demo Setup"
                width={700}
                height={400}
                className={styles.demoImg}
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className={`${styles.rightColumn} contact-animate`}>
            {status.success ? (
              <div className={styles.successAlert}>
                <strong>Thank you!</strong> Your message has been sent successfully. Our automation specialists will reach out to you shortly to schedule your demo.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                {status.error && (
                  <div className={styles.errorAlert}>{status.error}</div>
                )}

                <div className={styles.formGroup}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                    className={styles.inputField}
                    aria-label="Name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className={styles.inputField}
                    aria-label="Email"
                  />
                </div>

                <div className={styles.formGroup}>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    required
                    className={styles.inputField}
                    aria-label="Phone"
                  />
                </div>

                <div className={styles.formGroup}>
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

                <div className={styles.formGroup}>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
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
                  {status.submitting ? "Submitting..." : "Submit"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
