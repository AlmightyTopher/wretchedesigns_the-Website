"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-matte-black text-white relative antialiased">
      <header className="sticky top-0 z-50 w-full border-b border-neon-magenta/30 bg-[#111111bb] backdrop-blur-md shadow-neon">
        <nav className="container mx-auto px-4 flex items-center justify-between py-4 max-w-7xl">
          <Link href="/" className="flex items-center gap-3 select-none">
            <span className="glitch text-2xl font-header tracking-wide drop-shadow-md select-none" style={{ color: "#3A7CA5" }}>
              Wretched
            </span>
            <span className="font-header font-bold text-acid-magenta glow text-lg tracking-widest select-none">
              Designs
            </span>
          </Link>
          <div className="flex gap-6">
            <Link href="/shop" className="transition neon hover:text-electric-purple hover:drop-shadow-[0_0_10px_#FF00CC]">
              Shop
            </Link>
            <Link href="/gallery" className="transition neon hover:text-acid-magenta">
              Gallery
            </Link>
            <Link href="/about" className="transition neon hover:text-electric-purple">
              About
            </Link>
            <Link href="/contact" className="transition neon hover:text-acid-magenta">
              Contact
            </Link>
            <Link href="/blogs" className="transition neon hover:text-acid-magenta">
              Blog
            </Link>
            <a href="#" className="text-white">🛒 (Cart)</a>
          </div>
        </nav>
      </header>

      <main className="relative min-h-screen flex flex-col">
        <section className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80"
              alt="Cyberpunk neon city background"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: "blur(2px) saturate(1.2) brightness(0.75) contrast(1.5)",
                transform: "scale(1.05)"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#11111177] via-[#1a0033aa] to-[#1a0033]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#11111188] to-transparent"></div>
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
            <h1 className="glitch text-5xl md:text-7xl mb-7 neon leading-tight tracking-[0.11em]" style={{ color: "#3A7CA5" }}>
              Born from Chaos. Built to Disturb.
            </h1>
            <p className="text-xl md:text-2xl mb-8 neon">
              Custom Printed Apparel · Art & Relics · Nightlife For The Unrepentant
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-7">
              <Link
                href="/shop"
                className="px-8 py-4 text-lg font-header bg-electric-purple text-white rounded-lg shadow-neon neon transition duration-200 hover:scale-105 hover:bg-acid-magenta focus:ring-4 focus:ring-acid-magenta/30 focus:outline-none"
              >
                Shop Now
              </Link>
              <Link
                href="/gallery"
                className="px-8 py-4 text-lg font-header border-2 border-acid-magenta text-acid-magenta rounded-lg shadow-neon hover:bg-acid-magenta/20 neon transition duration-200 hover:scale-105 focus:ring-4 focus:ring-electric-purple/30 focus:outline-none"
              >
                View Art Gallery
              </Link>
            </div>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-32 h-2 bg-gradient-to-r from-electric-purple via-acid-magenta to-neon-blue rounded-full animate-pulse shadow-neon opacity-50"></div>
        </section>
      </main>

      <footer className="relative z-50 pointer-events-auto">
        <div className="container mx-auto px-4 py-6 text-center text-xs text-white/70 max-w-7xl">
          &copy; 2025 Wretched Designs. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
