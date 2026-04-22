"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api"; // 
import AdminLayout from "@/app/components/admin/AdminLayout";
import {
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

type TabType = "PENDING" | "APPROVED" | "REJECTED";

export default function AdminProductsPage() {

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("PENDING");

  // ================= LOAD =================
  const loadProducts = async (status: TabType) => {
    try {
      setLoading(true);

      const res = await api.get(`/api/admin/products?status=${status}`); 

      setProducts(res.data);

    } catch (err: any) {

      console.error("ERROR:", err);

      alert(
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to load products"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(activeTab);
  }, [activeTab]);

  // ================= ACTIONS =================
  const approve = async (id: number) => {
    try {
      setActionLoading(id);

      await api.put(`/api/admin/products/${id}/approve`); 

      loadProducts(activeTab);

    } catch (err: any) {
      alert(err.response?.data || "Approve failed");
    } finally {
      setActionLoading(null);
    }
  };

  const reject = async (id: number) => {
    try {
      setActionLoading(id);

      await api.put(`/api/admin/products/${id}/reject`); 

      loadProducts(activeTab);

    } catch (err: any) {
      alert(err.response?.data || "Reject failed");
    } finally {
      setActionLoading(null);
    }
  };

  // ================= UI =================
  return (
    <AdminLayout>

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Product Moderation
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage and approve supplier products
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6">

        {["PENDING", "APPROVED", "REJECTED"].map((tab) => (

          <button
            key={tab}
            onClick={() => setActiveTab(tab as TabType)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            {tab}
          </button>

        ))}

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="text-left">Price</th>
              <th className="text-left">Status</th>
              <th className="text-right pr-4">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading && (
              <tr>
                <td colSpan={4} className="text-center p-10 text-gray-400">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-10 text-gray-400">
                  No {activeTab} products
                </td>
              </tr>
            )}

            {!loading && products.map((p) => (

              <tr key={p.id} className="border-t hover:bg-gray-50">

                {/* PRODUCT */}
                <td className="p-4">
                  <div className="flex items-center gap-3">

                    <img
                      src={
                        p.imageUrl
                          ? `http://localhost:8080${p.imageUrl}`
                          : "https://via.placeholder.com/50"
                      }
                      className="w-12 h-12 rounded-lg object-cover border"
                    />

                    <div>
                      <p className="font-semibold text-gray-900">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {p.id}
                      </p>
                    </div>

                  </div>
                </td>

                {/* PRICE */}
                <td>₹{p.price}</td>

                {/* STATUS */}
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        p.status === "APPROVED"
                          ? "bg-green-100 text-green-600"
                          : p.status === "REJECTED"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    `}
                  >
                    {p.status}
                  </span>
                </td>

                {/* ACTION */}
                <td className="text-right pr-4">

                  {p.status === "PENDING" && (

                    <div className="flex justify-end gap-2">

                      <button
                        onClick={() => approve(p.id)}
                        disabled={actionLoading === p.id}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs"
                      >
                        {actionLoading === p.id
                          ? <Loader2 size={14} className="animate-spin"/>
                          : <CheckCircle size={14}/>
                        }
                        Approve
                      </button>

                      <button
                        onClick={() => reject(p.id)}
                        disabled={actionLoading === p.id}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs"
                      >
                        <XCircle size={14}/>
                        Reject
                      </button>

                    </div>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AdminLayout>
  );
}