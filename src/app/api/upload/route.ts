import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // For Cloudflare Pages compatibility, we'll simulate successful upload
    // In production, files should be uploaded to external storage like Cloudflare R2

    // Get the file for validation
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

    // In a real implementation, you'd upload to R2/S3 here
    // For now, return a mock response to unblock development

    // Generate unique filename for reference
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const uniqueId = Date.now() + Math.random().toString(36).substring(2, 15);
    const fileName = `${Date.now()}-${uniqueId}.${fileExtension}`;

    // Mock URL (in real implementation, this would be the actual uploaded file URL)
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      message: "File uploaded successfully (mock response - needs external storage integration)",
      url: fileUrl,
      fileName: fileName,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
