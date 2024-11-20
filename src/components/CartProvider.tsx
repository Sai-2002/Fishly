import React, { createContext, useContext, useState } from "react"; // Adjust the import path

// Define CartItem to extend Product and ensure quantity is a string
interface CartItem {
  _id: string; // Ensure the type matches your product structure
  name: string;
  price: number;
  quantity: string;
  pieces: string;
  servings: string;
  description: string; // Quantity must be a string
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  removeFromCart: (id: string) => void;
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

  // Add to cart with only required fields
  const addToCart = (item: CartItem) => {
    const { _id, name, pieces, price, description, quantity, servings,} = item; // Extract required fields
    setCart((prev) => {

      console.log("Previous data in cart provider" + prev)
      const existingItem = prev.find((i) => i._id === _id);
      if (existingItem) {
        // Update existing item's quantity
        return prev.map((i) =>
          i._id === _id
            ? {
                ...i,
                quantity: String(Number(i.quantity) + Number(quantity)),
              }
            : i
        );
      }
      // Add new item to cart with extracted fields
      return [
        ...prev,
        {
          _id,
          name,
          pieces,
          price,
          quantity: String(quantity),
          servings,
          description,
        },
      ];
    });
  };

  // Increment item's quantity
  const incrementItem = (_id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === _id
          ? { ...item, quantity: String(Number(item.quantity) + 1) }
          : item
      )
    );
  };

  // Decrement item's quantity
  const decrementItem = (_id: string) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item._id === _id);
      if (existingItem) {
        if (Number(existingItem.quantity) > 1) {
          // Update quantity if more than 1
          return prev.map((item) =>
            item._id === _id
              ? { ...item, quantity: String(Number(item.quantity) - 1) }
              : item
          );
        } else {
          // Remove item if quantity is 1
          return prev.filter((item) => item._id !== _id);
        }
      }
      return prev; // No changes if item not found
    });
  };

  // Remove item from cart
  const removeFromCart = (_id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== _id));
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

