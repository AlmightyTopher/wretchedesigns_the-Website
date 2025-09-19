import { NextRequest, NextResponse } from "next/server";
import { GalleryData, GalleryImage } from "@/types";

// Use edge runtime for Cloudflare compatibility
export const runtime = 'edge';

// Check if running in Cloudflare
const isCloudflare = process.env.CF_PAGES || process.env.CLOUDFLARE_PAGES;

// Fallback data for edge runtime
const FALLBACK_GALLERY_DATA: GalleryData = {
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
  return NextResponse.json(FALLBACK_GALLERY_DATA);
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    error: "Gallery management is temporarily disabled in production. Admin features available in local development."
  }, { status: 503 });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({
    error: "Gallery management is temporarily disabled in production. Admin features available in local development."
  }, { status: 503 });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({
    error: "Gallery management is temporarily disabled in production. Admin features available in local development."
  }, { status: 503 });
}