"use client";

import { useState } from "react";
import { Product } from "@/types";

interface BuyButtonProps {
  product: Product;
  disabled?: boolean;
  paymentsEnabled: boolean;
}

export default function BuyButton({ product, disabled = false, paymentsEnabled }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!paymentsEnabled) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement Stripe Checkout when payments are enabled
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Unable to process checkout. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return "Processing...";
    if (!paymentsEnabled) return "Coming Soon";
    if (!product.inStock) return "Out of Stock";
    return `Buy Now - $${product.price.toFixed(2)}`;
  };

  const getButtonStyle = () => {
    if (!paymentsEnabled) {
      return "w-full px-6 py-3 bg-gray-600 text-white rounded-lg cursor-not-allowed opacity-75";
    }
    if (disabled || loading) {
      return "w-full px-6 py-3 bg-gray-600 text-white rounded-lg cursor-not-allowed opacity-75";
    }
    return "w-full px-6 py-3 bg-electric-purple text-white rounded-lg shadow-neon neon transition duration-200 hover:scale-105 hover:bg-acid-magenta focus:ring-4 focus:ring-acid-magenta/30 focus:outline-none";
  };

  return (
    <button
      onClick={handlePurchase}
      disabled={disabled || !paymentsEnabled || loading}
      className={getButtonStyle()}
      title={!paymentsEnabled ? "Payments will be available soon" : undefined}
    >
      {loading && (
        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      )}
      {getButtonText()}
    </button>
  );
}