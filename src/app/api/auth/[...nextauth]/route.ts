import { NextResponse } from "next/server";

export const runtime = 'edge';

// Minimal auth placeholder for Cloudflare deployment
// Admin functionality is temporarily disabled for edge compatibility
export async function GET() {
  return NextResponse.json({
    error: "Authentication temporarily disabled for Cloudflare Edge Runtime"
  }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({
    error: "Authentication temporarily disabled for Cloudflare Edge Runtime"
  }, { status: 501 });
}