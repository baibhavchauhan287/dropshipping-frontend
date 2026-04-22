"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "@/app/components/admin/AdminLayout";
import { Users, Package, ShoppingCart, Truck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {

  const router = useRouter();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSuppliers: 0,
    totalProducts: 0,
    totalOrders: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("accessToken");

    // ✅ TOKEN NAHI → LOGIN PAGE
    if (!token) {
      router.push("/login");
      return;
    }

    console.log("TOKEN:", token); // 🔥 DEBUG

    axios.get("http://localhost:8080/api/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      console.log("DASHBOARD DATA:", res.data); // 🔥 DEBUG
      setStats(res.data);
    })
    .catch((err) => {

      console.error("Dashboard API error:", err);

      // ❌ 403 → logout + redirect
      if (err.response?.status === 403) {
        localStorage.clear();
        router.push("/login");
      }

    })
    .finally(() => {
      setLoading(false);
    });

  }, []);

  const cards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users },
    { title: "Suppliers", value: stats.totalSuppliers, icon: Truck },
    { title: "Products", value: stats.totalProducts, icon: Package },
    { title: "Orders", value: stats.totalOrders, icon: ShoppingCart },
  ];

  return (

    <AdminLayout>

      <div className="grid grid-cols-4 gap-6">

        {cards.map((card, index) => {

          const Icon = card.icon;

          return (

            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition"
            >

              <div className="flex justify-between items-center">

                {/* TEXT */}
                <div>
                  <p className="text-gray-500 text-sm">
                    {card.title}
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    {loading ? "..." : card.value}
                  </h2>
                </div>

                {/* ICON */}
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Icon size={20} className="text-indigo-600" />
                </div>

              </div>

            </div>

          );
        })}

      </div>

    </AdminLayout>

  );
}