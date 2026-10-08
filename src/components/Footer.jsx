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
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.08-2.007-.463-1.671-.693-2.73-2.39-2.813-2.5-.083-.11-.674-.897-.674-1.71 0-.813.424-1.213.575-1.378.151-.165.33-.207.441-.207.11 0 .221 0 .317.006.102.006.239-.039.373.284.144.346.491 1.196.533 1.282.043.086.071.187.014.3-.058.113-.086.184-.172.285-.086.101-.182.226-.26.303-.09.088-.184.184-.079.364.105.18.468.772 1.004 1.25.69.615 1.272.806 1.452.896.18.09.286.079.393-.044.107-.123.458-.533.58-.716.122-.183.245-.153.411-.092.167.062 1.056.498 1.238.589.182.091.303.136.348.213.045.077.045.447-.099.852z" />
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
