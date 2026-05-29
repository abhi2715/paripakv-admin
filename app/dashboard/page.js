'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './overview.module.css';

export default function DashboardPage() {
  const [blogCount, setBlogCount] = useState(null);
  const [testimonialCount, setTestimonialCount] = useState(null);

  useEffect(() => {
    fetch('/api/blogs').then(r => r.json()).then(data => setBlogCount(Array.isArray(data) ? data.length : 0));
    fetch('/api/testimonials').then(r => r.json()).then(data => setTestimonialCount(Array.isArray(data) ? data.length : 0));
  }, []);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconBlogs}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <div>
            <div className={styles.statValue}>{blogCount ?? '...'}</div>
            <div className={styles.statLabel}>Blog Posts</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconTestimonials}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div>
            <div className={styles.statValue}>{testimonialCount ?? '...'}</div>
            <div className={styles.statLabel}>Testimonials</div>
          </div>
        </div>
      </div>

      <h2 className="page-title" style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Quick Actions</h2>
      <div className={styles.quickActions}>
        <Link href="/dashboard/blogs/new" className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Blog Post
        </Link>
        <Link href="/dashboard/testimonials/new" className="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Testimonial
        </Link>
      </div>
    </>
  );
}
