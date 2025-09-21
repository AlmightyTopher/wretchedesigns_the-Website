import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-matte-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="glitch text-4xl text-center mb-8" style={{ color: "#3A7CA5" }}>
          Wretched Thoughts
        </h1>
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#181825] rounded-lg p-8 border border-neon-magenta/20 text-center">
            <div className="mb-6">
              <span className="text-6xl">⚡</span>
            </div>
            <h2 className="text-2xl text-acid-magenta mb-4">The Void Speaks</h2>
            <p className="text-white/80 mb-4">
              Our blog is currently in the development phase, much like ideas brewing
              in the darkest corners of the imagination.
            </p>
            <p className="text-white/70 mb-6">
              Here we will share insights into our creative process, discuss aesthetics
              that challenge conventions, and explore the intersection of art, technology,
              and rebellion.
            </p>
            <div className="border border-electric-purple/30 rounded p-4 bg-matte-black/50">
              <p className="text-electric-purple">
                📝 Coming soon: Articles about underground art movements, design philosophy,
                and the rejection of mediocrity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-[#181825] rounded-lg p-6 border border-neon-magenta/20">
              <h3 className="text-xl text-acid-magenta mb-3">Upcoming Topics</h3>
              <ul className="space-y-2 text-white/70">
                <li>• The Aesthetics of Rebellion</li>
                <li>• Cyberpunk Design Philosophy</li>
                <li>• Finding Beauty in Broken Code</li>
                <li>• Art That Refuses to Conform</li>
              </ul>
            </div>

            <div className="bg-[#181825] rounded-lg p-6 border border-neon-magenta/20">
              <h3 className="text-xl text-acid-magenta mb-3">Post Categories</h3>
              <ul className="space-y-2 text-white/70">
                <li>• Design Theory</li>
                <li>• Artist Spotlights</li>
                <li>• Behind the Scenes</li>
                <li>• Community Stories</li>
            </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
