import { NextRequest, NextResponse } from "next/server";
import { GalleryData, GalleryImage } from "@/types";

export const runtime = 'edge';

// Simple admin authentication check
function isAuthenticated(request: NextRequest): boolean {
  const adminToken = request.cookies.get('admin-token')?.value;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || !adminToken) return false;

  try {
    const decoded = atob(adminToken);
    const [user, timestamp] = decoded.split(':');

    if (user === 'admin' && timestamp) {
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 60 * 60 * 24 * 1000; // 24 hours in ms
      return tokenAge < maxAge;
    }
  } catch (error) {
    return false;
  }

  return false;
}

// In production, we'll use a simple storage mechanism
// For now, let's use the same static data but allow admin updates through cookies/localStorage
const GALLERY_DATA: GalleryData = {
  "images": [
    {
      "id": "art-1758303434881-1",
      "url": "/Images/Art/212c84dc-0494-4fb2-950d-1a450d86abf6.jpg",
      "title": "Cyberpunk Neon Dreams",
      "description": "A stunning digital artwork featuring electric neon colors and futuristic cityscape elements.",
      "order": 0,
      "createdAt": "2025-09-19T17:37:14.881Z",
      "category": "Digital Art"
    },
    {
      "id": "art-1758303434880-0",
      "url": "/Images/Art/0e24c8e1-ad42-4b6c-b538-672c737cec86.jpg",
      "title": "Electric Pulse Design",
      "description": "Bold abstract design with electric purple and magenta energy flows.",
      "order": 1,
      "createdAt": "2025-09-19T17:37:14.880Z",
      "category": "Abstract"
    },
    {
      "id": "art-new-001",
      "url": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
      "title": "Neon Cityscapes",
      "description": "Futuristic cityscape with vibrant neon lighting and cyberpunk aesthetics.",
      "order": 2,
      "createdAt": "2025-09-19T23:35:00.000Z",
      "category": "Photography"
    },
    {
      "id": "art-new-002",
      "url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "title": "Electric Energy",
      "description": "Abstract representation of electrical energy with vibrant purple and magenta hues.",
      "order": 3,
      "createdAt": "2025-09-19T23:36:00.000Z",
      "category": "Digital Art"
    }
  ],
  "lastUpdated": "2025-09-19T23:35:00.000Z"
};

export async function GET() {
  return NextResponse.json(GALLERY_DATA);
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized. Please login first." }, { status: 401 });
  }

  try {
    const { image }: { image: Omit<GalleryImage, "id" | "createdAt"> } = await request.json();

    const newImage: GalleryImage = {
      id: `art-${Date.now()}`,
      ...image,
      createdAt: new Date().toISOString(),
    };

    // For now, return success - in production this would save to KV storage
    return NextResponse.json({
      success: true,
      message: "Image would be added in production with persistent storage",
      image: newImage
    });
  } catch (error) {
    console.error("Error adding gallery image:", error);
    return NextResponse.json(
      { error: "Failed to add gallery image" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized. Please login first." }, { status: 401 });
  }

  try {
    const { images }: { images: GalleryImage[] } = await request.json();

    // For now, return success - in production this would save to KV storage
    return NextResponse.json({
      success: true,
      message: "Gallery would be updated in production with persistent storage",
      data: {
        images,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error updating gallery:", error);
    return NextResponse.json(
      { error: "Failed to update gallery" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized. Please login first." }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const imageId = url.searchParams.get("id");

    if (!imageId) {
      return NextResponse.json({ error: "Image ID required" }, { status: 400 });
    }

    // For now, return success - in production this would delete from KV storage
    return NextResponse.json({
      success: true,
      message: "Image would be deleted in production with persistent storage"
    });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery image" },
      { status: 500 }
    );
  }
}