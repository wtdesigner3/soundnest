'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Home,
  Layers,
  FileText,
  Inbox,
  Search,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import styles from './admin.module.css';

export default function AdminLayoutClient({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // If on login page, render children directly without admin chrome
  const isLoginPage = pathname?.startsWith('/admin/login');
  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/auth/logout/', { method: 'POST' });
      router.push('/admin/login/');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
      setLoggingOut(false);
    }
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Home Page', href: '/admin/home', icon: <Home size={18} /> },
    { label: 'Services', href: '/admin/services', icon: <Layers size={18} /> },
    { label: 'Blog Articles', href: '/admin/blog', icon: <FileText size={18} /> },
    { label: 'Leads Inbox', href: '/admin/leads', icon: <Inbox size={18} /> },
    { label: 'SEO Control Center', href: '/admin/seo', icon: <Search size={18} /> },
    { label: 'Website Settings', href: '/admin/settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar Navigation */}
      <aside
        className={`${styles.sidebar} ${isMobileOpen ? styles.sidebarOpen : ''}`}
        aria-label="Admin Navigation"
      >
        <div className={styles.sidebarHeader}>
          <div>
            <h1 className={styles.logoTitle}>SOUNDNEST</h1>
            <span className={styles.logoTag}>CMS PANEL</span>
          </div>
          {isMobileOpen && (
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className={styles.footerBtn}
              style={{ width: 'auto', padding: '0.25rem' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className={styles.navSection}>
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin' || pathname === '/admin/'
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" target="_blank" className={styles.footerBtn}>
            <ExternalLink size={16} />
            <span>View Public Site</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className={`${styles.footerBtn} ${styles.logoutBtn}`}
          >
            <LogOut size={16} />
            <span>{loggingOut ? 'Logging out...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        <header className={styles.topBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className={styles.btnSecondary}
              style={{ display: 'none', padding: '0.4rem 0.6rem' }}
            >
              <Menu size={18} />
            </button>
            <span className={styles.pageHeading}>Soundnest Administration</span>
          </div>

          <div className={styles.userBadge}>
            <ShieldCheck size={16} color="#e5b869" />
            <span>Admin</span>
            <div className={styles.userAvatar}>A</div>
          </div>
        </header>

        <main className={styles.contentContainer}>{children}</main>
      </div>
    </div>
  );
}
