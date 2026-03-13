"use client";

import { Bell, Search } from "lucide-react";

export default function AdminNavbar() {

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  return (

    <div className="bg-white border-b px-6 py-4 flex items-center justify-between">

      <div className="flex items-center gap-4">

        <div className="relative">

          <Search size={16} className="absolute left-3 top-3 text-gray-400" />

          <input
            placeholder="Search..."
            className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
          />

        </div>

      </div>

      <div className="flex items-center gap-6">

        <Bell size={20} className="text-gray-500 cursor-pointer" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
            A
          </div>
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>

      </div>

    </div>

  );
}