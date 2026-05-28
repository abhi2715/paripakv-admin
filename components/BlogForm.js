'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './BlogForm.module.css';

export default function BlogForm({ blog = null }) {
  const router = useRouter();
  const isEdit = !!blog;

  const [form, setForm] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    coverImage: blog?.coverImage || '',
    author: blog?.author || 'Paripakv Foundation',
    published: blog?.published ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug from title for new blogs
      if (field === 'title' && !isEdit) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      return updated;
    });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) {
        updateField('coverImage', data.url);
      } else {
        setError('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch {
      setError('Upload failed. Check your Cloudinary settings.');
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const url = isEdit ? `/api/blogs/${blog._id}` : '/api/blogs';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      router.push('/dashboard/blogs');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formWrap}>
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: '20px', color: 'var(--danger)', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* Cover Image */}
      <div className="form-group">
        <label className="form-label">Cover Image</label>
        <div className={styles.coverPreview}>
          {form.coverImage ? (
            <img src={form.coverImage} alt="Cover" />
          ) : (
            <div className={styles.coverPlaceholder}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
              <div style={{ marginTop: '8px' }}>No cover image</div>
            </div>
          )}
        </div>
        <div className={`btn btn-secondary btn-sm ${styles.uploadBtn}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          {uploading ? 'Uploading...' : 'Upload Image'}
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
        </div>
      </div>

      {/* Title */}
      <div className="form-group">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-input"
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Enter blog title..."
          required
        />
      </div>

      {/* Slug */}
      <div className="form-group">
        <label className="form-label">Slug</label>
        <input
          type="text"
          className="form-input"
          value={form.slug}
          onChange={(e) => updateField('slug', e.target.value)}
          placeholder="url-friendly-slug"
          required
        />
        <div className={styles.slugHint}>URL: /blog/{form.slug || '...'}</div>
      </div>

      {/* Excerpt */}
      <div className="form-group">
        <label className="form-label">Excerpt</label>
        <textarea
          className="form-textarea"
          value={form.excerpt}
          onChange={(e) => updateField('excerpt', e.target.value)}
          placeholder="A short summary shown on the blog card..."
          rows={3}
          required
          style={{ minHeight: '80px' }}
        />
      </div>

      {/* Content */}
      <div className="form-group">
        <label className="form-label">Content (HTML)</label>
        <textarea
          className={`form-textarea ${styles.contentEditor}`}
          value={form.content}
          onChange={(e) => updateField('content', e.target.value)}
          placeholder="Write the blog content in HTML..."
          required
        />
      </div>

      {/* Author */}
      <div className="form-group">
        <label className="form-label">Author</label>
        <input
          type="text"
          className="form-input"
          value={form.author}
          onChange={(e) => updateField('author', e.target.value)}
        />
      </div>

      {/* Published */}
      <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
        <input
          type="checkbox"
          id="published"
          checked={form.published}
          onChange={(e) => updateField('published', e.target.checked)}
          style={{ width: '18px', height: '18px', accentColor: 'var(--peach)' }}
        />
        <label htmlFor="published" style={{ fontSize: '0.9rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
          Published
        </label>
      </div>

      {/* Actions */}
      <div className={styles.formActions}>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Update Blog' : 'Create Blog'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => router.push('/dashboard/blogs')}>
          Cancel
        </button>
      </div>
    </form>
  );
}
