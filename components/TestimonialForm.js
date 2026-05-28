'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestimonialForm({ testimonial = null }) {
  const router = useRouter();
  const isEdit = !!testimonial;

  const [form, setForm] = useState({
    name: testimonial?.name || '',
    role: testimonial?.role || '',
    gender: testimonial?.gender || 'female',
    quote: testimonial?.quote || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const url = isEdit ? `/api/testimonials/${testimonial._id}` : '/api/testimonials';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      router.push('/dashboard/testimonials');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: '20px', color: 'var(--danger)', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-input"
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="e.g. A Student"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Role</label>
        <input
          type="text"
          className="form-input"
          value={form.role}
          onChange={(e) => updateField('role', e.target.value)}
          placeholder="e.g. Nirmala Bright Scholar, 2024"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Gender</label>
        <select className="form-select" value={form.gender} onChange={(e) => updateField('gender', e.target.value)}>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Quote</label>
        <textarea
          className="form-textarea"
          value={form.quote}
          onChange={(e) => updateField('quote', e.target.value)}
          placeholder="The testimonial text..."
          rows={5}
          required
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Update Testimonial' : 'Create Testimonial'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => router.push('/dashboard/testimonials')}>
          Cancel
        </button>
      </div>
    </form>
  );
}
