"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white border-b">

      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          DropShip
        </Link>

        {/* Search */}
        <div className="flex-1 mx-10">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Menu */}
        <div className="flex items-center gap-6">

          <Link href="/products" className="hover:text-indigo-600">
            Products
          </Link>

          <Link href="/cart" className="hover:text-indigo-600">
            Cart
          </Link>

          <Link
            href="/login"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Login
          </Link>

        </div>

      </div>

    </header>
  );
}