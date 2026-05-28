'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => { setTestimonials(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    setTestimonials(testimonials.filter((t) => t._id !== id));
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Testimonials</h1>
        <Link href="/dashboard/testimonials/new" className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Testimonial
        </Link>
      </div>

      {loading ? (
        <div className="empty-state"><p>Loading...</p></div>
      ) : testimonials.length === 0 ? (
        <div className="empty-state">
          <h3>No testimonials yet</h3>
          <p>Add your first testimonial to get started.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Quote</th>
                <th style={{ width: '160px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t._id}>
                  <td><strong>{t.name}</strong></td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t.role}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                    {t.quote.length > 100 ? t.quote.substring(0, 100) + '...' : t.quote}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/dashboard/testimonials/${t._id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                      <button onClick={() => handleDelete(t._id)} className="btn btn-danger btn-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
