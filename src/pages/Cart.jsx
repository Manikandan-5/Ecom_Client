// pages/Cart.js
import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import api from '../api/axios'
const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalItems, totalAmount } = useContext(CartContext);
 
const handleCheckout = async () => {
  try {

    // GET USER
    const user = JSON.parse(
      localStorage.getItem("user")
    );
 console.log(user)
    if (!user) {
     toast.warning("Please login");
      return;
    }

    const cartData = {
      userId: user.id,

      email: user.email,

      items: cart.map((item) => ({
        productId: item._id,

        name: item.name,

        image: item.image,

        selectedSize:
          item.selectedSize,

        quantity: item.quantity,

        price:
          item.finalPrice ||
          item.price,
      })),

      totalAmount,
    };

    const { data } = await api.post(
      "/cart",
      cartData
    );

    toast.success("Checkout successful");

    console.log(data);

  } catch (error) {

    console.log(error);

    toast.error("Checkout failed");
  }
};
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({totalItems} items)</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {cart.map((item) => (
              <div
                key={`${item._id}-${item.selectedSize}`}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4"
              >
                {/* Product Image */}
                <div className="sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/128x128?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      {item.brand && <p className="text-sm text-gray-500">{item.brand}</p>}
                      {item.selectedSize && (
                        <p className="text-sm text-gray-600 mt-1">Size: {item.selectedSize}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ₹{(item.finalPrice || item.price) * item.quantity}
                      </div>
                      {item.sale > 0 && (
                        <div className="text-sm text-gray-400 line-through">
                          ₹{item.price * item.quantity}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1, item.selectedSize)}
                        className="p-1 rounded-md border border-gray-300 hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1, item.selectedSize)}
                        className="p-1 rounded-md border border-gray-300 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id, item.selectedSize)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 border-b pb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>
              <div className="pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
         <button
  onClick={handleCheckout}
  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mt-4"
>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;