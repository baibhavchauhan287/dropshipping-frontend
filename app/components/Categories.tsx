"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
  children?: Category[];
}

export default function Categories() {

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:8080";

  const getImage = (url: string) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/categories/tree");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="bg-gray-50 py-12">

      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">
            Shop by Category
          </h2>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        )}

        {/* CATEGORY GRID */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">

            {categories.map((cat) => (

              <div
                key={cat.id}
                className="group relative bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-xl transition duration-300 cursor-pointer"
              >

                {/* LINK */}
                <Link href={`/products?category=${cat.id}`}>

                  {/* IMAGE BOX */}
                  <div className="w-full h-24 flex items-center justify-center mb-3">

                    <img
                      src={getImage(cat.imageUrl ?? "")}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition duration-300"
                      onError={(e: any) => e.target.src = "/placeholder.png"}
                    />

                  </div>

                  {/* NAME */}
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                    {cat.name}
                  </p>

                </Link>

                {/* SUBCATEGORY */}
                {cat.children && cat.children.length > 0 && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block bg-white border shadow-2xl rounded-xl mt-3 w-56 z-50">

                    <div className="py-2">

                      {cat.children.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/products?category=${sub.id}`}
                          className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                        >
                          {sub.name}
                        </Link>
                      ))}

                    </div>

                  </div>
                )}

              </div>

            ))}

          </div>
        )}

      </div>

    </section>
  );
}