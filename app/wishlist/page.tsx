"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import toast from "react-hot-toast";
import { Loader2, Trash2, ShoppingCart } from "lucide-react";

interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
}

export default function WishlistPage() {

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  // LOAD WISHLIST
  const loadWishlist = async () => {
    try {
      const res = await api.get("/api/customer/wishlist");
      setItems(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  //REMOVE ITEM
  const removeItem = async (productId: number) => {
    try {
      setActionLoading(productId);

      await api.post("/api/customer/wishlist/toggle", null, {
        params: { productId }
      });

      setItems((prev) => prev.filter((i) => i.productId !== productId));

      window.dispatchEvent(new Event("wishlistUpdated"));

      toast.success("Removed from wishlist");

    } catch {
      toast.error("Remove failed");
    } finally {
      setActionLoading(null);
    }
  };

  // MOVE TO CART
  const moveToCart = async (productId: number) => {
    try {
      setActionLoading(productId);

      await api.post("/api/customer/cart/add", {
        productId,
        quantity: 1
      });

      await removeItem(productId);

      window.dispatchEvent(new Event("cartUpdated"));

      toast.success("Moved to cart");

    } catch {
      toast.error("Move to cart failed");
    } finally {
      setActionLoading(null);
    }
  };

  // IMAGE FIX
  const getImage = (url: string) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("http")) return url;
    return `http://localhost:8080${url}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6">My Wishlist ❤️</h1>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20">
            <Loader2 className="animate-spin mx-auto" />
          </div>
        )}

        {/* EMPTY */}
        {!loading && items.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p>No items in wishlist 😢</p>
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {items.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden group"
            >

              {/* IMAGE */}
              <div className="relative">

                {/*  CLICKABLE IMAGE */}
                <Link href={`/products/${item.productId}`}>
                  <img
                    src={getImage(item.imageUrl)}
                    className="h-48 w-full object-cover cursor-pointer group-hover:scale-105 transition duration-300"
                    onError={(e: any) => e.target.src = "/placeholder.png"}
                  />
                </Link>

                {/* ❌ REMOVE ICON */}
                <button
                  onClick={() => removeItem(item.productId)}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-red-50"
                >
                  {actionLoading === item.productId ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} className="text-red-500" />
                  )}
                </button>

              </div>

              {/* CONTENT */}
              <div className="p-4">

                {/* ✅ CLICKABLE NAME */}
                <Link href={`/products/${item.productId}`}>
                  <h3 className="font-semibold text-sm line-clamp-2 hover:text-indigo-600 cursor-pointer">
                    {item.name}
                  </h3>
                </Link>

                <p className="text-indigo-600 font-bold mt-2">
                  ₹{item.price}
                </p>

                {/* ACTIONS */}
                <div className="mt-4 space-y-2">

                  <button
                    onClick={() => moveToCart(item.productId)}
                    disabled={actionLoading === item.productId}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    {actionLoading === item.productId ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <ShoppingCart size={16} />
                    )}
                    Move to Cart
                  </button>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="w-full text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      <Footer />

    </div>
  );
}