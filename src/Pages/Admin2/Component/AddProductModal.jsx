
import { useRef, useState } from "react";
import { X, Plus, Upload } from "lucide-react";

const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
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

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        image: "Please select a valid image file",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size must be less than 5MB",
      }));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        image: String(reader.result),
      }));

      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    };

    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Enter a valid price";
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

    const newProduct = {
      id: Date.now(),

      name: formData.name.trim(),

      category: formData.category,

      categorySlug: formData.category
        .toLowerCase()
        .replace(/\s+/g, "-"),

      sku: formData.sku.trim() || `SKU-${Date.now()}`,

      price: Number(formData.price),

      originalPrice: Number(formData.originalPrice || formData.price),

      stock: Number(formData.stock),

      availability:
        Number(formData.stock) > 0
          ? formData.availability
          : "Out of Stock",

      description: formData.description.trim(),

      image: formData.image.trim() || "/placeholder-product.png",

      images: formData.image.trim()
        ? [formData.image.trim()]
        : [],
    };

    onAddProduct(newProduct);

    setFormData({
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

    setErrors({});
    onClose();
  };

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/40 px-3 py-5
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          flex max-h-[92vh] w-full max-w-2xl
          flex-col overflow-hidden rounded-2xl
          border border-white/70
          bg-white/85 shadow-2xl
          backdrop-blur-2xl
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
      >
        {/* Header */}
        <div
          className="
            flex items-center justify-between
            border-b border-white/70
            bg-white/35 px-4 py-4
            sm:px-6
          "
        >
          <div>
            <h2
              id="add-product-title"
              className="text-lg font-bold text-(--primary) sm:text-xl"
            >
              Add Product
            </h2>

            <p className="mt-0.5 text-xs text-(--secondary)">
              Add a new product to your inventory
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close add product modal"
            className="
              rounded-lg p-2
              text-(--secondary)
              transition hover:bg-black/5
              hover:text-(--primary)
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-4 py-5 sm:px-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Product Name */}
            <div className="sm:col-span-2">
              <label
                htmlFor="product-name"
                className="mb-1.5 block text-xs font-semibold text-(--primary)"
              >
                Product Name *
              </label>

              <input
                id="product-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="
                  w-full rounded-xl border border-white/80
                  bg-white/55 px-3 py-2.5 text-sm
                  text-(--primary) outline-none
                  transition placeholder:text-gray-400
                  focus:border-(--primary)
                  focus:ring-2 focus:ring-(--primary)/10
                "
              />

              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="product-category"
                className="mb-1.5 block text-xs font-semibold text-(--primary)"
              >
                Category *
              </label>

              <select
                id="product-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="
                  w-full rounded-xl border border-white/80
                  bg-white/55 px-3 py-2.5 text-sm
                  text-(--primary) outline-none
                  focus:border-(--primary)
                "
              >
                <option value="">Select category</option>
                <option value="Garments">Garments</option>
                <option value="Cosmetics">Cosmetics</option>
                <option value="Accessories">Accessories</option>
                <option value="Other">Other</option>
              </select>

              {errors.category && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.category}
                </p>
              )}
            </div>

            {/* SKU */}
            <div>
              <label
                htmlFor="product-sku"
                className="mb-1.5 block text-xs font-semibold text-(--primary)"
              >
                SKU
              </label>

              <input
                id="product-sku"
                name="sku"
                type="text"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. SHIRT-001"
                className="
                  w-full rounded-xl border border-white/80
                  bg-white/55 px-3 py-2.5 text-sm
                  text-(--primary) outline-none
                  focus:border-(--primary)
                "
              />
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="product-price"
                className="mb-1.5 block text-xs font-semibold text-(--primary)"
              >
                Selling Price *
              </label>

              <input
                id="product-price"
                name="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter selling price"
                className="
                  w-full rounded-xl border border-white/80
                  bg-white/55 px-3 py-2.5 text-sm
                  text-(--primary) outline-none
                  focus:border-(--primary)
                "
              />

              {errors.price && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.price}
                </p>
              )}
            </div>

            {/* Original Price */}
            <div>
              <label
                htmlFor="product-original-price"
                className="mb-1.5 block text-xs font-semibold text-(--primary)"
              >
                Original Price
              </label>

              <input
                id="product-original-price"
                name="originalPrice"
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="Enter original price"
                className="
                  w-full rounded-xl border border-white/80
                  bg-white/55 px-3 py-2.5 text-sm
                  text-(--primary) outline-none
                  focus:border-(--primary)
                "
              />
            </div>

            {/* Stock */}
            <div>
              <label
                htmlFor="product-stock"
                className="mb-1.5 block text-xs font-semibold text-(--primary)"
              >
                Stock Quantity *
              </label>

              <input
                id="product-stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                className="
                  w-full rounded-xl border border-white/80
                  bg-white/55 px-3 py-2.5 text-sm
                  text-(--primary) outline-none
                  focus:border-(--primary)
                "
              />

              {errors.stock && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.stock}
                </p>
              )}
            </div>

            {/* Availability */}
            <div>
              <label
                htmlFor="product-availability"
                className="mb-1.5 block text-xs font-semibold text-(--primary)"
              >
                Availability
              </label>

              <select
                id="product-availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="
                  w-full rounded-xl border border-white/80
                  bg-white/55 px-3 py-2.5 text-sm
                  text-(--primary) outline-none
                  focus:border-(--primary)
                "
              >
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            {/* Image URL + Upload */}
            <div className="sm:col-span-2">
              <label
                htmlFor="product-image"
                className="mb-1.5 block text-xs font-semibold text-(--primary)"
              >
                Product Image
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Upload
                    size={16}
                    className="
                      pointer-events-none absolute
                      left-3 top-3 text-(--secondary)
                    "
                  />

                  <input
                    id="product-image"
                    name="image"
                    type="url"
                    value={formData.image.startsWith("data:") ? "" : formData.image}
                    onChange={handleChange}
                    placeholder="Paste image URL"
                    className="
                      w-full rounded-xl border border-white/80
                      bg-white/55 py-2.5 pl-9 pr-3
                      text-sm text-(--primary)
                      outline-none focus:border-(--primary)
                    "
                  />
                </div>

                <input
                  ref={fileInputRef}
                  id="product-image-file"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="
                    inline-flex shrink-0 items-center justify-center gap-2
                    rounded-xl border border-white/80 bg-white/55
                    px-4 py-2.5 text-sm font-semibold text-(--primary)
                    transition hover:bg-white/80
                  "
                >
                  <Upload size={16} />
                  Upload Image
                </button>
              </div>

              {formData.image && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={formData.image}
                    alt="Selected product preview"
                    className="h-20 w-20 rounded-xl border border-white/80 bg-white/50 object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-(--primary)">
                      Image Preview
                    </p>
                    <p className="mt-1 break-all text-[11px] text-(--secondary)">
                      {formData.image.startsWith("data:")
                        ? "Uploaded image selected"
                        : formData.image}
                    </p>
                  </div>
                </div>
              )}

              {errors.image && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.image}
                </p>
              )}

              <p className="mt-1 text-[11px] text-(--secondary)">
                You can paste an image URL or upload an image up to 5MB.
              </p>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label
                htmlFor="product-description"
                className="mb-1.5 block text-xs font-semibold text-(--primary)"
              >
                Description
              </label>

              <textarea
                id="product-description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                className="
                  w-full resize-none rounded-xl
                  border border-white/80 bg-white/55
                  px-3 py-2.5 text-sm text-(--primary)
                  outline-none focus:border-(--primary)
                "
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div
            className="
              mt-6 flex flex-col-reverse gap-2
              border-t border-white/70 pt-4
              sm:flex-row sm:justify-end
            "
          >
            <button
              type="button"
              onClick={onClose}
              className="
                rounded-xl border border-white/80
                bg-white/45 px-5 py-2.5
                text-sm font-semibold text-(--secondary)
                transition hover:bg-white/70
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                inline-flex items-center
                justify-center gap-2 rounded-xl
                bg-(--primary) px-5 py-2.5
                text-sm font-semibold text-white
                transition hover:opacity-90
              "
            >
              <Plus size={17} />
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;