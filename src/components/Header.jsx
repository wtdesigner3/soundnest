"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, X, ChevronDown, ChevronRight } from "lucide-react";
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
  const [mobileServicesOpen, setMobileServicesOpen] = useState(true);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customService, setCustomService] = useState("");
  const [siteSettings, setSiteSettings] = useState(null);

  const dropdownTimerRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleServicesEnter = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
      dropdownTimerRef.current = null;
    }
    setDesktopServicesOpen(true);
  };

  const handleServicesLeave = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }
    dropdownTimerRef.current = setTimeout(() => {
      setDesktopServicesOpen(false);
    }, 250);
  };

  // Close dropdown on route change
  useEffect(() => {
    setDesktopServicesOpen(false);
  }, [pathname]);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDesktopServicesOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setDesktopServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      if (dropdownTimerRef.current) {
        clearTimeout(dropdownTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    fetch('/api/admin/settings/')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSiteSettings(data);
      })
      .catch(() => { });
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
                alt={`${currentSiteName} - Luxury Smart Home Automation`}
                width={220}
                height={38}
                priority
                className={styles.logoImg}
              />
            </Link>
          </div>

          {/* Desktop Center Navigation */}
          <nav className={styles.desktopNav} aria-label="Main Navigation">
            <ul className={styles.desktopNavList}>
              <li>
                <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}>
                  Home
                </Link>
              </li>
              <li
                ref={dropdownRef}
                className={`${styles.hasDropdown} ${desktopServicesOpen ? styles.dropdownOpen : ""}`}
                onMouseEnter={handleServicesEnter}
                onMouseLeave={handleServicesLeave}
              >
                <button
                  type="button"
                  className={`${styles.navLink} ${pathname?.includes('automation') || pathname?.includes('curtain') || pathname?.includes('cinema') ? styles.navLinkActive : ''}`}
                  onClick={() => setDesktopServicesOpen((prev) => !prev)}
                  aria-expanded={desktopServicesOpen}
                  aria-haspopup="true"
                >
                  <span>Services</span>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor" className={styles.dropdownArrow}>
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  className={styles.dropdownMenu}
                  onMouseEnter={handleServicesEnter}
                  onMouseLeave={handleServicesLeave}
                >
                  <Link
                    href="/retro-fit-automation/"
                    className={`${styles.dropdownItem} ${pathname === '/retro-fit-automation/' ? styles.dropdownItemActive : ''}`}
                    onClick={() => setDesktopServicesOpen(false)}
                  >
                    <span className={styles.dropdownItemTitle}>Retro Fit Automation</span>
                    <span className={styles.dropdownItemDesc}>Wireless smart retrofitting without rewiring</span>
                  </Link>
                  <Link
                    href="/building-automation/"
                    className={`${styles.dropdownItem} ${pathname === '/building-automation/' ? styles.dropdownItemActive : ''}`}
                    onClick={() => setDesktopServicesOpen(false)}
                  >
                    <span className={styles.dropdownItemTitle}>Building Automation</span>
                    <span className={styles.dropdownItemDesc}>Commercial & villa centralized KNX control</span>
                  </Link>
                  <Link
                    href="/curtain-motor/"
                    className={`${styles.dropdownItem} ${pathname === '/curtain-motor/' ? styles.dropdownItemActive : ''}`}
                    onClick={() => setDesktopServicesOpen(false)}
                  >
                    <span className={styles.dropdownItemTitle}>Curtain Motor</span>
                    <span className={styles.dropdownItemDesc}>Motorized drape and blind automation</span>
                  </Link>
                  <Link
                    href="/home-cinema-audio-video/"
                    className={`${styles.dropdownItem} ${pathname === '/home-cinema-audio-video/' ? styles.dropdownItemActive : ''}`}
                    onClick={() => setDesktopServicesOpen(false)}
                  >
                    <span className={styles.dropdownItemTitle}>Home Cinema & AV</span>
                    <span className={styles.dropdownItemDesc}>Private Dolby Atmos theatres & multi-room audio</span>
                  </Link>
                </div>
              </li>
              <li>
                <Link href="/#about-us" className={styles.navLink}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog/" className={`${styles.navLink} ${pathname?.startsWith('/blog') ? styles.navLinkActive : ''}`}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact-us/" className={`${styles.navLink} ${pathname === '/contact-us/' ? styles.navLinkActive : ''}`}>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right Controls: Phone, Consultation CTA & Menu Hamburger */}
          <div className={styles.navRight}>
            <a
              href={`tel:${currentPhoneRaw}`}
              className={styles.phoneLink}
              title={`Call ${currentSiteName}`}
            >
              {/* <span className={styles.phoneDot} aria-hidden="true" /> */}
              <Phone className={styles.phoneIcon} />
              <span>{currentPhone}</span>
            </a>

            <button
              type="button"
              className={styles.headerCtaBtn}
              onClick={handleConsultationClick}
              id="header-consultation-btn"
            >
              <span>Book Consultation</span>
            </button>

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
              <span className={styles.menuBtnText}>Menu</span>
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
          <ul className={styles.drawerList}>
            <li className={styles.drawerItem}>
              <Link
                href="/"
                className={`${styles.drawerNavLink} ${pathname === '/' ? styles.drawerNavLinkActive : ''}`}
                onClick={() => setDrawerOpen(false)}
              >
                <span>Home</span>
                <ChevronRight size={16} className={styles.drawerArrow} />
              </Link>
            </li>

            {/* Collapsible Services Submenu */}
            <li className={styles.drawerItem}>
              <button
                type="button"
                className={`${styles.drawerNavLink} ${styles.drawerAccordionBtn} ${pathname?.includes('automation') || pathname?.includes('curtain') || pathname?.includes('cinema') ? styles.drawerNavLinkActive : ''}`}
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                aria-expanded={mobileServicesOpen}
              >
                <span>Services</span>
                <ChevronDown
                  size={16}
                  className={`${styles.drawerChevron} ${mobileServicesOpen ? styles.drawerChevronRotated : ''}`}
                />
              </button>

              {mobileServicesOpen && (
                <ul className={styles.drawerSubList}>
                  <li className={styles.drawerSubItem}>
                    <Link
                      href="/retro-fit-automation/"
                      className={`${styles.drawerSubLink} ${pathname === '/retro-fit-automation/' ? styles.drawerSubLinkActive : ''}`}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <span className={styles.subLinkDot} />
                      <span>Retro Fit Automation</span>
                    </Link>
                  </li>
                  <li className={styles.drawerSubItem}>
                    <Link
                      href="/building-automation/"
                      className={`${styles.drawerSubLink} ${pathname === '/building-automation/' ? styles.drawerSubLinkActive : ''}`}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <span className={styles.subLinkDot} />
                      <span>Building Automation</span>
                    </Link>
                  </li>
                  <li className={styles.drawerSubItem}>
                    <Link
                      href="/curtain-motor/"
                      className={`${styles.drawerSubLink} ${pathname === '/curtain-motor/' ? styles.drawerSubLinkActive : ''}`}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <span className={styles.subLinkDot} />
                      <span>Curtain Motor</span>
                    </Link>
                  </li>
                  <li className={styles.drawerSubItem}>
                    <Link
                      href="/home-cinema-audio-video/"
                      className={`${styles.drawerSubLink} ${pathname === '/home-cinema-audio-video/' ? styles.drawerSubLinkActive : ''}`}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <span className={styles.subLinkDot} />
                      <span>Home Cinema & AV</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className={styles.drawerItem}>
              <Link
                href="/about-us/"
                className={`${styles.drawerNavLink} ${pathname === '/about-us/' ? styles.drawerNavLinkActive : ''}`}
                onClick={() => setDrawerOpen(false)}
              >
                <span>About Us</span>
                <ChevronRight size={16} className={styles.drawerArrow} />
              </Link>
            </li>

            <li className={styles.drawerItem}>
              <Link
                href="/blog/"
                className={`${styles.drawerNavLink} ${pathname?.startsWith('/blog') ? styles.drawerNavLinkActive : ''}`}
                onClick={() => setDrawerOpen(false)}
              >
                <span>Blog</span>
                <ChevronRight size={16} className={styles.drawerArrow} />
              </Link>
            </li>

            <li className={styles.drawerItem}>
              <Link
                href="/contact-us/"
                className={`${styles.drawerNavLink} ${pathname === '/contact-us/' ? styles.drawerNavLinkActive : ''}`}
                onClick={() => setDrawerOpen(false)}
              >
                <span>Contact</span>
                <ChevronRight size={16} className={styles.drawerArrow} />
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.drawerFooter}>
          <a
            href={`tel:${currentPhoneRaw}`}
            className={styles.drawerPhone}
          >
            <Phone size={17} />
            <span>{currentPhone}</span>
          </a>
          <button
            type="button"
            className={styles.drawerCtaBtn}
            onClick={handleConsultationClick}
          >
            Book Free Consultation
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
