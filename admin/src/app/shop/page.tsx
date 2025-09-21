import ProductList from "@/components/ProductList";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-matte-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="glitch text-4xl text-center mb-8" style={{ color: "#3A7CA5" }}>
          Shop
        </h1>
        <p className="text-white/70 text-center mb-12 max-w-2xl mx-auto">
          Browse our collection of custom printed apparel and accessories. Express your unrepentant style.
        </p>
        <ProductList />
      </main>
      <Footer />
    </div>
  );
}
