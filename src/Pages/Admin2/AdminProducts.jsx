import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Download,
  Edit,
  Eye,
  Filter,
  Package,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

// JSON DATA
import Product from "../../data/Product.json";

// EXISTING COMPONENT
// import ActionCard from "./component/cards/ActionCard";
import StatCard from "./Component/cards/StatCard";
import AddProductModal from "./Component/AddProductModal";
import EditProductModal from "./Component/EditProductModal";

const AdminProducts = () => {
  // =====================================
  // STATES
  // =====================================

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const productsPerPage = 8;

  // =====================================
  // NORMALIZE PRODUCT DATA
  // =====================================

  const initialProducts = useMemo(() => {
    if (Array.isArray(Product?.categories)) {
      return Product.categories.flatMap((category) => {
        if (!Array.isArray(category.products)) {
          return [];
        }

        return category.products.map((product) => ({
          ...product,

          category: category.name || "Uncategorized",

          categorySlug: category.slug || "",

          image:
            product.images?.[0] ||
            product.image ||
            product.thumbnail ||
            "/placeholder-product.png",

          sku:
            product.inventory?.sku ||
            product.sku ||
            product.SKU ||
            `SKU-${product.id || "N/A"}`,

          stock: Number(
            product.inventory?.stock ?? product.stock ?? product.quantity ?? 0,
          ),

          price: Number(product.price?.current ?? product.price ?? 0),

          originalPrice: Number(
            product.price?.original ?? product.originalPrice ?? 0,
          ),

          availability:
            product.inventory?.availability ||
            product.availability ||
            "Out of Stock",
        }));
      });
    }

    if (Array.isArray(Product)) {
      return Product.map((product) => ({
        ...product,

        category: product.category || "Uncategorized",

        categorySlug: product.categorySlug || "",

        image:
          product.images?.[0] ||
          product.image ||
          product.thumbnail ||
          "/placeholder-product.png",

        sku:
          product.inventory?.sku ||
          product.sku ||
          product.SKU ||
          `SKU-${product.id || "N/A"}`,

        stock: Number(
          product.inventory?.stock ?? product.stock ?? product.quantity ?? 0,
        ),

        price: Number(product.price?.current ?? product.price ?? 0),

        originalPrice: Number(
          product.price?.original ?? product.originalPrice ?? 0,
        ),

        availability:
          product.inventory?.availability ||
          product.availability ||
          "Out of Stock",
      }));
    }

    return [];
  }, []);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // =====================================
  // MODAL HANDLERS
  // =====================================

  const handleOpenAddModal = () => {
    setIsAddProductModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddProductModalOpen(false);
  };

  const handleAddProduct = (newProduct) => {
    setProducts((previousProducts) => [newProduct, ...previousProducts]);
    setCurrentPage(1);
    setIsAddProductModalOpen(false);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsEditProductModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditingProduct(null);
    setIsEditProductModalOpen(false);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((previousProducts) =>
      previousProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );

    setEditingProduct(null);
    setIsEditProductModalOpen(false);
  };

  // =====================================
  // DELETE PRODUCT
  // =====================================

  const handleDeleteProduct = async (product) => {
    const productName = getProductName(product);

    const result = await Swal.fire({
      title: "Delete Product?",
      text: `Are you sure you want to delete "${productName}"?`,
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

    setProducts((previousProducts) =>
      previousProducts.filter((item) => {
        if (product.id != null && item.id != null) {
          return item.id !== product.id;
        }

        return item.sku !== product.sku;
      })
    );

    if (selectedProduct?.id === product.id) {
      setSelectedProduct(null);
    }

    if (editingProduct?.id === product.id) {
      setEditingProduct(null);
      setIsEditProductModalOpen(false);
    }

    setCurrentPage(1);

    await Swal.fire({
      title: "Deleted!",
      text: `${productName} has been removed.`,
      icon: "success",
      timer: 1600,
      showConfirmButton: false,
      buttonsStyling: false,
      customClass: {
        popup: "rounded-2xl",
        title: "text-xl font-bold text-(--primary)",
        htmlContainer: "text-sm text-(--secondary)",
      },
    });
  };

  // =====================================
  // CATEGORIES
  // =====================================

  const categories = useMemo(() => {
    return [
      ...new Set(
        initialProducts.map((product) => product.category || "Uncategorized"),
      ),
    ];
  }, [initialProducts]);

  // =====================================
  // PRODUCT STATISTICS
  // =====================================

  const statistics = useMemo(() => {
    const totalProducts = products.length;

    const totalStock = products.reduce(
      (total, product) => total + product.stock,
      0,
    );

    const outOfStock = products.filter(
      (product) => product.stock <= 0,
    ).length;

    const lowStock = products.filter(
      (product) => product.stock > 0 && product.stock <= 10,
    ).length;

    return {
      totalProducts,
      totalStock,
      outOfStock,
      lowStock,
    };
  }, [products]);

  // =====================================
  // FILTER AND SORT PRODUCTS
  // =====================================

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // SEARCH
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();

      filtered = filtered.filter((product) => {
        return (
          product.name?.toLowerCase().includes(search) ||
          product.title?.toLowerCase().includes(search) ||
          product.sku?.toLowerCase().includes(search) ||
          product.category?.toLowerCase().includes(search)
        );
      });
    }

    // CATEGORY FILTER
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter,
      );
    }

    // STOCK FILTER
    if (stockFilter === "in-stock") {
      filtered = filtered.filter((product) => product.stock > 10);
    }

    if (stockFilter === "low-stock") {
      filtered = filtered.filter(
        (product) => product.stock > 0 && product.stock <= 10,
      );
    }

    if (stockFilter === "out-of-stock") {
      filtered = filtered.filter((product) => product.stock <= 0);
    }

    // SORT
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "stock-low") {
      filtered.sort((a, b) => a.stock - b.stock);
    }

    if (sortBy === "stock-high") {
      filtered.sort((a, b) => b.stock - a.stock);
    }

    if (sortBy === "name") {
      filtered.sort((a, b) =>
        (a.name || a.title || "").localeCompare(b.name || b.title || ""),
      );
    }

    return filtered;
  }, [products, searchTerm, categoryFilter, stockFilter, sortBy]);

  // =====================================
  // PAGINATION
  // =====================================

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  // =====================================
  // HELPERS
  // =====================================

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const getProductName = (product) => {
    return product.name || product.title || "Unnamed Product";
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) {
      return {
        label: "Out of Stock",
        className: "bg-red-100 text-red-600",
      };
    }

    if (stock <= 10) {
      return {
        label: "Low Stock",
        className: "bg-orange-100 text-orange-600",
      };
    }

    return {
      label: "In Stock",
      className: "bg-emerald-100 text-emerald-600",
    };
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStockFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleStockChange = (value) => {
    setStockFilter(value);
    setCurrentPage(1);
  };

  // =====================================
  // EXPORT CSV
  // =====================================

  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Category",
      "SKU",
      "Price",
      "Original Price",
      "Stock",
      "Availability",
    ];

    const rows = filteredProducts.map((product) => [
      getProductName(product),
      product.category,
      product.sku,
      product.price,
      product.originalPrice,
      product.stock,
      product.availability,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "products.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <section className="min-w-0 px-3 pb-8 sm:px-5 lg:px-6">
      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--primary) sm:text-3xl">
            Products
          </h1>

          <p className="mt-1 text-sm text-(--secondary)">
            Manage your products, inventory and product details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="
              inline-flex items-center justify-center gap-2 rounded-xl
              border border-white/60 bg-white/30 px-3 py-2
              text-sm font-semibold text-(--primary)
              backdrop-blur-xl transition hover:bg-white/50
            "
          >
            <Download size={16} />
            Export
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="
              inline-flex items-center justify-center gap-2 rounded-xl
              bg-(--primary) px-3 py-2 text-sm font-semibold
              text-white shadow-sm transition hover:opacity-90
            "
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* =====================================
          STATISTICS
      ===================================== */}

      <div
        className="mb-4 grid
    grid-cols-1
    gap-3
    min-[480px]:grid-cols-2
    min-[1100px]:grid-cols-4"
      >
        <StatCard
          title="In Stock"
          value={statistics.totalStock}
          icon={CheckCircle}
          trendLabel="from last month"
          variant="blue"
        />
        <StatCard
          title="Total Products"
          value={statistics.totalProducts}
          icon={CheckCircle}
          trendLabel="from last month"
          variant="teal"
        />
        <StatCard
          title="Out Of Stock"
          value={statistics.outOfStock}
          icon={CheckCircle}
          trendLabel="from last month"
          variant="orange"
        />
        <StatCard
          title="Low Stock"
          value={statistics.lowStock}
          icon={CheckCircle}
          trendLabel="from last month"
          variant="purple"
        />
      </div>

      {/* =====================================
          FILTER SECTION
      ===================================== */}

      <div
        className="
          mb-5 rounded-2xl border border-white/60 bg-white/30 p-4
          shadow-[0_4px_18px_rgba(80,120,140,0.05)]
          backdrop-blur-xl
        "
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-(--primary)" />

            <h2 className="text-sm font-semibold text-(--primary)">
              Filter Products
            </h2>
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="
              inline-flex items-center gap-1 text-xs font-semibold
              text-(--primary) transition hover:opacity-70
            "
          >
            <X size={14} />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* SEARCH */}

          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search
              size={17}
              className="
                pointer-events-none absolute left-3 top-1/2
                -translate-y-1/2 text-(--muted)
              "
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search products..."
              className="
                h-10 w-full rounded-xl border border-white/70
                bg-white/45 pl-9 pr-3 text-sm text-(--primary)
                outline-none placeholder:text-(--muted)
                focus:border-(--primary)
              "
            />
          </div>

          {/* CATEGORY */}

          <select
            value={categoryFilter}
            onChange={(event) => handleCategoryChange(event.target.value)}
            className="
              h-10 w-full rounded-xl border border-white/70
              bg-white/45 px-3 text-sm text-(--primary)
              outline-none focus:border-(--primary)
            "
          >
            <option value="all">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* STOCK */}

          <select
            value={stockFilter}
            onChange={(event) => handleStockChange(event.target.value)}
            className="
              h-10 w-full rounded-xl border border-white/70
              bg-white/45 px-3 text-sm text-(--primary)
              outline-none focus:border-(--primary)
            "
          >
            <option value="all">All Stock</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          {/* SORT */}

          <select
            value={sortBy}
            onChange={(event) => {
              setSortBy(event.target.value);
              setCurrentPage(1);
            }}
            className="
              h-10 w-full rounded-xl border border-white/70
              bg-white/45 px-3 text-sm text-(--primary)
              outline-none focus:border-(--primary)
            "
          >
            <option value="newest">Newest</option>
            <option value="name">Name A-Z</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="stock-low">Stock: Low to High</option>
            <option value="stock-high">Stock: High to Low</option>
          </select>
        </div>
      </div>

      {/* =====================================
          PRODUCTS TABLE
      ===================================== */}

      <div
        className="
          overflow-hidden rounded-2xl border border-white/60
          bg-white/30 shadow-[0_4px_18px_rgba(80,120,140,0.05)]
          backdrop-blur-xl
        "
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/60 px-4 py-4">
          <div>
            <h2 className="text-base font-bold text-(--primary)">
              Product Inventory
            </h2>

            <p className="mt-1 text-xs text-(--secondary)">
              {filteredProducts.length} products found
            </p>
          </div>
        </div>

        {paginatedProducts.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center px-4 text-center">
            <Package size={38} className="mb-3 text-(--muted)" />

            <h3 className="text-base font-semibold text-(--primary)">
              No Products Found
            </h3>

            <p className="mt-1 text-sm text-(--secondary)">
              Try changing your search or filter options.
            </p>

            <button
              type="button"
              onClick={handleResetFilters}
              className="
                mt-4 rounded-xl bg-(--primary) px-4 py-2
                text-sm font-semibold text-white
              "
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/60 text-xs text-(--secondary)">
                    <th className="px-4 py-3 font-semibold">Product</th>

                    <th className="px-4 py-3 font-semibold">Category</th>

                    <th className="px-4 py-3 font-semibold">SKU</th>

                    <th className="px-4 py-3 font-semibold">Price</th>

                    <th className="px-4 py-3 font-semibold">Stock</th>

                    <th className="px-4 py-3 font-semibold">Status</th>

                    <th className="px-4 py-3 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedProducts.map((product, index) => {
                    const stockStatus = getStockStatus(product.stock);

                    return (
                      <tr
                        key={product.id || product.sku || index}
                        className="
                          border-b border-white/40 text-sm
                          transition hover:bg-white/25
                        "
                      >
                        {/* PRODUCT */}

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={getProductName(product)}
                              className="
                                h-12 w-12 shrink-0 rounded-xl
                                border border-white/60 bg-white/40
                                object-cover
                              "
                              onError={(event) => {
                                event.currentTarget.src =
                                  "/placeholder-product.png";
                              }}
                            />

                            <div className="min-w-0">
                              <p className="max-w-[210px] truncate font-semibold text-(--primary)">
                                {getProductName(product)}
                              </p>

                              <p className="mt-1 text-xs text-(--secondary)">
                                ID: {product.id || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CATEGORY */}

                        <td className="px-4 py-3 text-(--secondary)">
                          {product.category}
                        </td>

                        {/* SKU */}

                        <td className="px-4 py-3 text-xs text-(--secondary)">
                          {product.sku}
                        </td>

                        {/* PRICE */}

                        <td className="px-4 py-3">
                          <div className="font-semibold text-(--primary)">
                            {formatPrice(product.price)}
                          </div>

                          {product.originalPrice > product.price && (
                            <div className="text-xs text-(--muted) line-through">
                              {formatPrice(product.originalPrice)}
                            </div>
                          )}
                        </td>

                        {/* STOCK */}

                        <td className="px-4 py-3 font-medium text-(--primary)">
                          {product.stock}
                        </td>

                        {/* STATUS */}

                        <td className="px-4 py-3">
                          <span
                            className={`
                              inline-flex rounded-full px-2.5 py-1
                              text-[11px] font-semibold
                              ${stockStatus.className}
                            `}
                          >
                            {stockStatus.label}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              title="View Product"
                              onClick={() => setSelectedProduct(product)}
                              className="
                                rounded-lg bg-white/50 p-2
                                text-(--primary) transition
                                hover:bg-white/80
                              "
                            >
                              <Eye size={15} />
                            </button>

                            <button
                              type="button"
                              title="Edit Product"
                              onClick={() => handleOpenEditModal(product)}
                              className="
                                rounded-lg bg-white/50 p-2
                                text-(--primary) transition
                                hover:bg-white/80
                              "
                            >
                              <Edit size={15} />
                            </button>

                            <button
                              type="button"
                              title="Delete Product"
                              onClick={() => handleDeleteProduct(product)}
                              className="
                                rounded-lg bg-red-50 p-2 text-red-500
                                transition hover:bg-red-100
                              "
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* =====================================
                PAGINATION
            ===================================== */}

            <div className="flex flex-col gap-3 border-t border-white/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-(--secondary)">
                Showing{" "}
                {Math.min(
                  (currentPage - 1) * productsPerPage + 1,
                  filteredProducts.length,
                )}{" "}
                to{" "}
                {Math.min(
                  currentPage * productsPerPage,
                  filteredProducts.length,
                )}{" "}
                of {filteredProducts.length} products
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  className="
                    rounded-lg border border-white/70 bg-white/40
                    px-3 py-1.5 text-xs font-semibold text-(--primary)
                    disabled:cursor-not-allowed disabled:opacity-40
                  "
                >
                  Previous
                </button>

                <span className="rounded-lg bg-(--primary) px-3 py-1.5 text-xs font-semibold text-white">
                  {currentPage}
                </span>

                <button
                  type="button"
                  disabled={currentPage >= totalPages || totalPages === 0}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  className="
                    rounded-lg border border-white/70 bg-white/40
                    px-3 py-1.5 text-xs font-semibold text-(--primary)
                    disabled:cursor-not-allowed disabled:opacity-40
                  "
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* =====================================
          PRODUCT DETAILS MODAL
      ===================================== */}

      {selectedProduct && (
        <div
          className="
            fixed inset-0 z-[100] flex items-center justify-center
            bg-black/40 p-4 backdrop-blur-sm
          "
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="
              max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl
              border border-white/60 bg-white/90 p-5 shadow-2xl
            "
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-(--primary)">
                Product Details
              </h2>

              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="rounded-lg bg-gray-100 p-2 text-gray-600"
              >
                <X size={17} />
              </button>
            </div>

            <img
              src={selectedProduct.image}
              alt={getProductName(selectedProduct)}
              className="mb-4 h-52 w-full rounded-xl object-contain"
            />

            <h3 className="text-lg font-bold text-(--primary)">
              {getProductName(selectedProduct)}
            </h3>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Category</span>
                <span className="font-semibold text-gray-800">
                  {selectedProduct.category}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-500">SKU</span>
                <span className="font-semibold text-gray-800">
                  {selectedProduct.sku}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Price</span>
                <span className="font-semibold text-gray-800">
                  {formatPrice(selectedProduct.price)}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Stock</span>
                <span className="font-semibold text-gray-800">
                  {selectedProduct.stock}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Availability</span>
                <span className="font-semibold text-gray-800">
                  {selectedProduct.availability}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="
                mt-6 w-full rounded-xl bg-(--primary) px-4 py-2.5
                text-sm font-semibold text-white
              "
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={handleCloseAddModal}
        onAddProduct={handleAddProduct}
        categories={categories}
      />

      {/* EDIT PRODUCT MODAL */}
      <EditProductModal
        isOpen={isEditProductModalOpen}
        onClose={handleCloseEditModal}
        product={editingProduct}
        onUpdateProduct={handleUpdateProduct}
        categories={categories}
      />
    </section>
  );
};

export default AdminProducts;
