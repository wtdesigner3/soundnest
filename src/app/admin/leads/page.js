'use client';

import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Phone,
  Mail,
  MessageSquare,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react';
import styles from '../admin.module.css';

const statuses = [
  { id: 'all', label: 'All Inquiries' },
  { id: 'new', label: 'New / Unread' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'converted', label: 'Converted / Closed' },
  { id: 'archived', label: 'Archived' },
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/admin/leads/', window.location.origin);
      if (activeTab !== 'all') url.searchParams.set('status', activeTab);
      if (searchTerm) url.searchParams.set('search', searchTerm);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (res.ok) {
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [activeTab]);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setToastMsg(`Status updated to ${newStatus.toUpperCase()}`);
        fetchLeads();
        setTimeout(() => setToastMsg(null), 3000);
      }
    } catch {
      alert('Failed to update status');
    }
  };

  const handleDeleteLead = async (leadId, name) => {
    if (!confirm(`Delete inquiry from ${name}?`)) return;

    try {
      const res = await fetch(`/api/admin/leads/${leadId}/`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setToastMsg(`Inquiry deleted.`);
        fetchLeads();
        setTimeout(() => setToastMsg(null), 3000);
      }
    } catch {
      alert('Failed to delete inquiry');
    }
  };

  return (
    <div>
      <div className={styles.cardHeader}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.35rem' }}>
            Consultation Leads Inbox
          </h2>
          <p style={{ color: '#888888', margin: 0, fontSize: '0.85rem' }}>
            Review, follow up, and manage prospective clients captured across all website forms.
          </p>
        </div>
      </div>

      {toastMsg && (
        <div
          style={{
            background: 'rgba(46, 204, 113, 0.15)',
            border: '1px solid rgba(46, 204, 113, 0.3)',
            color: '#2ecc71',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Tabs & Search */}
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
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {statuses.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={styles.btnSecondary}
              style={{
                backgroundColor: activeTab === tab.id ? 'rgba(229, 184, 105, 0.15)' : undefined,
                borderColor: activeTab === tab.id ? 'rgba(229, 184, 105, 0.35)' : undefined,
                color: activeTab === tab.id ? '#e5b869' : undefined,
                fontSize: '0.8rem',
                padding: '0.45rem 0.85rem',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchLeads();
          }}
          style={{ display: 'flex', gap: '0.5rem', maxWidth: '350px', flex: 1 }}
        >
          <input
            type="text"
            placeholder="Search prospect name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.formInput}
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
          />
          <button type="submit" className={styles.btnSecondary} style={{ padding: '0.45rem 0.75rem' }}>
            <Search size={14} />
          </button>
        </form>
      </div>

      {/* Leads Table */}
      <div className={styles.cardSection}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Prospect</th>
                <th>Service & Requirements</th>
                <th>Source</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Direct Contact & Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#888' }}>
                    Loading consultation leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#888' }}>
                    No consultation inquiries found in this view.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const rawPhone = lead.phone?.replace(/[^0-9]/g, '') || '';
                  const waNumber = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

                  return (
                    <tr key={lead._id?.toString()}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#ffffff' }}>{lead.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#aaaaaa' }}>{lead.phone}</div>
                        <div style={{ fontSize: '0.75rem', color: '#777777' }}>{lead.email}</div>
                      </td>
                      <td style={{ maxWidth: '280px' }}>
                        <div style={{ fontSize: '0.85rem', color: '#e5b869', fontWeight: 600 }}>
                          {lead.serviceType}
                        </div>
                        {lead.message && (
                          <div
                            style={{
                              fontSize: '0.8rem',
                              color: '#bbbbbb',
                              marginTop: '0.25rem',
                              lineHeight: 1.4,
                            }}
                          >
                            &ldquo;{lead.message}&rdquo;
                          </div>
                        )}
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: '#888888',
                            background: '#1a1a1a',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                          }}
                        >
                          {lead.source || 'Website Form'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#888888' }}>
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : 'N/A'}
                      </td>
                      <td>
                        <select
                          value={lead.status || 'new'}
                          onChange={(e) =>
                            handleStatusChange(lead._id?.toString(), e.target.value)
                          }
                          className={styles.formSelect}
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.35rem 0.5rem',
                            width: 'auto',
                            borderColor:
                              lead.status === 'new'
                                ? '#2ecc71'
                                : lead.status === 'contacted'
                                ? '#3498db'
                                : '#444',
                          }}
                        >
                          <option value="new">NEW</option>
                          <option value="contacted">CONTACTED</option>
                          <option value="converted">CONVERTED</option>
                          <option value="archived">ARCHIVED</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {lead.phone && (
                            <a
                              href={`https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(
                                lead.name
                              )}%2C%20thank%20you%20for%20contacting%20Soundnest%20regarding%20${encodeURIComponent(
                                lead.serviceType
                              )}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.btnSecondary}
                              style={{
                                padding: '0.4rem 0.6rem',
                                color: '#2ecc71',
                                borderColor: 'rgba(46, 204, 113, 0.3)',
                              }}
                              title="Chat on WhatsApp"
                            >
                              <Send size={13} />
                            </a>
                          )}
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                              className={styles.btnSecondary}
                              style={{ padding: '0.4rem 0.6rem' }}
                              title="Call Phone Number"
                            >
                              <Phone size={13} />
                            </a>
                          )}
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}?subject=Soundnest%20Consultation`}
                              className={styles.btnSecondary}
                              style={{ padding: '0.4rem 0.6rem' }}
                              title="Send Email"
                            >
                              <Mail size={13} />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteLead(lead._id?.toString(), lead.name)
                            }
                            className={styles.btnDanger}
                            title="Delete Lead"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
