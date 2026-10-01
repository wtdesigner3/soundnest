'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, X, RefreshCw, AlertCircle, Link as LinkIcon, Check } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';

export default function ImageUploader({
  label,
  value,
  onChange,
  helpText,
  folder = 'general',
  placeholder = 'Upload an image...',
  required = false,
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Selected file is not an image. Please select JPG, PNG, WEBP, or SVG.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image exceeds 10MB limit. Please compress before uploading.');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload/', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        setError(data.error || 'Failed to upload image. Please try again.');
      }
    } catch (err) {
      setError('Network error while uploading image. Please check your connection.');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={styles.uploaderContainer}>
      {label && (
        <label className={styles.formLabel}>
          {label} {required && <span style={{ color: '#ff6b6b' }}>*</span>}
        </label>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#ff6b6b',
          fontSize: '0.78rem',
          marginBottom: '0.5rem',
          padding: '0.4rem 0.6rem',
          background: 'rgba(255, 107, 107, 0.1)',
          borderRadius: '5px'
        }}>
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* When an image is selected */}
      {value ? (
        <div className={styles.uploaderPreviewWrap}>
          <img
            src={value}
            alt="Uploaded Preview"
            className={styles.uploaderPreviewThumb}
            onError={(e) => {
              e.currentTarget.src = '/images/logo.png';
            }}
          />
          <div className={styles.uploaderPreviewInfo}>
            <div className={styles.uploaderPreviewUrl} title={value}>
              {value}
            </div>
            {helpText && <div className={styles.uploaderPreviewHelp}>{helpText}</div>}
          </div>
          <div className={styles.uploaderActions}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={`${styles.uploaderBtn} ${styles.uploaderBtnChange}`}
              title="Replace this image"
            >
              <RefreshCw size={13} className={uploading ? 'spin' : ''} />
              <span>{uploading ? 'Uploading...' : 'Replace'}</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className={`${styles.uploaderBtn} ${styles.uploaderBtnRemove}`}
              title="Remove image"
            >
              <X size={13} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty Dropzone state */
        <div
          className={`${styles.uploaderDropzone} ${isDragging ? styles.uploaderDropzoneActive : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud size={28} className={styles.uploaderIcon} />
          <div className={styles.uploaderText}>
            {uploading ? 'Uploading image...' : (isDragging ? 'Drop image here to upload' : 'Click to upload image or drag & drop')}
          </div>
          <div className={styles.uploaderSubtext}>
            {helpText || 'Supports JPG, PNG, WEBP, SVG (Max 10MB)'}
          </div>
        </div>
      )}

      {/* Manual URL input fallback toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.2rem' }}>
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className={styles.uploaderManualToggle}
        >
          {showManualInput ? 'Hide manual URL input' : 'Or paste manual image URL'}
        </button>
      </div>

      {showManualInput && (
        <div style={{ marginTop: '0.4rem' }}>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. /images/service-1-bg.jpg or https://..."
            className={styles.formInput}
            style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
          />
        </div>
      )}
    </div>
  );
}
