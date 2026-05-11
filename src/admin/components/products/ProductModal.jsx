import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const ProductModal = ({
  product,
  onClose,
  onSave,
}) => {
  const [loading, setLoading] = useState(false);

  const [aiLoading, setAiLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    brand: product?.brand || "",
    category: product?.category || "For Men",
    description: product?.description || "",
    price: product?.price || "",
    sale: product?.sale || 0,
    stock: product?.stock || "",
    sizes:
      product?.sizes?.join(", ") ||
      "SM, MD, LG, XL",
    image: product?.image || "",
  });

  // AI DESCRIPTION
  const generateDescription = async () => {
    if (!formData.name) {
    toast.warning("Enter product name first");
      return;
    }

    try {
      setAiLoading(true);

      const { data } = await api.post("/ai/generate-description", {
        title: formData.name,
      });

      setFormData((prev) => ({
        ...prev,
        description: data.description,
      }));
    } catch (error) {
      console.log(error);
     toast.error("AI generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  // SAVE PRODUCT
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const productData = {
      ...formData,

      price: Number(formData.price),

      sale: Number(formData.sale),

      stock: Number(formData.stock),

      sizes: formData.sizes
  .split(",")
  .map((size) => size.trim()),
    };

    // API URL
    const url = product
      ? `/products/${product._id}`
      : "/products";

    // API METHOD
    const method = product
      ? "put"
      : "post";

    // API CALL
    const { data } = await api[method](
      url,
      productData
    );

    // SAFE RESPONSE
    const savedProduct =
      data.product || data;

    // VALIDATION
    if (!savedProduct?._id) {
   toast.error("Invalid product response");
      return;
    }

    // SEND TO PARENT
    onSave(savedProduct);

  } catch (error) {
    console.log(error);

   toast.error("Failed to save product");

  } finally {
    setLoading(false);
  }
};

  const kidsSizes = [
  "0-3 Months",
  "0-6 Months",
  "0-12 Months",
  "1-2 Years",
 
];

const adultSizes = [
  "SM",
  "MD",
  "LG",
  "XL",
];

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-4 my-8">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">
            {product
              ? "Edit Product"
              : "Add Product"}
          </h2>

          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-2 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4"
        >
          {/* NAME + BRAND */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Product Name
              </label>

              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Brand
              </label>

              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    brand: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Category
            </label>

            <select
              value={formData.category}
              onChange={(e) => {
  const selectedCategory = e.target.value;

  setFormData({
    ...formData,
    category: selectedCategory,

    sizes:
      selectedCategory === "Kids"
        ? kidsSizes.join(", ")
        : adultSizes.join(", "),
  });
}}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="For Men">
                For Men
              </option>

              <option value="For Women">
                For Women
              </option>

              <option value="Kids">
                Kids
              </option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">
                Description
              </label>

              <button
                type="button"
                onClick={generateDescription}
                disabled={aiLoading}
                className="bg-black text-white px-3 py-1 rounded-lg text-sm"
              >
                {aiLoading
                  ? "Generating..."
                  : "AI Generate"}
              </button>
            </div>

            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* PRICE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Price
              </label>

              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Sale %
              </label>

              <input
                type="number"
                value={formData.sale}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sale: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Stock
              </label>

              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* SIZES */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Sizes
            </label>

           <div>
  <label className="block mb-1 text-sm font-medium">
    Sizes
  </label>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
    {(formData.category === "Kids"
      ? kidsSizes
      : adultSizes
    ).map((size) => (
      <label
        key={size}
        className="flex items-center gap-2 border rounded-lg px-3 py-2"
      >
        <input
          type="checkbox"
          checked={formData.sizes.includes(size)}
          onChange={(e) => {
            let updatedSizes;

            if (e.target.checked) {
              updatedSizes = [
                ...formData.sizes.split(", ").filter(Boolean),
                size,
              ];
            } else {
              updatedSizes = formData.sizes
                .split(", ")
                .filter((s) => s !== size);
            }

            setFormData({
              ...formData,
              sizes: updatedSizes.join(", "),
            });
          }}
        />

        {size}
      </label>
    ))}
  </div>
</div>
          </div>

          {/* IMAGE */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Image URL
            </label>

            <input
              type="text"
              value={formData.image}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  image: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white py-2 rounded-lg"
            >
              {loading
                ? "Saving..."
                : product
                ? "Update Product"
                : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;