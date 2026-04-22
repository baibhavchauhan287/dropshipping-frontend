"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { ShoppingCart, Loader2, Heart, Star } from "lucide-react";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function ProductDetailPage() {

  const { id } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [qty, setQty] = useState(1);

  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const BASE_URL = "http://localhost:8080";

  const getImage = (url: string) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url}`;
  };

  useEffect(() => {
    loadProduct();
    loadWishlist();
  }, []);

  const loadProduct = async () => {
    try {
      const res = await api.get(`/api/products/${id}`);
      setProduct(res.data);

      // ✅ first image select
      if (res.data.images?.length > 0) {
        setSelectedImage(res.data.images[0]);
      } else {
        setSelectedImage(res.data.imageUrl);
      }

    } catch {
      toast.error("Error loading product ❌");
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = async () => {
    try {
      const res = await api.get("/api/customer/wishlist");
      setWishlistIds(res.data.map((w: any) => w.productId));
    } catch {}
  };

  const toggleWishlist = async () => {
    try {
      setWishlistLoading(true);

      await api.post("/api/customer/wishlist/toggle", null, {
        params: { productId: product.id }
      });

      setWishlistIds((prev) =>
        prev.includes(product.id)
          ? prev.filter((id) => id !== product.id)
          : [...prev, product.id]
      );

    } finally {
      setWishlistLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      setCartLoading(true);

      await api.post("/api/customer/cart/add", {
        productId: product.id,
        quantity: qty
      });

      toast.success("Added to cart 🛒");

    } finally {
      setCartLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20"><Loader2 className="animate-spin mx-auto"/></div>;
  if (!product) return <div>Not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen">

      <Navbar />

      <div className="max-w-7xl mx-auto p-4 grid lg:grid-cols-2 gap-10">

        {/* ================= IMAGE SECTION ================= */}
        <div className="flex gap-4">

          {/* THUMBNAILS */}
          <div className="flex flex-col gap-3">
            {(product.images?.length ? product.images : [product.imageUrl]).map((img: string, i: number) => (
              <img
                key={i}
                src={getImage(img)}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 object-cover border rounded cursor-pointer 
                  ${selectedImage === img ? "border-indigo-500" : ""}`}
              />
            ))}
          </div>

          {/* MAIN IMAGE */}
          <div className="flex-1 bg-white p-4 rounded-xl shadow">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={getImage(selectedImage)}
                className="w-full h-full object-contain hover:scale-125 transition duration-500"
              />
            </div>
          </div>

        </div>

        {/* ================= DETAILS ================= */}
        <div className="space-y-6">

          <h1 className="text-2xl md:text-3xl font-bold">
            {product.name}
          </h1>

          {/* ⭐ RATING UI */}
          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor"/>)}
            <span className="text-gray-500 text-sm ml-2">(120 reviews)</span>
          </div>

          <p className="text-gray-600">{product.description}</p>

          <div className="text-3xl font-bold text-indigo-600">
            ₹{product.price}
          </div>

          {/* STOCK */}
          {product.stock !== undefined && (
            <p className={product.stock > 0 ? "text-green-600" : "text-red-500"}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>
          )}

          {/* QTY */}
          <div className="flex items-center gap-3">
            <button onClick={()=>setQty(q=>Math.max(1,q-1))}>-</button>
            <span>{qty}</span>
            <button onClick={()=>setQty(q=>q+1)}>+</button>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">

            <button
              onClick={addToCart}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg flex justify-center gap-2"
            >
              {cartLoading ? <Loader2 className="animate-spin"/> : <ShoppingCart/>}
              Add to Cart
            </button>

            <button
              onClick={toggleWishlist}
              className="px-6 border rounded-lg"
            >
              {wishlistLoading
                ? <Loader2 className="animate-spin"/>
                : <Heart className={wishlistIds.includes(product.id) ? "text-red-500 fill-red-500" : ""}/>
              }
            </button>

          </div>

        </div>

      </div>

      {/* ================= REVIEWS ================= */}
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

        <div className="bg-white p-4 rounded-lg shadow space-y-3">
          <p className="font-semibold">John Doe ⭐⭐⭐⭐⭐</p>
          <p className="text-gray-600 text-sm">
            Amazing product! Quality is top notch.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}