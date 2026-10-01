'use client';

import React, { useState, useEffect } from 'react';
import {
  Home,
  Sliders,
  Info,
  Layers,
  Sparkles,
  MessageSquareQuote,
  Megaphone,
  PhoneCall,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Star,
} from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import styles from '../admin.module.css';

const tabs = [
  { id: 'hero', label: 'Hero Slider', icon: <Sliders size={16} /> },
  { id: 'about', label: 'About Us', icon: <Info size={16} /> },
  { id: 'services', label: 'Services Showcase', icon: <Layers size={16} /> },
  { id: 'brands', label: 'Brands Marquee', icon: <Sparkles size={16} /> },
  { id: 'testimonials', label: 'Testimonials', icon: <MessageSquareQuote size={16} /> },
  { id: 'cta', label: 'CTA Banner', icon: <Megaphone size={16} /> },
  { id: 'contact', label: 'Contact Preview', icon: <PhoneCall size={16} /> },
];

export default function AdminHomePage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [formData, setFormData] = useState({
    heroSlides: [],
    aboutData: {
      kicker: '',
      title: '',
      image: '',
      paragraphs: [],
      ctaText: '',
      ctaLink: '',
    },
    servicesData: {
      kicker: '',
      title: '',
      services: [],
    },
    brandsList: [],
    testimonialsData: {
      kicker: '',
      title: '',
      items: [],
    },
    ctaBannerData: {
      title: '',
      buttonText: '',
      buttonLink: '',
      backgroundImage: '',
    },
    contactSectionData: {
      title: '',
      subtitle: '',
      image: '',
    },
  });

  const fetchHomeContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/home/');
      const data = await res.json();
      if (res.ok) {
        setFormData({
          heroSlides: data.heroSlides || [],
          aboutData: data.aboutData || {},
          servicesData: data.servicesData || {},
          brandsList: data.brandsList || [],
          testimonialsData: data.testimonialsData || {},
          ctaBannerData: data.ctaBannerData || {},
          contactSectionData: data.contactSectionData || {},
        });
      } else {
        setErrorMsg('Failed to load home content');
      }
    } catch {
      setErrorMsg('Network error loading home content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/home/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Home page content saved successfully!');
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(data.error || 'Failed to save home content');
      }
    } catch {
      setErrorMsg('Network error while saving home content');
    } finally {
      setSaving(false);
    }
  };

  // Repeater helpers
  const updateSlide = (idx, field, val) => {
    setFormData((prev) => {
      const updated = [...prev.heroSlides];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, heroSlides: updated };
    });
  };

  const addSlide = () => {
    setFormData((prev) => ({
      ...prev,
      heroSlides: [
        ...prev.heroSlides,
        {
          id: Date.now(),
          kicker: 'ALWAYS IN CONTROL',
          title: 'Smart Automation Solutions',
          description: 'Control and orchestrate your entire home with ease.',
          ctaText: 'Get Free Consultation',
          image: '/images/slider-1.jpg',
        },
      ],
    }));
  };

  const removeSlide = (idx) => {
    setFormData((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.filter((_, i) => i !== idx),
    }));
  };

  // Testimonial helpers
  const updateTestimonial = (idx, field, val) => {
    setFormData((prev) => {
      const items = [...(prev.testimonialsData.items || [])];
      items[idx] = { ...items[idx], [field]: val };
      return {
        ...prev,
        testimonialsData: { ...prev.testimonialsData, items },
      };
    });
  };

  const addTestimonial = () => {
    setFormData((prev) => ({
      ...prev,
      testimonialsData: {
        ...prev.testimonialsData,
        items: [
          ...(prev.testimonialsData.items || []),
          {
            id: Date.now(),
            author: 'Client Name',
            quote: 'Soundnest transformed our home with modern smart automation.',
            rating: 5,
            avatar: '/images/testimonials/avatar.png',
          },
        ],
      },
    }));
  };

  const removeTestimonial = (idx) => {
    setFormData((prev) => ({
      ...prev,
      testimonialsData: {
        ...prev.testimonialsData,
        items: prev.testimonialsData.items.filter((_, i) => i !== idx),
      },
    }));
  };

  // Brand helpers
  const updateBrand = (idx, field, val) => {
    setFormData((prev) => {
      const updated = [...prev.brandsList];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, brandsList: updated };
    });
  };

  const addBrand = () => {
    setFormData((prev) => ({
      ...prev,
      brandsList: [
        ...prev.brandsList,
        { name: 'New Brand Partner', image: '/images/brands/brand-1.png' },
      ],
    }));
  };

  const removeBrand = (idx) => {
    setFormData((prev) => ({
      ...prev,
      brandsList: prev.brandsList.filter((_, i) => i !== idx),
    }));
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#888888' }}>
        Loading Home Page content...
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
            Home Page Management
          </h2>
          <p style={{ color: '#888888', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Manage Hero Sliders, About Us, Services, Brand Marquee, Testimonials, and CTA Banner.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={styles.btnPrimary}
        >
          <Save size={16} />
          <span>{saving ? 'Saving Home Content...' : 'Save Changes'}</span>
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

      {/* Tabs */}
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
        {/* Tab 1: Hero Slider */}
        {activeTab === 'hero' && (
          <div className={styles.adminSectionCard}>
            <div className={styles.adminSectionHeader}>
              <h3 className={styles.adminSectionTitle}>
                <Sliders size={18} color="#e5b869" />
                <span>Hero Slides ({formData.heroSlides.length})</span>
              </h3>
              <button
                type="button"
                onClick={addSlide}
                className={styles.btnSecondary}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
              >
                <Plus size={14} />
                <span>Add Slide</span>
              </button>
            </div>

            {formData.heroSlides.map((slide, idx) => (
              <div key={slide.id || idx} className={styles.repeaterBox}>
                <div className={styles.repeaterHeaderRow}>
                  <span className={styles.repeaterTitle}>Slide #{idx + 1}</span>
                  {formData.heroSlides.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSlide(idx)}
                      className={styles.btnDanger}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      title="Remove slide"
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Kicker Tag</label>
                    <input
                      type="text"
                      value={slide.kicker}
                      onChange={(e) => updateSlide(idx, 'kicker', e.target.value)}
                      className={styles.formInput}
                      placeholder="ALWAYS IN CONTROL"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Slide Title</label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => updateSlide(idx, 'title', e.target.value)}
                      className={styles.formInput}
                      placeholder="One app, complete solution"
                    />
                  </div>
                </div>

                <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                  <label className={styles.formLabel}>Slide Description</label>
                  <textarea
                    value={slide.description}
                    onChange={(e) => updateSlide(idx, 'description', e.target.value)}
                    className={styles.formTextarea}
                    rows={2}
                    placeholder="Automate your entire home and manage it from anywhere..."
                  />
                </div>

                <div className={styles.formRow} style={{ marginTop: '1rem' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>CTA Button Text</label>
                    <input
                      type="text"
                      value={slide.ctaText}
                      onChange={(e) => updateSlide(idx, 'ctaText', e.target.value)}
                      className={styles.formInput}
                      placeholder="Get Free Consultation"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <ImageUploader
                      label="Slide Background Image"
                      value={slide.image}
                      onChange={(url) => updateSlide(idx, 'image', url)}
                      helpText="High-res wallpaper (1920x1080px)"
                      folder="slider"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: About Us */}
        {activeTab === 'about' && (
          <div className={styles.adminSectionCard}>
            <div className={styles.adminSectionHeader}>
              <h3 className={styles.adminSectionTitle}>
                <Info size={18} color="#e5b869" />
                <span>About Us Section</span>
              </h3>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Kicker Tag</label>
                <input
                  type="text"
                  value={formData.aboutData.kicker}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      aboutData: { ...prev.aboutData, kicker: e.target.value },
                    }))
                  }
                  className={styles.formInput}
                  placeholder="ABOUT US"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Section Main Title</label>
                <input
                  type="text"
                  value={formData.aboutData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      aboutData: { ...prev.aboutData, title: e.target.value },
                    }))
                  }
                  className={styles.formInput}
                  placeholder="Best Home Automation Smart Comfort & Efficiency"
                />
              </div>
            </div>

            <div className={styles.formRow} style={{ marginTop: '1.25rem' }}>
              <div className={styles.formGroup}>
                <ImageUploader
                  label="About Us Feature Image"
                  value={formData.aboutData.image}
                  onChange={(url) =>
                    setFormData((prev) => ({
                      ...prev,
                      aboutData: { ...prev.aboutData, image: url },
                    }))
                  }
                  helpText="High-res portrait or landscape photo"
                  folder="about"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>CTA Button Text</label>
                <input
                  type="text"
                  value={formData.aboutData.ctaText || "Let's Connect"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      aboutData: { ...prev.aboutData, ctaText: e.target.value },
                    }))
                  }
                  className={styles.formInput}
                  placeholder="Let's Connect"
                />
                <label className={styles.formLabel} style={{ marginTop: '0.75rem' }}>
                  CTA Button Link
                </label>
                <input
                  type="text"
                  value={formData.aboutData.ctaLink || '/contact-us/'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      aboutData: { ...prev.aboutData, ctaLink: e.target.value },
                    }))
                  }
                  className={styles.formInput}
                  placeholder="/contact-us/"
                />
              </div>
            </div>

            <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
              <label className={styles.formLabel}>
                Body Paragraphs (One paragraph per box)
              </label>
              {(formData.aboutData.paragraphs || []).map((p, pIdx) => (
                <div key={pIdx} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <textarea
                    value={p}
                    onChange={(e) => {
                      const newParas = [...(formData.aboutData.paragraphs || [])];
                      newParas[pIdx] = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        aboutData: { ...prev.aboutData, paragraphs: newParas },
                      }));
                    }}
                    rows={3}
                    className={styles.formTextarea}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newParas = formData.aboutData.paragraphs.filter((_, i) => i !== pIdx);
                      setFormData((prev) => ({
                        ...prev,
                        aboutData: { ...prev.aboutData, paragraphs: newParas },
                      }));
                    }}
                    className={styles.btnDanger}
                    style={{ alignSelf: 'flex-start', padding: '0.5rem' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    aboutData: {
                      ...prev.aboutData,
                      paragraphs: [...(prev.aboutData.paragraphs || []), ''],
                    },
                  }))
                }
                className={styles.btnSecondary}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                <Plus size={14} />
                <span>Add Paragraph</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Services Showcase */}
        {activeTab === 'services' && (
          <div className={styles.adminSectionCard}>
            <div className={styles.adminSectionHeader}>
              <h3 className={styles.adminSectionTitle}>
                <Layers size={18} color="#e5b869" />
                <span>Services Showcase on Home</span>
              </h3>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Kicker Tag</label>
                <input
                  type="text"
                  value={formData.servicesData.kicker}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      servicesData: { ...prev.servicesData, kicker: e.target.value },
                    }))
                  }
                  className={styles.formInput}
                  placeholder="WHAT WE OFFER"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Showcase Title</label>
                <input
                  type="text"
                  value={formData.servicesData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      servicesData: { ...prev.servicesData, title: e.target.value },
                    }))
                  }
                  className={styles.formInput}
                  placeholder="Upgrade To A Connected Home"
                />
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              {(formData.servicesData.services || []).map((srv, sIdx) => (
                <div key={srv.id || sIdx} className={styles.repeaterBox}>
                  <div className={styles.repeaterHeaderRow}>
                    <span className={styles.repeaterTitle}>Card #{sIdx + 1}: {srv.title}</span>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Card Title</label>
                      <input
                        type="text"
                        value={srv.title}
                        onChange={(e) => {
                          const updated = [...formData.servicesData.services];
                          updated[sIdx] = { ...updated[sIdx], title: e.target.value };
                          setFormData((prev) => ({
                            ...prev,
                            servicesData: { ...prev.servicesData, services: updated },
                          }));
                        }}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Link URL</label>
                      <input
                        type="text"
                        value={srv.link}
                        onChange={(e) => {
                          const updated = [...formData.servicesData.services];
                          updated[sIdx] = { ...updated[sIdx], link: e.target.value };
                          setFormData((prev) => ({
                            ...prev,
                            servicesData: { ...prev.servicesData, services: updated },
                          }));
                        }}
                        className={styles.formInput}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow} style={{ marginTop: '1rem' }}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Short Description</label>
                      <textarea
                        value={srv.description}
                        onChange={(e) => {
                          const updated = [...formData.servicesData.services];
                          updated[sIdx] = { ...updated[sIdx], description: e.target.value };
                          setFormData((prev) => ({
                            ...prev,
                            servicesData: { ...prev.servicesData, services: updated },
                          }));
                        }}
                        className={styles.formTextarea}
                        rows={2}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <ImageUploader
                        label="Service Card Image"
                        value={srv.image}
                        onChange={(url) => {
                          const updated = [...formData.servicesData.services];
                          updated[sIdx] = { ...updated[sIdx], image: url };
                          setFormData((prev) => ({
                            ...prev,
                            servicesData: { ...prev.servicesData, services: updated },
                          }));
                        }}
                        folder="services"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Brands Marquee */}
        {activeTab === 'brands' && (
          <div className={styles.adminSectionCard}>
            <div className={styles.adminSectionHeader}>
              <h3 className={styles.adminSectionTitle}>
                <Sparkles size={18} color="#e5b869" />
                <span>Authorized Brand Partners ({formData.brandsList.length})</span>
              </h3>
              <button
                type="button"
                onClick={addBrand}
                className={styles.btnSecondary}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
              >
                <Plus size={14} />
                <span>Add Brand Partner</span>
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem',
              }}
            >
              {formData.brandsList.map((brand, bIdx) => (
                <div key={bIdx} className={styles.repeaterBox} style={{ margin: 0 }}>
                  <div className={styles.repeaterHeaderRow}>
                    <span className={styles.repeaterTitle}>{brand.name || `Brand #${bIdx + 1}`}</span>
                    <button
                      type="button"
                      onClick={() => removeBrand(bIdx)}
                      className={styles.btnDanger}
                      style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Brand Name</label>
                    <input
                      type="text"
                      value={brand.name}
                      onChange={(e) => updateBrand(bIdx, 'name', e.target.value)}
                      className={styles.formInput}
                      placeholder="e.g. Lutron, Control4, Crestron"
                    />
                  </div>

                  <div className={styles.formGroup} style={{ marginTop: '0.75rem' }}>
                    <ImageUploader
                      label="Brand Logo"
                      value={brand.image}
                      onChange={(url) => updateBrand(bIdx, 'image', url)}
                      helpText="Transparent PNG recommended"
                      folder="brands"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Testimonials */}
        {activeTab === 'testimonials' && (
          <div className={styles.adminSectionCard}>
            <div className={styles.adminSectionHeader}>
              <h3 className={styles.adminSectionTitle}>
                <MessageSquareQuote size={18} color="#e5b869" />
                <span>Client Reviews & Testimonials ({formData.testimonialsData.items?.length || 0})</span>
              </h3>
              <button
                type="button"
                onClick={addTestimonial}
                className={styles.btnSecondary}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
              >
                <Plus size={14} />
                <span>Add Testimonial</span>
              </button>
            </div>

            <div className={styles.formRow} style={{ marginBottom: '1.5rem' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Section Kicker</label>
                <input
                  type="text"
                  value={formData.testimonialsData.kicker}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      testimonialsData: { ...prev.testimonialsData, kicker: e.target.value },
                    }))
                  }
                  className={styles.formInput}
                  placeholder="TESTIMONIAL"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Section Title</label>
                <input
                  type="text"
                  value={formData.testimonialsData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      testimonialsData: { ...prev.testimonialsData, title: e.target.value },
                    }))
                  }
                  className={styles.formInput}
                  placeholder="HEAR FROM OUR CLIENTS..."
                />
              </div>
            </div>

            {(formData.testimonialsData.items || []).map((t, tIdx) => (
              <div key={t.id || tIdx} className={styles.repeaterBox}>
                <div className={styles.repeaterHeaderRow}>
                  <span className={styles.repeaterTitle}>Review #{tIdx + 1}: {t.author}</span>
                  <button
                    type="button"
                    onClick={() => removeTestimonial(tIdx)}
                    className={styles.btnDanger}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Reviewer Name / Author</label>
                    <input
                      type="text"
                      value={t.author}
                      onChange={(e) => updateTestimonial(tIdx, 'author', e.target.value)}
                      className={styles.formInput}
                      placeholder="Priyanka Jain"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Rating (Stars)</label>
                    <select
                      value={t.rating || 5}
                      onChange={(e) => updateTestimonial(tIdx, 'rating', Number(e.target.value))}
                      className={styles.formSelect}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                  <label className={styles.formLabel}>Review Content</label>
                  <textarea
                    value={t.quote}
                    onChange={(e) => updateTestimonial(tIdx, 'quote', e.target.value)}
                    className={styles.formTextarea}
                    rows={3}
                    placeholder="Write client testimonial quote..."
                  />
                </div>

                <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                  <ImageUploader
                    label="Client Avatar / Photo"
                    value={t.avatar}
                    onChange={(url) => updateTestimonial(tIdx, 'avatar', url)}
                    helpText="Square avatar photo"
                    folder="testimonials"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 6: CTA Banner */}
        {activeTab === 'cta' && (
          <div className={styles.adminSectionCard}>
            <div className={styles.adminSectionHeader}>
              <h3 className={styles.adminSectionTitle}>
                <Megaphone size={18} color="#e5b869" />
                <span>Call to Action Banner</span>
              </h3>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Banner Headline</label>
              <textarea
                value={formData.ctaBannerData.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ctaBannerData: { ...prev.ctaBannerData, title: e.target.value },
                  }))
                }
                className={styles.formTextarea}
                rows={2}
                placeholder="Ready to experience life in a smart home?&#10;Book a free consultation now!"
              />
            </div>

            <div className={styles.formRow} style={{ marginTop: '1.25rem' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Button Text</label>
                <input
                  type="text"
                  value={formData.ctaBannerData.buttonText}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ctaBannerData: { ...prev.ctaBannerData, buttonText: e.target.value },
                    }))
                  }
                  className={styles.formInput}
                  placeholder="Let's Connect"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Button Link URL</label>
                <input
                  type="text"
                  value={formData.ctaBannerData.buttonLink}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ctaBannerData: { ...prev.ctaBannerData, buttonLink: e.target.value },
                    }))
                  }
                  className={styles.formInput}
                  placeholder="/contact-us/"
                />
              </div>
            </div>

            <div className={styles.formGroup} style={{ marginTop: '1.25rem' }}>
              <ImageUploader
                label="Banner Background Wallpaper"
                value={formData.ctaBannerData.backgroundImage}
                onChange={(url) =>
                  setFormData((prev) => ({
                    ...prev,
                    ctaBannerData: { ...prev.ctaBannerData, backgroundImage: url },
                  }))
                }
                helpText="Wide dark background image (~1920x600px)"
                folder="banners"
              />
            </div>
          </div>
        )}

        {/* Tab 7: Contact Preview */}
        {activeTab === 'contact' && (
          <div className={styles.adminSectionCard}>
            <div className={styles.adminSectionHeader}>
              <h3 className={styles.adminSectionTitle}>
                <PhoneCall size={18} color="#e5b869" />
                <span>Home Page Contact Preview Section</span>
              </h3>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Section Title</label>
                <input
                  type="text"
                  value={formData.contactSectionData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactSectionData: { ...prev.contactSectionData, title: e.target.value },
                    }))
                  }
                  className={styles.formInput}
                  placeholder="Contact Us"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Section Subtitle</label>
                <input
                  type="text"
                  value={formData.contactSectionData.subtitle}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactSectionData: { ...prev.contactSectionData, subtitle: e.target.value },
                    }))
                  }
                  className={styles.formInput}
                  placeholder="Schedule a demo with us today"
                />
              </div>
            </div>

            <div className={styles.formGroup} style={{ marginTop: '1.25rem' }}>
              <ImageUploader
                label="Demo / Studio Visual Image"
                value={formData.contactSectionData.image}
                onChange={(url) =>
                  setFormData((prev) => ({
                    ...prev,
                    contactSectionData: { ...prev.contactSectionData, image: url },
                  }))
                }
                helpText="Studio or showroom photo"
                folder="contact"
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
            <span>{saving ? 'Saving Home Page...' : 'Save All Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
