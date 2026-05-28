'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TestimonialForm from '../../../../../components/TestimonialForm';

export default function EditTestimonialPage() {
  const { id } = useParams();
  const [testimonial, setTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/testimonials/${id}`)
      .then((r) => r.json())
      .then((data) => { setTestimonial(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="empty-state"><p>Loading...</p></div>;
  if (!testimonial) return <div className="empty-state"><h3>Testimonial not found</h3></div>;

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Edit Testimonial</h1>
      </div>
      <TestimonialForm testimonial={testimonial} />
    </>
  );
}
