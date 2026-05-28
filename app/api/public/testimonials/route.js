import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Testimonial from '../../../../models/Testimonial';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  await dbConnect();
  const testimonials = await Testimonial.find()
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(testimonials, { headers: corsHeaders });
}
