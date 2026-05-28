'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blogs')
      .then((r) => r.json())
      .then((data) => { setBlogs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    setBlogs(blogs.filter((b) => b._id !== id));
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Blog Posts</h1>
        <Link href="/dashboard/blogs/new" className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Blog
        </Link>
      </div>

      {loading ? (
        <div className="empty-state"><p>Loading...</p></div>
      ) : blogs.length === 0 ? (
        <div className="empty-state">
          <h3>No blog posts yet</h3>
          <p>Create your first blog post to get started.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ width: '160px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>
                    <strong>{blog.title}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      /{blog.slug}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${blog.published ? 'badge-success' : 'badge-warning'}`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/dashboard/blogs/${blog._id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                      <button onClick={() => handleDelete(blog._id)} className="btn btn-danger btn-sm">Delete</button>
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
