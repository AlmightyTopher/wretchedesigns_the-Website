"use client";

import { useState, useEffect } from "react";
import { ProductData } from "@/types";
import BuyButton from "./BuyButton";

export default function ProductList() {
  const [productData, setProductData] = useState<ProductData>({
    products: [],
    paymentsEnabled: false,
    lastUpdated: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProductData(data);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-electric-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!productData.paymentsEnabled && (
        <div className="bg-yellow-900/20 border border-yellow-500 text-yellow-400 px-4 py-3 rounded-lg text-center">
          <p className="font-semibold">Store Coming Soon</p>
          <p className="text-sm">We're preparing our payment system. Products will be available for purchase shortly!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productData.products.map((product) => (
          <div
            key={product.id}
            className="bg-[#181825] rounded-lg shadow-neon border border-neon-magenta/20 overflow-hidden hover:border-electric-purple/50 transition-all duration-300"
          >
            <div className="aspect-square relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-image.jpg";
                }}
              />
              {!product.inStock && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Out of Stock
                </div>
              )}
              {product.category && (
                <div className="absolute top-4 left-4 bg-electric-purple/80 text-white px-3 py-1 rounded-full text-sm">
                  {product.category}
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-xl font-header text-acid-magenta mb-2">{product.name}</h3>
              <p className="text-white/70 text-sm mb-4 line-clamp-3">{product.description}</p>

              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-electric-purple neon">
                  ${product.price.toFixed(2)}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  product.inStock
                    ? "bg-green-900/20 text-green-400"
                    : "bg-red-900/20 text-red-400"
                }`}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <BuyButton
                product={product}
                disabled={!product.inStock || !productData.paymentsEnabled}
                paymentsEnabled={productData.paymentsEnabled}
              />
            </div>
          </div>
        ))}
      </div>

      {productData.products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/70 text-lg">Store is being updated.</p>
          <p className="text-white/50">Check back soon for new products.</p>
        </div>
      )}
    </div>
  );
}