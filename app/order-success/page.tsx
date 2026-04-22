export default function OrderSuccess() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">

      <h1 className="text-3xl font-bold text-green-600">
        🎉 Order Placed Successfully
      </h1>

      <p className="text-gray-500 mt-2">
        Thank you for shopping with us
      </p>

      <a href="/dashboard/customer" className="mt-4 text-indigo-600">
        Go to Home →
      </a>

    </div>
  );
}