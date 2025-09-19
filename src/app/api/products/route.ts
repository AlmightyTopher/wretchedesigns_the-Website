import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";
import { ProductData, Product } from "@/types";

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

export async function GET() {
  try {
    const data = readProductData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading product data:", error);
    return NextResponse.json(
      { error: "Failed to read product data" },
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

    const { product }: { product: Omit<Product, "id" | "createdAt" | "updatedAt"> } = await request.json();

    const data = readProductData();
    const newProduct: Product = {
      id: crypto.randomUUID(),
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.products.push(newProduct);
    data.lastUpdated = new Date().toISOString();

    writeProductData(data);

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { error: "Failed to add product" },
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

    const { product }: { product: Product } = await request.json();

    const data = readProductData();
    const index = data.products.findIndex(p => p.id === product.id);

    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    data.products[index] = {
      ...product,
      updatedAt: new Date().toISOString(),
    };
    data.lastUpdated = new Date().toISOString();

    writeProductData(data);

    return NextResponse.json(data.products[index]);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
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
    const productId = url.searchParams.get("id");

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const data = readProductData();
    data.products = data.products.filter(p => p.id !== productId);
    data.lastUpdated = new Date().toISOString();

    writeProductData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}