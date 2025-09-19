import { NextRequest, NextResponse } from "next/server";
import { ProductData } from "@/types";
import fs from "fs";
import path from "path";

export const runtime = 'edge';

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

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();

    // Check if payments are enabled
    const productData = readProductData();
    if (!productData.paymentsEnabled) {
      return NextResponse.json(
        { error: "Payments are not currently enabled" },
        { status: 400 }
      );
    }

    // Find the product
    const product = productData.products.find(p => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (!product.inStock) {
      return NextResponse.json(
        { error: "Product is out of stock" },
        { status: 400 }
      );
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Payment processing is not configured" },
        { status: 500 }
      );
    }

    // TODO: Initialize Stripe when environment variables are available
    /*
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
              images: [product.image],
            },
            unit_amount: Math.round(product.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/shop.html`,
      metadata: {
        productId: product.id,
      },
    });

    return NextResponse.json({ url: session.url });
    */

    // For now, return an error until Stripe is configured
    return NextResponse.json(
      { error: "Stripe checkout is not yet configured. Please check back later." },
      { status: 501 }
    );

  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}