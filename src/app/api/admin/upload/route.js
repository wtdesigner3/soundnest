import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided for upload' }, { status: 400 });
    }

    // Validate mime type
    const validMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/x-icon',
      'image/vnd.microsoft.icon',
      'image/avif',
    ];

    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Please upload JPG, PNG, WEBP, SVG, or GIF images.` },
        { status: 400 }
      );
    }

    // Size limit: 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum 10MB limit.' },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Sanitize filename
    const originalName = file.name || 'image.jpg';
    const ext = path.extname(originalName) || '.jpg';
    const baseName = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e4)}`;
    const finalFileName = `${baseName}-${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadsDir, finalFileName);

    // Write file buffer to public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${finalFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: finalFileName,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error('[Upload API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
