"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";

export default function CustomerRegister() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleGoogleSignup = () => {
    window.location.href =
      "http://localhost:8080/oauth2/authorization/google";
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/register/customer",
        form
      );

      setSuccessMsg(
        res.data.message || "Your account has been created successfully."
      );

      setForm({
        name: "",
        email: "",
        mobile: "",
        password: "",
      });

    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white flex-col justify-center items-center px-20">

  <h1 className="text-5xl font-bold mb-6">
    DropShipPro
  </h1>

  <p className="text-2xl text-indigo-100 text-center max-w-md mb-8">
    Create an account to enjoy a faster and better shopping experience.
  </p>

  {/* CUSTOMER BENEFITS */}

  <div className="space-y-4 text-indigo-100 mb-10 text-lg">

    <p>✔ Track your orders easily</p>

    <p>✔ Save your favorite products</p>

    <p>✔ Faster checkout</p>

    <p>✔ Get latest product updates</p>

  </div>

  <img
    src="/dropshipping-illustration.png"
    className="w-[420px]"
  />

</div>


      {/* RIGHT FORM */}

      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50 p-6">

        <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl border">

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h2>

          <p className="text-gray-500 mb-6">
            Sign up to start shopping.
          </p>


          {/* GOOGLE SIGNUP */}

          <button
            onClick={handleGoogleSignup}
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

            <span className="mx-3 text-gray-400 text-sm">
              OR
            </span>

            <div className="flex-grow border-t"></div>

          </div>


          {successMsg && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 rounded text-sm">
              {errorMsg}
            </div>
          )}


          {/* FORM */}

          <form onSubmit={handleSubmit} className="space-y-4">


            {/* NAME */}

            <div className="relative">

              <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />

              <input
                name="name"
                placeholder="Full name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 pl-10 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />

            </div>


            {/* EMAIL */}

            <div className="relative">

              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />

              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 pl-10 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />

            </div>


            {/* MOBILE */}

            <div className="relative">

              <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />

              <input
                name="mobile"
                placeholder="Mobile number"
                value={form.mobile}
                onChange={handleChange}
                className="w-full border border-gray-300 pl-10 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />

            </div>


            {/* PASSWORD */}

            <div className="relative">

              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 pl-10 pr-10 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>

            </div>


            {/* BUTTON */}

            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

          </form>


          {/* LOGIN */}

          <p className="text-center text-sm mt-6">

            Already have an account?{" "}

            <Link
              href="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}