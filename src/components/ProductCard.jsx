import { useState, useContext, useEffect } from "react";
import {
  ShoppingCart,
  Star,
  TrendingDown,
  Check,
} from "lucide-react";

import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const { addToCart, cart } = useContext(CartContext);

  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [showQuantityIndicator, setShowQuantityIndicator] =
    useState(false);

  // =========================
  // CATEGORY NORMALIZATION
  // =========================

  const normalizedCategory =
    product.category?.toLowerCase() || "";

  const getCategoryColor = () => {
    switch (normalizedCategory) {
      case "men":
        return "bg-blue-100 text-blue-800";

      case "women":
        return "bg-pink-100 text-pink-800";

      case "kids":
        return "bg-green-100 text-green-800";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryLabel = () => {
    switch (normalizedCategory) {
      case "men":
        return "For Men";

      case "women":
        return "For Women";

      case "kids":
        return "Kids";

      default:
        return product.category;
    }
  };

  // =========================
  // CART MATCHING
  // =========================

  const existingCartItem = cart.find((item) => {
    const sameProduct = item._id === product._id;

    // Product without sizes
    if (!product.sizes || product.sizes.length === 0) {
      return sameProduct;
    }

    // Product with size
    return (
      sameProduct &&
      item.selectedSize === (selectedSize || null)
    );
  });

  const currentQuantity = existingCartItem?.quantity || 0;

  const isInCart = !!existingCartItem;

  // =========================
  // AUTO SELECT SIZE
  // =========================

  useEffect(() => {
    if (
      !selectedSize &&
      product.sizes?.length > 0
    ) {
      const cartItemWithSize = cart.find(
        (item) =>
          item._id === product._id &&
          item.selectedSize
      );

      if (cartItemWithSize) {
        setSelectedSize(cartItemWithSize.selectedSize);
      }
    }
  }, [cart, product, selectedSize]);

  // =========================
  // PRICE FUNCTIONS
  // =========================

  const calculateDiscountedPrice = () => {
    if (product.sale && product.sale > 0) {
      return (
        product.price -
        (product.price * product.sale) / 100
      );
    }

    return product.price;
  };

  const getDiscountPercentage = () => {
    return product.sale || 0;
  };

  // =========================
  // STOCK STATUS
  // =========================

  const getStockStatus = () => {
    if (product.stock === 0) {
      return {
        text: "Out of Stock",
        color: "text-red-600",
      };
    }

    if (product.stock < 10) {
      return {
        text: `Only ${product.stock} left`,
        color: "text-orange-600",
      };
    }

    return {
      text: "In Stock",
      color: "text-green-600",
    };
  };

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = () => {
    // Size required check
    if (
      product.sizes &&
      product.sizes.length > 0 &&
      !selectedSize
    ) {
      setShowSizeSelector(true);
      return;
    }

    const cartItem = {
      _id: product._id,
      title: product.title,
      brand: product.brand,
      price: Number(product.price),
      sale: Number(product.sale) || 0,
      image: product.image,
      category: normalizedCategory,
      description: product.description,
      quantity: 1,
      selectedSize: selectedSize || null,
      finalPrice: calculateDiscountedPrice(),
      stock: product.stock,
    };

    addToCart(cartItem);

    setShowQuantityIndicator(true);

    setTimeout(() => {
      setShowQuantityIndicator(false);
    }, 1500);
  };

  // =========================
  // RATING
  // =========================

  const renderRating = (rating = 4.5) => {
    const fullStars = Math.floor(rating);

    return (
      <div className="flex items-center gap-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < fullStars
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        <span className="text-xs text-gray-600">
          ({product.reviews?.length || 4})
        </span>
      </div>
    );
  };

  // =========================
  // UI
  // =========================

  return (
    <div
      className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* BADGES */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {getDiscountPercentage() > 0 && (
          <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
            <TrendingDown className="h-3 w-3" />
            {getDiscountPercentage()}% OFF
          </div>
        )}

        {product.category && (
          <div
            className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor()}`}
          >
            {getCategoryLabel()}
          </div>
        )}
      </div>

      {/* QUANTITY POPUP */}
      {showQuantityIndicator && (
        <div className="absolute top-1/2 left-1/2 z-20 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
          +1 Added!
        </div>
      )}

      {/* IMAGE */}
      <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x300?text=No+Image";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">
                No Image
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        {/* BRAND */}
        <div className="mb-2">
          {product.brand && (
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              {product.brand}
            </p>
          )}

          <h3 className="text-lg font-bold text-gray-800 line-clamp-1 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* RATING */}
        {renderRating(product.rating || 4.5)}

        {/* SIZE SELECTOR */}
        {product.sizes &&
          product.sizes.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">
                  Select Size
                </span>

                {showSizeSelector &&
                  !selectedSize && (
                    <span className="text-xs text-red-500">
                      *Required
                    </span>
                  )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setShowSizeSelector(false);
                    }}
                    className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* PRICE */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            ₹
            {calculateDiscountedPrice().toLocaleString()}
          </span>

          {getDiscountPercentage() > 0 && (
            <>
              <span className="text-sm text-gray-400 line-through">
                ₹{product.price.toLocaleString()}
              </span>

              <span className="text-xs text-green-600 font-semibold">
                Save ₹
                {(
                  product.price -
                  calculateDiscountedPrice()
                ).toLocaleString()}
              </span>
            </>
          )}
        </div>

        {/* STOCK */}
        <div className="mt-2">
          <span
            className={`text-xs font-medium ${getStockStatus().color}`}
          >
            {getStockStatus().text}
          </span>
        </div>

        {/* BUTTON */}
        {isInCart ? (
          <div className="flex items-center justify-between mt-4 gap-2">
            <button
              onClick={() => navigate("/cart")}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" />
              Go To Cart
            </button>

            <div className="text-sm font-semibold text-green-600">
              Qty: {currentQuantity}
            </div>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full mt-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              product.stock === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            Add To Cart
          </button>
        )}

        {/* CART INFO */}
        {isInCart && (
          <div className="text-center mt-2 text-xs text-green-600 font-medium">
            ✓ {currentQuantity} item(s) in cart
            {selectedSize &&
              ` - Size ${selectedSize}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;