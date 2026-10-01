'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  FileCode,
  Globe,
  Shield,
  Code,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import styles from '../admin.module.css';

const tabs = [
  { id: 'metas', label: 'Page Metas & Canonicals', icon: <Search size={16} /> },
  { id: 'schemas', label: 'Schema.org JSON-LD', icon: <FileCode size={16} /> },
  { id: 'sitemap', label: 'Dynamic Sitemap.xml', icon: <Globe size={16} /> },
  { id: 'robots', label: 'Robots.txt Rules', icon: <Shield size={16} /> },
  { id: 'scripts', label: 'Tracking & Analytics', icon: <Code size={16} /> },
];

export default function AdminSeoPage() {
  const [activeTab, setActiveTab] = useState('metas');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // SEO Settings State
  const [settings, setSettings] = useState({
    metaOverrides: [],
    customSchemas: [],
    robotsTxt: '',
    sitemapSettings: {
      defaultChangefreq: 'weekly',
      defaultPriority: 0.8,
      extraUrls: [],
    },
    scripts: {
      headerScripts: '',
      footerScripts: '',
      googleAnalyticsId: '',
      gtmId: '',
    },
  });

  const fetchSeoSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo/');
      const data = await res.json();
      if (res.ok && data.settings) {
        setSettings(data.settings);
      }
    } catch {
      setErrorMsg('Error loading SEO settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoSettings();
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/seo/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (res.ok) {
        setToastMsg('SEO settings successfully saved and synced!');
        setTimeout(() => setToastMsg(null), 4000);
      } else {
        setErrorMsg(data.error || 'Failed to save SEO settings.');
      }
    } catch {
      setErrorMsg('Network error saving SEO settings.');
    } finally {
      setSaving(false);
    }
  };

  // Metas Helpers
  const addMetaOverride = () => {
    setSettings((prev) => ({
      ...prev,
      metaOverrides: [
        ...prev.metaOverrides,
        {
          path: '/new-page/',
          title: 'New Page Title - Soundnest',
          description: 'Custom meta description for this page.',
          canonical: 'https://soundnest.in/new-page/',
        },
      ],
    }));
  };

  const updateMetaOverride = (idx, field, value) => {
    setSettings((prev) => {
      const copy = [...prev.metaOverrides];
      copy[idx][field] = value;
      return { ...prev, metaOverrides: copy };
    });
  };

  const removeMetaOverride = (idx) => {
    setSettings((prev) => ({
      ...prev,
      metaOverrides: prev.metaOverrides.filter((_, i) => i !== idx),
    }));
  };

  // Schema Helpers
  const addCustomSchema = () => {
    setSettings((prev) => ({
      ...prev,
      customSchemas: [
        ...prev.customSchemas,
        {
          id: `schema-${Date.now()}`,
          name: 'Custom Page Schema',
          path: '*',
          schemaType: 'Custom',
          jsonLd: JSON.stringify(
            {
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Soundnest',
            },
            null,
            2
          ),
          isActive: true,
        },
      ],
    }));
  };

  const updateCustomSchema = (idx, field, value) => {
    setSettings((prev) => {
      const copy = [...prev.customSchemas];
      copy[idx][field] = value;
      return { ...prev, customSchemas: copy };
    });
  };

  const removeCustomSchema = (idx) => {
    setSettings((prev) => ({
      ...prev,
      customSchemas: prev.customSchemas.filter((_, i) => i !== idx),
    }));
  };

  // Sitemap Extra URL helpers
  const addSitemapUrl = () => {
    setSettings((prev) => ({
      ...prev,
      sitemapSettings: {
        ...prev.sitemapSettings,
        extraUrls: [
          ...(prev.sitemapSettings?.extraUrls || []),
          { url: '/landing-page/', changefreq: 'weekly', priority: 0.8 },
        ],
      },
    }));
  };

  const updateSitemapUrl = (idx, field, value) => {
    setSettings((prev) => {
      const copy = [...(prev.sitemapSettings?.extraUrls || [])];
      copy[idx][field] = value;
      return {
        ...prev,
        sitemapSettings: { ...prev.sitemapSettings, extraUrls: copy },
      };
    });
  };

  const removeSitemapUrl = (idx) => {
    setSettings((prev) => ({
      ...prev,
      sitemapSettings: {
        ...prev.sitemapSettings,
        extraUrls: prev.sitemapSettings.extraUrls.filter((_, i) => i !== idx),
      },
    }));
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.35rem' }}>
            SEO Control Center
          </h2>
          <p style={{ color: '#888888', margin: 0, fontSize: '0.85rem' }}>
            Centralized hub for Meta tags, Schema.org JSON-LD, Dynamic Sitemap, Robots.txt, and Analytics.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className={styles.btnPrimary}
          id="btn-save-seo"
        >
          <Save size={16} />
          <span>{saving ? 'Saving Settings...' : 'Save All SEO Settings'}</span>
        </button>
      </div>

      {toastMsg && (
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
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
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
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={styles.btnSecondary}
            style={{
              backgroundColor: activeTab === tab.id ? 'rgba(229, 184, 105, 0.15)' : undefined,
              borderColor: activeTab === tab.id ? 'rgba(229, 184, 105, 0.35)' : undefined,
              color: activeTab === tab.id ? '#e5b869' : undefined,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ==================================================================
          TAB 1: PAGE METAS & CANONICALS
          ================================================================== */}
      {activeTab === 'metas' && (
        <div className={styles.cardSection}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>Page Meta Tags & Canonical Overrides</h3>
              <p style={{ color: '#888888', margin: '0.25rem 0 0', fontSize: '0.8rem' }}>
                Define custom Titles, Descriptions, and Canonicals for any URL route on your site.
              </p>
            </div>
            <button
              type="button"
              onClick={addMetaOverride}
              className={styles.btnSecondary}
              style={{ fontSize: '0.8rem' }}
            >
              <Plus size={14} />
              <span>Add Route Override</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {settings.metaOverrides?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: '#181818',
                  border: '1px solid #282828',
                  borderRadius: '8px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '400px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#e5b869', fontWeight: 600 }}>Path:</span>
                    <input
                      type="text"
                      value={item.path}
                      onChange={(e) => updateMetaOverride(idx, 'path', e.target.value)}
                      placeholder="/example-page/"
                      className={styles.formInput}
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMetaOverride(idx)}
                    className={styles.btnDanger}
                    style={{ padding: '0.35rem 0.65rem' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Meta Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateMetaOverride(idx, 'title', e.target.value)}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Meta Description</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateMetaOverride(idx, 'description', e.target.value)}
                      rows={2}
                      className={styles.formTextarea}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Canonical URL</label>
                    <input
                      type="text"
                      value={item.canonical}
                      onChange={(e) => updateMetaOverride(idx, 'canonical', e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          TAB 2: SCHEMA.ORG JSON-LD INJECTOR
          ================================================================== */}
      {activeTab === 'schemas' && (
        <div className={styles.cardSection}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>Schema.org Structured Data Injector</h3>
              <p style={{ color: '#888888', margin: '0.25rem 0 0', fontSize: '0.8rem' }}>
                Inject Google Rich Results JSON-LD markup site-wide (*) or on specific pages.
              </p>
            </div>
            <button
              type="button"
              onClick={addCustomSchema}
              className={styles.btnSecondary}
              style={{ fontSize: '0.8rem' }}
            >
              <Plus size={14} />
              <span>Add Schema</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {settings.customSchemas?.map((schema, idx) => (
              <div
                key={schema.id || idx}
                style={{
                  background: '#181818',
                  border: '1px solid #282828',
                  borderRadius: '8px',
                  padding: '1.25rem',
                }}
              >
                <div className={styles.formRow} style={{ marginBottom: '1rem' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Schema Label</label>
                    <input
                      type="text"
                      value={schema.name}
                      onChange={(e) => updateCustomSchema(idx, 'name', e.target.value)}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Target Path (* for all pages)</label>
                    <input
                      type="text"
                      value={schema.path}
                      onChange={(e) => updateCustomSchema(idx, 'path', e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label className={styles.formLabel} style={{ margin: 0 }}>
                      JSON-LD Structured Data
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          JSON.parse(schema.jsonLd);
                          alert('✓ Valid JSON syntax!');
                        } catch (err) {
                          alert(`Invalid JSON: ${err.message}`);
                        }
                      }}
                      className={styles.btnSecondary}
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    >
                      Validate JSON
                    </button>
                  </div>
                  <textarea
                    value={schema.jsonLd}
                    onChange={(e) => updateCustomSchema(idx, 'jsonLd', e.target.value)}
                    rows={8}
                    className={styles.formTextarea}
                    style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#ccc' }}>
                    <input
                      type="checkbox"
                      checked={schema.isActive}
                      onChange={(e) => updateCustomSchema(idx, 'isActive', e.target.checked)}
                    />
                    <span>Active (Inject into &lt;head&gt;)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeCustomSchema(idx)}
                    className={styles.btnDanger}
                    style={{ padding: '0.35rem 0.75rem' }}
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          TAB 3: DYNAMIC SITEMAP.XML
          ================================================================== */}
      {activeTab === 'sitemap' && (
        <div className={styles.cardSection}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>Dynamic XML Sitemap Configuration</h3>
              <p style={{ color: '#888888', margin: '0.25rem 0 0', fontSize: '0.8rem' }}>
                Your sitemap is generated live from all published services, articles, and pages.
              </p>
            </div>
            <a
              href="/sitemap.xml"
              target="_blank"
              className={styles.btnSecondary}
              style={{ fontSize: '0.8rem' }}
            >
              <ExternalLink size={14} />
              <span>View Live Sitemap.xml</span>
            </a>
          </div>

          <div
            style={{
              background: '#161616',
              border: '1px solid #282828',
              borderRadius: '8px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ fontSize: '0.9rem', color: '#e5b869', fontWeight: 700, marginBottom: '0.5rem' }}>
              Automatic Indexing Included:
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#aaa', fontSize: '0.85rem', lineHeight: 1.6 }}>
              <li>Core Static Pages: Homepage (/), Contact Us (/contact-us/), Blog Archive (/blog/)</li>
              <li>All Active Services: Automatically synced from MongoDB (e.g. /retro-fit-automation/)</li>
              <li>All Published Blog Posts: Automatically synced from MongoDB (23+ articles)</li>
            </ul>
          </div>

          {/* Extra Custom URLs */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label className={styles.formLabel} style={{ margin: 0 }}>
                Custom Sitemap URLs
              </label>
              <button
                type="button"
                onClick={addSitemapUrl}
                className={styles.btnSecondary}
                style={{ fontSize: '0.75rem' }}
              >
                + Add Custom URL
              </button>
            </div>

            {settings.sitemapSettings?.extraUrls?.map((item, idx) => (
              <div
                key={idx}
                style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}
              >
                <input
                  type="text"
                  placeholder="/custom-landing-page/"
                  value={item.url}
                  onChange={(e) => updateSitemapUrl(idx, 'url', e.target.value)}
                  className={styles.formInput}
                  style={{ flex: 2 }}
                />
                <select
                  value={item.changefreq || 'weekly'}
                  onChange={(e) => updateSitemapUrl(idx, 'changefreq', e.target.value)}
                  className={styles.formSelect}
                  style={{ flex: 1 }}
                >
                  <option value="daily">daily</option>
                  <option value="weekly">weekly</option>
                  <option value="monthly">monthly</option>
                </select>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="1.0"
                  value={item.priority || 0.8}
                  onChange={(e) => updateSitemapUrl(idx, 'priority', e.target.value)}
                  className={styles.formInput}
                  style={{ width: '80px' }}
                />
                <button
                  type="button"
                  onClick={() => removeSitemapUrl(idx)}
                  className={styles.btnDanger}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          TAB 4: ROBOTS.TXT RULES
          ================================================================== */}
      {activeTab === 'robots' && (
        <div className={styles.cardSection}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>Robots.txt Directives</h3>
              <p style={{ color: '#888888', margin: '0.25rem 0 0', fontSize: '0.8rem' }}>
                Control which pages web crawlers (Googlebot, Bingbot) can crawl and index.
              </p>
            </div>
            <a
              href="/robots.txt"
              target="_blank"
              className={styles.btnSecondary}
              style={{ fontSize: '0.8rem' }}
            >
              <ExternalLink size={14} />
              <span>View Live Robots.txt</span>
            </a>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Robots.txt Content</label>
            <textarea
              value={settings.robotsTxt}
              onChange={(e) => setSettings((prev) => ({ ...prev, robotsTxt: e.target.value }))}
              rows={10}
              className={styles.formTextarea}
              style={{ fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.5 }}
            />
          </div>

          <button
            type="button"
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                robotsTxt: `# Robots.txt for Soundnest
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/

Sitemap: https://soundnest.in/sitemap.xml
`,
              }))
            }
            className={styles.btnSecondary}
            style={{ fontSize: '0.8rem' }}
          >
            Reset to Recommended Soundnest Rules
          </button>
        </div>
      )}

      {/* ==================================================================
          TAB 5: TRACKING & ANALYTICS
          ================================================================== */}
      {activeTab === 'scripts' && (
        <div className={styles.cardSection}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>Tracking, GTM & Analytics Scripts</h3>
              <p style={{ color: '#888888', margin: '0.25rem 0 0', fontSize: '0.8rem' }}>
                Inject Google Tag Manager, Google Analytics, Meta Pixel, and verification tags.
              </p>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Google Analytics 4 Measurement ID</label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={settings.scripts?.googleAnalyticsId || ''}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    scripts: { ...prev.scripts, googleAnalyticsId: e.target.value },
                  }))
                }
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Google Tag Manager (GTM) Container ID</label>
              <input
                type="text"
                placeholder="GTM-XXXXXXX"
                value={settings.scripts?.gtmId || ''}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    scripts: { ...prev.scripts, gtmId: e.target.value },
                  }))
                }
                className={styles.formInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Header Tracking Code (&lt;head&gt;)</label>
            <textarea
              placeholder="<!-- Insert custom meta verification or tracking scripts -->"
              value={settings.scripts?.headerScripts || ''}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  scripts: { ...prev.scripts, headerScripts: e.target.value },
                }))
              }
              rows={4}
              className={styles.formTextarea}
              style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
