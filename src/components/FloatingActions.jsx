"use client";

import { useState, useEffect } from "react";
import { Phone, ChevronUp } from "lucide-react";
import { companyInfo } from "@/data/homeData";
import styles from "./FloatingActions.module.css";

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

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
        href={`tel:${companyInfo.phoneRaw}`}
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
          href={`https://api.whatsapp.com/send?phone=${companyInfo.whatsapp}`}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className={styles.whatsappBtn}
          aria-label="Chat with Soundnest on WhatsApp"
          title="WhatsApp Us"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.08-2.007-.463-1.671-.693-2.73-2.39-2.813-2.5-.083-.11-.674-.897-.674-1.71 0-.813.424-1.213.575-1.378.151-.165.33-.207.441-.207.11 0 .221 0 .317.006.102.006.239-.039.373.284.144.346.491 1.196.533 1.282.043.086.071.187.014.3-.058.113-.086.184-.172.285-.086.101-.182.226-.26.303-.09.088-.184.184-.079.364.105.18.468.772 1.004 1.25.69.615 1.272.806 1.452.896.18.09.286.079.393-.044.107-.123.458-.533.58-.716.122-.183.245-.153.411-.092.167.062 1.056.498 1.238.589.182.091.303.136.348.213.045.077.045.447-.099.852z" />
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
