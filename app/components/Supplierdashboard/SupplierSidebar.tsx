"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Settings
} from "lucide-react";

const menu = [
  { name: "Dashboard", href: "/dashboard/supplier", icon: LayoutDashboard },
  { name: "Products", href: "/dashboard/supplier/products", icon: Package },
  { name: "Orders", href: "/dashboard/supplier/orders", icon: ShoppingCart },
  { name: "Customers", href: "/dashboard/supplier/customers", icon: Users },
  { name: "Earnings", href: "/dashboard/supplier/earnings", icon: DollarSign },
  { name: "Settings", href: "/dashboard/supplier/settings", icon: Settings },
];

export default function Sidebar() {

  const pathname = usePathname();

  return (

    <aside className="w-64 min-h-screen bg-white border-r flex flex-col shadow-sm">

      {/* Logo */}

      <div className="p-6 text-2xl font-bold border-b">
        DropShip Pro
      </div>

      {/* Menu */}

      <nav className="flex-1 px-4 py-6 space-y-2">

        {menu.map((item) => {

          const Icon = item.icon;

          const isActive = pathname === item.href;

          return (

            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200
              
              ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }
              
              `}
            >

              <div
                className={`p-2 rounded-md
                  
                  ${
                    isActive
                      ? "bg-white/20"
                      : "bg-gray-100"
                  }
                  
                `}
              >

                <Icon size={18} />

              </div>

              {item.name}

            </Link>

          );

        })}

      </nav>

      {/* Footer */}

      <div className="p-4 border-t text-sm text-gray-500 text-center">
        © 2026 DropShip
      </div>

    </aside>

  );
}