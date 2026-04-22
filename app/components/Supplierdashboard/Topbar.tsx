"use client";

import { Bell, Plus, Search, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  role: string;
}

export default function Topbar() {

  const router = useRouter();

  const [search, setSearch] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // ✅ LOAD USER
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // ✅ CLOSE DROPDOWN OUTSIDE CLICK
  useEffect(() => {
    const handleClick = (e: any) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // 🔔 DUMMY NOTIFICATIONS
  const notifications = [
    "New order received",
    "Stock running low",
    "Payment credited ₹5000",
  ];

  // 🔍 SEARCH
  const handleSearch = (e: any) => {
    e.preventDefault();
    router.push(`/dashboard/supplier/search?q=${search}`);
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">

      <div className="flex items-center justify-between px-4 md:px-8 py-3">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          {/* MOBILE MENU */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <Menu />
          </button>

          <div>
            <h1 className="text-lg md:text-xl font-semibold">
              Supplier Dashboard
            </h1>
            <p className="hidden md:block text-xs text-gray-500">
              Manage your business
            </p>
          </div>

        </div>

        {/* CENTER SEARCH */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex relative w-1/3"
        >
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, orders..."
            className="w-full bg-gray-100 border rounded-full pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </form>

        {/* RIGHT */}
        <div className="flex items-center gap-4 md:gap-6">

          {/* ADD PRODUCT */}
          <button
            onClick={() => router.push("/dashboard/supplier/products/add")}
            className="hidden md:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition"
          >
            <Plus size={16} />
            Add Product
          </button>

          {/* 🔔 NOTIFICATIONS */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => setShowNotif(!showNotif)}>
              <Bell />
            </button>

            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {notifications.length}
              </span>
            )}

            {showNotif && (
              <div className="absolute right-0 mt-3 w-72 bg-white border rounded-xl shadow-lg animate-fade-in">

                <div className="p-3 font-semibold border-b">
                  Notifications
                </div>

                {notifications.map((n, i) => (
                  <div
                    key={i}
                    className="p-3 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {n}
                  </div>
                ))}

                <div className="text-center text-indigo-600 text-sm p-2 hover:bg-gray-50 cursor-pointer">
                  View All
                </div>
              </div>
            )}
          </div>

          {/* 👤 PROFILE */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 bg-indigo-600 text-white flex items-center justify-center rounded-full font-semibold">
                {firstLetter}
              </div>

              <span className="hidden md:block text-sm font-medium">
                {user?.name || "User"}
              </span>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-3 w-56 bg-white border rounded-xl shadow-lg">

                <div className="p-4 border-b">
                  <p className="font-semibold">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email}
                  </p>
                  <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded mt-1 inline-block">
                    {user?.role?.replace("ROLE_", "")}
                  </span>
                </div>

                <button
                  onClick={() => router.push("/profile")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  My Profile
                </button>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 text-sm"
                >
                  Logout
                </button>

              </div>
            )}
          </div>

        </div>

      </div>

      {/* 📱 MOBILE SEARCH */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full bg-gray-100 border rounded-full pl-10 pr-4 py-2"
          />
        </form>
      </div>

    </header>
  );
}