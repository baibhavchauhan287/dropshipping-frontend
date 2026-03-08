"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function SupplierRegister() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/register/supplier",
        form
      );

      setSuccessMsg(
        res.data.message ||
        "Registration submitted successfully. Awaiting admin approval."
      );

      setForm({ name: "", email: "", mobile: "", password: "" });

    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.message || "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Premium Branding Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-green-600 via-teal-600 to-emerald-500 text-white items-center justify-center p-16">
        <div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Grow With Global Sellers
          </h1>
          <p className="text-lg opacity-90">
            Join our trusted supplier network and unlock worldwide demand.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-10 bg-gray-50">

        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">

          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            Supplier Signup
          </h2>

          <p className="text-gray-500 mb-6">
            Become a verified supplier partner.
          </p>

          {/* Success Message */}
          {successMsg && (
            <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              {successMsg}
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              name="name"
              placeholder="Company Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              name="email"
              type="email"
              placeholder="Business Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              name="mobile"
              placeholder="Contact Number"
              value={form.mobile}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />

            <button
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold transition duration-200 shadow-md"
            >
              {loading ? "Submitting Application..." : "Register as Supplier"}
            </button>

          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Already registered?{" "}
            <Link
              href="/login"
              className="text-green-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}