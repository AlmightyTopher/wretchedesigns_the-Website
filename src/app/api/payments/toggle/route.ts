import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST() {
  return NextResponse.json({
    error: "Payment toggle temporarily disabled for Cloudflare Edge Runtime compatibility"
  }, { status: 501 });
}