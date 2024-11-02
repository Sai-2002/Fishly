// src/components/Cart.tsx
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { CartContext } from "./CartContext";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { CartItem } from "../types/CartItem";
import axios from "axios";

interface CartProps {
  updateTotalCount: (counts: number[]) => void;
  searchTerm: string;
}

const Cart: React.FC<CartProps> = ({ updateTotalCount, searchTerm }) => {
  const navigate = useNavigate(); // Hook for navigation
  const cartContext = useContext(CartContext);
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  if (!cartContext) {
    return <div>Error: Cart context is unavailable.</div>;
  }

  const { cartItems, updateCartItem, removeFromCart } = cartContext;

  useEffect(() => {
    // Update the total count whenever cartItems change
    const counts = cartItems.map((item) => item.count);
    updateTotalCount(counts);
  }, [cartItems, updateTotalCount]);

  const handleCountChange = (item: CartItem, increment: boolean) => {
    const currentCount = item.count;
    const newCount = increment
      ? currentCount + 1
      : Math.max(currentCount - 1, 1);

    updateCartItem({ ...item, count: newCount }, newCount);
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + item.price * item.count;
  }, 0);

  // Function to handle search input change
  const handleSearchChange = (term: string) => {
    setLocalSearchTerm(term);
  };

  // Function to handle search box click
  const handleSearchBoxClick = () => {
    // Scroll logic can be added here if needed
  };

  const verifyToken = async () => {
    const uid = sessionStorage.getItem("uid");
    const token = sessionStorage.getItem("token");

    if (!uid || !token) {
      navigate("/login");
    }

    try {
      const response = await axios.post(
        "https://api.fishly.co.in/verify",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      if (response.data.success) {
        // Token is valid, set the logged-in state
        setIsLoggedIn(true);
        // Optionally navigate to a different page
        navigate("/checkout"); // Replace with your desired route
      } else {
        // Token is invalid, handle accordingly
        sessionStorage.removeItem("uid");
        sessionStorage.removeItem("token");
        setIsLoggedIn(false);
        // Optionally navigate to login
        navigate("/login");
      }
    } catch (error) {
      console.error("Verification failed", error);
      sessionStorage.removeItem("uid");
      sessionStorage.removeItem("token");
      setIsLoggedIn(false);
      // Optionally navigate to login
      navigate("/login");
    }
  };

  // const handleCheckoutClick = () => {
  //   if (isLoggedIn) {
  //     navigate("/checkout"); // Navigate to checkout page
  //   } else {
  //     navigate("/login"); // Navigate to login page
  //   }
  // };

  // const isLoggedIn = sessionStorage.getItem("uid") === "true";
  // if (!isLoggedIn) {
  //   navigate("/login"); // Redirect to the login page if not logged in
  // } else {
  //   navigate("/checkout"); // Navigate to the Checkout page if logged in
  // }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        totalCount={cartItems.reduce(
          (acc: number, item: CartItem) => acc + item.count,
          0
        )}
        onSearchChange={handleSearchChange}
        searchTerm={localSearchTerm}
        onSearchBoxClick={handleSearchBoxClick}
      />
      <div className="flex-grow p-4 flex justify-center items-center">
        <div className="max-w-lg w-full p-4 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-4 text-center">Cart</h1>
          {cartItems.length === 0 ? (
            <p className="text-center">Your cart is empty.</p>
          ) : (
            <ul>
              {cartItems.map((item: CartItem) => (
                <li
                  key={item._id}
                  className="mb-4 border-b pb-4 flex items-start"
                >
                  <img
                    src={"data:image/jpeg;base64," + item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover mr-4"
                  />
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <div className="flex flex-col mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <button
                          className="bg-gray-300 rounded px-2"
                          onClick={() => handleCountChange(item, false)}
                        >
                          -
                        </button>
                        <span className="font-bold">{item.count}</span>
                        <button
                          className="bg-gray-300 rounded px-2"
                          onClick={() => handleCountChange(item, true)}
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.weight}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p>
                      Price: <span className="font-bold">Rs. {item.price}</span>
                    </p>
                    <p>
                      Total:{" "}
                      <span className="font-bold">
                        Rs. {(item.price * item.count).toFixed(2)}
                      </span>
                    </p>
                    <button
                      className="text-red-500 underline mt-2"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {cartItems.length > 0 && (
        <div className="p-4 bg-white border-t">
          <div className="max-w-lg mx-auto">
            <div className="flex justify-end items-center mb-4">
              <p className="text-lg font-semibold">
                Total Price: Rs. {totalPrice.toFixed(2)}
              </p>
            </div>

            {isLoggedIn ? (
              <div className="flex justify-center">
                <button
                  onClick={verifyToken} // Navigate to checkout
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Checkout
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={verifyToken} // Navigate to checkout
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Cart;
