"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Navbar from "@/app/components/Navbar";
import toast from "react-hot-toast";
import { Loader2, MapPin } from "lucide-react";

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

export default function AddressPage() {

  const [list, setList] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    addressLine: ""
  });

  const [errors, setErrors] = useState<any>({});

  // ================= LOAD =================
  const load = async () => {
    try {
      const res = await api.get("/api/customer/address");
      setList(res.data);
    } catch {
      toast.error("Failed to load addresses ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ================= VALIDATION =================
  const validate = () => {
    let newErrors: any = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Name is required";
    }

    if (!form.phone) {
      newErrors.phone = "Phone is required";
    } else if (!/^[6-9]\d{9}$/.test(form.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!form.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(form.pincode)) {
      newErrors.pincode = "Invalid pincode";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!form.addressLine.trim()) {
      newErrors.addressLine = "Address is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ================= ADD =================
  const add = async () => {
    if (!validate()) return;

    try {
      setActionLoading(-1);

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

      setErrors({});
      load();

    } catch {
      toast.error("Add failed ❌");
    } finally {
      setActionLoading(null);
    }
  };

  // ================= DELETE =================
  const del = async (id: number) => {
    try {
      setActionLoading(id);

      await api.delete(`/api/customer/address/${id}`);

      toast.success("Deleted 🗑");
      load();

    } catch {
      toast.error("Delete failed ❌");
    } finally {
      setActionLoading(null);
    }
  };

  // ================= DEFAULT =================
  const setDefault = async (id: number) => {
    try {
      setActionLoading(id);

      await api.put(`/api/customer/address/${id}/default`);

      toast.success("Default updated ⭐");
      load();

    } catch {
      toast.error("Failed ❌");
    } finally {
      setActionLoading(null);
    }
  };

  const inputClass = (field: string) =>
    `border p-2 rounded w-full ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="bg-gray-50 min-h-screen">

      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">

        <h1 className="text-2xl font-bold mb-6">My Addresses</h1>

        {/* ================= ADD FORM ================= */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">

          <h2 className="font-semibold mb-4">Add New Address</h2>

          <div className="grid md:grid-cols-2 gap-4">

            {/* NAME */}
            <div>
              <input
                placeholder="Full Name *"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                className={inputClass("fullName")}
              />
              {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
            </div>

            {/* PHONE */}
            <div>
              <input
                placeholder="Phone *"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className={inputClass("phone")}
              />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div>

            {/* PINCODE */}
            <div>
              <input
                placeholder="Pincode *"
                value={form.pincode}
                onChange={e => setForm({ ...form, pincode: e.target.value })}
                className={inputClass("pincode")}
              />
              {errors.pincode && <p className="text-red-500 text-xs">{errors.pincode}</p>}
            </div>

            {/* CITY */}
            <div>
              <input
                placeholder="City *"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                className={inputClass("city")}
              />
              {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
            </div>

            {/* STATE */}
            <input
              placeholder="State"
              value={form.state}
              onChange={e => setForm({ ...form, state: e.target.value })}
              className="border p-2 rounded"
            />

            {/* ADDRESS */}
            <div className="md:col-span-2">
              <input
                placeholder="Address Line *"
                value={form.addressLine}
                onChange={e => setForm({ ...form, addressLine: e.target.value })}
                className={inputClass("addressLine")}
              />
              {errors.addressLine && <p className="text-red-500 text-xs">{errors.addressLine}</p>}
            </div>

          </div>

          <button
            onClick={add}
            disabled={actionLoading === -1}
            className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded flex items-center gap-2 disabled:opacity-50"
          >
            {actionLoading === -1 && <Loader2 className="animate-spin" size={16} />}
            Add Address
          </button>

        </div>

        {/* ================= LIST ================= */}
        {loading ? (
          <p>Loading...</p>
        ) : list.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <MapPin className="mx-auto mb-2" />
            No addresses added yet
          </div>
        ) : (
          <div className="space-y-4">

            {list.map(a => (
              <div
                key={a.id}
                className="bg-white p-5 rounded-xl shadow flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold">{a.fullName}</p>
                  <p className="text-sm text-gray-600">{a.phone}</p>
                  <p className="mt-1 text-sm">
                    {a.addressLine}, {a.city}, {a.state} - {a.pincode}
                  </p>

                  {a.default && (
                    <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">

                  {!a.default && (
                    <button
                      onClick={() => setDefault(a.id)}
                      className="text-indigo-600 text-sm"
                    >
                      Set Default
                    </button>
                  )}

                  <button
                    onClick={() => del(a.id)}
                    className="text-red-500 text-sm flex items-center gap-1"
                  >
                    {actionLoading === a.id && (
                      <Loader2 size={14} className="animate-spin" />
                    )}
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}