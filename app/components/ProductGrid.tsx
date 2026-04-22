"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
}

export default function ShopPage() {

  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
    loadWishlist();
  }, []);

  // =========================
  // PRODUCTS
  // =========================
  const loadProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Product error:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // WISHLIST LOAD
  // =========================
  const loadWishlist = async () => {
    try {
      const res = await api.get("/api/customer/wishlist");

      const ids = Array.isArray(res.data)
        ? res.data.map((w: any) => w.productId)
        : [];

      setWishlist(ids);

    } catch (err) {
      console.error("Wishlist load error:", err);
    }
  };

  // =========================
  // TOGGLE WISHLIST
  // =========================
  const toggleWishlist = async (productId: number) => {
    try {
      setWishlistLoading(productId);

      await api.post(
        "/api/customer/wishlist/toggle",
        null,
        {
          params: { productId },
        }
      );

      setWishlist((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );

    } catch (err) {
      console.error("Wishlist toggle error:", err);
    } finally {
      setWishlistLoading(null);
    }
  };

  // =========================
  // IMAGE HANDLER
  // =========================
  const getImage = (url?: string) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("http")) return url;
    return `http://localhost:8080${url}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <h1 className="text-2xl font-bold mb-6">
        Trending Products
      </h1>

      {/* LOADING */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-72 bg-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* PRODUCTS */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {products.map((p) => {

            const isWishlisted = wishlist.includes(p.id);

            return (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >

                {/* IMAGE */}
                <div className="relative">

                  <img
                    src={getImage(p.imageUrl)}
                    className="w-full h-56 object-cover"
                  />

                  {/* ❤️ WISHLIST */}
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow"
                  >
                    {wishlistLoading === p.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Heart
                        size={16}
                        className={
                          isWishlisted
                            ? "text-red-500 fill-red-500"
                            : "text-gray-400"
                        }
                      />
                    )}
                  </button>

                </div>

                {/* INFO */}
                <div className="p-3">
                  <h3 className="font-medium line-clamp-1">
                    {p.name}
                  </h3>

                  <p className="text-indigo-600 font-bold">
                    ₹{p.price}
                  </p>

                  <Link href={`/products/${p.id}`}>
                    <button className="mt-2 w-full bg-indigo-600 text-white py-2 rounded-lg">
                      View Product
                    </button>
                  </Link>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}