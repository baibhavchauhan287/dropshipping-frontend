"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart
} from "lucide-react";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard/admin" },
  { name: "Users", icon: Users, path: "/dashboard/admin/users" },
  { name: "Suppliers", icon: Users, path: "/dashboard/admin/suppliers" },
  { name: "Products", icon: Package, path: "/dashboard/admin/products" },
  { name: "Orders", icon: ShoppingCart, path: "/dashboard/admin/orders" },
  { name: "Analytics", icon: BarChart, path: "/dashboard/admin/analytics" },
];

export default function AdminSidebar() {

  const pathname = usePathname();

  return (

    <div className="w-64 bg-gray-950 text-gray-300 min-h-screen flex flex-col">

      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">
          Dropship Admin
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">

        {menu.map((item) => {

          const Icon = item.icon;
          const active = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
              ${active
                ? "bg-indigo-600 text-white"
                : "hover:bg-gray-800"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}

      </nav>

    </div>
  );
}