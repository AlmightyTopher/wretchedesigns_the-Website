import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";
import { ProductData } from "@/types";

const PRODUCTS_FILE = path.join(process.cwd(), "public/data/products.json");

function readProductData(): ProductData {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return {
      products: [],
      paymentsEnabled: false,
      lastUpdated: new Date().toISOString()
    };
  }
}

function writeProductData(data: ProductData) {
  const dir = path.dirname(PRODUCTS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { enabled } = await request.json();

    // Check if Stripe is properly configured before enabling payments
    if (enabled && (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PUBLISHABLE_KEY)) {
      return NextResponse.json(
        { error: "Stripe environment variables are not configured" },
        { status: 400 }
      );
    }

    const data = readProductData();
    data.paymentsEnabled = enabled;
    data.lastUpdated = new Date().toISOString();

    writeProductData(data);

    return NextResponse.json({ success: true, paymentsEnabled: enabled });
  } catch (error) {
    console.error("Error toggling payments:", error);
    return NextResponse.json(
      { error: "Failed to toggle payments" },
      { status: 500 }
    );
  }
}