import Link from "next/link";

export default function Header() {
  return (
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
  );
}
