import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    error: "User management temporarily disabled for Cloudflare Edge Runtime compatibility"
  }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({
    error: "User management temporarily disabled for Cloudflare Edge Runtime compatibility"
  }, { status: 501 });
}

export async function PUT() {
  return NextResponse.json({
    error: "User management temporarily disabled for Cloudflare Edge Runtime compatibility"
  }, { status: 501 });
}

export async function DELETE() {
  return NextResponse.json({
    error: "User management temporarily disabled for Cloudflare Edge Runtime compatibility"
  }, { status: 501 });
}