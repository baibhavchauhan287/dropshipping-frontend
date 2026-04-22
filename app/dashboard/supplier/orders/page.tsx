"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function SupplierOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/api/supplier/orders");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setOrders(data);

    } catch (err) {
      console.error("Load error:", err.response?.data || err.message);
      alert("Failed to load orders ❌");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ✅ UPDATE STATUS
  // =========================
  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      await api.put(`/api/supplier/orders/${id}/status`, {
        status: status,
      });

      // 🔥 instant UI update
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status } : o
        )
      );

    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert(err.response?.data || "Status update failed ❌");

      // 🔥 fallback reload (important in production)
      loadOrders();

    } finally {
      setUpdatingId(null);
    }
  };

  const badge = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-yellow-100 text-yellow-700";
      case "SHIPPED":
        return "bg-blue-100 text-blue-700";
      case "OUT_FOR_DELIVERY":
        return "bg-purple-100 text-purple-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          📦 Supplier Orders
        </h1>
        <p className="text-gray-500">
          Manage all incoming orders in one place
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

        <div className="grid grid-cols-5 bg-gray-100 text-sm font-semibold text-gray-700 p-4">
          <div>Order ID</div>
          <div>Products</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {orders.length === 0 && (
          <div className="p-6 text-center text-gray-400">
            No Orders Found
          </div>
        )}

        {orders.map((order) => (

          <div
            key={order.id}
            className="grid grid-cols-5 items-center p-4 border-b hover:bg-gray-50 transition"
          >

            <div className="font-bold text-gray-800">
              #{order.id}
            </div>

            <div className="text-sm text-gray-600">
              {order.items?.map((i) => i.productName).join(", ")}
            </div>

            <div className="font-semibold text-green-600">
              ₹{order.totalAmount}
            </div>

            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div>
              <select
                value={order.status}
                disabled={updatingId === order.id}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="border rounded-lg p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                <option value="DELIVERED">DELIVERED</option>
              </select>
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}