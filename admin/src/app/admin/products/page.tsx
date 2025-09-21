"use client";

import { useState, useEffect } from "react";
import { ProductData, Product } from "@/types";

export default function ProductManager() {
  const [productData, setProductData] = useState<ProductData>({
    products: [],
    paymentsEnabled: false,
    lastUpdated: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "",
    inStock: true,
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    inStock: boolean;
  } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to load products");
      const data = await response.json();
      setProductData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      image: "",
      category: "",
      inStock: true,
    });
    setEditingProduct(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowAddForm(true);
  };

  const openEditForm = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category || "",
      inStock: product.inStock,
    });
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const saveProduct = async () => {
    try {
      setError("");
      const method = editingProduct ? "PUT" : "POST";
      const body = editingProduct
        ? { product: { ...editingProduct, ...formData } }
        : { product: formData };

      const response = await fetch("/api/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`Failed to ${editingProduct ? "update" : "add"} product`);

      await loadProducts();
      setShowAddForm(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${editingProduct ? "update" : "add"} product`);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setError("");
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const startInlineEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category || "",
      inStock: product.inStock,
    });
  };

  const cancelInlineEdit = () => {
    setEditingProductId(null);
    setEditFormData(null);
    setError("");
  };

  const updateInlineProduct = async (productId: string) => {
    if (!editFormData) return;

    try {
      setError("");

      const response = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: {
            id: productId,
            ...editFormData,
            updatedAt: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to update product");

      await loadProducts();
      cancelInlineEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    }
  };

  const uploadImageForInline = async (file: File) => {
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      return result.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      return null;
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="glitch text-3xl neon" style={{ color: "#3A7CA5" }}>
          Product Manager
        </h1>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">Payments:</span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                productData.paymentsEnabled
                  ? "bg-green-900/20 text-green-400"
                  : "bg-red-900/20 text-red-400"
              }`}
            >
              {productData.paymentsEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
          <button
            onClick={openAddForm}
            className="px-6 py-2 bg-electric-purple text-white rounded-lg shadow-neon neon transition duration-200 hover:scale-105 hover:bg-acid-magenta focus:ring-4 focus:ring-acid-magenta/30 focus:outline-none"
          >
            Add Product
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!productData.paymentsEnabled && (
        <div className="bg-yellow-900/20 border border-yellow-500 text-yellow-400 px-4 py-3 rounded">
          <p className="font-semibold">Payments are currently disabled</p>
          <p className="text-sm">Products will show "Coming Soon" until Stripe is configured. Configure STRIPE_PUBLISHABLE_KEY and STRIPE_SECRET_KEY in environment variables to enable payments.</p>
        </div>
      )}

      {/* Add/Edit Product Form */}
      {showAddForm && (
        <div className="bg-[#181825] rounded-lg shadow-neon p-6 border border-neon-magenta/20">
          <h2 className="text-xl font-header text-acid-magenta mb-4">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-matte-black border border-neon-magenta/30 rounded text-white focus:border-electric-purple focus:outline-none"
                placeholder="Product name"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Price ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-matte-black border border-neon-magenta/30 rounded text-white focus:border-electric-purple focus:outline-none"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-white/70 mb-2">Product Image</label>
              <div className="space-y-4">
                {/* Image Preview */}
                {imagePreview && (
                  <div className="flex justify-center">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full h-48 object-contain rounded-lg border border-neon-magenta/30"
                      />
                      <button
                        onClick={() => {
                          setImagePreview("");
                          setFormData({ ...formData, image: "" });
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}

                {/* Image Upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        try {
                          setUploadingImage(true);
                          setError("");

                          const formDataUpload = new FormData();
                          formDataUpload.append('file', file);

                          const response = await fetch('/api/upload', {
                            method: 'POST',
                            body: formDataUpload,
                          });

                          const result = await response.json();

                          if (!response.ok) {
                            throw new Error(result.error || 'Upload failed');
                          }

                          setFormData({ ...formData, image: result.url });
                          setImagePreview(result.url);
                        } catch (err) {
                          setError(err instanceof Error ? err.message : 'Failed to upload image');
                        } finally {
                          setUploadingImage(false);
                        }
                      }}
                      className="w-full px-3 py-2 bg-matte-black border border-neon-magenta/30 rounded text-white focus:border-electric-purple focus:outline-none file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-electric-purple file:text-white file:hover:bg-acid-magenta"
                      disabled={uploadingImage}
                      title="Choose image file to upload"
                    />
                    {uploadingImage && (
                      <div className="mt-2 text-electric-purple text-sm flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-electric-purple"></div>
                        Uploading...
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => {
                        setFormData({ ...formData, image: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      className="w-full px-3 py-2 bg-matte-black border border-neon-magenta/30 rounded text-white focus:border-electric-purple focus:outline-none"
                      placeholder="Or paste image URL"
                    />
                  </div>
                </div>
                <div className="text-xs text-white/50">
                  Choose a file to upload or paste a URL. Supported formats: JPG, PNG, GIF, WebP (max 5MB).
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Category (optional)</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-matte-black border border-neon-magenta/30 rounded text-white focus:border-electric-purple focus:outline-none"
                placeholder="e.g., T-Shirts, Posters"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-white/70 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-matte-black border border-neon-magenta/30 rounded text-white focus:border-electric-purple focus:outline-none"
                rows={4}
                placeholder="Product description"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="inStock"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="rounded border-neon-magenta/30 text-electric-purple focus:ring-electric-purple"
              />
              <label htmlFor="inStock" className="text-sm text-white/70">In Stock</label>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={saveProduct}
              disabled={!formData.name || !formData.image || formData.price <= 0}
              className="px-6 py-2 bg-electric-purple text-white rounded-lg shadow-neon neon transition duration-200 hover:scale-105 hover:bg-acid-magenta focus:ring-4 focus:ring-acid-magenta/30 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingProduct ? "Update Product" : "Add Product"}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                resetForm();
              }}
              className="px-6 py-2 border border-acid-magenta text-acid-magenta rounded hover:bg-acid-magenta/20 neon transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productData.products.map((product) => {
          const isEditing = editingProductId === product.id;

          if (isEditing && editFormData) {
            return (
              <div
                key={product.id}
                className="bg-[#181825] rounded-lg shadow-neon border border-neon-magenta/20 overflow-hidden"
              >
                <div className="p-4">
                  <h3 className="text-lg font-header text-acid-magenta mb-4">Editing: {product.name}</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-white/70 mb-1">Product Name</label>
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          name: e.target.value
                        })}
                        className="w-full px-3 py-2 bg-matte-black border border-neon-magenta/30 rounded text-white focus:border-electric-purple focus:outline-none"
                        placeholder="Product name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white/70 mb-1">Price ($)</label>
                      <input
                        type="number"
                        value={editFormData.price}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          price: parseFloat(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 bg-matte-black border border-neon-magenta/30 rounded text-white focus:border-electric-purple focus:outline-none"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white/70 mb-1">Category (optional)</label>
                      <input
                        type="text"
                        value={editFormData.category}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          category: e.target.value
                        })}
                        className="w-full px-3 py-2 bg-matte-black border border-neon-magenta/30 rounded text-white focus:border-electric-purple focus:outline-none"
                        placeholder="e.g., T-Shirts, Posters"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white/70 mb-1">Description</label>
                      <textarea
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          description: e.target.value
                        })}
                        className="w-full px-3 py-2 bg-matte-black border border-neon-magenta/30 rounded text-white focus:border-electric-purple focus:outline-none"
                        rows={3}
                        placeholder="Product description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white/70 mb-1">Product Image</label>
                      <div className="flex justify-center mb-3">
                        <img
                          src={editFormData.image}
                          alt="Current product"
                          className="w-24 h-24 object-cover rounded-lg border border-neon-magenta/30"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-image.jpg";
                          }}
                        />
                      </div>
                      <input
                        type="url"
                        value={editFormData.image}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          image: e.target.value
                        })}
                        className="w-full px-3 py-2 bg-matte-black border border-neon-magenta/30 rounded text-white focus:border-electric-purple focus:outline-none mb-2"
                        placeholder="Image URL"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const imageUrl = await uploadImageForInline(file);
                          if (imageUrl) {
                            setEditFormData({
                              ...editFormData,
                              image: imageUrl
                            });
                          }
                        }}
                        className="w-full px-3 py-2 bg-matte-black border border-neon-magenta/30 rounded text-white focus:border-electric-purple focus:outline-none file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-electric-purple file:text-white file:hover:bg-acid-magenta"
                        title="Upload new image"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`inStock-${product.id}`}
                        checked={editFormData.inStock}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          inStock: e.target.checked
                        })}
                        className="rounded border-neon-magenta/30 text-electric-purple focus:ring-electric-purple"
                      />
                      <label htmlFor={`inStock-${product.id}`} className="text-sm text-white/70">In Stock</label>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={() => updateInlineProduct(product.id)}
                        disabled={!editFormData.name || !editFormData.image || editFormData.price <= 0}
                        className="flex-1 px-4 py-2 bg-electric-purple text-white rounded shadow-neon neon transition duration-200 hover:scale-105 hover:bg-acid-magenta focus:ring-4 focus:ring-acid-magenta/30 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Update Product
                      </button>
                      <button
                        onClick={cancelInlineEdit}
                        className="px-4 py-2 border border-acid-magenta text-acid-magenta rounded hover:bg-acid-magenta/20 neon transition duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Normal display mode
          return (
            <div
              key={product.id}
              className="bg-[#181825] rounded-lg shadow-neon border border-neon-magenta/20 overflow-hidden"
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
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
                    Out of Stock
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-header text-acid-magenta mb-2">{product.name}</h3>
                <p className="text-white/70 text-sm mb-3 line-clamp-3">{product.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-bold text-electric-purple">${product.price.toFixed(2)}</span>
                  {product.category && (
                    <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded">
                      {product.category}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startInlineEdit(product)}
                    className="flex-1 px-4 py-2 bg-electric-purple text-white rounded shadow-neon neon transition duration-200 hover:scale-105 hover:bg-acid-magenta text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded transition duration-200 hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {productData.products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/70 text-lg">No products added yet.</p>
          <p className="text-white/50">Click "Add Product" to get started.</p>
        </div>
      )}
    </div>
  );
}
