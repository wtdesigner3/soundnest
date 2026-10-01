'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Save,
  X,
  CheckCircle,
} from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import styles from '../admin.module.css';

const categories = [
  'All Categories',
  'Home Automation',
  'Commercial Automation',
  'Lighting & Climate',
  'Audio & Home Theater',
  'Industry Insights',
];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All Categories');
  const [successMsg, setSuccessMsg] = useState(null);

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Home Automation',
    author: 'Soundnest Team',
    featuredImage: '/images/slider-1.jpg',
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/admin/posts/', window.location.origin);
      if (searchTerm) url.searchParams.set('search', searchTerm);
      if (selectedCat !== 'All Categories') url.searchParams.set('category', selectedCat);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCat]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const openNewPostModal = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '<p>Write your article content here...</p>',
      category: 'Home Automation',
      author: 'Soundnest Team',
      featuredImage: '/images/slider-1.jpg',
    });
    setIsEditorOpen(true);
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      category: post.category || 'Home Automation',
      author: post.author || 'Soundnest Team',
      featuredImage: post.featuredImage || '/images/slider-1.jpg',
    });
    setIsEditorOpen(true);
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !editingPost
        ? val
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        : prev.slug,
    }));
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim()) {
      alert('Article title and slug are required.');
      return;
    }

    try {
      const url = editingPost
        ? `/api/admin/posts/${editingPost.slug}/`
        : '/api/admin/posts/';
      const method = editingPost ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(
          editingPost
            ? `Article "${formData.title}" updated!`
            : `Article "${formData.title}" published! Available at /${formData.slug}/`
        );
        setIsEditorOpen(false);
        fetchPosts();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        alert(data.error || 'Failed to save post.');
      }
    } catch {
      alert('Network error saving article.');
    }
  };

  const handleDeletePost = async (post) => {
    if (!confirm(`Delete article "${post.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/posts/${post.slug}/`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSuccessMsg(`Article "${post.title}" deleted.`);
        fetchPosts();
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch {
      alert('Error deleting post.');
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.35rem' }}>
            Blog Articles Manager
          </h2>
          <p style={{ color: '#888888', margin: 0, fontSize: '0.85rem' }}>
            Manage editorial articles, publish updates, and optimize content for search engines.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewPostModal}
          className={styles.btnPrimary}
          id="btn-new-article"
        >
          <Plus size={16} />
          <span>Write New Article</span>
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

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <form
          onSubmit={handleSearchSubmit}
          style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '450px' }}
        >
          <input
            type="text"
            placeholder="Search by title or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.formInput}
            style={{ padding: '0.5rem 1rem' }}
          />
          <button type="submit" className={styles.btnSecondary}>
            <Search size={16} />
          </button>
        </form>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className={styles.formSelect}
          style={{ width: 'auto', padding: '0.5rem 1rem' }}
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Articles Table */}
      <div className={styles.cardSection}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Article Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: '#888' }}>
                    Loading articles...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: '#888' }}>
                    No articles match your search criteria.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.slug}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                        {post.title}
                      </div>
                      <code style={{ fontSize: '0.75rem', color: '#e5b869' }}>
                        /{post.slug}/
                      </code>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#cccccc',
                          background: '#222222',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                        }}
                      >
                        {post.category || 'General'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#aaaaaa' }}>{post.author}</td>
                    <td style={{ fontSize: '0.85rem', color: '#888888' }}>{post.date}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Link
                          href={`/${post.slug}/`}
                          target="_blank"
                          className={styles.btnSecondary}
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                          title="View Live Article"
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditModal(post)}
                          className={styles.btnSecondary}
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                          title="Edit Article"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePost(post)}
                          className={styles.btnDanger}
                          title="Delete Article"
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

      {/* Article Editor Modal */}
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
              maxWidth: '850px',
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
                marginBottom: '1.5rem',
                borderBottom: '1px solid #222222',
                paddingBottom: '1rem',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                {editingPost ? `Edit Article: ${editingPost.title}` : 'Write New Article'}
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

            <form onSubmit={handleSavePost}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Article Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                  placeholder="e.g. The Future of KNX Home Automation in 2026"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>URL Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase() }))
                    }
                    required
                    placeholder="e.g. knx-home-automation-future"
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className={styles.formSelect}
                  >
                    <option value="Home Automation">Home Automation</option>
                    <option value="Commercial Automation">Commercial Automation</option>
                    <option value="Lighting & Climate">Lighting & Climate</option>
                    <option value="Audio & Home Theater">Audio & Home Theater</option>
                    <option value="Industry Insights">Industry Insights</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Author Name</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, author: e.target.value }))
                    }
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                <ImageUploader
                  label="Featured Banner Image"
                  value={formData.featuredImage}
                  onChange={(url) => setFormData((prev) => ({ ...prev, featuredImage: url }))}
                  helpText="High-res blog header image"
                  folder="blog"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Excerpt / Short Summary</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  rows={2}
                  className={styles.formTextarea}
                  placeholder="Brief preview displayed in blog archive cards..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Article Content (HTML / Markdown)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, content: e.target.value }))
                  }
                  rows={10}
                  className={styles.formTextarea}
                  style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                  placeholder="<p>Full article body with headings, paragraphs, and lists...</p>"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className={styles.btnSecondary}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary} id="btn-save-article">
                  <Save size={16} />
                  <span>{editingPost ? 'Update Article' : 'Publish Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
