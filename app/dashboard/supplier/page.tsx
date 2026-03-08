"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function SupplierDashboard() {

  const router = useRouter();

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {

      const decoded: any = jwtDecode(token);

      if (decoded.role !== "SUPPLIER") {
        router.push("/login");
      }

    } catch (error) {

      console.log("Invalid token");
      router.push("/login");

    }

  }, [router]);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Supplier Dashboard
      </h1>
    </div>
  );
}