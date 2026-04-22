"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {

  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // ================= HANDLE INPUT =================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= GOOGLE LOGIN =================
  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:8080/oauth2/authorization/google";
  };

  // ================= LOGIN SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setLoading(true);
    setError("");

    try {

      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 IMPORTANT (cookie receive karega)
        body: JSON.stringify(form),
      });

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Server error");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Invalid email or password");
      }

      if (!data.accessToken) {
        throw new Error("Login failed: Token not received");
      }

      // ================= STORE TOKEN =================
      localStorage.setItem("accessToken", data.accessToken);

      // ❌ REMOVED COOKIE (IMPORTANT FIX)

      // ================= STORE USER =================
      const userData = {
        name: data.name,
        email: data.email,
        role: data.role,
      };

      localStorage.setItem("user", JSON.stringify(userData));

      console.log("LOGIN SUCCESS:", data);

      // ================= REDIRECT =================
      if (data.role === "ROLE_ADMIN") {
        router.push("/dashboard/admin");
      } 
      else if (data.role === "ROLE_SUPPLIER") {
        router.push("/dashboard/supplier");
      } 
      else if (data.role === "ROLE_CUSTOMER") {
        router.push("/dashboard/customer");
      } 
      else {
        router.push("/");
      }

    } catch (err: any) {

      console.error("LOGIN ERROR:", err);
      setError(err.message || "Something went wrong");

    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (

    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white flex-col justify-center items-center px-20">

        <h1 className="text-6xl font-bold mb-6">
          Arts Connect
        </h1>

        <p className="text-lg text-indigo-100 text-center max-w-md mb-10">
          Discover winning products, manage suppliers, and scale your
          online business, all in one powerful platform.
        </p>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50 p-6">

        <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-2xl border">

          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Welcome Back
          </h2>

          <p className="text-gray-500 mb-6 text-center">
            Sign in to your account
          </p>

          {/* GOOGLE LOGIN */}
          <button
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 p-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5"
            />
            Continue with Google
          </button>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t"></div>
            <span className="mx-3 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t"></div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 rounded text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-sm text-gray-600">
                Email Address
              </label>

              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Password
              </label>

              <div className="relative">

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-sm text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>
            </div>

            <div className="flex justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>

              <a
                href="/forgot-password"
                className="text-indigo-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white p-3 rounded-lg font-semibold transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p className="text-center text-sm mt-6">
            New customer?{" "}
            <a
              href="/register/customer"
              className="text-indigo-600 font-semibold"
            >
              Create account
            </a>
          </p>

          <p className="text-center text-sm mt-2">
            Want to sell products?{" "}
            <a
              href="/register/supplier"
              className="text-indigo-600 font-semibold"
            >
              Register as supplier
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}