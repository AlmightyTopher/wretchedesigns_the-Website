import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

// Static product data for read-only access
const PRODUCT_DATA = {
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
  try {
    return NextResponse.json(PRODUCT_DATA);
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