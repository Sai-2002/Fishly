import React, { createContext, useContext, useEffect, useState } from "react";
// import { CartItem } from "../types/CartItem"; // Adjust import based on your structure

interface CartItem {
  _id: string; // Unique identifier for the item (e.g., product ID)
  name: string; // Name of the item
  price: number; // Price of the item
  count: number; // Quantity of the item in the cart
  description: string; // Short description of the item (optional)
}


interface CartContextProps {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  updateCartItem: (item: CartItem, count: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalCount: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    return JSON.parse(sessionStorage.getItem("cartItems") || "[]");
  });

  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const count = cartItems.reduce((acc, item) => acc + item.count, 0);
    setTotalCount(count);
  }, [cartItems]);

  // Add item to the cart with only required fields
  const addItem = (item: CartItem) => {
    const { _id, name, price, count, description } = item; // Extract required fields
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i._id === _id);
      if (existingItem) {
        return prevItems.map((i) =>
          i._id === _id
            ? { ...i, count: i.count + count } // Increment count if item exists
            : i
        );
      } else {
        return [
          ...prevItems,
          { _id, name, price, count, description }, // Add only required fields
        ];
      }
    });
  };

  // Update item quantity/count in the cart with required fields
  const updateCartItem = (item: CartItem, count: number) => {
    const { _id, name, price, description } = item; // Extract required fields
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i._id === _id);
      if (existingItem) {
        return prevItems.map((i) =>
          i._id === _id
            ? { ...i, count } // Update count if item exists
            : i
        );
      } else {
        return [
          ...prevItems,
          { _id, name, price, count, description }, // Add new item with required fields
        ];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item._id !== id);
      sessionStorage.setItem(`count_${id}`, "0");
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    sessionStorage.removeItem("cartItems");
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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartContext };
