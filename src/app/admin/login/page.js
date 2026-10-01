'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password) {
      setStatus({ loading: false, error: 'Please enter both username and password.' });
      return;
    }

    setStatus({ loading: true, error: null });

    try {
      const res = await fetch('/api/admin/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setStatus({
          loading: false,
          error: data.error || 'Authentication failed. Please check credentials.',
        });
      }
    } catch {
      setStatus({
        loading: false,
        error: 'Network connection error. Please try again.',
      });
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.brandHeader}>
          <div className={styles.shieldIcon}>
            <ShieldCheck size={28} color="#e5b869" />
          </div>
          <h1 className={styles.brandTitle}>SOUNDNEST</h1>
          <p className={styles.brandSubtitle}>Admin CMS & SEO Control Center</p>
        </div>

        {status.error && <div className={styles.errorBox}>{status.error}</div>}

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.inputLabel}>
              Username
            </label>
            <div className={styles.inputWrapper}>
              <User size={18} className={styles.fieldIcon} />
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
                className={styles.textInput}
                autoComplete="username"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.inputLabel}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.fieldIcon} />
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                required
                className={styles.textInput}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status.loading}
            className={styles.submitBtn}
            id="admin-login-btn"
          >
            <span>{status.loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className={styles.footerInfo}>
          Protected by Soundnest Security &bull; Authorized Personnel Only
        </div>
      </div>
    </div>
  );
}
