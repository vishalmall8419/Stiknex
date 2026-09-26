import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle,
  Edit,
  Folder,
  ImagePlus,
  Package,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

import Product from "../../data/Product.json";
import StatCard from "./Component/cards/StatCard";

const FALLBACK_IMAGE = "/placeholder-product.png";

const createSlug = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const getCategoryProducts = (category) =>
  Array.isArray(category?.products) ? category.products : [];

const getCategoryImage = (category) => {
  const firstProduct = getCategoryProducts(category)[0];

  return (
    category?.image ||
    category?.thumbnail ||
    firstProduct?.images?.[0] ||
    firstProduct?.image ||
    firstProduct?.thumbnail ||
    FALLBACK_IMAGE
  );
};

const normalizeCategories = (data) => {
  if (!Array.isArray(data?.categories)) return [];

  return data.categories.map((category, index) => {
    const products = getCategoryProducts(category);

    return {
      id: category.id ?? category.slug ?? `category-${index + 1}`,
      name: category.name || "Untitled Category",
      slug: category.slug || createSlug(category.name),
      description: category.description || "Manage products in this category.",
      image: getCategoryImage(category),
      productCount: products.length,
      status: category.status || "Active",
      products,
    };
  });
};

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  status: "Active",
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const initialCategories = useMemo(() => normalizeCategories(Product), []);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const statistics = useMemo(() => {
    const totalProducts = categories.reduce(
      (total, category) => total + Number(category.productCount || 0),
      0,
    );

    return {
      totalCategories: categories.length,
      activeCategories: categories.filter((category) => category.status === "Active").length,
      inactiveCategories: categories.filter((category) => category.status !== "Active").length,
      totalProducts,
    };
  }, [categories]);

  const filteredCategories = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        !search ||
        category.name.toLowerCase().includes(search) ||
        category.slug.toLowerCase().includes(search) ||
        category.description.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" || category.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData(emptyForm);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      image: category.image || "",
      status: category.status || "Active",
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: name === "slug" ? value.toLowerCase().replace(/\s+/g, "-") : value,
    }));

    setErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((previous) => ({ ...previous, image: "Please select an image file." }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((previous) => ({ ...previous, image: "Image size must be 5MB or less." }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((previous) => ({ ...previous, image: String(reader.result || "") }));
      setErrors((previous) => ({ ...previous, image: "" }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = "Category name is required.";
    if (!formData.slug.trim()) nextErrors.slug = "Category slug is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const categoryData = {
      id: editingCategory?.id || `category-${Date.now()}`,
      name: formData.name.trim(),
      slug: formData.slug.trim() || createSlug(formData.name),
      description: formData.description.trim(),
      image: formData.image.trim() || FALLBACK_IMAGE,
      status: formData.status,
      productCount: editingCategory?.productCount || 0,
      products: editingCategory?.products || [],
    };

    if (editingCategory) {
      setCategories((previous) =>
        previous.map((category) =>
          category.id === editingCategory.id ? categoryData : category,
        ),
      );
    } else {
      setCategories((previous) => [categoryData, ...previous]);
    }

    closeModal();

    Swal.fire({
      title: editingCategory ? "Category Updated" : "Category Added",
      text: `${categoryData.name} has been saved successfully.`,
      icon: "success",
      timer: 1600,
      showConfirmButton: false,
      customClass: { popup: "rounded-2xl" },
    });
  };

  const handleDelete = async (category) => {
    const result = await Swal.fire({
      title: "Delete Category?",
      text: `Are you sure you want to delete ${category.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
      buttonsStyling: false,
      customClass: {
        popup: "rounded-2xl",
        title: "text-xl font-bold text-(--primary)",
        htmlContainer: "text-sm text-(--secondary)",
        confirmButton:
          "rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600",
        cancelButton:
          "mr-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100",
      },
    });

    if (!result.isConfirmed) return;

    setCategories((previous) => previous.filter((item) => item.id !== category.id));

    await Swal.fire({
      title: "Deleted!",
      text: `${category.name} has been removed.`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      customClass: { popup: "rounded-2xl" },
    });
  };

  return (
    <section className="min-w-0 px-3 pb-8 sm:px-5 lg:px-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--primary) sm:text-3xl">Categories</h1>
          <p className="mt-1 text-sm text-(--secondary)">
            Manage product categories, status and category details.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--primary) px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 min-[1100px]:grid-cols-4">
        <StatCard title="Total Categories" value={statistics.totalCategories} icon={Folder} trendLabel="All categories" variant="blue" />
        <StatCard title="Active Categories" value={statistics.activeCategories} icon={CheckCircle} trendLabel="Currently active" variant="teal" />
        <StatCard title="Inactive Categories" value={statistics.inactiveCategories} icon={Folder} trendLabel="Currently inactive" variant="orange" />
        <StatCard title="Total Products" value={statistics.totalProducts} icon={Package} trendLabel="Across categories" variant="purple" />
      </div>

      <div className="mb-5 rounded-2xl border border-white/60 bg-white/30 p-4 shadow-[0_4px_18px_rgba(80,120,140,0.05)] backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Search size={17} className="text-(--primary)" />
            <h2 className="text-sm font-semibold text-(--primary)">Filter Categories</h2>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-(--primary) transition hover:opacity-70"
          >
            <X size={14} />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search categories..."
            className="h-10 w-full rounded-xl border border-white/70 bg-white/45 px-3 text-sm text-(--primary) outline-none placeholder:text-(--muted) focus:border-(--primary)"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-10 w-full rounded-xl border border-white/70 bg-white/45 px-3 text-sm text-(--primary) outline-none focus:border-(--primary)"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/30 shadow-[0_4px_18px_rgba(80,120,140,0.05)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/60 px-4 py-4">
          <div>
            <h2 className="text-base font-bold text-(--primary)">Category Inventory</h2>
            <p className="mt-1 text-xs text-(--secondary)">{filteredCategories.length} categories found</p>
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center px-4 text-center">
            <Folder size={38} className="mb-3 text-(--muted)" />
            <h3 className="text-base font-semibold text-(--primary)">No Categories Found</h3>
            <p className="mt-1 text-sm text-(--secondary)">Try changing your search or filter.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/60 text-xs text-(--secondary)">
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Slug</th>
                  <th className="px-4 py-3 font-semibold">Products</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b border-white/40 text-sm transition hover:bg-white/25">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-12 w-12 shrink-0 rounded-xl border border-white/60 bg-white/40 object-cover"
                          onError={(event) => {
                            event.currentTarget.src = FALLBACK_IMAGE;
                          }}
                        />
                        <div className="min-w-0">
                          <p className="max-w-[230px] truncate font-semibold text-(--primary)">{category.name}</p>
                          <p className="mt-1 max-w-[280px] truncate text-xs text-(--secondary)">{category.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-(--secondary)">{category.slug}</td>
                    <td className="px-4 py-3 font-semibold text-(--primary)">{category.productCount}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${category.status === "Active" ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-600"}`}>
                        {category.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button type="button" title="Edit Category" onClick={() => openEditModal(category)} className="rounded-lg bg-white/50 p-2 text-(--primary) transition hover:bg-white/80">
                          <Edit size={15} />
                        </button>
                        <button type="button" title="Delete Category" onClick={() => handleDelete(category)} className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={closeModal}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/70 bg-white/90 p-5 shadow-2xl sm:p-6" onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-(--primary)">{editingCategory ? "Edit Category" : "Add Category"}</h2>
                <p className="mt-1 text-sm text-(--secondary)">Enter category information below.</p>
              </div>
              <button type="button" onClick={closeModal} className="rounded-lg bg-black/5 p-2 text-(--primary) transition hover:bg-black/10">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="category-name" className="mb-1.5 block text-sm font-semibold text-(--primary)">Category Name *</label>
                  <input id="category-name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Garments" className="h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 text-sm text-(--primary) outline-none focus:border-(--primary)" />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="category-slug" className="mb-1.5 block text-sm font-semibold text-(--primary)">Category Slug *</label>
                  <input id="category-slug" name="slug" value={formData.slug} onChange={handleChange} placeholder="e.g. garments" className="h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 text-sm text-(--primary) outline-none focus:border-(--primary)" />
                  {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="category-description" className="mb-1.5 block text-sm font-semibold text-(--primary)">Description</label>
                <textarea id="category-description" name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Write category description..." className="w-full resize-none rounded-xl border border-black/10 bg-white/70 px-3 py-3 text-sm text-(--primary) outline-none focus:border-(--primary)" />
              </div>

              <div>
                <label htmlFor="category-image" className="mb-1.5 block text-sm font-semibold text-(--primary)">Image URL</label>
                <input id="category-image" name="image" type="url" value={formData.image.startsWith("data:") ? "" : formData.image} onChange={handleChange} placeholder="https://example.com/category-image.jpg" className="h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 text-sm text-(--primary) outline-none focus:border-(--primary)" />
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm font-semibold text-(--primary) transition hover:bg-white">
                    <Upload size={16} /> Upload Image
                  </button>
                  <span className="text-xs text-(--secondary)">Max 5MB</span>
                </div>
                {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}

                {formData.image && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-black/10 bg-white/50 p-3">
                    <img src={formData.image} alt="Category preview" className="h-20 w-20 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="flex items-center gap-1 text-sm font-semibold text-(--primary)"><ImagePlus size={15} /> Image preview</p>
                      <p className="mt-1 truncate text-xs text-(--secondary)">URL or uploaded image selected</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="category-status" className="mb-1.5 block text-sm font-semibold text-(--primary)">Status</label>
                <select id="category-status" name="status" value={formData.status} onChange={handleChange} className="h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 text-sm text-(--primary) outline-none focus:border-(--primary)">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-black/10 pt-4 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeModal} className="rounded-xl border border-black/10 bg-white/70 px-4 py-2.5 text-sm font-semibold text-(--primary) transition hover:bg-white">Cancel</button>
                <button type="submit" className="rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">{editingCategory ? "Update Category" : "Save Category"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminCategories;
