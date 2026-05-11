import { Edit, Trash2, Package } from "lucide-react";

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="h-48 bg-gray-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500">
          {product.brand}
        </p>

        <div className="flex justify-between items-center mt-3">
          <span className="font-bold text-xl">
            ₹{product.price}
          </span>

          <span>
            Stock: {product.stock}
          </span>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={onEdit}
            className="flex-1 border py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>

          <button
            onClick={onDelete}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;