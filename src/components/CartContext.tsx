import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem } from "../types/CartItem"; // Adjust import based on your structure

interface CartContextProps {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  updateCartItem: (item: CartItem, count: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void; // Optional: Function to clear the cart
  totalCount: number;
}

// Create CartContext
const CartContext = createContext<CartContextProps | undefined>(undefined);

// CartProvider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load initial state from sessionStorage if available
    return JSON.parse(sessionStorage.getItem("cartItems") || "[]");
  });

  const [totalCount, setTotalCount] = useState(0);

  // Update session storage whenever cartItems change
  useEffect(() => {
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Update totalCount whenever cartItems change
  useEffect(() => {
    const count = cartItems.reduce((acc, item) => acc + item.count, 0);
    setTotalCount(count);
  }, [cartItems]);

  // Add item to the cart
  const addItem = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i._id === item._id);
      if (existingItem) {
        return prevItems.map((i) =>
          i._id === item._id
            ? { ...i, count: i.count + item.count } // Increment count if item exists
            : i
        );
      } else {
        return [...prevItems, item]; // Add new item if it doesn't exist
      }
    });
  };

  // Update item quantity/count in the cart
  const updateCartItem = (item: CartItem, count: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i._id === item._id);
      if (existingItem) {
        return prevItems.map((i) =>
          i._id === item._id
            ? { ...i, count, quantity: String(item.weight) } // Update existing item
            : i
        );
      } else {
        return [
          ...prevItems,
          { ...item, count, quantity: String(item.weight) }, // Add new item if not found
        ];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  // Clear cart items from state and sessionStorage
  const clearCart = () => {
    setCartItems([]);
    sessionStorage.removeItem("cartItems"); // Clear the cart from session storage
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        updateCartItem,
        removeFromCart,
        clearCart,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Export CartContext itself if needed
export { CartContext };
