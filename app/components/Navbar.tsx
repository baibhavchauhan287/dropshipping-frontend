"use client";

import Link from "next/link";
import {
  ShoppingCart,
  User,
  LogOut,
  Heart,
  Menu,
  X
} from "lucide-react";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Navbar() {

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ================= USER =================
  const loadUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        if (!parsedUser.name && parsedUser.email) {
          parsedUser.name = parsedUser.email.split("@")[0];
        }

        setUser(parsedUser);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  // ================= CART =================
  const loadCart = async () => {
    try {
      const res = await api.get("/api/customer/cart");

      const total = res.data.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );

      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  };

  // ================= WISHLIST =================
  const loadWishlist = async () => {
    try {
      const res = await api.get("/api/customer/wishlist");
      setWishlistCount(res.data.length);
    } catch {
      setWishlistCount(0);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();

    setUser(null);
    setCartCount(0);
    setWishlistCount(0);

    router.push("/login");

    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  // ================= OUTSIDE CLICK =================
  useEffect(() => {
    const handleClick = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ================= INIT =================
  useEffect(() => {
    loadUser();
    loadCart();
    loadWishlist();

    window.addEventListener("cartUpdated", loadCart);
    window.addEventListener("wishlistUpdated", loadWishlist);
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
      window.removeEventListener("wishlistUpdated", loadWishlist);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const firstName =
    user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "User";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

        {/* LOGO */}
        <Link href="/dashboard/customer" className="text-xl font-bold text-indigo-600">
          Madhubani Arts Connect
        </Link>

        {/* SEARCH (Desktop only) */}
        <div className="hidden md:block flex-1 mx-6">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6">

            <Link href="/products" className="hover:text-indigo-600">
              Shop
            </Link>

            {/* ❤️ Wishlist */}
            <Link href="/wishlist" className="relative">
              <Heart className="w-6 h-6 text-pink-500" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-1.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* 🛒 Cart */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* USER */}
            {!user ? (
              <Link
                href="/login"
                className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg"
              >
                Login
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg"
                >
                  <User size={16} />
                  <span className="text-sm">{firstName}</span>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">

                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm flex items-center gap-2"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>

                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden"
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="md:hidden bg-white border-t p-4 space-y-4">

          <input
            type="text"
            placeholder="Search..."
            className="w-full border rounded-lg px-4 py-2"
          />

          <Link href="/products" className="block">Products</Link>
          <Link href="/wishlist" className="block">Wishlist ({wishlistCount})</Link>
          <Link href="/cart" className="block">Cart ({cartCount})</Link>

          {!user ? (
            <Link
              href="/login"
              className="block bg-indigo-600 text-white text-center py-2 rounded"
            >
              Login
            </Link>
          ) : (
            <>
              <Link href="/profile" className="block">Profile</Link>
              <button
                onClick={handleLogout}
                className="block text-red-500"
              >
                Logout
              </button>
            </>
          )}

        </div>
      )}

    </header>
  );
}