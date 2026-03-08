"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 mt-24">

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            DropShip
          </h2>

          <p className="text-gray-400 text-sm leading-6">
            Start your ecommerce journey with high quality
            dropshipping suppliers and trending products.
          </p>

          <div className="flex gap-4 mt-6 text-lg">
            <span className="cursor-pointer hover:text-white">🌐</span>
            <span className="cursor-pointer hover:text-white">📘</span>
            <span className="cursor-pointer hover:text-white">📷</span>
            <span className="cursor-pointer hover:text-white">🐦</span>
          </div>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Company
          </h3>

          <ul className="space-y-2 text-sm">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/careers">Careers</Link></li>
          </ul>
        </div>

        {/* Customer */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Customer
          </h3>

          <ul className="space-y-2 text-sm">
            <li><Link href="/account">My Account</Link></li>
            <li><Link href="/orders">Orders</Link></li>
            <li><Link href="/wishlist">Wishlist</Link></li>
            <li><Link href="/support">Support</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Subscribe
          </h3>

          <p className="text-sm text-gray-400 mb-4">
            Get latest products and offers directly in your inbox.
          </p>

          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 rounded-l bg-gray-800 border border-gray-700 text-sm"
            />

            <button className="bg-white text-black px-4 rounded-r text-sm font-medium">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} DropShip. All rights reserved.
      </div>

    </footer>
  );
}