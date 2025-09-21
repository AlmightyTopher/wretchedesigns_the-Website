import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

// Use Node.js runtime for file system operations
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const uniqueId = Date.now() + '-' + randomUUID();
    const fileName = `${uniqueId}.${fileExtension}`;

    // Determine upload directory based on file type or category
    const category = determineCategory(file.name, file.type);
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', category);

    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true });

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // Generate public URL
    const fileUrl = `/uploads/${category}/${fileName}`;

    return NextResponse.json({
      message: "File uploaded successfully",
      url: fileUrl,
      fileName: fileName,
      size: file.size,
      type: file.type,
      category: category
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

function determineCategory(fileName: string, fileType: string): string {
  const name = fileName.toLowerCase();

  if (name.includes('cup') || name.includes('mug')) {
    return 'Cups';
  }
  if (name.includes('shirt') || name.includes('tee') || name.includes('apparel')) {
    return 'Shirts';
  }
  if (name.includes('art') || name.includes('print') || name.includes('design')) {
    return 'Art';
  }

  // Default category
  return 'Art';
}
