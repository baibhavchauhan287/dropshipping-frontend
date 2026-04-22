

import Sidebar from "@/app/components/Supplierdashboard/SupplierSidebar";
import Topbar from "@/app/components/Supplierdashboard/Topbar";

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Topbar />

        <main className="p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}