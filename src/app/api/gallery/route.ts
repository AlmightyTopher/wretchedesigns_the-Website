import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";
import { GalleryData, GalleryImage } from "@/types";

export const runtime = 'edge';

const GALLERY_FILE = path.join(process.cwd(), "public/data/gallery.json");

function readGalleryData(): GalleryData {
  try {
    const data = fs.readFileSync(GALLERY_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { images: [], lastUpdated: new Date().toISOString() };
  }
}

function writeGalleryData(data: GalleryData) {
  const dir = path.dirname(GALLERY_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(GALLERY_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const data = readGalleryData();
    return NextResponse.json(data);
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