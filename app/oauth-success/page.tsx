"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
}

export default function OAuthSuccess() {

  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {

    const token = params.get("token");

    if (token) {

      localStorage.setItem("accessToken", token);

      const decoded: DecodedToken = jwtDecode(token);

      setTimeout(() => {

        if (decoded.role === "ADMIN") {
          router.push("/dashboard/admin");
        } 
        else if (decoded.role === "SUPPLIER") {
          router.push("/dashboard/supplier");
        } 
        else {
          router.push("/dashboard/customer");
        }

      }, 1500);

    }

  }, [params, router]);

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-2xl shadow-xl text-center w-[400px]">

        <h1 className="text-3xl font-bold text-indigo-600 mb-6">
          DropShipPro
        </h1>

        <div className="flex justify-center mb-6">

          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>

        </div>

        <h2 className="text-xl font-semibold mb-2">
          Signing you in...
        </h2>

        <p className="text-gray-500 text-sm">
          Please wait while we securely connect your Google account.
        </p>

      </div>

    </div>

  );
}