"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt_decode from "jwt-decode";

export default function AdminDashboard() {

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const decoded: any = jwt_decode(token);

    if (decoded.role !== "ADMIN") {
      router.push("/login");
    }
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>
    </div>
  );
}