import React, { createContext, useContext, useState, useEffect } from "react";
import { cartHelpers, getAuthToken } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartLoaded, setCartLoaded] = useState(false);

  const { user } = useAuth();

  const loadCart = async () => {
    console.log("=== Cart FETCH START ===");
    setLoading(true);
    setError(null);
    try {
      const data = await cartHelpers.getCart();
      setCart(data || { items: [] });
      setCartLoaded(true);
      console.log("Cart loaded:", data);
    } catch (err) {
      console.error("=== Cart FETCH ERROR ===");
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      setError(err.response?.data?.message || "Sepet yüklenemedi");
      setCart({ items: [] });
      setCartLoaded(true);
    } finally {
      setLoading(false);
    }
  };

   
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      console.log("User changed, reloading cart. User:", user?.username);
      loadCart();
    } else {
      console.log("No token, clearing cart");
      setCart({ items: [] });
      setCartLoaded(true);
    }
  }, [user]);

  const refetchCart = async () => await loadCart();
  const clearError = () => setError(null);

  const addToCart = async (product, quantity = 1) => {
    try {
      const data = await cartHelpers.addItem(product.id, quantity, product.price);
      await loadCart();
      return { success: true, data };
    } catch (err) {
      console.error("Add to cart error:", err);
      setError(err.response?.data?.message || "Sepete eklenemedi");
      return {
        success: false,
        message: err.response?.data?.message || "Sepete eklenemedi",
      };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartHelpers.removeItem(productId);
      await loadCart();
    } catch (err) {
      console.error("Remove from cart error:", err);
      setError(err.response?.data?.message || "Ürün silinemedi");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await cartHelpers.updateItem(productId, quantity);
      await loadCart();
    } catch (err) {
      console.error("Update quantity error:", err);
      setError(err.response?.data?.message || "Miktar güncellenemedi");
    }
  };

  const clearCart = async () => {
    try {
      await cartHelpers.clearCart();
      setCart({ items: [] });
    } catch (err) {
      console.warn("Clear cart failed:", err);
      setCart({ items: [] });
    }
  };

  const getTotalItems = () =>
    cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  const getTotalPrice = () =>
    cart?.items?.reduce((sum, item) => sum + item.price * (item.quantity || 0), 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cartItems: cart.items || [],
        loading,
        error,
        cartLoaded,
        loadCart,
        refetchCart,
        clearError,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalItems,
        getTotalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);