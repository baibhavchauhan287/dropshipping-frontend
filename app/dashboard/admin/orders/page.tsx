"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import AdminLayout from "@/app/components/admin/AdminLayout";

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const res = await api.get("/api/admin/orders");
    setOrders(res.data);
    setFiltered(res.data);
  };

  // 🔍 SEARCH
  useEffect(() => {
    const result = orders.filter((o) =>
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.orderNumber?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, orders]);

  // 📊 STATS
  const total = orders.length;
  const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pending = orders.filter(o => o.status === "PENDING").length;

  const badge = (status) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-700";
      case "CONFIRMED": return "bg-blue-100 text-blue-700";
      case "SHIPPED": return "bg-purple-100 text-purple-700";
      case "DELIVERED": return "bg-green-100 text-green-700";
      default: return "bg-gray-100";
    }
  };

  return (
    <AdminLayout>

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Orders Dashboard</h1>
        <p className="text-gray-500">Manage all customer orders</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-4 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Revenue</p>
          <h2 className="text-2xl font-bold text-green-600">
            ₹{revenue}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Pending</p>
          <h2 className="text-2xl font-bold text-yellow-600">
            {pending}
          </h2>
        </div>

      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          placeholder="Search order / customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">

        <div className="grid grid-cols-6 bg-gray-100 p-3 text-sm font-semibold">
          <div>Order</div>
          <div>Customer</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Date</div>
          <div></div>
        </div>

        {filtered.map((order) => (

          <div key={order.id}>

            {/* MAIN ROW */}
            <div
              className="grid grid-cols-6 p-3 border-b hover:bg-gray-50 cursor-pointer"
              onClick={() =>
                setExpanded(expanded === order.id ? null : order.id)
              }
            >
              <div>
                <p className="font-semibold">#{order.id}</p>
                <p className="text-xs text-gray-400">
                  {order.orderNumber}
                </p>
              </div>

              <div>
                <p>{order.customerName}</p>
                <p className="text-xs text-gray-400">
                  {order.customerEmail}
                </p>
              </div>

              <div className="font-semibold text-green-600">
                ₹{order.totalAmount}
              </div>

              <div>
                <span className={`px-2 py-1 rounded text-xs ${badge(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>

              <div
                className="text-indigo-600 text-sm cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOrder(order);
                }}
              >
                View
              </div>
            </div>

            {/* EXPAND */}
            {expanded === order.id && (
              <div className="bg-gray-50 p-4 border-b">
                <h4 className="font-semibold mb-2">Products</h4>

                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between border p-2 mb-2 rounded">
                    <div>
                      {item.productName} × {item.quantity}
                      {/* 🔥 SUPPLIER (SMALL ADD) */}
                      <p className="text-xs text-indigo-500">
                        {item.supplierName}
                      </p>
                    </div>
                    <div>₹{item.price}</div>
                  </div>
                ))}
              </div>
            )}

          </div>

        ))}

      </div>

      {/* MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

          <div className="bg-white w-[700px] rounded-xl shadow-xl p-6 relative">

            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-2">
              Order #{selectedOrder.id}
            </h2>

            <p className="text-gray-500 mb-4">
              {selectedOrder.orderNumber}
            </p>

            {/* CUSTOMER */}
            <div className="mb-4">
              <p className="font-semibold">Customer</p>
              <p>{selectedOrder.customerName}</p>
              <p className="text-sm text-gray-400">
                {selectedOrder.customerEmail}
              </p>
            </div>

            {/* PRODUCTS */}
            <div>
              <p className="font-semibold mb-2">Products</p>

              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between border p-2 mb-2 rounded">
                  <div>
                    {item.productName} × {item.quantity}

                    {/* 🔥 SUPPLIER INFO (NO UI CHANGE) */}
                    <p className="text-xs text-indigo-500">
                      Supplier: {item.supplierName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.supplierEmail}
                    </p>

                  </div>

                  <div className="text-green-600">
                    ₹{item.price}
                  </div>
                </div>
              ))}

            </div>

            {/* TOTAL */}
            <div className="flex justify-between mt-4 font-bold text-lg">
              <span>Total</span>
              <span>₹{selectedOrder.totalAmount}</span>
            </div>

          </div>

        </div>
      )}

    </AdminLayout>
  );
}