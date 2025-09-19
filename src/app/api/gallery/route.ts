import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

// Static gallery data for read-only access
const GALLERY_DATA = {
  "images": [
    {
      "id": "art-1758303434881-1",
      "url": "/Images/Art/212c84dc-0494-4fb2-950d-1a450d86abf6.jpg",
      "title": "Art #2",
      "description": "Beautiful art design",
      "order": 0,
      "createdAt": "2025-09-19T17:37:14.881Z",
      "category": "Art"
    },
    {
      "id": "art-1758303434880-0",
      "url": "/Images/Art/0e24c8e1-ad42-4b6c-b538-672c737cec86.jpg",
      "title": "Art #1",
      "description": "Beautiful art design",
      "order": 1,
      "createdAt": "2025-09-19T17:37:14.880Z",
      "category": "Art"
    }
  ],
  "lastUpdated": "2025-09-19T19:46:08.689Z"
};

export async function GET() {
  try {
    return NextResponse.json(GALLERY_DATA);
  } catch (error) {
    console.error("Error reading gallery data:", error);
    return NextResponse.json(
      { error: "Failed to read gallery data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { image }: { image: Omit<GalleryImage, "id" | "createdAt"> } = await request.json();

    const data = readGalleryData();
    const newImage: GalleryImage = {
      id: crypto.randomUUID(),
      ...image,
      createdAt: new Date().toISOString(),
    };

    data.images.push(newImage);
    data.images.sort((a, b) => a.order - b.order);
    data.lastUpdated = new Date().toISOString();

    writeGalleryData(data);

    return NextResponse.json(newImage);
  } catch (error) {
    console.error("Error adding gallery image:", error);
    return NextResponse.json(
      { error: "Failed to add gallery image" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { images }: { images: GalleryImage[] } = await request.json();

    const data = readGalleryData();
    data.images = images;
    data.lastUpdated = new Date().toISOString();

    writeGalleryData(data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating gallery:", error);
    return NextResponse.json(
      { error: "Failed to update gallery" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const imageId = url.searchParams.get("id");

    if (!imageId) {
      return NextResponse.json({ error: "Image ID required" }, { status: 400 });
    }

    const data = readGalleryData();
    data.images = data.images.filter(img => img.id !== imageId);
    data.lastUpdated = new Date().toISOString();

    writeGalleryData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery image" },
      { status: 500 }
    );
  }
}