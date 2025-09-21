import { NextRequest, NextResponse } from "next/server";
import { getGalleryImages, addGalleryImage, updateGalleryImages, deleteGalleryImage } from "@/lib/supabase";
import { GalleryData, GalleryImage } from "@/types";

export const runtime = 'edge';

// Simple auth check for admin operations
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) return false;
  return authHeader === `Bearer ${adminKey}`;
}

export async function GET() {
  try {
    const images = await getGalleryImages();

    // Convert DB format to API format
    const galleryData: GalleryData = {
      images: images.map(img => ({
        id: img.id,
        title: img.title,
        url: img.url,
        description: img.description,
        order: img.order,
        category: img.category,
        createdAt: img.created_at
      })),
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(galleryData);
  } catch (error) {
    console.error("Error reading gallery data:", error);
    return NextResponse.json(
      { error: "Failed to read gallery data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { image }: { image: Omit<GalleryImage, "id" | "createdAt"> } = await request.json();

    const newImage = await addGalleryImage({
      title: image.title,
      url: image.url,
      description: image.description || '',
      order: image.order,
      category: image.category || 'Digital Art'
    });

    // Convert DB format to API format
    const responseImage: GalleryImage = {
      id: newImage.id,
      title: newImage.title,
      url: newImage.url,
      description: newImage.description,
      order: newImage.order,
      category: newImage.category,
      createdAt: newImage.created_at
    };

    return NextResponse.json(responseImage);
  } catch (error) {
    console.error("Error adding gallery image:", error);
    return NextResponse.json(
      { error: "Failed to add gallery image" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { images }: { images: GalleryImage[] } = await request.json();

    // Convert API format to DB format
    const dbImages = images.map(img => ({
      id: img.id,
      title: img.title,
      url: img.url,
      description: img.description,
      order: img.order,
      category: img.category,
      created_at: img.createdAt
    }));

    await updateGalleryImages(dbImages);

    const galleryData: GalleryData = {
      images,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(galleryData);
  } catch (error) {
    console.error("Error updating gallery:", error);
    return NextResponse.json(
      { error: "Failed to update gallery" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const imageId = url.searchParams.get("id");

    if (!imageId) {
      return NextResponse.json({ error: "Image ID required" }, { status: 400 });
    }

    await deleteGalleryImage(imageId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery image" },
      { status: 500 }
    );
  }
}