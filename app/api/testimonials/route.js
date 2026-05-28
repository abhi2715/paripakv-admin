import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Testimonial from '../../../models/Testimonial';

// GET all testimonials
export async function GET() {
  await dbConnect();
  const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(testimonials);
}

// POST — create a new testimonial
export async function POST(request) {
  await dbConnect();
  const body = await request.json();

  try {
    const testimonial = await Testimonial.create(body);
    return NextResponse.json(testimonial, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
