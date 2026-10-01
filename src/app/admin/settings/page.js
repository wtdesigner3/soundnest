'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Image as ImageIcon,
  Phone,
  Share2,
  Code,
  Save,
  CheckCircle,
  AlertCircle,
  Globe,
  ExternalLink,
} from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import styles from '../admin.module.css';

const tabs = [
  { id: 'branding', label: 'Branding & Logo', icon: <ImageIcon size={16} /> },
  { id: 'contact', label: 'Contact Details', icon: <Phone size={16} /> },
  { id: 'social', label: 'Social Media', icon: <Share2 size={16} /> },
  { id: 'scripts', label: 'Header & Footer Code', icon: <Code size={16} /> },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('branding');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [formData, setFormData] = useState({
    branding: {
      siteName: 'Soundnest',
      logo: '/images/logo.png',
      favicon: '/images/favicon.png',
      copyright: `© ${new Date().getFullYear()} SOUNDNEST ALL RIGHTS RESERVED`,
    },
    contact: {
      phone: '+91-9049295678',
      phoneRaw: '+919049295678',
      email: 'sales@soundnest.in',
      address: 'Q 24, Block Q, Lajpat Nagar IV, Lajpat Nagar, New Delhi, Delhi 110024',
      businessHours: 'Mon - Sat: 10:00 AM - 7:00 PM',
    },
    social: {
      whatsapp: '919049295678',
      instagram: 'https://www.instagram.com/soundnest.in?igsh=ZGF3djRyd29iMTdi',
      facebook: '',
      linkedin: '',
      youtube: '',
      twitter: '',
    },
    codeInjection: {
      headerScripts: '',
      footerScripts: '',
    },
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings/');
      const data = await res.json();
      if (res.ok) {
        setFormData(data);
      } else {
        setErrorMsg('Failed to load settings');
      }
    } catch {
      setErrorMsg('Network error loading settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleNestedChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/settings/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Website settings saved successfully!');
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(data.error || 'Failed to save settings');
      }
    } catch {
      setErrorMsg('Network error while saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#888888' }}>
        Loading website settings...
      </div>
    );
  }

  return (
    <div>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Website Settings & Injection
          </h2>
          <p style={{ color: '#888888', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Manage website logo, favicon, contact information, social profiles, and SEO code injection.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={styles.btnPrimary}
        >
          <Save size={16} />
          <span>{saving ? 'Saving Settings...' : 'Save Settings'}</span>
        </button>
      </div>

      {successMsg && (
        <div
          style={{
            background: 'rgba(46, 204, 113, 0.15)',
            border: '1px solid rgba(46, 204, 113, 0.3)',
            color: '#2ecc71',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            background: 'rgba(231, 76, 60, 0.15)',
            border: '1px solid rgba(231, 76, 60, 0.3)',
            color: '#e74c3c',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className={styles.adminTabNav}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`${styles.adminTabBtn} ${activeTab === tab.id ? styles.adminTabBtnActive : ''}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSave}>
        {/* Tab 1: Branding */}
        {activeTab === 'branding' && (
          <div className={styles.adminSectionCard}>
            <div className={styles.adminSectionHeader}>
              <h3 className={styles.adminSectionTitle}>
                <ImageIcon size={18} color="#e5b869" />
                <span>Branding & Logo Assets</span>
              </h3>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Website Brand Name</label>
                <input
                  type="text"
                  value={formData.branding.siteName}
                  onChange={(e) => handleNestedChange('branding', 'siteName', e.target.value)}
                  className={styles.formInput}
                  placeholder="Soundnest"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Copyright Notice</label>
                <input
                  type="text"
                  value={formData.branding.copyright}
                  onChange={(e) => handleNestedChange('branding', 'copyright', e.target.value)}
                  className={styles.formInput}
                  placeholder="© 2025 SOUNDNEST ALL RIGHTS RESERVED"
                />
              </div>
            </div>

            <div className={styles.formRow} style={{ marginTop: '1.5rem' }}>
              <div className={styles.formGroup}>
                <ImageUploader
                  label="Website Primary Logo"
                  value={formData.branding.logo}
                  onChange={(url) => handleNestedChange('branding', 'logo', url)}
                  helpText="Recommended: Transparent PNG or SVG, ~240x48px"
                  folder="branding"
                />
              </div>

              <div className={styles.formGroup}>
                <ImageUploader
                  label="Website Favicon"
                  value={formData.branding.favicon}
                  onChange={(url) => handleNestedChange('branding', 'favicon', url)}
                  helpText="Recommended: 32x32px or 64x64px PNG or ICO"
                  folder="branding"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Contact Details */}
        {activeTab === 'contact' && (
          <div className={styles.adminSectionCard}>
            <div className={styles.adminSectionHeader}>
              <h3 className={styles.adminSectionTitle}>
                <Phone size={18} color="#e5b869" />
                <span>Business & Contact Details</span>
              </h3>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Primary Phone Display</label>
                <input
                  type="text"
                  value={formData.contact.phone}
                  onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)}
                  className={styles.formInput}
                  placeholder="+91-9049295678"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Raw Phone for Click-to-Call (tel: link)</label>
                <input
                  type="text"
                  value={formData.contact.phoneRaw}
                  onChange={(e) => handleNestedChange('contact', 'phoneRaw', e.target.value)}
                  className={styles.formInput}
                  placeholder="+919049295678"
                />
              </div>
            </div>

            <div className={styles.formRow} style={{ marginTop: '1.25rem' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Official Sales / Support Email</label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleNestedChange('contact', 'email', e.target.value)}
                  className={styles.formInput}
                  placeholder="sales@soundnest.in"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Studio / Business Hours</label>
                <input
                  type="text"
                  value={formData.contact.businessHours}
                  onChange={(e) => handleNestedChange('contact', 'businessHours', e.target.value)}
                  className={styles.formInput}
                  placeholder="Mon - Sat: 10:00 AM - 7:00 PM"
                />
              </div>
            </div>

            <div className={styles.formGroup} style={{ marginTop: '1.25rem' }}>
              <label className={styles.formLabel}>Studio & Office Address</label>
              <textarea
                value={formData.contact.address}
                onChange={(e) => handleNestedChange('contact', 'address', e.target.value)}
                className={styles.formTextarea}
                rows={3}
                placeholder="Full physical address for website footer and Schema JSON-LD"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Social Media */}
        {activeTab === 'social' && (
          <div className={styles.adminSectionCard}>
            <div className={styles.adminSectionHeader}>
              <h3 className={styles.adminSectionTitle}>
                <Share2 size={18} color="#e5b869" />
                <span>Social Profiles & Messaging</span>
              </h3>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>WhatsApp Number (Numbers only, e.g. 919049295678)</label>
                <input
                  type="text"
                  value={formData.social.whatsapp}
                  onChange={(e) => handleNestedChange('social', 'whatsapp', e.target.value)}
                  className={styles.formInput}
                  placeholder="919049295678"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Instagram Profile URL</label>
                <input
                  type="url"
                  value={formData.social.instagram}
                  onChange={(e) => handleNestedChange('social', 'instagram', e.target.value)}
                  className={styles.formInput}
                  placeholder="https://www.instagram.com/soundnest.in"
                />
              </div>
            </div>

            <div className={styles.formRow} style={{ marginTop: '1.25rem' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Facebook Page URL</label>
                <input
                  type="url"
                  value={formData.social.facebook}
                  onChange={(e) => handleNestedChange('social', 'facebook', e.target.value)}
                  className={styles.formInput}
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>LinkedIn Company URL</label>
                <input
                  type="url"
                  value={formData.social.linkedin}
                  onChange={(e) => handleNestedChange('social', 'linkedin', e.target.value)}
                  className={styles.formInput}
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
            </div>

            <div className={styles.formRow} style={{ marginTop: '1.25rem' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>YouTube Channel URL</label>
                <input
                  type="url"
                  value={formData.social.youtube}
                  onChange={(e) => handleNestedChange('social', 'youtube', e.target.value)}
                  className={styles.formInput}
                  placeholder="https://youtube.com/@..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Twitter / X URL</label>
                <input
                  type="url"
                  value={formData.social.twitter}
                  onChange={(e) => handleNestedChange('social', 'twitter', e.target.value)}
                  className={styles.formInput}
                  placeholder="https://x.com/..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Code Injection */}
        {activeTab === 'scripts' && (
          <div className={styles.adminSectionCard}>
            <div className={styles.adminSectionHeader}>
              <h3 className={styles.adminSectionTitle}>
                <Code size={18} color="#e5b869" />
                <span>SEO Scripts & Code Injection</span>
              </h3>
            </div>

            <div
              style={{
                background: 'rgba(229, 184, 105, 0.08)',
                border: '1px solid rgba(229, 184, 105, 0.25)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                color: '#cccccc',
                lineHeight: 1.6,
              }}
            >
              <strong>💡 Code Injection Guide:</strong> Any code placed in <strong>Header Scripts</strong> will be directly injected into the <code>&lt;head&gt;</code> tag on every public page (ideal for Google Tag Manager, Google Analytics, Meta Pixel, Hotjar, or custom verification meta tags). Any code placed in <strong>Footer Scripts</strong> will be injected right before the closing <code>&lt;/body&gt;</code> tag.
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Header Code Injection (injected into <code>&lt;head&gt;</code>)
              </label>
              <textarea
                value={formData.codeInjection.headerScripts}
                onChange={(e) => handleNestedChange('codeInjection', 'headerScripts', e.target.value)}
                className={styles.formTextarea}
                rows={8}
                style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                placeholder="<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXX');</script>
<!-- End Google Tag Manager -->"
              />
            </div>

            <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
              <label className={styles.formLabel}>
                Footer Code Injection (injected before <code>&lt;/body&gt;</code>)
              </label>
              <textarea
                value={formData.codeInjection.footerScripts}
                onChange={(e) => handleNestedChange('codeInjection', 'footerScripts', e.target.value)}
                className={styles.formTextarea}
                rows={8}
                style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                placeholder="<!-- Tracking pixels, chat widgets, or custom scripts -->
<noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX'
height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript>"
              />
            </div>
          </div>
        )}

        {/* Bottom Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button
            type="submit"
            disabled={saving}
            className={styles.btnPrimary}
            style={{ padding: '0.85rem 2rem' }}
          >
            <Save size={18} />
            <span>{saving ? 'Saving Website Settings...' : 'Save Website Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
