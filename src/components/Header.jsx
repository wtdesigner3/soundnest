"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, X } from "lucide-react";
import styles from "./Header.module.css";
import { companyInfo, navItems } from "@/data/homeData";

export default function Header({ onOpenConsultation }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  // Lock scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [drawerOpen]);

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}>
        <div className={`container ${styles.headerContainer}`}>
          {/* Logo */}
          <div className={styles.logoWrapper}>
            <Link href="/" className={styles.logoLink} aria-label="Soundnest Home">
              <Image
                src="/images/logo.png"
                alt="Soundnest - Home Automation"
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
              href={`tel:${companyInfo.phoneRaw}`}
              className={styles.phoneLink}
              title="Call Soundnest"
            >
              <Phone className={styles.phoneIcon} />
              <span>{companyInfo.phone}</span>
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
            src="/images/logo.png"
            alt="Soundnest Logo"
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
            href={`tel:${companyInfo.phoneRaw}`}
            className={styles.drawerPhone}
          >
            <Phone size={18} />
            <span>{companyInfo.phone}</span>
          </a>
          <button
            type="button"
            className={`btn-pill-white ${styles.drawerCta}`}
            onClick={() => {
              setDrawerOpen(false);
              if (onOpenConsultation) onOpenConsultation();
            }}
          >
            Get Free Consultation
          </button>
        </div>
      </aside>
    </>
  );
}
