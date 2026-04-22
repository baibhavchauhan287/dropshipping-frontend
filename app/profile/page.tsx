"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Navbar from "@/app/components/Navbar";
import toast from "react-hot-toast";
import {
  User,
  Package,
  MapPin,
  Shield,
  Edit3,
  Save,
  X,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [tab, setTab] = useState("profile");
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/customer/profile");
      setUser(res.data);
      setName(res.data.name);
    } finally {
      setLoading(false);
    }
  };

  const update = async () => {
    try {
      setSaving(true);

      const res = await api.put("/api/customer/profile", { name });

      toast.success("Profile updated ✅");

      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...stored, name })
      );

      window.dispatchEvent(new Event("storage"));

      setUser(res.data);
      setEdit(false);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User, path: null },
    { id: "orders", label: "Orders", icon: Package, path: "/orders" },
    { id: "address", label: "Addresses", icon: MapPin, path: "/address" },
    { id: "security", label: "Security", icon: Shield, path: null },
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-5xl mx-auto p-6 animate-pulse">
          <div className="h-8 w-40 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-4 gap-4">
            <div className="h-40 bg-gray-200 rounded col-span-1"></div>
            <div className="h-60 bg-gray-200 rounded col-span-3"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* LEFT SIDEBAR */}
          <div className="bg-white rounded-2xl shadow p-4 h-fit">

            {/* USER INFO */}
            <div className="flex flex-col items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <p className="mt-2 font-semibold">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            {/* MENU */}
            <div className="space-y-2">
              {tabs.map((t) => {
                const Icon = t.icon;

                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (t.path) {
                        router.push(t.path);
                      } else {
                        setTab(t.id);
                      }
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      tab === t.id
                        ? "bg-indigo-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={16} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="md:col-span-3 bg-white rounded-2xl shadow p-6">

            {/* PROFILE TAB */}
            {tab === "profile" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Profile Details
                </h2>

                <div className="space-y-4">

                  {/* NAME */}
                  <div>
                    <label className="text-sm text-gray-500">Name</label>

                    {edit ? (
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border px-3 py-2 w-full rounded-lg mt-1"
                      />
                    ) : (
                      <p className="font-medium">{user?.name}</p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{user?.email}</p>
                  </div>

                  {/* BUTTONS */}
                  {!edit ? (
                    <button
                      onClick={() => setEdit(true)}
                      className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
                    >
                      <Edit3 size={16} /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={update}
                        disabled={saving}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        <Save size={16} />
                        {saving ? "Saving..." : "Save"}
                      </button>

                      <button
                        onClick={() => {
                          setEdit(false);
                          setName(user.name);
                        }}
                        className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg"
                      >
                        <X size={16} /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {tab === "orders" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  My Orders
                </h2>
                <p className="text-gray-500">
                  Redirecting to Orders page...
                </p>
              </div>
            )}

            {/* ADDRESS TAB */}
            {tab === "address" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Saved Addresses
                </h2>
                <p className="text-gray-500">
                  Redirecting to Address page...
                </p>
              </div>
            )}

            {/* SECURITY TAB */}
            {tab === "security" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Security Settings
                </h2>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>✔ Change Password (coming soon)</p>
                  <p>✔ Two-Factor Authentication (2FA)</p>
                  <p>✔ Login Activity Tracking</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}