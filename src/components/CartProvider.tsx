import React, { createContext, useContext, useState } from "react";
import { Product } from "../types/Product"; // Adjust the import path

// Define CartItem to extend Product and ensure quantity is a string
interface CartItem extends Product {
  quantity: string; // Quantity must be a string
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  incrementItem: (id: number) => void;
  decrementItem: (id: number) => void;
  removeFromCart: (id: number) => void;
  totalItems: number; // Optional: total items in the cart
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        // Update existing item's quantity, ensuring it's treated as a string
        return prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity: String(Number(i.quantity) + Number(item.quantity)),
              }
            : i
        );
      }
      // Add new item to cart with quantity as a string
      return [...prev, { ...item, quantity: String(item.quantity) }];
    });
  };

  const incrementItem = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: String(Number(item.quantity) + 1) }
          : item
      )
    );
  };

  const decrementItem = (id: number) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === id);
      if (existingItem) {
        if (Number(existingItem.quantity) > 1) {
          // Update quantity if more than 1
          return prev.map((item) =>
            item.id === id
              ? { ...item, quantity: String(Number(item.quantity) - 1) }
              : item
          );
        } else {
          // Remove item if quantity is 1
          return prev.filter((item) => item.id !== id);
        }
      }
      return prev; // No changes if item not found
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculate total items in cart
  const totalItems = cart.reduce(
    (total, item) => total + Number(item.quantity),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        incrementItem,
        decrementItem,
        removeFromCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
