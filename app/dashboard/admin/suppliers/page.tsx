
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/app/components/admin/AdminLayout";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Search
} from "lucide-react";

interface Supplier {
  id: number;
  name: string;
  email: string;
  status: string;
}

export default function SuppliersPage() {

  const [suppliers,setSuppliers] = useState<Supplier[]>([]);
  const [filtered,setFiltered] = useState<Supplier[]>([]);
  const [loading,setLoading] = useState(true);

  const [search,setSearch] = useState("");
  const [statusFilter,setStatusFilter] = useState("ALL");

  const [actionLoading,setActionLoading] = useState<number | null>(null);

  const [page,setPage] = useState(1);
  const perPage = 6;

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;


  const loadSuppliers = async () => {

    try{

      const res = await axios.get(
        "http://localhost:8080/api/admin/suppliers",
        { headers:{ Authorization:`Bearer ${token}` } }
      );

      setSuppliers(res.data);
      setFiltered(res.data);

    }catch(err){
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(()=>{
    loadSuppliers();
  },[]);


  useEffect(()=>{

    let data = suppliers;

    if(search){
      data = data.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if(statusFilter !== "ALL"){
      data = data.filter(s => s.status === statusFilter);
    }

    setFiltered(data);
    setPage(1);

  },[search,statusFilter,suppliers]);


  const approveSupplier = async (id:number)=>{

    setActionLoading(id);

    await axios.put(
      `http://localhost:8080/api/admin/suppliers/${id}/approve`,
      {},
      { headers:{ Authorization:`Bearer ${token}` } }
    );

    await loadSuppliers();
    setActionLoading(null);
  };


  const rejectSupplier = async (id:number)=>{

    setActionLoading(id);

    await axios.put(
      `http://localhost:8080/api/admin/suppliers/${id}/reject`,
      {},
      { headers:{ Authorization:`Bearer ${token}` } }
    );

    await loadSuppliers();
    setActionLoading(null);
  };


  const statusBadge = (status:string)=>{

    if(status==="ACTIVE")
      return "bg-green-50 text-green-600 border border-green-200";

    if(status==="PENDING")
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";

    return "bg-red-50 text-red-600 border border-red-200";
  };


  const totalPages = Math.ceil(filtered.length/perPage);

  const pageData = filtered.slice(
    (page-1)*perPage,
    page*perPage
  );


  return(

    <AdminLayout>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Supplier Management
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Approve or reject supplier registrations
          </p>

        </div>

      </div>


      {/* FILTER BAR */}

      <div className="flex gap-4 mb-6">

        <div className="relative">

          <Search
            size={16}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            placeholder="Search suppliers..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 w-72 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />

        </div>


        <select
          value={statusFilter}
          onChange={(e)=>setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white"
        >

          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="REJECTED">Rejected</option>

        </select>

      </div>


      {/* TABLE */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">

        <table className="w-full text-sm">

          <thead className="bg-gray-50">

            <tr>

              <th className="p-4 text-left font-semibold text-gray-600">
                Supplier
              </th>

              <th className="p-4 text-left font-semibold text-gray-600">
                Email
              </th>

              <th className="p-4 text-left font-semibold text-gray-600">
                Status
              </th>

              <th className="p-4 text-right font-semibold text-gray-600">
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {loading && (

              <tr>

                <td colSpan={4} className="p-12 text-center text-gray-400">
                  Loading suppliers...
                </td>

              </tr>

            )}


            {!loading && pageData.map((s)=>(

              <tr
                key={s.id}
                className="border-t hover:bg-gray-50 transition"
              >

                {/* NAME */}

                <td className="p-4">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-semibold shadow ring-2 ring-white">
                      {s.name.charAt(0)}
                    </div>

                    <div>

                      <p className="font-semibold text-gray-900">
                        {s.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        ID: {s.id}
                      </p>

                    </div>

                  </div>

                </td>


                {/* EMAIL */}

                <td className="p-4 text-gray-600">
                  {s.email}
                </td>


                {/* STATUS */}

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(s.status)}`}
                  >
                    {s.status}
                  </span>

                </td>


                {/* ACTIONS */}

                <td className="p-4 text-right">

                  <div className="flex justify-end gap-2">

                    {s.status==="PENDING" && (

                      <>

                        <button
                          onClick={()=>approveSupplier(s.id)}
                          disabled={actionLoading===s.id}
                          className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-md text-xs hover:bg-green-700 transition"
                        >

                          {actionLoading===s.id
                            ? <Loader2 size={14} className="animate-spin"/>
                            : <CheckCircle size={14}/>
                          }

                          Approve

                        </button>


                        <button
                          onClick={()=>rejectSupplier(s.id)}
                          disabled={actionLoading===s.id}
                          className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-md text-xs hover:bg-red-700 transition"
                        >

                          <XCircle size={14}/>
                          Reject

                        </button>

                      </>

                    )}

                    {s.status==="ACTIVE" && (
                      <span className="text-green-600 text-xs font-medium">
                        Approved
                      </span>
                    )}

                    {s.status==="REJECTED" && (
                      <span className="text-red-600 text-xs font-medium">
                        Rejected
                      </span>
                    )}

                  </div>

                </td>

              </tr>

            ))}


            {!loading && filtered.length===0 && (

              <tr>

                <td colSpan={4} className="p-12 text-center text-gray-400">
                  No suppliers found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>


      {/* PAGINATION */}

      <div className="flex justify-between items-center mt-8">

        <p className="text-sm text-gray-500">
          Showing {pageData.length} of {filtered.length} suppliers
        </p>

        <div className="flex gap-2">

          <button
            onClick={()=>setPage(page-1)}
            disabled={page===1}
            className="px-3 py-1 border rounded-md text-sm disabled:opacity-40"
          >
            Prev
          </button>

          <button
            onClick={()=>setPage(page+1)}
            disabled={page===totalPages}
            className="px-3 py-1 border rounded-md text-sm disabled:opacity-40"
          >
            Next
          </button>

        </div>

      </div>

    </AdminLayout>

  );

}

