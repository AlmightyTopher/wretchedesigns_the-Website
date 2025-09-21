import { NextRequest, NextResponse } from "next/server";
import { ProductData } from "@/types";

export const runtime = 'edge';

// Static product data for production
const PRODUCT_DATA: ProductData = {
  "products": [
    {
      "id": "art-1758303434886-0",
      "name": "Art Design #1",
      "description": "Beautiful original artwork and designs. Unique design with vibrant colors.",
      "price": 15.2,
      "image": "/uploads/1758311236103-557ad263-e5d1-415a-93e0-fcf33a3cc114.png",
      "category": "Art",
      "inStock": true,
      "createdAt": "2025-09-19T17:37:14.886Z",
      "updatedAt": "2025-09-19T19:48:54.052Z"
    },
    {
      "id": "art-1758303434886-1",
      "name": "Art Design #2",
      "description": "Beautiful original artwork and designs. Unique design with vibrant colors.",
      "price": 18.43,
      "image": "/Images/Art/212c84dc-0494-4fb2-950d-1a450d86abf6.jpg",
      "category": "Art",
      "inStock": true,
      "createdAt": "2025-09-19T17:37:14.886Z",
      "updatedAt": "2025-09-19T17:37:14.886Z"
    }
  ],
  "paymentsEnabled": false,
  "lastUpdated": "2025-09-19T19:48:54.052Z"
};

export async function GET() {
  return NextResponse.json(PRODUCT_DATA);
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    error: "Product management is temporarily disabled in production. Admin features available in local development."
  }, { status: 503 });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({
    error: "Product management is temporarily disabled in production. Admin features available in local development."
  }, { status: 503 });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({
    error: "Product management is temporarily disabled in production. Admin features available in local development."
  }, { status: 503 });
}