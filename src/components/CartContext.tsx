import React, { createContext, useContext, useEffect, useState } from "react";

interface CartItem {
  _id: string; // Unique identifier for the item (e.g., product ID)
  name: string; // Name of the item
  price: number; // Price of the item
  count: number; // Quantity of the item in the cart
  description: string; // Short description of the item (optional)
  image: string;
  weight: string;
}

interface CartContextProps {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  updateCartItem: (item: CartItem, count: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalCount: number;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize cart items from session storage or an empty array
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    return JSON.parse(sessionStorage.getItem("cartItems") || "[]");
  });

  const [totalCount, setTotalCount] = useState(0);

  // Effect to update session storage whenever cartItems change
  useEffect(() => {
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Effect to calculate the total count of items in the cart whenever cartItems change
  useEffect(() => {
    const count = cartItems.reduce((acc, item) => acc + item.count, 0);
    setTotalCount(count);
  }, [cartItems]);

  // Add item to the cart (with required fields)
  const addItem = (item: CartItem) => {
    const { _id, name, price, count, description, image, weight } = item;
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i._id === _id);
      if (existingItem) {
        // If item already exists, increment the count
        return prevItems.map((i) =>
          i._id === _id ? { ...i, count: i.count + count } : i
        );
      } else {
        // If item doesn't exist, add it to the cart
        return [
          ...prevItems,
          { _id, name, price, count, description, image, weight },
        ];
      }
    });
  };

  // Update item quantity/count in the cart (with required fields)
  const updateCartItem = (item: CartItem, count: number) => {
    const { _id, name, price, description, image, weight } = item;
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i._id === _id);
      if (existingItem) {
        // Update the count if item exists
        return prevItems.map((i) => (i._id === _id ? { ...i, count } : i));
      } else {
        // Add a new item with the specified fields if it doesn't exist
        return [
          ...prevItems,
          { _id, name, price, count, description, image, weight },
        ];
      }
    });
  };

  // Remove item from the cart by ID
  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item._id !== id);
      sessionStorage.setItem("cartItems", JSON.stringify(updatedItems)); // Update session storage
      return updatedItems;
    });
  };

  // Clear the entire cart and remove it from session storage
  const clearCart = () => {
    setCartItems([]); // Clear the state
    sessionStorage.removeItem("cartItems"); // Clear session storage
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
        setCartItems,
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
