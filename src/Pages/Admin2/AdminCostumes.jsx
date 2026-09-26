import React, { useMemo, useState } from "react";
import {
  CheckCircle,
  Edit,
  Eye,
  Filter,
  Plus,
  Search,
  Shirt,
  Trash2,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

const initialCostumes = [
  {
    id: 1,
    name: "Classic Cotton Shirt",
    category: "Shirts",
    sku: "CST-001",
    price: 799,
    stock: 42,
    size: "S, M, L, XL",
    color: "White",
    status: "Active",
    image: "/placeholder-product.png",
  },
  {
    id: 2,
    name: "Slim Fit Denim",
    category: "Jeans",
    sku: "CST-002",
    price: 1299,
    stock: 8,
    size: "28, 30, 32, 34",
    color: "Blue",
    status: "Active",
    image: "/placeholder-product.png",
  },
  {
    id: 3,
    name: "Traditional Kurta",
    category: "Ethnic Wear",
    sku: "CST-003",
    price: 999,
    stock: 0,
    size: "M, L, XL",
    color: "Cream",
    status: "Inactive",
    image: "/placeholder-product.png",
  },
];

const emptyForm = {
  name: "",
  category: "",
  sku: "",
  price: "",
  stock: "",
  size: "",
  color: "",
  status: "Active",
  image: "",
};

const AdminCostumes = () => {
  const [costumes, setCostumes] = useState(initialCostumes);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCostume, setSelectedCostume] = useState(null);
  const [editingCostume, setEditingCostume] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const categories = useMemo(
    () => [...new Set(costumes.map((item) => item.category))],
    [costumes],
  );

  const filteredCostumes = useMemo(() => {
    return costumes.filter((item) => {
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch = [item.name, item.category, item.sku, item.color]
        .join(" ")
        .toLowerCase()
        .includes(search);
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [costumes, searchTerm, categoryFilter, statusFilter]);

  const statistics = useMemo(
    () => ({
      total: costumes.length,
      active: costumes.filter((item) => item.status === "Active").length,
      lowStock: costumes.filter((item) => item.stock > 0 && item.stock <= 10)
        .length,
      outOfStock: costumes.filter((item) => item.stock <= 0).length,
    }),
    [costumes],
  );

  const openAddModal = () => {
    setEditingCostume(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (costume) => {
    setEditingCostume(costume);
    setFormData({ ...costume });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCostume(null);
    setFormData(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.category || !formData.sku.trim()) {
      Swal.fire({
        title: "Required fields missing",
        text: "Name, category and SKU are required.",
        icon: "warning",
      });
      return;
    }

    const payload = {
      ...formData,
      id: editingCostume?.id ?? Date.now(),
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      price: Number(formData.price) || 0,
      stock: Number(formData.stock) || 0,
    };

    setCostumes((previous) =>
      editingCostume
        ? previous.map((item) => (item.id === editingCostume.id ? payload : item))
        : [payload, ...previous],
    );

    closeModal();
    Swal.fire({
      title: editingCostume ? "Costume updated" : "Costume added",
      icon: "success",
      timer: 1400,
      showConfirmButton: false,
    });
  };

  const handleDelete = async (costume) => {
    const result = await Swal.fire({
      title: "Delete costume?",
      text: `Are you sure you want to delete ${costume.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setCostumes((previous) => previous.filter((item) => item.id !== costume.id));
    if (selectedCostume?.id === costume.id) setSelectedCostume(null);

    Swal.fire({
      title: "Deleted",
      text: "Costume removed successfully.",
      icon: "success",
      timer: 1400,
      showConfirmButton: false,
    });
  };

  return (
    <section className="min-w-0 px-3 pb-8 sm:px-5 lg:px-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--primary) sm:text-3xl">Costumes</h1>
          <p className="mt-1 text-sm text-(--secondary)">
            Manage garments, sizes, colors and costume inventory.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <Plus size={16} /> Add Costume
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 min-[1100px]:grid-cols-4">
        {[
          ["Total Costumes", statistics.total, Shirt],
          ["Active", statistics.active, CheckCircle],
          ["Low Stock", statistics.lowStock, Filter],
          ["Out of Stock", statistics.outOfStock, Trash2],
        ].map(([title, value, Icon]) => (
          <div key={title} className="rounded-2xl border border-white/60 bg-white/30 p-4 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-(--secondary)">{title}</p>
              <Icon size={18} className="text-(--primary)" />
            </div>
            <p className="mt-3 text-2xl font-bold text-(--primary)">{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 rounded-2xl border border-white/60 bg-white/30 p-4 shadow-sm backdrop-blur-xl">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search costumes..."
              className="h-10 w-full rounded-xl border border-white/70 bg-white/45 pl-9 pr-3 text-sm text-(--primary) outline-none focus:border-(--primary)"
            />
          </div>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-10 w-full rounded-xl border border-white/70 bg-white/45 px-3 text-sm text-(--primary) outline-none">
            <option value="all">All Categories</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 w-full rounded-xl border border-white/70 bg-white/45 px-3 text-sm text-(--primary) outline-none">
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/30 shadow-sm backdrop-blur-xl">
        <div className="border-b border-white/60 px-4 py-4">
          <h2 className="text-base font-bold text-(--primary)">Costume Inventory</h2>
          <p className="mt-1 text-xs text-(--secondary)">{filteredCostumes.length} costumes found</p>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/60 text-xs text-(--secondary)">
                {['Costume', 'Category', 'SKU', 'Price', 'Stock', 'Status', 'Actions'].map((heading) => <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>)}
              </tr>
            </thead>
            <tbody>
              {filteredCostumes.map((costume) => (
                <tr key={costume.id} className="border-b border-white/40 text-sm transition hover:bg-white/25">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={costume.image || '/placeholder-product.png'} alt={costume.name} className="h-12 w-12 rounded-xl border border-white/60 bg-white/40 object-cover" /><div><p className="font-semibold text-(--primary)">{costume.name}</p><p className="mt-1 text-xs text-(--secondary)">{costume.color} · {costume.size}</p></div></div></td>
                  <td className="px-4 py-3 text-(--secondary)">{costume.category}</td>
                  <td className="px-4 py-3 text-xs text-(--secondary)">{costume.sku}</td>
                  <td className="px-4 py-3 font-semibold text-(--primary)">₹{costume.price.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-medium text-(--primary)">{costume.stock}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${costume.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>{costume.status}</span></td>
                  <td className="px-4 py-3"><div className="flex items-center justify-end gap-1.5"><button type="button" title="View" onClick={() => setSelectedCostume(costume)} className="rounded-lg bg-white/50 p-2 text-(--primary) hover:bg-white/80"><Eye size={15} /></button><button type="button" title="Edit" onClick={() => openEditModal(costume)} className="rounded-lg bg-white/50 p-2 text-(--primary) hover:bg-white/80"><Edit size={15} /></button><button type="button" title="Delete" onClick={() => handleDelete(costume)} className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100"><Trash2 size={15} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onMouseDown={closeModal}>
          <div className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/70 bg-white/90 p-5 shadow-2xl backdrop-blur-2xl sm:p-6" onMouseDown={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-bold text-(--primary)">{editingCostume ? 'Edit Costume' : 'Add Costume'}</h2><button type="button" onClick={closeModal} className="rounded-lg p-2 text-(--secondary) hover:bg-black/5"><X size={19} /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {['name', 'category', 'sku', 'price', 'stock', 'size', 'color', 'image'].map((field) => (
                  <div key={field}><label className="mb-1.5 block text-sm font-semibold text-(--primary)">{field.charAt(0).toUpperCase() + field.slice(1)}{['name','category','sku'].includes(field) ? ' *' : ''}</label><input required={['name','category','sku'].includes(field)} type={['price','stock'].includes(field) ? 'number' : field === 'image' ? 'url' : 'text'} name={field} value={formData[field]} onChange={handleChange} placeholder={`Enter ${field}`} className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2.5 text-sm text-(--primary) outline-none focus:border-(--primary)" /></div>
                ))}
                <div><label className="mb-1.5 block text-sm font-semibold text-(--primary)">Status</label><select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2.5 text-sm text-(--primary) outline-none"><option>Active</option><option>Inactive</option></select></div>
              </div>
              <div className="flex flex-col-reverse gap-3 border-t border-black/10 pt-4 sm:flex-row sm:justify-end"><button type="button" onClick={closeModal} className="rounded-xl border border-black/10 px-5 py-2.5 text-sm font-semibold text-(--secondary) hover:bg-black/5">Cancel</button><button type="submit" className="rounded-xl bg-(--primary) px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">{editingCostume ? 'Save Changes' : 'Add Costume'}</button></div>
            </form>
          </div>
        </div>
      )}

      {selectedCostume && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={() => setSelectedCostume(null)}><div className="w-full max-w-md rounded-2xl bg-white/95 p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold text-(--primary)">Costume Details</h2><button type="button" onClick={() => setSelectedCostume(null)}><X size={18} /></button></div><img src={selectedCostume.image || '/placeholder-product.png'} alt={selectedCostume.name} className="mb-4 h-52 w-full rounded-xl object-contain" /><h3 className="text-lg font-bold text-(--primary)">{selectedCostume.name}</h3><div className="mt-4 space-y-2 text-sm text-(--secondary)"><p>Category: {selectedCostume.category}</p><p>SKU: {selectedCostume.sku}</p><p>Price: ₹{selectedCostume.price.toLocaleString('en-IN')}</p><p>Stock: {selectedCostume.stock}</p><p>Size: {selectedCostume.size}</p><p>Color: {selectedCostume.color}</p><p>Status: {selectedCostume.status}</p></div></div></div>
      )}
    </section>
  );
};

export default AdminCostumes;
