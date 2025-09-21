import { NextRequest, NextResponse } from "next/server";
import { GalleryData, GalleryImage } from "@/types";
import { getGalleryImages, addGalleryImage, updateGalleryImages, deleteGalleryImage } from "@/lib/supabase";

// Use Node.js runtime for database operations
export const runtime = 'nodejs';

export async function GET() {
  try {
    const images = await getGalleryImages();

    // Convert database format to frontend format
    const galleryData: GalleryData = {
      images: images.map(img => ({
        id: img.id,
        url: img.url,
        title: img.title,
        description: img.description || "",
        order: img.order,
        createdAt: img.created_at,
        category: img.category || "Art"
      })),
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(galleryData);
  } catch (error) {
    console.error('Gallery GET error:', error);
    return NextResponse.json({
      error: "Failed to fetch gallery images"
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, url, description, category } = body;

    if (!title || !url) {
      return NextResponse.json({
        error: "Title and URL are required"
      }, { status: 400 });
    }

    // Get current max order
    const images = await getGalleryImages();
    const maxOrder = images.length > 0 ? Math.max(...images.map(img => img.order)) : -1;

    const newImage = await addGalleryImage({
      title,
      url,
      description: description || "",
      order: maxOrder + 1,
      category: category || "Art"
    });

    return NextResponse.json({
      message: "Image added successfully",
      image: {
        id: newImage.id,
        url: newImage.url,
        title: newImage.title,
        description: newImage.description || "",
        order: newImage.order,
        createdAt: newImage.created_at,
        category: newImage.category || "Art"
      }
    });
  } catch (error) {
    console.error('Gallery POST error:', error);
    return NextResponse.json({
      error: "Failed to add image"
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { images } = body;

    if (!Array.isArray(images)) {
      return NextResponse.json({
        error: "Images array is required"
      }, { status: 400 });
    }

    // Convert frontend format to database format
    const dbImages = images.map((img: GalleryImage) => ({
      id: img.id,
      title: img.title,
      url: img.url,
      description: img.description || "",
      order: img.order,
      category: img.category || "Art",
      created_at: img.createdAt
    }));

    await updateGalleryImages(dbImages);

    return NextResponse.json({
      message: "Gallery updated successfully"
    });
  } catch (error) {
    console.error('Gallery PUT error:', error);
    return NextResponse.json({
      error: "Failed to update gallery"
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        error: "Image ID is required"
      }, { status: 400 });
    }

    await deleteGalleryImage(id);

    return NextResponse.json({
      message: "Image deleted successfully"
    });
  } catch (error) {
    console.error('Gallery DELETE error:', error);
    return NextResponse.json({
      error: "Failed to delete image"
    }, { status: 500 });
  }
}