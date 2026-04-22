export default function OrdersTable() {

  const orders = [
    { id: "#1001", product: "Wireless Headphones", price: "₹1200", status: "Shipped" },
    { id: "#1002", product: "Smart Watch", price: "₹800", status: "Pending" },
  ];

  return (

    <div className="bg-white rounded-xl shadow-lg">

      <div className="p-6 border-b font-semibold text-lg">
        Recent Orders
      </div>

      <table className="w-full text-left">

        <thead className="bg-gray-50">

          <tr>

            <th className="p-4">Order ID</th>
            <th className="p-4">Product</th>
            <th className="p-4">Price</th>
            <th className="p-4">Status</th>

          </tr>

        </thead>

        <tbody>

          {orders.map((order) => (

            <tr key={order.id} className="border-t hover:bg-gray-50">

              <td className="p-4 font-medium">
                {order.id}
              </td>

              <td className="p-4">
                {order.product}
              </td>

              <td className="p-4">
                {order.price}
              </td>

              <td className="p-4">

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "Shipped"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >

                  {order.status}

                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}