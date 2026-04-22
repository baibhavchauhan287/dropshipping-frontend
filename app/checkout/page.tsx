"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Loader2, MapPin, CreditCard } from "lucide-react";

interface CartItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
}

interface Address {
  id: number;
  fullName: string;
  phone: string;
  pincode: string;
  city: string;
  state: string;
  addressLine: string;
  default: boolean;
}

export default function CheckoutPage() {

  const [cart, setCart] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [adding, setAdding] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    addressLine: ""
  });

  const router = useRouter();

  // ================= LOAD =================
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cartRes, addressRes] = await Promise.all([
        api.get("/api/customer/cart"),
        api.get("/api/customer/address")
      ]);

      setCart(cartRes.data);
      setAddresses(addressRes.data);

      const defaultAddr = addressRes.data.find((a: Address) => a.default);
      setSelectedAddress(defaultAddr || addressRes.data[0]);

    } catch {
      toast.error("Login required ❌");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  // ================= TOTAL =================
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // ================= VALIDATION =================
  const validate = () => {
    if (!form.fullName || !form.phone || !form.city || !form.pincode) {
      toast.error("Fill required fields ❌");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      toast.error("Invalid phone ❌");
      return false;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      toast.error("Invalid pincode ❌");
      return false;
    }

    return true;
  };

  // ================= ADD ADDRESS =================
  const addAddress = async () => {
    if (!validate()) return;

    try {
      setAdding(true);

      await api.post("/api/customer/address", form);

      toast.success("Address added ✅");

      setForm({
        fullName: "",
        phone: "",
        pincode: "",
        city: "",
        state: "",
        addressLine: ""
      });

      setShowForm(false);

      const updated = await api.get("/api/customer/address");
      setAddresses(updated.data);

      const last = updated.data[updated.data.length - 1];
      setSelectedAddress(last);

    } catch {
      toast.error("Failed ❌");
    } finally {
      setAdding(false);
    }
  };

  // ================= PLACE ORDER =================
  const placeOrder = async () => {

    if (!selectedAddress) {
      toast.error("Select address ❌");
      return;
    }

    try {
      setPlacing(true);

      const fullAddress = `
${selectedAddress.fullName},
${selectedAddress.addressLine},
${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode},
Mobile: ${selectedAddress.phone}
`;

      await api.post("/api/customer/orders/place", {
        address: fullAddress
      });

      toast.success("Order placed 🎉");

      setCart([]);
      router.push("/order-success");

    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Order failed ❌");
    } finally {
      setPlacing(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return <div className="p-10 animate-pulse">Loading checkout...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">

          {/* ADDRESS */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin />
                <h2 className="font-bold">Select Address</h2>
              </div>

              <button
                onClick={() => setShowForm(!showForm)}
                className="text-indigo-600 text-sm"
              >
                + Add New
              </button>
            </div>

            {/* FORM */}
            {showForm && (
              <div className="grid gap-3 mb-4 border p-4 rounded-xl">

                <input placeholder="Name"
                  value={form.fullName}
                  onChange={e => setForm({...form, fullName: e.target.value})}
                  className="border p-2 rounded"/>

                <input placeholder="Phone"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  className="border p-2 rounded"/>

                <input placeholder="Pincode"
                  value={form.pincode}
                  onChange={e => setForm({...form, pincode: e.target.value})}
                  className="border p-2 rounded"/>

                <input placeholder="City"
                  value={form.city}
                  onChange={e => setForm({...form, city: e.target.value})}
                  className="border p-2 rounded"/>

                <input placeholder="State"
                  value={form.state}
                  onChange={e => setForm({...form, state: e.target.value})}
                  className="border p-2 rounded"/>

                <input placeholder="Address"
                  value={form.addressLine}
                  onChange={e => setForm({...form, addressLine: e.target.value})}
                  className="border p-2 rounded"/>

                <button
                  onClick={addAddress}
                  disabled={adding}
                  className="bg-indigo-600 text-white py-2 rounded flex justify-center"
                >
                  {adding ? <Loader2 className="animate-spin"/> : "Save Address"}
                </button>

              </div>
            )}

            {/* ADDRESS LIST */}
            <div className="space-y-3">
              {addresses.map(a => (
                <div
                  key={a.id}
                  onClick={() => setSelectedAddress(a)}
                  className={`border p-4 rounded-xl cursor-pointer ${
                    selectedAddress?.id === a.id
                      ? "border-indigo-600 bg-indigo-50"
                      : ""
                  }`}
                >
                  <p className="font-semibold">{a.fullName}</p>
                  <p className="text-sm">{a.phone}</p>
                  <p className="text-sm">
                    {a.addressLine}, {a.city}, {a.state} - {a.pincode}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* PAYMENT */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard />
              <h2 className="font-bold">Payment</h2>
            </div>
            <div className="border p-3 rounded">
              Cash on Delivery
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="font-bold mb-4">Summary</h2>

          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.productName} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <hr className="my-4"/>

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={placeOrder}
            disabled={placing}
            className="w-full mt-4 bg-yellow-400 py-3 rounded"
          >
            {placing ? <Loader2 className="animate-spin"/> : "Place Order"}
          </button>

        </div>

      </div>

      <Footer />
    </div>
  );
}