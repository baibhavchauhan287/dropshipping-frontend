import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }: any) {

  return (

    <div className="flex min-h-screen bg-gray-100">

      <AdminSidebar />

      <div className="flex-1 flex flex-col">

        <AdminNavbar />

        <main className="p-8 flex-1">
          {children}
        </main>

      </div>

    </div>

  );

}