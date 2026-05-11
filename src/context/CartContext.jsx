// context/CartContext.js
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    console.log("Loading cart from localStorage:", savedCart);
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        updateCartSummary(parsedCart);
      } catch (error) {
        console.error("Error parsing cart:", error);
        setCart([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    console.log("Saving cart to localStorage:", cart);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartSummary(cart);
    
    // Dispatch event for navbar and other components
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  const updateCartSummary = (cartItems) => {
    const items = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    const amount = cartItems.reduce(
      (total, item) => total + ((item.finalPrice || item.price || item.rate || 0) * (item.quantity || 1)),
      0
    );
    setTotalItems(items);
    setTotalAmount(amount);
  };

  const addToCart = (product) => {
    console.log("addToCart called with product:", product);
    
    setCart(prevCart => {
      // Check if product already exists with same ID and size
      const existingIndex = prevCart.findIndex(
        item => item._id === product._id && item.selectedSize === product.selectedSize
      );

      if (existingIndex !== -1) {
        // Product exists, increase quantity by 1
        console.log("Product exists, increasing quantity by 1");
        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + (product.quantity || 1)
        };
        return updatedCart;
      } else {
        // Add new product
        console.log("Adding new product to cart");
        return [...prevCart, { ...product, quantity: product.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (id, size = null) => {
    console.log("Removing from cart:", id, size);
    
    setCart(prevCart => {
      const newCart = prevCart.filter(item => {
        if (size) {
          return !(item._id === id && item.selectedSize === size);
        }
        return item._id !== id;
      });
      return newCart;
    });
  };

  const updateQuantity = (id, newQuantity, size = null) => {
    console.log("Updating quantity:", id, newQuantity, size);
    
    if (newQuantity < 1) {
      removeFromCart(id, size);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item => {
        if (size) {
          return item._id === id && item.selectedSize === size
            ? { ...item, quantity: newQuantity }
            : item;
        }
        return item._id === id
          ? { ...item, quantity: newQuantity }
          : item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + ((item.finalPrice || item.price || item.rate || 0) * (item.quantity || 1)),
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        totalAmount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;