'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info,
  Sliders,
  MessageSquare,
  Image as ImageIcon,
  FolderKanban,
} from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import styles from '../admin.module.css';

const editorTabs = [
  { id: 'hero', label: 'Hero & SEO', icon: <Sparkles size={16} /> },
  { id: 'features', label: 'Features (What We Offer)', icon: <Layers size={16} /> },
  { id: 'experience', label: 'Why Choose Us', icon: <Info size={16} /> },
  { id: 'process', label: 'Process & Gallery', icon: <FolderKanban size={16} /> },
  { id: 'faqs', label: 'FAQs', icon: <MessageSquare size={16} /> },
];

const availableIcons = [
  'lightbulb',
  'fan',
  'thermometer',
  'tv',
  'toggle',
  'sparkles',
  'wallet',
  'home',
  'shield',
  'cpu',
  'speaker',
  'projector',
  'wave',
  'film',
  'music',
  'leaf',
  'dashboard',
];

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal / Drawer state for Create & Edit
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [editingService, setEditingService] = useState(null);

  const initialFormState = {
    name: '',
    slug: '',
    title: '',
    metaDescription: '',
    h1: '',
    heroSubtitle: '',
    badge: 'SOUNDNEST SMART SOLUTIONS',
    heroBgImage: '/images/service-1-bg.jpg',
    heroImage: '/images/services/retrofit.jpg',
    heroPills: ['100% Turnkey Solution', 'Quick Deployment', 'Manufacturer Warranty'],
    featuresKicker: 'WHAT WE OFFER',
    featuresTitle: 'Smart Features for Modern Living',
    features: [
      {
        title: 'Smart Lighting',
        description: 'Control your lights from a single tap on your phone or ambient sensors.',
        icon: 'lightbulb',
        image: '/images/slider-1.jpg',
      },
      {
        title: 'Climate Control',
        description: 'Tired of your AC remote? Switch to smart temperature scheduling.',
        icon: 'thermometer',
        image: '/images/slider-2.jpg',
      },
    ],
    experienceKicker: 'SOUNDNEST EXPERIENCE',
    experienceTitle: 'Why Choose Soundnest?',
    experienceSubtitle: 'Save Money, Save Time.',
    experienceDescription:
      'Instead of building a new smart home, we upgrade what you already have. No need to spend lakhs on reconstruction.',
    experiencePoints: [
      {
        title: 'Save Money, Save Time',
        description: 'Upgrade what you already have with minimal civil work or disruption.',
        icon: 'wallet',
      },
      {
        title: 'No Mess, No Stress',
        description: 'Clean, dust-free deployment by certified systems engineers.',
        icon: 'sparkles',
      },
      {
        title: 'Perfect for Indian Homes',
        description: 'Engineered specifically for Indian electrical topologies and load conditions.',
        icon: 'home',
      },
    ],
    processKicker: 'OUR PROCESS',
    processTitle: 'Immerse Yourself in Intelligent Living',
    processSubtitle: 'Turnkey consultation, CAD schematics, installation, and family training.',
    processParagraphs: [
      'Our experienced engineering team has transformed hundreds of homes and corporate spaces across India.',
      'We use only globally certified, warranty-backed products and provide lifetime dedicated support.',
    ],
    gallery: [
      { url: '/images/slider-3.jpg', title: 'Centralized Control App' },
      { url: '/images/services/retrofit.jpg', title: 'Concealed Module Integration' },
      { url: '/images/about-us.jpg', title: 'Architectural Lighting Design' },
    ],
    faqs: [
      {
        question: 'Does this service require rewiring or breaking walls?',
        answer: 'No! It is designed to work seamlessly with existing conduit and switch infrastructure.',
      },
      {
        question: 'Will existing physical switches continue to work normally?',
        answer: 'Yes! Physical touch points work as normal, with smart automation added on top.',
      },
    ],
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/services/');
      const data = await res.json();
      if (res.ok) {
        setServices(data.services || []);
      } else {
        setError(data.error || 'Failed to load services');
      }
    } catch {
      setError('Network error loading services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openNewServiceModal = () => {
    setEditingService(null);
    setFormData(initialFormState);
    setActiveTab('hero');
    setIsEditorOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || '',
      slug: service.slug || '',
      title: service.title || '',
      metaDescription: service.metaDescription || '',
      h1: service.h1 || service.name || '',
      heroSubtitle: service.heroSubtitle || '',
      badge: service.badge || 'SOUNDNEST SMART SOLUTIONS',
      heroBgImage: service.heroBgImage || service.heroImage || '/images/service-1-bg.jpg',
      heroImage: service.heroImage || '/images/services/retrofit.jpg',
      heroPills: service.heroPills || [
        '100% Turnkey Solution',
        'Quick Deployment',
        'Manufacturer Warranty',
      ],
      featuresKicker: service.featuresKicker || 'WHAT WE OFFER',
      featuresTitle: service.featuresTitle || 'Smart Features for Modern Living',
      features:
        service.features?.length > 0
          ? service.features.map((f) => ({
              title: f.title || '',
              description: f.description || '',
              icon: f.icon || 'lightbulb',
              image: f.image || '/images/slider-1.jpg',
            }))
          : initialFormState.features,
      experienceKicker: service.experienceKicker || 'SOUNDNEST EXPERIENCE',
      experienceTitle: service.experienceTitle || `Why Choose ${service.name}?`,
      experienceSubtitle: service.experienceSubtitle || 'Engineered for luxury, reliability, and precision control.',
      experienceDescription:
        service.experienceDescription ||
        'We combine world-class hardware with personalized integration to deliver unparalleled smart living experiences.',
      experiencePoints:
        service.experiencePoints?.length > 0
          ? service.experiencePoints.map((p) => ({
              title: p.title || '',
              description: p.description || '',
              icon: p.icon || 'sparkles',
            }))
          : initialFormState.experiencePoints,
      processKicker: service.processKicker || 'OUR PROCESS',
      processTitle: service.processTitle || 'Immerse Yourself in Intelligent Living',
      processSubtitle: service.processSubtitle || 'Turnkey consultation, CAD schematics, and precision deployment.',
      processParagraphs:
        service.processParagraphs?.length > 0
          ? service.processParagraphs
          : initialFormState.processParagraphs,
      gallery:
        service.gallery?.length > 0
          ? service.gallery.map((g) => ({
              url: g.url || '/images/slider-1.jpg',
              title: g.title || '',
            }))
          : initialFormState.gallery,
      faqs:
        service.faqs?.length > 0
          ? service.faqs.map((f) => ({
              question: f.question || '',
              answer: f.answer || '',
            }))
          : initialFormState.faqs,
    });
    setActiveTab('hero');
    setIsEditorOpen(true);
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      h1: prev.h1 === prev.name || !prev.h1 ? val : prev.h1,
      slug: !editingService
        ? val
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        : prev.slug,
      title: !editingService ? `${val} in India - Soundnest` : prev.title,
    }));
  };

  // Feature repeaters
  const handleFeatureChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.features];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, features: updated };
    });
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        { title: '', description: '', icon: 'lightbulb', image: '/images/slider-1.jpg' },
      ],
    }));
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // Experience repeaters
  const handleExpPointChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.experiencePoints];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experiencePoints: updated };
    });
  };

  const addExpPoint = () => {
    setFormData((prev) => ({
      ...prev,
      experiencePoints: [
        ...prev.experiencePoints,
        { title: 'New Advantage Point', description: 'Describe why clients choose this solution.', icon: 'sparkles' },
      ],
    }));
  };

  const removeExpPoint = (index) => {
    setFormData((prev) => ({
      ...prev,
      experiencePoints: prev.experiencePoints.filter((_, i) => i !== index),
    }));
  };

  // Gallery repeaters
  const handleGalleryChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.gallery];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, gallery: updated };
    });
  };

  const addGalleryItem = () => {
    setFormData((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        { url: '/images/slider-1.jpg', title: 'New Showcase Photo' },
      ],
    }));
  };

  const removeGalleryItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  // FAQ repeaters
  const handleFaqChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.faqs];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, faqs: updated };
    });
  };

  const addFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }],
    }));
  };

  const removeFaq = (index) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      alert('Please provide both Service Name and URL Slug.');
      return;
    }

    try {
      const url = editingService
        ? `/api/admin/services/${editingService.slug}/`
        : '/api/admin/services/';
      const method = editingService ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(
          editingService
            ? `Service "${formData.name}" updated successfully!`
            : `New service "${formData.name}" created! Accessible at /${formData.slug}/`
        );
        setIsEditorOpen(false);
        fetchServices();
        setTimeout(() => setSuccessMsg(null), 5000);
      } else {
        alert(data.error || 'Failed to save service.');
      }
    } catch {
      alert('Network error saving service.');
    }
  };

  const handleDelete = async (service) => {
    if (
      !confirm(
        `Are you sure you want to delete "${service.name}" (/${service.slug}/)? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/services/${service.slug}/`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`Service "${service.name}" deleted.`);
        fetchServices();
        setTimeout(() => setSuccessMsg(null), 5000);
      } else {
        alert(data.error || 'Failed to delete service.');
      }
    } catch {
      alert('Network error deleting service.');
    }
  };

  return (
    <div>
      {/* Header Bar */}
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
            Services Management
          </h2>
          <p style={{ color: '#888888', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Full control of Hero, Features, Why Choose Us, Our Process, Galleries, and FAQs.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewServiceModal}
          className={styles.btnPrimary}
        >
          <Plus size={16} />
          <span>Add New Service</span>
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

      {error && (
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
          {error}
        </div>
      )}

      {/* Services Table */}
      <div className={styles.cardSection}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Service Name</th>
                <th>URL Route</th>
                <th>Sections</th>
                <th>SEO Meta Title</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#888888' }}>
                    Loading services from MongoDB Atlas...
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#888888' }}>
                    No services found. Click &ldquo;Add New Service&rdquo; above.
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.slug}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                        {service.name}
                      </div>
                      {service.badge && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: '#e5b869',
                            background: 'rgba(229, 184, 105, 0.1)',
                            padding: '0.15rem 0.4rem',
                            borderRadius: '4px',
                            marginTop: '0.2rem',
                            display: 'inline-block',
                          }}
                        >
                          {service.badge}
                        </span>
                      )}
                    </td>
                    <td>
                      <code style={{ fontSize: '0.8rem', color: '#e5b869' }}>
                        /{service.slug}/
                      </code>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', color: '#aaaaaa', lineHeight: 1.5 }}>
                        <div>✨ {service.features?.length || 0} Features</div>
                        <div>💎 {service.experiencePoints?.length || 0} Why Choose Us</div>
                        <div>📸 {service.gallery?.length || 0} Gallery Photos</div>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          color: '#aaaaaa',
                          maxWidth: '260px',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={service.title}
                      >
                        {service.title || 'Default Title'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Link
                          href={`/${service.slug}/`}
                          target="_blank"
                          className={styles.btnSecondary}
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                          title="View Live Page"
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <button
                          type="button"
                          id={`btn-edit-${service.slug}`}
                          onClick={() => openEditModal(service)}
                          className={styles.btnSecondary}
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                          title="Edit Service"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(service)}
                          className={styles.btnDanger}
                          title="Delete Service"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Editor Modal */}
      {isEditorOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(5px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            overflowY: 'auto',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditorOpen(false);
          }}
        >
          <div
            style={{
              background: '#141414',
              border: '1px solid rgba(229, 184, 105, 0.3)',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '960px',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                borderBottom: '1px solid #222222',
                paddingBottom: '1rem',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  {editingService ? `Edit Service: ${editingService.name}` : 'Create New Service'}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#888888' }}>
                  Target route: <code>/{formData.slug || 'service-slug'}/</code>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className={styles.footerBtn}
                style={{ width: 'auto', padding: '0.35rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tab Navigation */}
            <div className={styles.adminTabNav}>
              {editorTabs.map((tab) => (
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
              {/* Tab 1: Hero & SEO */}
              {activeTab === 'hero' && (
                <div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Service Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={handleNameChange}
                        className={styles.formInput}
                        placeholder="e.g. Retro Fit Automation"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>URL Slug * (e.g. retro-fit-automation)</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            slug: e.target.value
                              .toLowerCase()
                              .trim()
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/^-+|-+$/g, ''),
                          }))
                        }
                        className={styles.formInput}
                        placeholder="retro-fit-automation"
                        required
                        disabled={!!editingService}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow} style={{ marginTop: '1.25rem' }}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Badge Kicker (Top gold pill)</label>
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                        className={styles.formInput}
                        placeholder="ZERO WIRING CHANGES"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Hero H1 Headline</label>
                      <input
                        type="text"
                        value={formData.h1}
                        onChange={(e) => setFormData((prev) => ({ ...prev, h1: e.target.value }))}
                        className={styles.formInput}
                        placeholder="Retro Fit Automation"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup} style={{ marginTop: '1.25rem' }}>
                    <label className={styles.formLabel}>Hero Subtitle</label>
                    <textarea
                      value={formData.heroSubtitle}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, heroSubtitle: e.target.value }))
                      }
                      className={styles.formTextarea}
                      rows={3}
                      placeholder="Do you love your home but wish it had modern smart features? Good news!..."
                    />
                  </div>

                  {/* Hero Background Image Upload */}
                  <div className={styles.formRow} style={{ marginTop: '1.5rem' }}>
                    <div className={styles.formGroup}>
                      <ImageUploader
                        label="Hero Background Wallpaper"
                        value={formData.heroBgImage}
                        onChange={(url) => setFormData((prev) => ({ ...prev, heroBgImage: url }))}
                        helpText="Wide hero background image (1920x1080px)"
                        folder="services"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <ImageUploader
                        label="Service Featured / Card Thumbnail"
                        value={formData.heroImage}
                        onChange={(url) => setFormData((prev) => ({ ...prev, heroImage: url }))}
                        helpText="Thumbnail image for service listings"
                        folder="services"
                      />
                    </div>
                  </div>

                  {/* SEO Section */}
                  <div
                    style={{
                      background: '#181818',
                      border: '1px solid #282828',
                      borderRadius: '8px',
                      padding: '1.25rem',
                      marginTop: '1.5rem',
                    }}
                  >
                    <h4 style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: '#e5b869' }}>
                      🔍 SEO & Search Meta Information
                    </h4>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Google Meta Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                        className={styles.formInput}
                        placeholder="Retrofit Home Automation in India - Soundnest"
                      />
                    </div>

                    <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                      <label className={styles.formLabel}>Google Meta Description</label>
                      <textarea
                        value={formData.metaDescription}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))
                        }
                        className={styles.formTextarea}
                        rows={2}
                        placeholder="Looking for the best retrofit home automation in India?..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Features ("What We Offer") */}
              {activeTab === 'features' && (
                <div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Section Kicker</label>
                      <input
                        type="text"
                        value={formData.featuresKicker}
                        onChange={(e) => setFormData((prev) => ({ ...prev, featuresKicker: e.target.value }))}
                        className={styles.formInput}
                        placeholder="WHAT WE OFFER"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Section Main Title</label>
                      <input
                        type="text"
                        value={formData.featuresTitle}
                        onChange={(e) => setFormData((prev) => ({ ...prev, featuresTitle: e.target.value }))}
                        className={styles.formInput}
                        placeholder="Smart Features for Modern Living"
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      margin: '1.5rem 0 1rem',
                    }}
                  >
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#e5b869' }}>
                      Feature Cards ({formData.features.length})
                    </h4>
                    <button
                      type="button"
                      onClick={addFeature}
                      className={styles.btnSecondary}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      <Plus size={14} />
                      <span>Add Feature Card</span>
                    </button>
                  </div>

                  {formData.features.map((feature, idx) => (
                    <div key={idx} className={styles.repeaterBox}>
                      <div className={styles.repeaterHeaderRow}>
                        <span className={styles.repeaterTitle}>Feature #{idx + 1}: {feature.title || 'Untitled'}</span>
                        {formData.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(idx)}
                            className={styles.btnDanger}
                            style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Feature Title</label>
                          <input
                            type="text"
                            value={feature.title}
                            onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                            className={styles.formInput}
                            placeholder="e.g. Smart Lighting"
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Feature Icon</label>
                          <select
                            value={feature.icon || 'lightbulb'}
                            onChange={(e) => handleFeatureChange(idx, 'icon', e.target.value)}
                            className={styles.formSelect}
                          >
                            {availableIcons.map((ic) => (
                              <option key={ic} value={ic}>
                                {ic}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className={styles.formGroup} style={{ marginTop: '0.85rem' }}>
                        <label className={styles.formLabel}>Feature Description</label>
                        <textarea
                          value={feature.description}
                          onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                          className={styles.formTextarea}
                          rows={2}
                          placeholder="Brief capability description..."
                        />
                      </div>

                      <div className={styles.formGroup} style={{ marginTop: '0.85rem' }}>
                        <ImageUploader
                          label="Feature Card Background Image"
                          value={feature.image}
                          onChange={(url) => handleFeatureChange(idx, 'image', url)}
                          helpText="Clean interior or lighting photo"
                          folder="features"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Why Choose Us (Experience) */}
              {activeTab === 'experience' && (
                <div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Section Kicker</label>
                      <input
                        type="text"
                        value={formData.experienceKicker}
                        onChange={(e) => setFormData((prev) => ({ ...prev, experienceKicker: e.target.value }))}
                        className={styles.formInput}
                        placeholder="SOUNDNEST EXPERIENCE"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Section Title</label>
                      <input
                        type="text"
                        value={formData.experienceTitle}
                        onChange={(e) => setFormData((prev) => ({ ...prev, experienceTitle: e.target.value }))}
                        className={styles.formInput}
                        placeholder="Why Choose Retrofit Automation?"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                    <label className={styles.formLabel}>Section Description</label>
                    <textarea
                      value={formData.experienceDescription}
                      onChange={(e) => setFormData((prev) => ({ ...prev, experienceDescription: e.target.value }))}
                      className={styles.formTextarea}
                      rows={2}
                      placeholder="Instead of building a new smart home, we upgrade what you already have..."
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      margin: '1.5rem 0 1rem',
                    }}
                  >
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#e5b869' }}>
                      Why Choose Us Points ({formData.experiencePoints.length})
                    </h4>
                    <button
                      type="button"
                      onClick={addExpPoint}
                      className={styles.btnSecondary}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      <Plus size={14} />
                      <span>Add Advantage Point</span>
                    </button>
                  </div>

                  {formData.experiencePoints.map((point, pIdx) => (
                    <div key={pIdx} className={styles.repeaterBox}>
                      <div className={styles.repeaterHeaderRow}>
                        <span className={styles.repeaterTitle}>Point #{pIdx + 1}: {point.title}</span>
                        {formData.experiencePoints.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExpPoint(pIdx)}
                            className={styles.btnDanger}
                            style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Point Title</label>
                          <input
                            type="text"
                            value={point.title}
                            onChange={(e) => handleExpPointChange(pIdx, 'title', e.target.value)}
                            className={styles.formInput}
                            placeholder="e.g. Save Money, Save Time"
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Icon</label>
                          <select
                            value={point.icon || 'sparkles'}
                            onChange={(e) => handleExpPointChange(pIdx, 'icon', e.target.value)}
                            className={styles.formSelect}
                          >
                            {availableIcons.map((ic) => (
                              <option key={ic} value={ic}>
                                {ic}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className={styles.formGroup} style={{ marginTop: '0.85rem' }}>
                        <label className={styles.formLabel}>Point Description</label>
                        <textarea
                          value={point.description}
                          onChange={(e) => handleExpPointChange(pIdx, 'description', e.target.value)}
                          className={styles.formTextarea}
                          rows={2}
                          placeholder="Detailed value explanation..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Process & Gallery */}
              {activeTab === 'process' && (
                <div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Process Kicker</label>
                      <input
                        type="text"
                        value={formData.processKicker}
                        onChange={(e) => setFormData((prev) => ({ ...prev, processKicker: e.target.value }))}
                        className={styles.formInput}
                        placeholder="OUR PROCESS"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Process Heading</label>
                      <input
                        type="text"
                        value={formData.processTitle}
                        onChange={(e) => setFormData((prev) => ({ ...prev, processTitle: e.target.value }))}
                        className={styles.formInput}
                        placeholder="Immerse yourself in the pinnacle of Home Entertainment"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                    <label className={styles.formLabel}>Process Subtitle</label>
                    <input
                      type="text"
                      value={formData.processSubtitle}
                      onChange={(e) => setFormData((prev) => ({ ...prev, processSubtitle: e.target.value }))}
                      className={styles.formInput}
                      placeholder="Start with one room or whole-home. Every smart device is future-ready."
                    />
                  </div>

                  <div className={styles.formGroup} style={{ marginTop: '1.25rem' }}>
                    <label className={styles.formLabel}>
                      Process Body Paragraphs
                    </label>
                    {formData.processParagraphs.map((para, pIdx) => (
                      <div key={pIdx} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <textarea
                          value={para}
                          onChange={(e) => {
                            const updated = [...formData.processParagraphs];
                            updated[pIdx] = e.target.value;
                            setFormData((prev) => ({ ...prev, processParagraphs: updated }));
                          }}
                          className={styles.formTextarea}
                          rows={2}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.processParagraphs.filter((_, i) => i !== pIdx);
                            setFormData((prev) => ({ ...prev, processParagraphs: updated }));
                          }}
                          className={styles.btnDanger}
                          style={{ padding: '0.5rem', alignSelf: 'flex-start' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          processParagraphs: [...prev.processParagraphs, ''],
                        }))
                      }
                      className={styles.btnSecondary}
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                    >
                      <Plus size={14} />
                      <span>Add Paragraph</span>
                    </button>
                  </div>

                  {/* Visual Gallery */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      margin: '2rem 0 1rem',
                      borderTop: '1px solid #222',
                      paddingTop: '1.5rem',
                    }}
                  >
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#e5b869' }}>
                      Showcase Visual Gallery ({formData.gallery.length} Images)
                    </h4>
                    <button
                      type="button"
                      onClick={addGalleryItem}
                      className={styles.btnSecondary}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      <Plus size={14} />
                      <span>Add Gallery Photo</span>
                    </button>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: '1rem',
                    }}
                  >
                    {formData.gallery.map((item, gIdx) => (
                      <div key={gIdx} className={styles.repeaterBox} style={{ margin: 0 }}>
                        <div className={styles.repeaterHeaderRow}>
                          <span className={styles.repeaterTitle}>Photo #{gIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeGalleryItem(gIdx)}
                            className={styles.btnDanger}
                            style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Photo Caption / Title</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleGalleryChange(gIdx, 'title', e.target.value)}
                            className={styles.formInput}
                            placeholder="e.g. Smart App Centralized Control"
                          />
                        </div>

                        <div className={styles.formGroup} style={{ marginTop: '0.75rem' }}>
                          <ImageUploader
                            label="Gallery Image"
                            value={item.url}
                            onChange={(url) => handleGalleryChange(gIdx, 'url', url)}
                            folder="gallery"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: FAQs */}
              {activeTab === 'faqs' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#e5b869' }}>
                      Frequently Asked Questions ({formData.faqs.length})
                    </h4>
                    <button
                      type="button"
                      onClick={addFaq}
                      className={styles.btnSecondary}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      <Plus size={14} />
                      <span>Add FAQ</span>
                    </button>
                  </div>

                  {formData.faqs.map((faq, idx) => (
                    <div key={idx} className={styles.repeaterBox}>
                      <div className={styles.repeaterHeaderRow}>
                        <span className={styles.repeaterTitle}>Question #{idx + 1}</span>
                        {formData.faqs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFaq(idx)}
                            className={styles.btnDanger}
                            style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Question</label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                          className={styles.formInput}
                          placeholder="e.g. Does retrofit automation require rewiring?"
                        />
                      </div>

                      <div className={styles.formGroup} style={{ marginTop: '0.75rem' }}>
                        <label className={styles.formLabel}>Answer</label>
                        <textarea
                          value={faq.answer}
                          onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                          className={styles.formTextarea}
                          rows={3}
                          placeholder="Detailed clear answer..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Modal Footer Save & Cancel Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '1rem',
                  marginTop: '2rem',
                  borderTop: '1px solid #222222',
                  paddingTop: '1.25rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className={styles.btnSecondary}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  style={{ padding: '0.75rem 2rem' }}
                >
                  <Save size={16} />
                  <span>{editingService ? 'Save Service Changes' : 'Create Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
