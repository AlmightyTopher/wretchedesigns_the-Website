"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface GalleryImage {
  id: string;
  title: string;
  url: string;
  description: string;
  order: number;
  category?: string;
  createdAt: string;
}

export default function SimpleAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [galleryData, setGalleryData] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/admin");
      if (response.ok) {
        setIsAuthenticated(true);
        loadGalleryData();
      } else {
        setIsAuthenticated(false);
        router.push("/admin-login");
      }
    } catch (error) {
      setIsAuthenticated(false);
      router.push("/admin-login");
    }
  };

  const loadGalleryData = async () => {
    try {
      const response = await fetch("/api/gallery-admin");
      if (response.ok) {
        const data = await response.json();
        setGalleryData(data.images || []);
      }
    } catch (error) {
      console.error("Failed to load gallery data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/admin", { method: "DELETE" });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const addNewImage = async () => {
    const title = prompt("Enter image title:");
    const url = prompt("Enter image URL:");
    const description = prompt("Enter image description:");

    if (title && url && description) {
      try {
        const response = await fetch("/api/gallery-admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: {
              title,
              url,
              description,
              order: galleryData.length,
              category: "Digital Art"
            }
          })
        });

        if (response.ok) {
          const result = await response.json();
          setMessage(result.message || "Image added successfully!");
          setTimeout(() => setMessage(""), 3000);
        }
      } catch (error) {
        setMessage("Failed to add image");
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  if (isAuthenticated === null || isLoading) {
    return (
      <div className="min-h-screen bg-matte-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-electric-purple mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-matte-black">
      <header className="border-b border-neon-magenta/30 bg-[#111111bb] backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <h1 className="glitch text-2xl font-header" style={{ color: "#3A7CA5" }}>
            Wretched Designs Admin
          </h1>
          <div className="flex gap-4">
            <a
              href="/"
              target="_blank"
              className="px-4 py-2 border border-acid-magenta text-acid-magenta rounded hover:bg-acid-magenta/20 neon transition duration-200"
            >
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-electric-purple text-white rounded hover:bg-acid-magenta transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {message && (
          <div className="mb-6 p-4 bg-electric-purple/20 border border-electric-purple rounded-lg text-white">
            {message}
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-header text-acid-magenta">Gallery Management</h2>
            <button
              onClick={addNewImage}
              className="px-6 py-2 bg-electric-purple text-white rounded-lg shadow-neon neon transition duration-200 hover:scale-105 hover:bg-acid-magenta"
            >
              Add New Image
            </button>
          </div>

          <div className="bg-[#181825] rounded-lg border border-neon-magenta/20 p-6">
            <p className="text-yellow-400 mb-4">
              ⚠️ Production Mode: Changes are not persistent yet. Working on Cloudflare KV storage integration.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryData.map((image) => (
                <div
                  key={image.id}
                  className="bg-black/20 rounded-lg border border-neon-magenta/10 p-4"
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                  <h3 className="text-white font-medium mb-1">{image.title}</h3>
                  <p className="text-white/70 text-sm mb-2">{image.description}</p>
                  <p className="text-acid-magenta text-xs">
                    Category: {image.category || "Uncategorized"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#181825] rounded-lg border border-neon-magenta/20 p-6">
          <h3 className="text-xl font-header text-acid-magenta mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-black/20 rounded-lg">
              <h4 className="text-white font-medium mb-2">Gallery Stats</h4>
              <p className="text-white/70">Total Images: {galleryData.length}</p>
            </div>
            <div className="p-4 bg-black/20 rounded-lg">
              <h4 className="text-white font-medium mb-2">Next Steps</h4>
              <p className="text-white/70">Cloudflare KV storage setup</p>
            </div>
            <div className="p-4 bg-black/20 rounded-lg">
              <h4 className="text-white font-medium mb-2">Status</h4>
              <p className="text-green-400">Admin System Active</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}