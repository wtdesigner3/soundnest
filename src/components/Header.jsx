"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, X } from "lucide-react";
import styles from "./Header.module.css";
import { companyInfo, navItems } from "@/data/homeData";
import ConsultationModal from "@/components/ConsultationModal";

/**
 * Utility function to programmatically open the consultation popup from any component or page.
 */
export function openConsultationModal(serviceName) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-consultation-modal", {
        detail: { service: serviceName },
      })
    );
  }
}

export default function Header({ onOpenConsultation }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customService, setCustomService] = useState("");
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    fetch('/api/admin/settings/')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSiteSettings(data);
      })
      .catch(() => {});
  }, []);

  const currentPhone = siteSettings?.contact?.phone || companyInfo.phone;
  const currentPhoneRaw = siteSettings?.contact?.phoneRaw || companyInfo.phoneRaw;
  const currentLogo = siteSettings?.branding?.logo || '/images/logo.png';
  const currentSiteName = siteSettings?.branding?.siteName || companyInfo.name;

  // Detect appropriate default service based on current route
  let detectedService = "Select Service Type";
  if (pathname?.includes("retro-fit")) {
    detectedService = "Retro Fit Automation";
  } else if (pathname?.includes("building-automation")) {
    detectedService = "Building Automation";
  } else if (pathname?.includes("curtain-motor")) {
    detectedService = "Curtain Motor";
  } else if (pathname?.includes("home-cinema")) {
    detectedService = "Home Cinema & Audio Video";
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for global consultation modal trigger events
  useEffect(() => {
    const handleGlobalOpen = (e) => {
      if (e.detail?.service) {
        setCustomService(e.detail.service);
      }
      if (onOpenConsultation) {
        onOpenConsultation();
      } else {
        setIsModalOpen(true);
      }
    };

    window.addEventListener("open-consultation-modal", handleGlobalOpen);
    return () => window.removeEventListener("open-consultation-modal", handleGlobalOpen);
  }, [onOpenConsultation]);

  // Lock scroll when drawer is open (unless modal is already managing scroll lock)
  useEffect(() => {
    if (drawerOpen && !isModalOpen) {
      document.body.style.overflow = "hidden";
    } else if (!drawerOpen && !isModalOpen) {
      document.body.style.overflow = "";
    }
  }, [drawerOpen, isModalOpen]);

  const handleConsultationClick = () => {
    setDrawerOpen(false);
    if (onOpenConsultation) {
      onOpenConsultation();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}>
        <div className={`container ${styles.headerContainer}`}>
          {/* Logo */}
          <div className={styles.logoWrapper}>
            <Link href="/" className={styles.logoLink} aria-label={`${currentSiteName} Home`}>
              <Image
                src={currentLogo}
                alt={`${currentSiteName} - Home Automation`}
                width={240}
                height={42}
                priority
                className={styles.logoImg}
              />
            </Link>
          </div>

          {/* Right Navigation Controls */}
          <div className={styles.navRight}>
            <a
              href={`tel:${currentPhoneRaw}`}
              className={styles.phoneLink}
              title={`Call ${currentSiteName}`}
            >
              <Phone className={styles.phoneIcon} />
              <span>{currentPhone}</span>
            </a>

            <button
              type="button"
              className={styles.menuBtn}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <span className={styles.burgerLines}>
                <span className={styles.burgerLine}></span>
                <span className={styles.burgerLine}></span>
                <span className={styles.burgerLine}></span>
              </span>
              <span>Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${drawerOpen ? styles.backdropOpen : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Off-canvas Navigation Drawer */}
      <aside
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}
        aria-label="Navigation Drawer"
      >
        <div className={styles.drawerHeader}>
          <Image
            src={currentLogo}
            alt={`${currentSiteName} Logo`}
            width={160}
            height={32}
            className={styles.logoImg}
          />
          <button
            type="button"
            className={styles.drawerCloseBtn}
            onClick={() => setDrawerOpen(false)}
            aria-label="Close Navigation Menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className={styles.drawerNav}>
          <ul className={styles.navLinksList}>
            {navItems.map((item, idx) => (
              <li key={idx} className={styles.navItem}>
                <Link
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.drawerFooter}>
          <a
            href={`tel:${currentPhoneRaw}`}
            className={styles.drawerPhone}
          >
            <Phone size={18} />
            <span>{currentPhone}</span>
          </a>
          <button
            type="button"
            className={`btn-pill-white ${styles.drawerCta}`}
            onClick={handleConsultationClick}
          >
            Get Free Consultation
          </button>
        </div>
      </aside>

      {/* Self-contained Consultation Modal for pages without parent modal state */}
      {!onOpenConsultation && (
        <ConsultationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          defaultService={customService || detectedService}
        />
      )}
    </>
  );
}
