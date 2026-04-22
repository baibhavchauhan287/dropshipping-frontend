"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function OAuthSuccessClient() {
  const params = useSearchParams();
  const router = useRouter();

  const token = params.get("token");

  useEffect(() => {
    if (token) {
      // ✅ Save token (choose one method)

      // 1. LocalStorage (simple)
      localStorage.setItem("token", token);

      // 2. OR Cookie (better for auth)
      // document.cookie = `token=${token}; path=/`;

      // Redirect after login
      router.push("/");
    } else {
      router.push("/login");
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">Logging you in...</p>
    </div>
  );
}