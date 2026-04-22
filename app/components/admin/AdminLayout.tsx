"use client";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }: any) {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* NAVBAR */}
        <AdminNavbar />

        {/* MAIN CONTENT (SCROLLABLE ONLY THIS PART) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>

      </div>

    </div>
  );
}