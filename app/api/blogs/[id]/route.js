import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Blog from '../../../../models/Blog';

// GET single blog
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const blog = await Blog.findById(id).lean();
  if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(blog);
}

// PUT — update a blog
export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const body = await request.json();

  try {
    const blog = await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(blog);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// DELETE a blog
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ message: 'Deleted' });
}
