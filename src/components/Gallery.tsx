"use client";

import { useState, useEffect } from "react";
import { GalleryData } from "@/types";

export default function Gallery() {
  const [gallery, setGallery] = useState<GalleryData>({ images: [], lastUpdated: "" });
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const response = await fetch("/api/gallery");
      if (response.ok) {
        const data = await response.json();
        setGallery(data);
      }
    } catch (error) {
      console.error("Failed to load gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-electric-purple"></div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.images.map((image) => (
          <div
            key={image.id}
            className="relative group cursor-pointer overflow-hidden rounded-lg border border-neon-magenta/20 hover:border-electric-purple/50 transition-all duration-300"
            onClick={() => openModal(image.url)}
          >
            <div className="aspect-square">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-image.jpg";
                }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-header text-lg mb-1">{image.title}</h3>
                {image.description && (
                  <p className="text-white/80 text-sm line-clamp-2">{image.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {gallery.images.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/70 text-lg">Gallery is being updated.</p>
          <p className="text-white/50">Check back soon for new content.</p>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <img
              src={selectedImage}
              alt="Gallery image"
              className="max-w-full max-h-full object-contain rounded-lg shadow-neon"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}