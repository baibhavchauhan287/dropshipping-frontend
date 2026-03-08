import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import Categories from "@/app/components/Categories";
import ProductGrid from "@/app/components/ProductGrid";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <div>

      <Navbar />

      <Hero />

      <Categories />

      <ProductGrid />

      <Footer />

    </div>
  );
}