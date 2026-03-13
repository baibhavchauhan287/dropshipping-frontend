import AdminLayout from "@/app/components/admin/AdminLayout";
import { Users, Package, ShoppingCart, Truck } from "lucide-react";

export default function AdminDashboard() {

  const cards = [
    { title: "Total Users", value: "1,245", icon: Users },
    { title: "Suppliers", value: "87", icon: Truck },
    { title: "Products", value: "5,230", icon: Package },
    { title: "Orders", value: "2,430", icon: ShoppingCart },
  ];

  return (

    <AdminLayout>

      <div className="grid grid-cols-4 gap-6">

        {cards.map((card, index) => {

          const Icon = card.icon;

          return (

            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition"
            >

              <div className="flex justify-between items-center">

                <div>
                  <p className="text-gray-500 text-sm">
                    {card.title}
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    {card.value}
                  </h2>
                </div>

                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Icon size={20} className="text-indigo-600" />
                </div>

              </div>

            </div>

          );
        })}

      </div>

    </AdminLayout>

  );
}