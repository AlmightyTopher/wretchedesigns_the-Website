import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-matte-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="glitch text-4xl text-center mb-8" style={{ color: "#3A7CA5" }}>
          Contact Us
        </h1>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#181825] rounded-lg p-8 border border-neon-magenta/20">
            <h2 className="text-2xl text-acid-magenta mb-6">Get In Touch</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white text-lg mb-2">Business Inquiries</h3>
                <p className="text-white/70">business@wretcheddesigns.com</p>
              </div>
              <div>
                <h3 className="text-white text-lg mb-2">Custom Orders</h3>
                <p className="text-white/70">orders@wretcheddesigns.com</p>
              </div>
              <div>
                <h3 className="text-white text-lg mb-2">Collaboration</h3>
                <p className="text-white/70">collab@wretcheddesigns.com</p>
              </div>
            </div>
          </div>

          <div className="bg-[#181825] rounded-lg p-8 border border-neon-magenta/20">
            <h2 className="text-2xl text-acid-magenta mb-6">Follow Us</h2>
            <div className="space-y-4">
              <a href="#" className="flex items-center gap-3 text-white/80 hover:text-electric-purple transition-colors">
                <span className="text-electric-purple">►</span>
                Instagram @wretcheddesigns
              </a>
              <a href="#" className="flex items-center gap-3 text-white/80 hover:text-electric-purple transition-colors">
                <span className="text-electric-purple">►</span>
                Discord Community
              </a>
              <a href="#" className="flex items-center gap-3 text-white/80 hover:text-electric-purple transition-colors">
                <span className="text-electric-purple">►</span>
                Eternal Darkness Gallery
              </a>
            </div>
          </div>

          <div className="md:col-span-2 bg-[#181825] rounded-lg p-8 border border-neon-magenta/20">
            <h2 className="text-2xl text-acid-magenta mb-6">Visit Our Studio</h2>
            <div className="text-white/80">
              <p className="mb-2">Shadow Realm Creative District</p>
              <p className="mb-2">Underground Level -13</p>
              <p className="mb-4">Cyberspace, Dimension 7</p>
              <p className="text-white/60 italic">
                *Physical coordinates encrypted. Send carrier pigeon to manifest entrance.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
