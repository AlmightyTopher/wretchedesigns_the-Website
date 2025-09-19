import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-matte-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="glitch text-4xl text-center mb-8" style={{ color: "#3A7CA5" }}>
          About Wretched Designs
        </h1>
        <div className="max-w-4xl mx-auto text-white/80 space-y-6">
          <div className="bg-[#181825] rounded-lg p-8 border border-neon-magenta/20">
            <h2 className="text-2xl text-acid-magenta mb-4">Our Story</h2>
            <p className="mb-4">
              Wretched Designs emerged from the shadows of the underground design scene,
              cultivating a unique aesthetic that blends cyberpunk futurism with raw,
              unapologetic creativity.
            </p>
            <p className="mb-4">
              We're a collective of rebellious artists and designers who reject
              conventional norms in favor of bold, provocative works that challenge
              perceptions and spark conversations.
            </p>
            <p>
              Each piece carries the weight of our shared vision - to create art that
              resonates with the renegades, outsiders, and visionaries who dare to
              embrace their authentic selves.
            </p>
          </div>

          <div className="bg-[#181825] rounded-lg p-8 border border-neon-magenta/20">
            <h2 className="text-2xl text-acid-magenta mb-4">What We Stand For</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-electric-purple font-bold">✱</span>
                <span>Uncompromising artistic integrity</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-electric-purple font-bold">✱</span>
                <span>Rebellion against commercial conformity</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-electric-purple font-bold">✱</span>
                <span>Empowerment of alternative aesthetics</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-electric-purple font-bold">✱</span>
                <span>Community for the unrestrained and unconventional</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
