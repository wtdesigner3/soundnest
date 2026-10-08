"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ArrowUp, ChevronRight } from "lucide-react";
import { companyInfo, navItems } from "@/data/homeData";
import styles from "./Footer.module.css";

export default function Footer() {
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    fetch('/api/admin/settings/')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSiteSettings(data);
      })
      .catch(() => {});
  }, []);

  const phone = siteSettings?.contact?.phone || companyInfo.phone;
  const phoneRaw = siteSettings?.contact?.phoneRaw || companyInfo.phoneRaw;
  const email = siteSettings?.contact?.email || companyInfo.email;
  const address = siteSettings?.contact?.address || companyInfo.address;
  const logo = siteSettings?.branding?.logo || '/images/logo.png';
  const siteName = siteSettings?.branding?.siteName || companyInfo.name;
  const instagram = siteSettings?.social?.instagram || companyInfo.instagram;
  const whatsapp = siteSettings?.social?.whatsapp || companyInfo.whatsapp;
  const copyright =
    siteSettings?.branding?.copyright ||
    `© ${new Date().getFullYear()} SOUNDNEST ALL RIGHTS RESERVED`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer} role="contentinfo" aria-label="Site Footer">
      <div className="container">
        <div className={styles.mainFooter}>
          {/* Column 1: Brand & Bio */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logoLink} aria-label={`${siteName} Home`}>
              <Image
                src={logo}
                alt={`${siteName} Luxury Automation`}
                width={200}
                height={36}
                className={styles.logoImg}
              />
            </Link>
            <p className={styles.brandBio}>
              Pioneering intelligent living, architectural audio-video integration, and bespoke smart systems for premier homes and luxury estates across India.
            </p>
            <div className={styles.socialRow}>
              <a
                href={instagram}
                target="_blank"
                rel="nofollow noopener noreferrer"
                aria-label="Follow Soundnest on Instagram"
                className={styles.socialBtn}
                title="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                href={`https://api.whatsapp.com/send?phone=${whatsapp}`}
                target="_blank"
                rel="nofollow noopener noreferrer"
                aria-label="Chat with Soundnest on WhatsApp"
                className={styles.socialBtn}
                title="WhatsApp"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.09c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.13 8.13 0 01-1.25-4.32c0-4.51 3.67-8.18 8.18-8.18 2.18 0 4.24.85 5.78 2.39a8.13 8.13 0 012.4 5.79c0 4.51-3.67 8.17-8.18 8.17zm4.49-6.13c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.23.9 2.42 1.03 2.59.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.17-.48-.29z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Solutions */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Solutions</h4>
            <ul className={styles.linksList}>
              <li>
                <Link href="/retro-fit-automation/">
                  <ChevronRight size={13} className={styles.linkArrow} />
                  <span>Retro Fit Automation</span>
                </Link>
              </li>
              <li>
                <Link href="/building-automation/">
                  <ChevronRight size={13} className={styles.linkArrow} />
                  <span>Building Automation</span>
                </Link>
              </li>
              <li>
                <Link href="/curtain-motor/">
                  <ChevronRight size={13} className={styles.linkArrow} />
                  <span>Curtain Motor</span>
                </Link>
              </li>
              <li>
                <Link href="/home-cinema-audio-video/">
                  <ChevronRight size={13} className={styles.linkArrow} />
                  <span>Home Cinema & AV</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Navigation */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Company</h4>
            <ul className={styles.linksList}>
              <li>
                <Link href="/">
                  <ChevronRight size={13} className={styles.linkArrow} />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/#about-us">
                  <ChevronRight size={13} className={styles.linkArrow} />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/blog/">
                  <ChevronRight size={13} className={styles.linkArrow} />
                  <span>Insights & Blog</span>
                </Link>
              </li>
              <li>
                <Link href="/contact-us/">
                  <ChevronRight size={13} className={styles.linkArrow} />
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Experience Studio & Contacts */}
          <div className={styles.contactCol}>
            <h4 className={styles.colTitle}>Studio & Contact</h4>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <div className={styles.iconBox}>
                  <Phone size={15} />
                </div>
                <div>
                  <span className={styles.contactItemLabel}>Direct Line</span>
                  <a href={`tel:${phoneRaw}`} className={styles.contactItemVal}>{phone}</a>
                </div>
              </li>
              <li className={styles.contactItem}>
                <div className={styles.iconBox}>
                  <Mail size={15} />
                </div>
                <div>
                  <span className={styles.contactItemLabel}>Email Support</span>
                  <a href={`mailto:${email}`} className={styles.contactItemVal}>{email}</a>
                </div>
              </li>
              <li className={styles.contactItem}>
                <div className={styles.iconBox}>
                  <MapPin size={15} />
                </div>
                <div>
                  <span className={styles.contactItemLabel}>Delhi Studio</span>
                  <span className={styles.contactItemVal}>{address}</span>
                </div>
              </li>
              <li className={styles.contactItem}>
                <div className={styles.iconBox}>
                  <Clock size={15} />
                </div>
                <div>
                  <span className={styles.contactItemLabel}>Studio Hours</span>
                  <span className={styles.contactItemVal}>Mon - Sat: 10:00 AM - 7:00 PM</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className={styles.copyrightBar}>
          <p className={styles.copyrightText}>{copyright}</p>
          <button
            type="button"
            onClick={scrollToTop}
            className={styles.backToTopBtn}
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}
