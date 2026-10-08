"use client";

import { useState, useEffect } from "react";
import { Phone, ChevronUp } from "lucide-react";
import { companyInfo } from "@/data/homeData";
import styles from "./FloatingActions.module.css";

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    fetch('/api/admin/settings/')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSiteSettings(data);
      })
      .catch(() => {});
  }, []);

  const phoneRaw = siteSettings?.contact?.phoneRaw || companyInfo.phoneRaw;
  const whatsapp = siteSettings?.social?.whatsapp || companyInfo.whatsapp;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Floating Call Now Button (Bottom-Left) */}
      <a
        href={`tel:${phoneRaw}`}
        className={styles.callBtn}
        aria-label="Call Now"
        title="Call Now"
      >
        <Phone size={22} />
      </a>

      {/* Floating WhatsApp Button (Bottom-Right) */}
      <div className={styles.whatsappWrapper}>
        <span className={styles.whatsappBadge}>WhatsApp us</span>
        <a
          href={`https://api.whatsapp.com/send?phone=${whatsapp}`}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className={styles.whatsappBtn}
          aria-label="Chat with Soundnest on WhatsApp"
          title="WhatsApp Us"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.09c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.13 8.13 0 01-1.25-4.32c0-4.51 3.67-8.18 8.18-8.18 2.18 0 4.24.85 5.78 2.39a8.13 8.13 0 012.4 5.79c0 4.51-3.67 8.17-8.18 8.17zm4.49-6.13c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.23.9 2.42 1.03 2.59.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.17-.48-.29z" />
          </svg>
        </a>
      </div>

      {/* Floating Scroll-To-Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`${styles.scrollTopBtn} ${showScrollTop ? styles.scrollTopVisible : ""}`}
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        <ChevronUp size={22} />
      </button>
    </>
  );
}
