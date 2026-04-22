"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  IndianRupee,
  ShoppingCart,
  Package,
  Users,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function DashboardPage() {

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
    chart: [],
    recentOrders: [],
  });

  // ================= LOAD DATA =================
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {

      const token = localStorage.getItem("accessToken");

      const res = await axios.get(
        "http://localhost:8080/api/supplier/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const apiData = res.data || {};

      setData({
        revenue: apiData.revenue || 0,
        orders: apiData.orders || 0,
        products: apiData.products || 0,
        customers: apiData.customers || 0,
        chart: apiData.chart || [],
        recentOrders: apiData.recentOrders || [],
      });

    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading Dashboard...
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Supplier Dashboard
        </h1>
        <p className="text-gray-500">
          Overview of your business performance
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard title="Revenue" value={`₹${data.revenue}`} icon={IndianRupee} color="green" />
        <StatCard title="Orders" value={data.orders} icon={ShoppingCart} color="blue" />
        <StatCard title="Products" value={data.products} icon={Package} color="purple" />
        <StatCard title="Customers" value={data.customers} icon={Users} color="orange" />

      </div>

      {/* ================= CHART ================= */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">

        <h2 className="text-lg font-semibold mb-4">
          Revenue Overview
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.chart || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>

      </div>

      {/* ================= ORDERS ================= */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

        <div className="p-6 border-b font-semibold text-lg">
          Recent Orders
        </div>

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>

            {(data?.recentOrders || []).length > 0 ? (

              data.recentOrders.map((order: any) => (

                <tr key={order.id} className="border-t hover:bg-gray-50">

                  <td className="p-4 font-medium">
                    #{order.id}
                  </td>

                  <td className="p-4">
                    {order.productName || "N/A"}
                  </td>

                  <td className="p-4 text-green-600 font-semibold">
                    ₹{order.amount || 0}
                  </td>

                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-600"
                        : order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-600"
                    }`}>
                      {order.status || "UNKNOWN"}
                    </span>
                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td colSpan={4} className="text-center p-6 text-gray-400">
                  No Orders Found
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}


// ================= COMPONENT =================
function StatCard({ title, value, icon: Icon, color }: any) {

  const colors: any = {
    green: "from-green-500 to-emerald-600",
    blue: "from-blue-500 to-indigo-600",
    purple: "from-purple-500 to-pink-500",
    orange: "from-orange-500 to-red-500",
  };

  return (
    <div className={`p-6 rounded-xl text-white shadow-lg bg-gradient-to-r ${colors[color]}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <h2 className="text-2xl font-bold mt-2">{value}</h2>
        </div>
        <Icon size={28} />
      </div>
    </div>
  );
}