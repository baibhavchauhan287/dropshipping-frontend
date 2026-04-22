"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export default function CartPage() {

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const BASE_URL = "http://localhost:8080";

  const getImage = (url: string) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url}`;
  };

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await api.get("/api/customer/cart");
      setCart(res.data);

      // update navbar count
      window.dispatchEvent(new Event("cartUpdated"));

    } catch {
      toast.error("Login required ❌");
    } finally {
      setLoading(false);
    }
  };

  // REMOVE ITEM
  const removeItem = async (id: number) => {
    try {
      await api.delete(`/api/customer/cart/${id}`);
      toast.success("Removed");
      loadCart();
    } catch {
      toast.error("Error");
    }
  };

  // INCREASE QTY
  const increaseQty = async (id: number) => {
    try {
      await api.put(`/api/customer/cart/${id}/increase`);
      loadCart();
    } catch {
      toast.error("Error");
    }
  };

  // DECREASE QTY
  const decreaseQty = async (id: number) => {
    try {
      await api.put(`/api/customer/cart/${id}/decrease`);
      loadCart();
    } catch {
      toast.error("Error");
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading) {
    return <div className="p-10 text-center">Loading cart...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      <Navbar />

      <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-3 gap-8">

        {/* CART ITEMS */}
        <div className="md:col-span-2 space-y-4">

          <h1 className="text-2xl font-bold">Shopping Cart</h1>

          {cart.length === 0 && (
            <div className="bg-white p-10 rounded-xl shadow text-center">
              <ShoppingBag size={40} className="mx-auto text-gray-400 mb-3"/>
              <p className="text-gray-500">Your cart is empty</p>

              <button
                onClick={() => router.push("/products")}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg"
              >
                Continue Shopping
              </button>
            </div>
          )}

          {cart.map(item => (

            <div
              key={item.id}
              className="bg-white p-4 rounded-xl shadow flex gap-4 items-center"
            >

              {/* IMAGE */}
              <img
                src={getImage(item.imageUrl)}
                className="w-24 h-24 object-cover rounded-lg border"
                onError={(e:any)=> e.target.src="/placeholder.png"}
              />

              {/* INFO */}
              <div className="flex-1">

                <p className="font-semibold text-gray-900">
                  {item.productName}
                </p>

                <p className="text-gray-500 text-sm">
                  ₹{item.price}
                </p>

                {/* QTY */}
                <div className="flex items-center gap-2 mt-2">

                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="p-1 border rounded hover:bg-gray-100"
                  >
                    <Minus size={14}/>
                  </button>

                  <span className="px-2">{item.quantity}</span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="p-1 border rounded hover:bg-gray-100"
                  >
                    <Plus size={14}/>
                  </button>

                </div>

              </div>

              {/* REMOVE */}
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2/>
              </button>

            </div>

          ))}

        </div>

        {/* SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow h-fit sticky top-6 space-y-4">

          <h2 className="text-lg font-bold">Order Summary</h2>

          <div className="flex justify-between text-sm">
            <span>Items</span>
            <span>{cart.length}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Total</span>
            <span className="font-bold text-indigo-600">₹{total}</span>
          </div>

          <hr/>

          <button
            onClick={() => router.push("/checkout")}
            disabled={cart.length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
          >
            Proceed to Checkout
          </button>

        </div>

      </div>

      <Footer />

    </div>
  );
}