"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, PackagePlus } from "lucide-react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  children?: Category[];
}

export default function AddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
  });

  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [childCategories, setChildCategories] = useState<Category[]>([]);

  const [selectedParent, setSelectedParent] = useState("");
  const [selectedChild, setSelectedChild] = useState("");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  // ================= LOAD CATEGORY =================
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories/tree")
      .then((res) => setParentCategories(res.data))
      .catch(() => alert("Failed to load categories"))
      .finally(() => setPageLoading(false));
  }, []);

  // ================= INPUT =================
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= CATEGORY =================
  const handleParentChange = (e: any) => {
    const parentId = e.target.value;
    setSelectedParent(parentId);

    const parent = parentCategories.find(
      (p) => p.id === Number(parentId)
    );

    setChildCategories(parent?.children || []);
    setSelectedChild("");
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const categoryId = selectedChild || selectedParent;

    if (!categoryId) return alert("Please select category");
    if (!token) return alert("Please login");

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:8080/api/supplier/products",
        {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          stock: Number(form.stock),
          imageUrl: form.imageUrl,
          categoryId: Number(categoryId),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Product added successfully");
      router.push("/dashboard/supplier/products");

    } catch (err: any) {
      alert(err.response?.data || "Error ❌");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <Link
            href="/dashboard/supplier/products"
            className="flex items-center gap-2 text-indigo-600 text-sm mb-2 hover:underline"
          >
            <ArrowLeft size={16} /> Back
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">
            Add Product
          </h1>

          <p className="text-gray-500 text-sm">
            Create and manage your product details
          </p>
        </div>

        <div className="w-14 h-14 flex items-center justify-center bg-indigo-100 rounded-2xl shadow">
          <PackagePlus className="text-indigo-600" />
        </div>

      </div>

      {/* GRID */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* BASIC INFO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">

            <h2 className="text-lg font-semibold text-gray-800">
              Basic Info
            </h2>

            <input
              name="name"
              placeholder="Product name"
              value={form.name}
              onChange={handleChange}
              className="input"
            />

            <textarea
              name="description"
              placeholder="Product description"
              value={form.description}
              onChange={handleChange}
              className="input h-28"
            />

            <div className="grid md:grid-cols-2 gap-4">

              <select
                value={selectedParent}
                onChange={handleParentChange}
                className="input"
              >
                <option value="">Select Parent Category</option>
                {parentCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {childCategories.length > 0 && (
                <select
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className="input"
                >
                  <option value="">Select Sub Category</option>
                  {childCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}

            </div>

          </div>

          {/* PRICING */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">

            <h2 className="text-lg font-semibold text-gray-800">
              Pricing & Stock
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <input
                type="number"
                name="price"
                placeholder="Price ₹"
                onChange={handleChange}
                className="input"
              />

              <input
                type="number"
                name="stock"
                placeholder="Stock"
                onChange={handleChange}
                className="input"
              />

            </div>

          </div>

          {/* IMAGE */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">

            <h2 className="text-lg font-semibold mb-3">
              Product Image
            </h2>

            <input
              name="imageUrl"
              placeholder="Paste image URL"
              onChange={handleChange}
              className="input"
            />

          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow hover:scale-105 transition"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>

        </div>

        {/* RIGHT PREVIEW */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-6">

          <p className="text-sm text-gray-500 mb-3">
            Live Preview
          </p>

          <img
            src={form.imageUrl || "/placeholder.png"}
            className="w-full h-52 object-cover rounded-xl"
          />

          <h3 className="mt-4 font-semibold text-lg">
            {form.name || "Product Name"}
          </h3>

          <p className="text-sm text-gray-500">
            {form.description || "Description"}
          </p>

          <p className="mt-2 text-xl font-bold text-indigo-600">
            ₹{form.price || 0}
          </p>

        </div>

      </div>

      {/* GLOBAL INPUT STYLE */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #fafafa;
          transition: all 0.2s;
        }
        .input:focus {
          outline: none;
          border-color: #6366f1;
          background: white;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
      `}</style>

    </div>
  );
}