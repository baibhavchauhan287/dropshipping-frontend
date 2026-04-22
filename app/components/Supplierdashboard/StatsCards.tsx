import {
  IndianRupee,
  ShoppingCart,
  Package,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Revenue",
    value: "₹12,400",
    icon: IndianRupee,
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Orders",
    value: "342",
    icon: ShoppingCart,
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Products",
    value: "84",
    icon: Package,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Customers",
    value: "120",
    icon: Users,
    color: "from-orange-500 to-red-500",
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-4 gap-6">

      {stats.map((stat) => {

        const Icon = stat.icon;

        return (

          <div
            key={stat.title}
            className={`p-6 rounded-xl text-white shadow-lg bg-gradient-to-r ${stat.color}`}
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="text-sm opacity-90">
                  {stat.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {stat.value}
                </h2>

              </div>

              <Icon size={32} />

            </div>

          </div>

        );
      })}
    </div>
  );
}