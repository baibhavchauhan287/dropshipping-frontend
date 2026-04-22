"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";
import { ShoppingCart, Loader2, Heart } from "lucide-react";

import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import Categories from "@/app/components/Categories";
import Footer from "@/app/components/Footer";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock?: number;
}

export default function ShopPage() {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState<number | null>(null);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  useEffect(() => {
    loadProducts();
    loadWishlist();
  }, []);

  // ✅ PRODUCTS
  const loadProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(res.data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // ✅ WISHLIST
  const loadWishlist = async () => {
    try {
      const res = await api.get("/api/customer/wishlist");
      const ids = res.data.map((w: any) => w.productId);
      setWishlistIds(ids);
    } catch {}
  };

  // ❤️ TOGGLE
  const toggleWishlist = async (productId: number) => {
    try {
      setWishlistLoading(productId);

      await api.post("/api/customer/wishlist/toggle", null, {
        params: { productId }
      });

      setWishlistIds((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );

      window.dispatchEvent(new Event("wishlistUpdated"));

    } catch {
      toast.error("Wishlist error ❌");
    } finally {
      setWishlistLoading(null);
    }
  };

  // 🛒 CART
  const addToCart = async (productId: number) => {
    try {
      setActionLoading(productId);

      await api.post("/api/customer/cart/add", {
        productId,
        quantity: 1
      });

      toast.success("Added to cart 🛒");
      window.dispatchEvent(new Event("cartUpdated"));

    } catch {
      toast.error("Cart error ❌");
    } finally {
      setActionLoading(null);
    }
  };

  // 🖼 IMAGE FIX (IMPORTANT)
  const getImage = (url: string) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("http")) return url;
    return `http://localhost:8080${url}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      <Navbar />
      <Hero />
      <Categories />

      <div className="max-w-7xl mx-auto px-4 py-6">

        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          All Products
        </h1>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-3 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* PRODUCTS */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

            {products.map((p) => (

              <div
                key={p.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden group"
              >

                {/* IMAGE SECTION */}
                <div className="relative">

                  {/* ❤️ WISHLIST */}
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow z-10"
                  >
                    {wishlistLoading === p.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Heart
                        size={16}
                        className={
                          wishlistIds.includes(p.id)
                            ? "text-red-500 fill-red-500"
                            : "text-gray-400"
                        }
                      />
                    )}
                  </button>

                  {/* ✅ PERFECT IMAGE BOX */}
                  <Link href={`/products/${p.id}`}>
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={getImage(p.imageUrl)}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e: any) => e.target.src = "/placeholder.png"}
                      />
                    </div>
                  </Link>

                </div>

                {/* CONTENT */}
                <div className="p-3">

                  <Link href={`/products/${p.id}`}>
                    <h3 className="text-sm font-semibold line-clamp-2 hover:text-indigo-600">
                      {p.name}
                    </h3>
                  </Link>

                  <p className="text-lg font-bold text-indigo-600 mt-1">
                    ₹{p.price}
                  </p>

                  {/* STOCK */}
                  {p.stock !== undefined && (
                    <p className={`text-xs mt-1 ${
                      p.stock === 0
                        ? "text-red-500"
                        : p.stock <= 5
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}>
                      {p.stock === 0
                        ? "Out of stock"
                        : p.stock <= 5
                        ? "Only few left"
                        : "In stock"}
                    </p>
                  )}

                  {/* 🛒 BUTTON */}
                  <button
                    onClick={() => addToCart(p.id)}
                    disabled={actionLoading === p.id || p.stock === 0}
                    className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    {actionLoading === p.id
                      ? <Loader2 size={16} className="animate-spin"/>
                      : <ShoppingCart size={16}/>
                    }
                    Add to Cart
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}