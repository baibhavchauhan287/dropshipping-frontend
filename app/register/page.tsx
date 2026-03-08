import Link from "next/link";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-xl w-[500px] text-center">

        <h1 className="text-3xl font-bold mb-6">
          Join DropshippingPro
        </h1>

        <div className="space-y-4">

          <Link href="/register/customer">
            <button className="w-full bg-black text-white p-4 rounded-lg">
              Create Customer Account
            </button>
          </Link>

          <Link href="/register/supplier">
            <button className="w-full border border-black p-4 rounded-lg">
              Become a Supplier
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
}