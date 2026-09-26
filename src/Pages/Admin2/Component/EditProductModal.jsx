import React, { useEffect, useRef, useState } from "react";
import { X, Save, Package, Upload, Image as ImageIcon } from "lucide-react";

const EditProductModal = ({
  isOpen,
  onClose,
  product,
  onUpdateProduct,
  categories = [],
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    sku: "",
    price: "",
    originalPrice: "",
    stock: "",
    availability: "In Stock",
    description: "",
    image: "",
  });

  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Existing product data form mein set karna
  useEffect(() => {
    if (!product) return;

    setFormData({
      name: product.name || "",
      category: product.category || "",
      sku: product.sku || "",
      price: product.price ?? "",
      originalPrice: product.originalPrice ?? "",
      stock: product.stock ?? "",
      availability: product.availability || "In Stock",
      description: product.description || "",
      image:
        product.image ||
        product.images?.[0] ||
        "",
    });

    setErrors({});
  }, [product]);

  if (!isOpen || !product) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((previous) => ({
        ...previous,
        image: "Please select a valid image file",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((previous) => ({
        ...previous,
        image: "Image size must be less than 5MB",
      }));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFormData((previous) => ({
        ...previous,
        image: String(reader.result || ""),
      }));

      setErrors((previous) => ({
        ...previous,
        image: "",
      }));
    };

    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    }

    if (formData.price === "" || Number(formData.price) < 0) {
      newErrors.price = "Enter a valid price";
    }

    if (
      formData.originalPrice !== "" &&
      Number(formData.originalPrice) < 0
    ) {
      newErrors.originalPrice = "Enter a valid original price";
    }

    if (formData.stock === "" || Number(formData.stock) < 0) {
      newErrors.stock = "Enter a valid stock quantity";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const updatedProduct = {
      ...product,

      name: formData.name.trim(),
      category: formData.category,
      categorySlug: formData.category
        .toLowerCase()
        .replace(/\s+/g, "-"),

      sku: formData.sku.trim(),

      price: Number(formData.price),
      originalPrice:
        formData.originalPrice === ""
          ? 0
          : Number(formData.originalPrice),

      stock: Number(formData.stock),

      availability:
        Number(formData.stock) > 0
          ? formData.availability
          : "Out of Stock",

      description: formData.description.trim(),

      image: formData.image.trim() || "/placeholder-product.png",

      images: formData.image.trim()
        ? [formData.image.trim()]
        : product.images || [],
    };

    onUpdateProduct(updatedProduct);
    onClose();
  };

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/40 p-4
        backdrop-blur-sm
      "
      onMouseDown={onClose}
    >
      <div
        className="
          relative max-h-[92dvh] w-full max-w-2xl
          overflow-y-auto rounded-2xl
          border border-white/70
          bg-white/85 p-5
          shadow-[0_20px_70px_rgba(30,60,70,0.20)]
          backdrop-blur-2xl
          sm:p-6
        "
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl
                bg-[var(--primary)]/10
                text-[var(--primary)]
              "
            >
              <Package size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[var(--primary)]">
                Edit Product
              </h2>

              <p className="text-xs text-[var(--secondary)]">
                Update product information
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit product modal"
            className="
              rounded-lg p-2
              text-[var(--secondary)]
              transition
              hover:bg-black/5
              hover:text-[var(--primary)]
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name and Category */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold leading-5 text-[var(--primary)]">
                Product Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="mt-1 block w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2.5 text-sm text-[var(--primary)] outline-none transition placeholder:text-[var(--secondary)]/60 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
              />

              {errors.name && (
                <p className="mt-1 text-xs font-medium text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold leading-5 text-[var(--primary)]">
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2.5 text-sm text-[var(--primary)] outline-none transition placeholder:text-[var(--secondary)]/60 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
              >
                <option value="">Select category</option>

                {categories.length > 0 ? (
                  categories.map((category, index) => {
                    const categoryName =
                      typeof category === "string"
                        ? category
                        : category.name;

                    return (
                      <option
                        key={category.id || category.slug || index}
                        value={categoryName}
                      >
                        {categoryName}
                      </option>
                    );
                  })
                ) : (
                  <>
                    <option value="Garments">Garments</option>
                    <option value="Cosmetics">Cosmetics</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                  </>
                )}
              </select>

              {errors.category && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {errors.category}
                </p>
              )}
            </div>
          </div>

          {/* SKU and Stock */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold leading-5 text-[var(--primary)]">
                SKU *
              </label>

              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Enter SKU"
                className="mt-1 block w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2.5 text-sm text-[var(--primary)] outline-none transition placeholder:text-[var(--secondary)]/60 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
              />

              {errors.sku && (
                <p className="mt-1 text-xs font-medium text-red-600">{errors.sku}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold leading-5 text-[var(--primary)]">
                Stock Quantity *
              </label>

              <input
                type="number"
                min="0"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock"
                className="mt-1 block w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2.5 text-sm text-[var(--primary)] outline-none transition placeholder:text-[var(--secondary)]/60 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
              />

              {errors.stock && (
                <p className="mt-1 text-xs font-medium text-red-600">{errors.stock}</p>
              )}
            </div>
          </div>

          {/* Price and Original Price */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold leading-5 text-[var(--primary)]">
                Selling Price *
              </label>

              <input
                type="number"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter selling price"
                className="mt-1 block w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2.5 text-sm text-[var(--primary)] outline-none transition placeholder:text-[var(--secondary)]/60 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
              />

              {errors.price && (
                <p className="mt-1 text-xs font-medium text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold leading-5 text-[var(--primary)]">
                Original Price
              </label>

              <input
                type="number"
                min="0"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="Enter original price"
                className="mt-1 block w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2.5 text-sm text-[var(--primary)] outline-none transition placeholder:text-[var(--secondary)]/60 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
              />

              {errors.originalPrice && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {errors.originalPrice}
                </p>
              )}
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold leading-5 text-[var(--primary)]">
              Availability
            </label>

            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2.5 text-sm text-[var(--primary)] outline-none transition placeholder:text-[var(--secondary)]/60 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
            >
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Coming Soon">Coming Soon</option>
            </select>
          </div>

          {/* Image URL and Upload */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold leading-5 text-[var(--primary)]">Product Image</label>

            <div className="space-y-3 ">
                
              <input
                type="url"
                name="image"
                value={formData.image.startsWith("data:") ? "" : formData.image}
                onChange={handleChange}
                placeholder="https://example.com/product-image.jpg"
                className="mt-1 block w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2.5 text-sm text-[var(--primary)] outline-none transition placeholder:text-[var(--secondary)]/60 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
              />

              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--primary)] transition hover:bg-black/5"
                >
                  <Upload size={16} />
                  Upload Image
                </button>

                <span className="text-xs text-[var(--secondary)]">Max 5MB</span>
              </div>

              {errors.image && (
                <p className="mt-1 text-xs font-medium text-red-600">{errors.image}</p>
              )}

              {formData.image && (
                <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white/40 p-3">
                  <img
                    src={formData.image}
                    alt="Product preview"
                    className="h-20 w-20 rounded-xl border border-black/10 object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 text-sm font-semibold text-[var(--primary)]">
                      <ImageIcon size={15} />
                      Image preview
                    </p>
                    <p className="mt-1 text-xs text-[var(--secondary)]">
                      URL or uploaded image selected
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold leading-5 text-[var(--primary)]">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={4}
              className="mt-1 block w-full resize-none rounded-xl border border-black/10 bg-white/70 px-3 py-2.5 text-sm text-[var(--primary)] outline-none transition placeholder:text-[var(--secondary)]/60 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
            />
          </div>

          {/* Buttons */}
          <div
            className="
              flex flex-col-reverse gap-3
              border-t border-black/10 pt-4
              sm:flex-row sm:justify-end
            "
          >
            <button
              type="button"
              onClick={onClose}
              className="
                rounded-xl border border-black/10
                px-5 py-2.5
                text-sm font-semibold
                text-[var(--secondary)]
                transition
                hover:bg-black/5
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                inline-flex items-center
                justify-center gap-2
                rounded-xl
                bg-[var(--primary)]
                px-5 py-2.5
                text-sm font-semibold text-white
                transition
                hover:opacity-90
              "
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;