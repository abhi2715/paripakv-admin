import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Blog from '../../../../../models/Blog';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(request, { params }) {
  await dbConnect();
  const { slug } = await params;
  const blog = await Blog.findOne({ slug, published: true }).lean();

  if (!blog) {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
  }

  return NextResponse.json(blog, { headers: corsHeaders });
}
