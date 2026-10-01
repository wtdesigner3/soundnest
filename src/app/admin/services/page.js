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
} from 'lucide-react';
import styles from '../admin.module.css';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal / Drawer state for Create & Edit
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    title: '',
    metaDescription: '',
    h1: '',
    heroSubtitle: '',
    badge: 'SOUNDNEST SMART SOLUTIONS',
    heroBgImage: '/images/service-1-bg.jpg',
    features: [
      { title: 'Smart App Control', description: 'Centralized control via mobile smartphone or tablet.', image: '/images/slider-1.jpg' },
      { title: 'Energy Efficiency', description: 'Intelligent scheduling reduces unnecessary utility bills.', image: '/images/slider-2.jpg' },
    ],
    faqs: [
      { question: 'How is the service installed?', answer: 'Installed cleanly by certified engineers with full support.' },
    ],
  });

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
    setFormData({
      name: '',
      slug: '',
      title: '',
      metaDescription: '',
      h1: '',
      heroSubtitle: '',
      badge: 'SOUNDNEST SMART SOLUTIONS',
      heroBgImage: '/images/service-1-bg.jpg',
      features: [
        { title: 'Smart App Control', description: 'Centralized control via mobile smartphone or tablet.', image: '/images/slider-1.jpg' },
        { title: 'Energy Efficiency', description: 'Intelligent scheduling reduces unnecessary utility bills.', image: '/images/slider-2.jpg' },
      ],
      faqs: [
        { question: 'How is the service installed?', answer: 'Installed cleanly by certified engineers with full support.' },
      ],
    });
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
      features:
        service.features?.length > 0
          ? service.features.map((f) => ({ ...f, image: f.image || '/images/slider-1.jpg' }))
          : [{ title: '', description: '', image: '/images/slider-1.jpg' }],
      faqs: service.faqs?.length > 0 ? service.faqs : [{ question: '', answer: '' }],
    });
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

  const handleFeatureChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.features];
      updated[index][field] = value;
      return { ...prev, features: updated };
    });
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { title: '', description: '', image: '/images/slider-1.jpg' }],
    }));
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleFaqChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.faqs];
      updated[index][field] = value;
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
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        alert(data.error || 'Failed to delete service.');
      }
    } catch {
      alert('Network error deleting service.');
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.35rem' }}>
            Services Management
          </h2>
          <p style={{ color: '#888888', margin: 0, fontSize: '0.85rem' }}>
            Manage core services and publish new dynamic services automatically resolved by Next.js.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewServiceModal}
          className={styles.btnPrimary}
          id="btn-add-service"
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
                <th>Features</th>
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
                      <span style={{ fontSize: '0.85rem', color: '#aaaaaa' }}>
                        {service.features?.length || 0} features
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          color: '#aaaaaa',
                          maxWidth: '280px',
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
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.75rem',
                borderBottom: '1px solid #222222',
                paddingBottom: '1rem',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                {editingService ? `Edit Service: ${editingService.name}` : 'Create New Service'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className={styles.btnSecondary}
                style={{ padding: '0.35rem' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Service Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                    placeholder="e.g. Architectural Lighting"
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>URL Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase() }))
                    }
                    required
                    placeholder="e.g. architectural-lighting"
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Hero H1 Headline</label>
                  <input
                    type="text"
                    value={formData.h1}
                    onChange={(e) => setFormData((prev) => ({ ...prev, h1: e.target.value }))}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Header Badge Tag</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Hero Subtitle Paragraph</label>
                <textarea
                  value={formData.heroSubtitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, heroSubtitle: e.target.value }))
                  }
                  rows={2}
                  className={styles.formTextarea}
                />
              </div>

              {/* Hero Background Image */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Hero Section Background Image URL</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={formData.heroBgImage}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, heroBgImage: e.target.value }))
                    }
                    placeholder="/images/service-1-bg.jpg"
                    className={styles.formInput}
                    style={{ flex: 1 }}
                  />
                  {formData.heroBgImage && (
                    <img
                      src={formData.heroBgImage}
                      alt="Hero BG Preview"
                      style={{
                        width: '56px',
                        height: '36px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        border: '1px solid rgba(229, 184, 105, 0.4)',
                        flexShrink: 0,
                      }}
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  )}
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#888888',
                    marginTop: '0.3rem',
                    display: 'block',
                  }}
                >
                  Live Presets: /images/service-1-bg.jpg, /images/building-automation-1-1.jpg, /images/curtain-motor-1.jpg, /images/home-cinema-audio-video-3.jpg
                </span>
              </div>

              {/* SEO Controls */}
              <div
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #2e2e2e',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#e5b869',
                    marginBottom: '1rem',
                  }}
                >
                  SEO & Search Engine Metas
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>SEO Meta Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>SEO Meta Description</label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))
                    }
                    rows={2}
                    className={styles.formTextarea}
                  />
                </div>
              </div>

              {/* Features Editor */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                  }}
                >
                  <label className={styles.formLabel} style={{ margin: 0 }}>
                    Feature Matrix Cards with Background Overlays ({formData.features.length})
                  </label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className={styles.btnSecondary}
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                  >
                    + Add Feature
                  </button>
                </div>

                {formData.features.map((feat, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#181818',
                      border: '1px solid #282828',
                      borderRadius: '8px',
                      padding: '0.85rem',
                      marginBottom: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Feature Title *"
                        value={feat.title}
                        onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                        className={styles.formInput}
                        style={{ flex: 1 }}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Card Background Image (/images/slider-1.jpg)"
                        value={feat.image || ''}
                        onChange={(e) => handleFeatureChange(idx, 'image', e.target.value)}
                        className={styles.formInput}
                        style={{ flex: 1.2 }}
                      />
                      {feat.image && (
                        <img
                          src={feat.image}
                          alt={feat.title || 'Feature'}
                          style={{
                            width: '40px',
                            height: '34px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: '1px solid rgba(229, 184, 105, 0.4)',
                            flexShrink: 0,
                          }}
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className={styles.btnDanger}
                        style={{ padding: '0.55rem 0.65rem', flexShrink: 0 }}
                        title="Remove Feature"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <textarea
                      placeholder="Feature Description (rendered over dark gradient card overlay)"
                      value={feat.description}
                      onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                      rows={2}
                      className={styles.formTextarea}
                    />
                  </div>
                ))}
              </div>

              {/* FAQs Editor */}
              <div style={{ marginBottom: '2rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                  }}
                >
                  <label className={styles.formLabel} style={{ margin: 0 }}>
                    Frequently Asked Questions ({formData.faqs.length})
                  </label>
                  <button
                    type="button"
                    onClick={addFaq}
                    className={styles.btnSecondary}
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                  >
                    + Add FAQ
                  </button>
                </div>

                {formData.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#181818',
                      border: '1px solid #282828',
                      borderRadius: '6px',
                      padding: '0.75rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Question"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                        className={styles.formInput}
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() => removeFaq(idx)}
                        className={styles.btnDanger}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <textarea
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                      rows={2}
                      className={styles.formTextarea}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className={styles.btnSecondary}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary} id="btn-save-service">
                  <Save size={16} />
                  <span>{editingService ? 'Save Changes' : 'Publish Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
