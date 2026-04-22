"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/app/components/admin/AdminLayout";
import axios from "axios";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
  parentId?: number;
  children?: Category[];
}

export default function CategoryPage() {

  const API = "http://localhost:8080/api/categories";

  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [expanded, setExpanded] = useState<{[key:number]:boolean}>({});

  const [form, setForm] = useState({
    name: "",
    imageUrl: "",
    parentId: "" as number | ""
  });

  const [editId, setEditId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);

  // ================= LOAD =================
  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/tree`);
      setCategories(res.data);

      // expand all by default
      const map:any = {};
      const loop = (list:Category[])=>{
        list.forEach(c=>{
          map[c.id]=true;
          if(c.children) loop(c.children);
        });
      };
      loop(res.data);
      setExpanded(map);

    } catch {
      alert("Failed to load ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    loadCategories();
  },[]);

  // ================= SAVE =================
  const handleSave = async (e:any)=>{
    e.preventDefault();

    const payload = {
      ...form,
      parentId: form.parentId || null
    };

    if(editId){
      await axios.put(`${API}/${editId}`, payload);
    }else{
      await axios.post(API, payload);
    }

    reset();
    loadCategories();
  };

  const reset = ()=>{
    setForm({name:"",imageUrl:"",parentId:""});
    setEditId(null);
    setOpenModal(false);
  };

  const handleDelete = async(id:number)=>{
    if(!confirm("Delete?")) return;
    await axios.delete(`${API}/${id}`);
    loadCategories();
  };

  const openEdit = (c:Category)=>{
    setEditId(c.id);
    setForm({
      name:c.name,
      imageUrl:c.imageUrl||"",
      parentId:c.parentId||""
    });
    setOpenModal(true);
  };

  // ================= FILTER =================
  const filterTree = (list:Category[]):Category[] =>
    list.map(c=>({
      ...c,
      children:c.children?filterTree(c.children):[]
    })).filter(c=>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.children && c.children.length>0)
    );

  const filtered = filterTree(categories);

  // ================= TOGGLE =================
  const toggle = (id:number)=>{
    setExpanded(prev=>({...prev,[id]:!prev[id]}));
  };

  const toggleAll = (open:boolean)=>{
    const map:any={};
    const loop = (list:Category[])=>{
      list.forEach(c=>{
        map[c.id]=open;
        if(c.children) loop(c.children);
      });
    };
    loop(categories);
    setExpanded(map);
  };

  // ================= TREE =================
  const renderTree = (list:Category[], level=0)=>(
    list.map(cat=>{
      const isOpen = expanded[cat.id];

      return(
        <div key={cat.id} style={{marginLeft:level*16}} className="space-y-2">

          <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition group">

            <div className="flex items-center gap-3">

              {/* Arrow */}
              {cat.children?.length ? (
                <button
                  onClick={()=>toggle(cat.id)}
                  className="text-gray-400 text-xs"
                >
                  {isOpen ? "▼" : "▶"}
                </button>
              ) : <div className="w-4"/>}

              {/* Avatar */}
              {cat.imageUrl ? (
                <img src={cat.imageUrl} className="w-9 h-9 rounded-lg object-cover"/>
              ) : (
                <div className="w-9 h-9 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-lg font-semibold">
                  {cat.name[0]}
                </div>
              )}

              {/* Text */}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {cat.name}
                </p>
                <p className="text-xs text-gray-400">
                  /{cat.slug}
                </p>
              </div>

            </div>

            {/* Actions */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">

              <button
                onClick={()=>openEdit(cat)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Pencil size={16}/>
              </button>

              <button
                onClick={()=>handleDelete(cat.id)}
                className="p-2 hover:bg-red-50 text-red-500 rounded-lg"
              >
                <Trash2 size={16}/>
              </button>

            </div>

          </div>

          {/* Children */}
          {isOpen && cat.children?.length>0 && (
            <div className="ml-6 space-y-2">
              {renderTree(cat.children, level+1)}
            </div>
          )}

        </div>
      );
    })
  );

  return (
    <AdminLayout>

      {/* 🔥 SCROLL ONLY CONTENT */}
      <div className="h-[calc(100vh-80px)] overflow-y-auto px-6 py-6">

        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Categories
              </h1>
              <p className="text-sm text-gray-500">
                Manage product hierarchy
              </p>
            </div>

            <div className="flex gap-2">

              <button
                onClick={()=>toggleAll(true)}
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100"
              >
                Expand All
              </button>

              <button
                onClick={()=>toggleAll(false)}
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100"
              >
                Collapse All
              </button>

              <button
                onClick={()=>setOpenModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={16}/>
                Add
              </button>

            </div>

          </div>

          {/* SEARCH */}
          <div className="bg-white rounded-xl border shadow-sm p-3 mb-6 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
            <input
              placeholder="Search categories..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="pl-10 w-full py-2.5 text-sm outline-none"
            />
          </div>

          {/* LIST */}
          <div className="bg-white rounded-2xl shadow-sm p-4 space-y-2">

            {loading && <p>Loading...</p>}

            {!loading && filtered.length===0 && (
              <div className="text-center py-20 text-gray-500">
                No categories found
              </div>
            )}

            {!loading && renderTree(filtered)}

          </div>

        </div>

      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">

          <form
            onSubmit={handleSave}
            className="bg-white rounded-2xl w-[400px] p-6 shadow-xl"
          >

            <h2 className="text-lg font-semibold mb-4">
              {editId ? "Edit Category" : "Add Category"}
            </h2>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e)=>setForm({...form,name:e.target.value})}
              className="w-full border rounded-lg p-2.5 mb-3 text-sm"
              required
            />

            <input
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={(e)=>setForm({...form,imageUrl:e.target.value})}
              className="w-full border rounded-lg p-2.5 mb-3 text-sm"
            />

            <select
              value={form.parentId}
              onChange={(e)=>setForm({...form,parentId:e.target.value?Number(e.target.value):""})}
              className="w-full border rounded-lg p-2.5 mb-4 text-sm"
            >
              <option value="">Main Category</option>
              {categories.map(c=>(
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={reset}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Cancel
              </button>

              <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg">
                Save
              </button>
            </div>

          </form>

        </div>
      )}

    </AdminLayout>
  );
}