"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryName: string;
  status: string;
}

interface Token {
  sub: string;
  role: string;
  exp: number;
}

export default function SupplierProductsPage() {

  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 6;

  // GET TOKEN
  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  // AUTH CHECK
  useEffect(() => {

    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded: Token = jwtDecode(token);

      //  Expiry check
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        router.push("/login");
        return;
      }

      // FIX: ROLE CHECK (IMPORTANT)
      if (decoded.role !== "ROLE_SUPPLIER") {
        router.push("/login");
        return;
      }

      loadProducts(token);

    } catch (err) {
      console.error("Token error:", err);
      router.push("/login");
    }

  }, []);

  // LOAD PRODUCTS
  const loadProducts = async (token: string) => {
    try {

      const res = await axios.get(
        "http://localhost:8080/api/supplier/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Products:", res.data);

      setProducts(res.data);

    } catch (error: any) {

      console.error("API ERROR:", error.response || error);

      if (error.response?.status === 401) {
        localStorage.clear();
        router.push("/login");
      } else if (error.response?.status === 403) {
        setErrorMsg("Access denied (SUPPLIER only)");
      } else {
        setErrorMsg("Failed to load products");
      }

    } finally {
      setLoading(false);
    }
  };

  // 🗑 DELETE PRODUCT
  const handleDelete = async (id: number) => {

    const token = getToken();
    if (!token) return;

    if (!confirm("Delete this product?")) return;

    try {

      setActionLoading(id);

      await axios.delete(
        `http://localhost:8080/api/supplier/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(prev => prev.filter(p => p.id !== id));

    } catch (error: any) {

      console.error("DELETE ERROR:", error.response || error);

      if (error.response?.status === 401) {
        localStorage.clear();
        router.push("/login");
      } else {
        alert("Delete failed");
      }

    } finally {
      setActionLoading(null);
    }
  };

  // SEARCH FILTER
  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const totalPages = Math.ceil(filteredProducts.length / perPage);

  const pageData = filteredProducts.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Products</h1>

        <Link
          href="/dashboard/supplier/products/add"
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl"
        >
          <Plus size={18}/> Add Product
        </Link>
      </div>

      <input
        placeholder="Search..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="w-full p-3 border rounded-xl"
      />

      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      <div className="bg-white rounded-xl overflow-hidden border">
        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-10">
                  Loading...
                </td>
              </tr>
            ) : pageData.map(p => (
              <tr key={p.id} className="border-t">

                <td className="p-4 flex gap-3">
                  <img
                    src={p.imageUrl || "/placeholder.png"}
                    className="w-12 h-12 rounded"
                  />
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.description}</p>
                  </div>
                </td>

                <td className="p-4">{p.categoryName}</td>
                <td className="p-4">₹{p.price}</td>

                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    p.stock === 0
                      ? "bg-red-100 text-red-600"
                      : p.stock <= 5
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-600"
                  }`}>
                    {p.stock}
                  </span>
                </td>

                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    p.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : p.status === "APPROVED"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {p.status}
                  </span>
                </td>

                <td className="p-4 text-right space-x-2">

                  <button className="px-3 py-1 border rounded">
                    <Pencil size={14}/>
                  </button>

                  <button
                    onClick={()=>handleDelete(p.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    {actionLoading === p.id ? "..." : <Trash2 size={14}/>}
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      <div className="flex justify-between">

        <button
          onClick={()=>setPage(page-1)}
          disabled={page===1}
        >Prev</button>

        <button
          onClick={()=>setPage(page+1)}
          disabled={page===totalPages}
        >Next</button>

      </div>

    </div>
  );
}