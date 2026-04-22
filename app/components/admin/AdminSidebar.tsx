"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart,
  Layers,
  Truck,
  Menu,
  ChevronLeft
} from "lucide-react";

const menu = [
  {
    section: "MAIN",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard/admin" },
      { name: "Analytics", icon: BarChart, path: "/dashboard/admin/analytics" },
    ]
  },
  {
    section: "MANAGEMENT",
    items: [
      { name: "Users", icon: Users, path: "/dashboard/admin/users" },
      { name: "Suppliers", icon: Truck, path: "/dashboard/admin/suppliers" },
    ]
  },
  {
    section: "CATALOG",
    items: [
      { name: "Categories", icon: Layers, path: "/dashboard/admin/categories" },
      { name: "Products", icon: Package, path: "/dashboard/admin/products" },
    ]
  },
  {
    section: "SALES",
    items: [
      { name: "Orders", icon: ShoppingCart, path: "/dashboard/admin/orders" },
    ]
  }
];

export default function AdminSidebar() {

  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (

    <div className={`h-screen bg-gradient-to-b from-gray-950 to-gray-900 border-r border-gray-800 
    ${collapsed ? "w-20" : "w-64"} transition-all duration-300 flex flex-col`}>

      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">

        {!collapsed && (
          <h1 className="text-lg font-bold text-white tracking-wide">
             Dropship
          </h1>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white transition"
        >
          <ChevronLeft className={`${collapsed && "rotate-180"} transition`} />
        </button>

      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">

        {menu.map(group => (

          <div key={group.section}>

            {!collapsed && (
              <p className="text-[11px] text-gray-500 uppercase tracking-wider px-3 mb-2">
                {group.section}
              </p>
            )}

            <div className="space-y-1">

              {group.items.map(item => {

                const Icon = item.icon;
                const active = pathname.startsWith(item.path);

                return (

                  <Link
                    key={item.name}
                    href={item.path}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                    ${active
                      ? "bg-indigo-600/20 text-indigo-400 border-l-4 border-indigo-500"
                      : "hover:bg-gray-800 text-gray-300"
                    }`}
                  >

                    {/* ICON */}
                    <Icon size={18} />

                    {/* TEXT */}
                    {!collapsed && (
                      <span className="font-medium">
                        {item.name}
                      </span>
                    )}

                    {/* TOOLTIP */}
                    {collapsed && (
                      <span className="absolute left-14 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                        {item.name}
                      </span>
                    )}

                  </Link>

                );
              })}

            </div>

          </div>

        ))}

      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-800">

        {!collapsed ? (
          <div className="bg-gray-800 p-3 rounded-lg text-xs text-gray-400">
            Logged in as <br />
            <span className="text-white font-medium">
              Admin User
            </span>
          </div>
        ) : (
          <div className="text-center text-gray-500 text-xs">
            👤
          </div>
        )}

      </div>

    </div>
  );
}