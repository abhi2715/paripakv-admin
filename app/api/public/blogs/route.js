import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Blog from '../../../../models/Blog';

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
  const blogs = await Blog.find({ published: true })
    .sort({ publishedAt: -1 })
    .select('title slug excerpt coverImage author publishedAt')
    .lean();

  return NextResponse.json(blogs, { headers: corsHeaders });
}
