'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BlogForm from '../../../../../components/BlogForm';

export default function EditBlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blogs/${id}`)
      .then((r) => r.json())
      .then((data) => { setBlog(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="empty-state"><p>Loading...</p></div>;
  if (!blog) return <div className="empty-state"><h3>Blog not found</h3></div>;

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Edit Blog Post</h1>
      </div>
      <BlogForm blog={blog} />
    </>
  );
}
