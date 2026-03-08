"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function OAuthError() {

  const params = useSearchParams();
  const router = useRouter();

  const message = params.get("message");

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-xl shadow text-center">

        <h1 className="text-2xl font-bold text-red-500 mb-3">
          Login Failed
        </h1>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <button
          onClick={() => router.push("/login")}
          className="bg-indigo-600 text-white px-6 py-2 rounded"
        >
          Back to Login
        </button>

      </div>

    </div>

  );
}