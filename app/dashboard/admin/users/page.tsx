"use client";

import { useEffect, useState, Fragment } from "react";
import AdminLayout from "@/app/components/admin/AdminLayout";
import axios from "axios";
import {
  Search,
  MoreVertical,
  Users,
  UserCheck,
  Truck
} from "lucide-react";

import { Menu, Transition } from "@headlessui/react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function UsersPage() {

  const [users,setUsers] = useState<User[]>([]);
  const [search,setSearch] = useState("");
  const [loading,setLoading] = useState(true);

  const [page,setPage] = useState(1);
  const perPage = 6;

  useEffect(()=>{

    const token = localStorage.getItem("accessToken");

    if(!token){
      setLoading(false);
      return;
    }

    axios.get("http://localhost:8080/api/admin/users",{
      headers:{ Authorization:`Bearer ${token}` }
    })
    .then(res=>{
      setUsers(res.data);
      setLoading(false);
    })
    .catch(()=>{
      setLoading(false);
    });

  },[]);

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length/perPage);

  const pageData = filteredUsers.slice(
    (page-1)*perPage,
    page*perPage
  );

  const roleBadge = (role:string)=>{

    if(role==="ADMIN")
      return "bg-red-50 text-red-600 border border-red-200";

    if(role==="SUPPLIER")
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";

    return "bg-green-50 text-green-700 border border-green-200";

  }

  const statusBadge = (status:string)=>{

    if(status==="ACTIVE")
      return "bg-green-50 text-green-700 border border-green-200";

    if(status==="PENDING")
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";

    return "bg-red-50 text-red-700 border border-red-200";

  }

  return(

    <AdminLayout>

{/* HEADER */}

<div className="flex items-center justify-between mb-10">

<div>

<h1 className="text-3xl font-bold text-gray-900">
Users
</h1>

<p className="text-sm text-gray-500 mt-1">
Manage all platform users
</p>

</div>

<div className="relative">

<Search size={16} className="absolute left-3 top-3 text-gray-400"/>

<input
placeholder="Search users..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="pl-9 pr-4 py-2.5 w-72 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
/>

</div>

</div>


{/* STATS */}

<div className="grid grid-cols-3 gap-6 mb-10">

<div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

<div className="flex justify-between">

<div>

<p className="text-sm text-gray-500">
Total Users
</p>

<h2 className="text-3xl font-bold mt-2">
{users.length}
</h2>

</div>

<div className="p-3 bg-indigo-100 rounded-xl">
<Users className="text-indigo-600"/>
</div>

</div>

</div>


<div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

<div className="flex justify-between">

<div>

<p className="text-sm text-gray-500">
Active Users
</p>

<h2 className="text-3xl font-bold mt-2">
{users.filter(u=>u.status==="ACTIVE").length}
</h2>

</div>

<div className="p-3 bg-green-100 rounded-xl">
<UserCheck className="text-green-600"/>
</div>

</div>

</div>


<div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

<div className="flex justify-between">

<div>

<p className="text-sm text-gray-500">
Suppliers
</p>

<h2 className="text-3xl font-bold mt-2">
{users.filter(u=>u.role==="SUPPLIER").length}
</h2>

</div>

<div className="p-3 bg-yellow-100 rounded-xl">
<Truck className="text-yellow-700"/>
</div>

</div>

</div>

</div>


{/* USERS TABLE */}

<div className="bg-white rounded-2xl border border-gray-100 shadow-sm">

<table className="w-full text-sm">

<thead className="bg-gray-50">

<tr>

<th className="p-4 text-left font-semibold text-gray-600">
User
</th>

<th className="p-4 text-left font-semibold text-gray-600">
Role
</th>

<th className="p-4 text-left font-semibold text-gray-600">
Status
</th>

<th className="p-4 text-right font-semibold text-gray-600">
Action
</th>

</tr>

</thead>

<tbody>

{loading && (

<tr>
<td colSpan={4} className="p-12 text-center text-gray-400">
Loading users...
</td>
</tr>

)}

{!loading && pageData.map((u)=>(

<tr
key={u.id}
className="border-t hover:bg-gray-50 transition"
>

<td className="p-4">

<div className="flex items-center gap-3">

<div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-semibold shadow ring-2 ring-white">
{u.name.charAt(0)}
</div>

<div>

<p className="font-semibold text-gray-900">
{u.name}
</p>

<p className="text-xs text-gray-500">
{u.email}
</p>

</div>

</div>

</td>


<td className="p-4">

<span className={`px-3 py-1 rounded-full text-xs font-medium ${roleBadge(u.role)}`}>
{u.role}
</span>

</td>


<td className="p-4">

<span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(u.status)}`}>
{u.status}
</span>

</td>


<td className="p-4 text-right relative">

<Menu as="div" className="relative inline-block">

<Menu.Button className="p-2 hover:bg-gray-100 rounded-lg">
<MoreVertical size={18}/>
</Menu.Button>

<Transition
as={Fragment}
enter="transition ease-out duration-100"
enterFrom="transform opacity-0 scale-95"
enterTo="transform opacity-100 scale-100"
leave="transition ease-in duration-75"
leaveFrom="transform opacity-100 scale-100"
leaveTo="transform opacity-0 scale-95"
>

<Menu.Items className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-xl text-sm z-50">

<Menu.Item>
{({active})=>(
<button className={`block w-full text-left px-4 py-2 ${active && "bg-gray-100"}`}>
View
</button>
)}
</Menu.Item>

<Menu.Item>
{({active})=>(
<button className={`block w-full text-left px-4 py-2 ${active && "bg-gray-100"}`}>
Edit
</button>
)}
</Menu.Item>

<Menu.Item>
{({active})=>(
<button className={`block w-full text-left px-4 py-2 text-red-600 ${active && "bg-red-50"}`}>
Delete
</button>
)}
</Menu.Item>

</Menu.Items>

</Transition>

</Menu>

</td>

</tr>

))}

</tbody>

</table>

</div>


{/* PAGINATION */}

<div className="flex justify-between items-center mt-8">

<p className="text-sm text-gray-500">
Showing {pageData.length} of {users.length} users
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