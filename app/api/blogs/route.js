import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Blog from '../../../models/Blog';

// GET all blogs
export async function GET() {
  await dbConnect();
  const blogs = await Blog.find().sort({ publishedAt: -1 }).lean();
  return NextResponse.json(blogs);
}

// POST — create a new blog
export async function POST(request) {
  await dbConnect();
  const body = await request.json();

  try {
    const blog = await Blog.create(body);
    return NextResponse.json(blog, { status: 201 });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json({ error: 'A blog with this slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
