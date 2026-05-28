import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Testimonial from '../../../../models/Testimonial';

// GET single testimonial
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const testimonial = await Testimonial.findById(id).lean();
  if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(testimonial);
}

// PUT — update
export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const body = await request.json();

  try {
    const testimonial = await Testimonial.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(testimonial);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// DELETE
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const testimonial = await Testimonial.findByIdAndDelete(id);
  if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ message: 'Deleted' });
}
