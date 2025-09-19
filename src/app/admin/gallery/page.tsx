"use client";

import { useState, useEffect } from "react";
import { GalleryData, GalleryImage } from "@/types";

export default function GalleryManager() {
  const [gallery, setGallery] = useState<GalleryData>({ images: [], lastUpdated: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newImage, setNewImage] = useState({
    url: "",
    title: "",
    description: "",
    order: 0,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/gallery");
      if (!response.ok) throw new Error("Failed to load gallery");
      const data = await response.json();
      setGallery(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  const addImage = async () => {
    try {
      setError("");
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: newImage }),
      });

      if (!response.ok) throw new Error("Failed to add image");

      await loadGallery();
      setNewImage({ url: "", title: "", description: "", order: 0 });
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add image");
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      setError("");
      const response = await fetch(`/api/gallery?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete image");
      await loadGallery();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
    }
  };

  const reorderImages = async (images: GalleryImage[]) => {
    try {
      setError("");
      const response = await fetch("/api/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });

      if (!response.ok) throw new Error("Failed to reorder images");
      await loadGallery();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reorder images");
    }
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...gallery.images];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newImages.length) return;

    // Swap images
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];

    // Update order values
    newImages.forEach((img, idx) => {
      img.order = idx;
    });

    reorderImages(newImages);
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
          Gallery Manager
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-2 bg-electric-purple text-white rounded-lg shadow-neon neon transition duration-200 hover:scale-105 hover:bg-acid-magenta focus:ring-4 focus:ring-acid-magenta/30 focus:outline-none"
        >
          Add Image
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Add Image Form */}
      {showAddForm && (
        <div className="bg-[#181825] rounded-lg shadow-neon p-6 border border-neon-magenta/20">
          <h2 className="text-xl font-header text-acid-magenta mb-4">Add New Image</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-white/70 mb-2">Gallery Image</label>
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
                          setNewImage({ ...newImage, url: "" });
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

                          setNewImage({ ...newImage, url: result.url });
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
                      value={newImage.url}
                      onChange={(e) => {
                        setNewImage({ ...newImage, url: e.target.value });
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
              <label className="block text-sm text-white/70 mb-2">Image Title</label>
              <input
                type="text"
                value={newImage.title}
                onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                className="w-full px-3 py-2 bg-matte-black border border-neon-magenta/30 rounded text-white focus:border-electric-purple focus:outline-none"
                placeholder="Image title"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-white/70 mb-2">Description (optional)</label>
              <textarea
                value={newImage.description}
                onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                className="w-full px-3 py-2 bg-matte-black border border-neon-magenta/30 rounded text-white focus:border-electric-purple focus:outline-none"
                rows={3}
                placeholder="Image description"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Order</label>
              <input
                type="number"
                value={newImage.order}
                onChange={(e) => setNewImage({ ...newImage, order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-matte-black border border-neon-magenta/30 rounded text-white focus:border-electric-purple focus:outline-none"
                min="0"
                title="Image display order number"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={addImage}
              disabled={!newImage.url || !newImage.title}
              className="px-6 py-2 bg-electric-purple text-white rounded-lg shadow-neon neon transition duration-200 hover:scale-105 hover:bg-acid-magenta focus:ring-4 focus:ring-acid-magenta/30 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Image
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 border border-acid-magenta text-acid-magenta rounded hover:bg-acid-magenta/20 neon transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.images.map((image, index) => (
          <div
            key={image.id}
            className="bg-[#181825] rounded-lg shadow-neon border border-neon-magenta/20 overflow-hidden"
          >
            <div className="aspect-video relative">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-image.jpg";
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-header text-acid-magenta mb-2">{image.title}</h3>
              {image.description && (
                <p className="text-white/70 text-sm mb-3">{image.description}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/50">Order: {image.order}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => moveImage(index, "up")}
                    disabled={index === 0}
                    className="p-1 text-white/50 hover:text-electric-purple disabled:opacity-25 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveImage(index, "down")}
                    disabled={index === gallery.images.length - 1}
                    className="p-1 text-white/50 hover:text-electric-purple disabled:opacity-25 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => deleteImage(image.id)}
                    className="p-1 text-red-400 hover:text-red-300"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {gallery.images.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/70 text-lg">No images in gallery yet.</p>
          <p className="text-white/50">Click "Add Image" to get started.</p>
        </div>
      )}
    </div>
  );
}
