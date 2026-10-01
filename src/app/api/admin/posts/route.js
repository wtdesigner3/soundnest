import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { blogPosts as fallbackPosts } from '@/data/blogData';

export async function GET(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase();
  const category = searchParams.get('category');

  try {
    const db = await getDb();
    if (!db) {
      let filtered = fallbackPosts;
      if (category) filtered = filtered.filter((p) => p.category === category);
      if (search)
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(search) || p.slug.toLowerCase().includes(search)
        );
      return NextResponse.json({ posts: filtered });
    }

    const collection = db.collection('posts');
    let query = {};

    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    const posts = await collection.find(query).sort({ date: -1 }).toArray();

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      category = 'Home Automation',
      author = 'Soundnest Expert',
      featuredImage = '/images/slider-1.jpg',
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Post title and slug are required' },
        { status: 400 }
      );
    }

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    const collection = db.collection('posts');

    const existing = await collection.findOne({ slug: cleanSlug });
    if (existing) {
      return NextResponse.json(
        { error: `An article with slug "${cleanSlug}" already exists.` },
        { status: 409 }
      );
    }

    const now = new Date();
    const newPost = {
      title: title.trim(),
      slug: cleanSlug,
      excerpt: excerpt || title,
      content: content || `<p>${excerpt || title}</p>`,
      category,
      author,
      featuredImage,
      date: now.toISOString().split('T')[0],
      createdAt: now,
      updatedAt: now,
    };

    await collection.insertOne(newPost);

    return NextResponse.json({
      success: true,
      message: `Article "${newPost.title}" published!`,
      post: newPost,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
