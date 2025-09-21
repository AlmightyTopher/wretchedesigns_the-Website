"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string>("");

  const openImageModal = (src: string) => {
    setSelectedImage(src);
  };

  const closeImageModal = () => {
    setSelectedImage("");
  };

  return (
    <div className="min-h-screen bg-matte-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <section className="w-full p-4">
          <h1 className="glitch text-5xl md:text-7xl mb-10 text-center" style={{ color: "#3A7CA5" }}>
            Our Gallery
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Gallery Item 1 */}
            <div
              className="bg-gradient-to-br from-[#1c002e] to-[#0c001a] rounded-lg p-6 shadow-neon-sm border border-neon-magenta/20 hover:shadow-neon transition-all duration-300 cursor-pointer"
              onClick={() => openImageModal("/Images/Art/0e24c8e1-ad42-4b6c-b538-672c737cec86.jpg")}
            >
              <div className="w-full h-48 overflow-hidden rounded-md mb-4 border border-electric-purple/30 flex items-center justify-center">
                <img
                  src="/Images/Art/0e24c8e1-ad42-4b6c-b538-672c737cec86.jpg"
                  alt="Cyberpunk Art"
                  className="h-full w-auto object-cover"
                />
              </div>
              <h2 className="text-3xl font-header mb-2 text-electric-purple glow">Neon Cityscape</h2>
              <p className="text-white/80 text-lg">A vibrant depiction of a futuristic city, bathed in neon lights.</p>
            </div>

            {/* Gallery Item 2 */}
            <div
              className="bg-gradient-to-br from-[#1c002e] to-[#0c001a] rounded-lg p-6 shadow-neon-sm border border-neon-magenta/20 hover:shadow-neon transition-all duration-300 cursor-pointer"
              onClick={() => openImageModal("/Images/Art/212c84dc-0494-4fb2-950d-1a450d86abf6.jpg")}
            >
              <div className="w-full h-48 overflow-hidden rounded-md mb-4 border border-neon-magenta/30 flex items-center justify-center">
                <img
                  src="/Images/Art/212c84dc-0494-4fb2-950d-1a450d86abf6.jpg"
                  alt="Abstract Glitch Art"
                  className="h-full w-auto object-cover"
                />
              </div>
              <h2 className="text-3xl font-header mb-2 text-neon-magenta glow">Digital Disruption</h2>
              <p className="text-white/80 text-lg">An abstract piece exploring the beauty of digital errors and glitches.</p>
            </div>

            {/* Gallery Item 3 */}
            <div
              className="bg-gradient-to-br from-[#1c002e] to-[#0c001a] rounded-lg p-6 shadow-neon-sm border border-neon-magenta/20 hover:shadow-neon transition-all duration-300 cursor-pointer"
              onClick={() => openImageModal("/Images/Art/36f583e6-dae6-4858-a57e-b25c34e3b0da.jpg")}
            >
              <div className="w-full h-48 overflow-hidden rounded-md mb-4 border border-electric-purple/30 flex items-center justify-center">
                <img
                  src="/Images/Art/36f583e6-dae6-4858-a57e-b25c34e3b0da.jpg"
                  alt="Futuristic Portrait"
                  className="h-full w-auto object-cover"
                />
              </div>
              <h2 className="text-3xl font-header mb-2 text-acid-magenta glow">Synthwave Dream</h2>
              <p className="text-white/80 text-lg">A captivating portrait infused with synthwave aesthetics and vibrant hues.</p>
            </div>

            {/* Gallery Item 4 */}
            <div
              className="bg-gradient-to-br from-[#1c002e] to-[#0c001a] rounded-lg p-6 shadow-neon-sm border border-neon-magenta/20 hover:shadow-neon transition-all duration-300 cursor-pointer"
              onClick={() => openImageModal("/Images/Art/478cb881-8222-440c-9f67-e3e39fb24e5d.jpg")}
            >
              <div className="w-full h-48 overflow-hidden rounded-md mb-4 border border-neon-blue/30 flex items-center justify-center">
                <img
                  src="/Images/Art/478cb881-8222-440c-9f67-e3e39fb24e5d.jpg"
                  alt="Abstract Landscape"
                  className="h-full w-auto object-cover"
                />
              </div>
              <h2 className="text-3xl font-header mb-2 text-neon-blue glow">Quantum Realm</h2>
              <p className="text-white/80 text-lg">An otherworldly landscape blending abstract forms with digital textures.</p>
            </div>

            {/* Gallery Item 5 */}
            <div
              className="bg-gradient-to-br from-[#1c002e] to-[#0c001a] rounded-lg p-6 shadow-neon-sm border border-neon-magenta/20 hover:shadow-neon transition-all duration-300 cursor-pointer"
              onClick={() => openImageModal("/Images/Art/4fb77fbe-3d28-40ce-9243-a683afc07b50.jpg")}
            >
              <div className="w-full h-48 overflow-hidden rounded-md mb-4 border border-electric-purple/30 flex items-center justify-center">
                <img
                  src="/Images/Art/4fb77fbe-3d28-40ce-9243-a683afc07b50.jpg"
                  alt="Cyberpunk Vehicle"
                  className="h-full w-auto object-cover"
                />
              </div>
              <h2 className="text-3xl font-header mb-2 text-electric-purple glow">Ghost Rider</h2>
              <p className="text-white/80 text-lg">Sleek and menacing, a vehicle designed for the future's dark alleys.</p>
            </div>

            {/* Gallery Item 6 */}
            <div
              className="bg-gradient-to-br from-[#1c002e] to-[#0c001a] rounded-lg p-6 shadow-neon-sm border border-neon-magenta/20 hover:shadow-neon transition-all duration-300 cursor-pointer"
              onClick={() => openImageModal("/Images/Art/51eb4dbf-9652-4c3b-8c35-0934874ec938.jpg")}
            >
              <div className="w-full h-48 overflow-hidden rounded-md mb-4 border border-neon-magenta/30 flex items-center justify-center">
                <img
                  src="/Images/Art/51eb4dbf-9652-4c3b-8c35-0934874ec938.jpg"
                  alt="Vaporwave Sunset"
                  className="h-full w-auto object-cover"
                />
              </div>
              <h2 className="text-3xl font-header mb-2 text-neon-magenta glow">Vaporwave Visions</h2>
              <p className="text-white/80 text-lg">A nostalgic and serene depiction of a vaporwave sunset.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100]"
          onClick={closeImageModal}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={selectedImage}
              alt="Full size image"
              className="max-w-full max-h-full object-contain cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 text-white text-4xl font-bold leading-none"
              onClick={closeImageModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
