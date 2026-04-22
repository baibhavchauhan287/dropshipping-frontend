"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Package } from "lucide-react";

export default function OrdersPage() {

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/api/customer/orders");
      setOrders(res.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= STATUS COLOR =================
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLACED":
        return "bg-blue-100 text-blue-700";
      case "SHIPPED":
        return "bg-purple-100 text-purple-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ================= TIMELINE =================
  const steps = ["PLACED", "SHIPPED", "DELIVERED"];

  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="max-w-6xl mx-auto p-4 md:p-8">

        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          My Orders
        </h1>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="mx-auto text-gray-400" size={50} />
            <p className="text-gray-500 mt-2">No Orders Found</p>
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order: any) => {

              const currentStepIndex =
                steps.indexOf(order.status);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow p-6"
                >

                  {/* HEADER */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-semibold text-lg">
                        Order #{order.orderNumber || order.id}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* TIMELINE */}
                  <div className="flex items-center mt-5 gap-2">

                    {steps.map((step, index) => (
                      <div key={step} className="flex-1 flex items-center">

                        <div
                          className={`h-3 w-3 rounded-full ${
                            index <= currentStepIndex
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />

                        {index !== steps.length - 1 && (
                          <div
                            className={`flex-1 h-1 ${
                              index < currentStepIndex
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />
                        )}

                      </div>
                    ))}

                  </div>

                  {/* DETAILS */}
                  <div className="mt-4 text-sm text-gray-600 space-y-1">
                    <p>💰 Total: ₹{order.totalAmount}</p>
                    <p>📍 {order.address}</p>
                  </div>

                  {/* ITEMS */}
                  {order.items?.length > 0 && (
                    <div className="mt-4 border-t pt-3 text-sm">
                      {order.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between">
                          <span>
                            {item.productName} × {item.quantity}
                          </span>
                          <span>
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}