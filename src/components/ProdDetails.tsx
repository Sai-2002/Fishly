import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { useCart } from "./CartContext";

const ProdDetails: React.FC = () => {
  const location = useLocation();
  const product = location.state;
  const { cartItems, updateCartItem, removeFromCart, totalCount } = useCart();
  const [count, setCount] = useState(0);
  const [istoggle, setIsToggle] = useState(false);

  const buttonData = [
    { id: 1, name: "Gravy", description: product.gravy },
    { id: 2, name: "Fry", description: product.fry },
    { id: 3, name: "Barbeque", description: product.barbeque },
  ];
  const [popupContent, setPopupContent] = useState<{
    name: string;
    description: string[];
  } | null>(null);

  // Initialize count from session storage and synchronize with cart state
  useEffect(() => {
    window.scrollTo(0, 0);

    const storedCount = sessionStorage.getItem(`count_${product._id}`);
    const initialCount = storedCount ? parseInt(storedCount, 10) : 0;
    setCount(initialCount);
  }, [product]);

  // Synchronize count with cart items when they change
  useEffect(() => {
    const cartItem = cartItems.find((item) => item._id === product._id);
    if (cartItem) {
      setCount(cartItem.count);
      sessionStorage.setItem(`count_${product._id}`, cartItem.count.toString());
    } else {
      setCount(0);
      sessionStorage.removeItem(`count_${product._id}`);
    }
  }, [cartItems, product._id]);

  const handleCountChange = (increment: boolean) => {
    setCount((prevCount) => {
      const newCount = increment ? prevCount + 1 : Math.max(prevCount - 1, 0);

      // Update session storage
      sessionStorage.setItem(`count_${product._id}`, newCount.toString());

      // Update cart context
      if (newCount > 0) {
        updateCartItem(product, newCount);
      } else {
        removeFromCart(product._id);
      }

      return newCount;
    });
  };

  const openPopup = (content: { name: string; description: string }) => {
    const bulletPoints = content.description
      .split(".")
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence !== "");

    setPopupContent({ name: content.name, description: bulletPoints });
    setIsToggle(true);
  };

  const closePopup = () => {
    setIsToggle(false);
    setPopupContent(null);
  };

  if (!product) return <div>Error: Product details are unavailable.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      <Navbar
        totalCount={totalCount}
        onSearchChange={() => {}}
        searchTerm=""
        onSearchBoxClick={() => {}}
      />

      <div className="flex justify-center items-center min-h-screen p-4 sm:p-8 bg-gray-100">
        <div className="bg-white w-full max-w-4xl shadow-lg rounded-md overflow-hidden flex flex-col sm:flex-row">
          {/* Left: Product Image */}
          <div className="w-full sm:w-1/2 p-4 sm:p-8 pt-10 sm:pt-20 flex justify-center">
            <img
              src={"data:image/jpeg;base64," + product.image}
              alt={product.name}
              className="w-64 max-w-xs h-48 object-fill pt-6"
            />
          </div>

          {/* Right: Product Details */}
          <div className="w-full sm:w-1/2 p-4 sm:p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{product.name}</h1>
              <p className="text-gray-600 mb-2 sm:mb-4">by Fishly</p>
              <div className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-4">
                Rs.{product.price}
              </div>
              <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6">
                {product.description}
              </p>

              {/* Quantity Selector */}
              {count === 0 ? (
                <button
                  className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors w-full"
                  onClick={() => handleCountChange(true)}
                >
                  Add to Cart
                </button>
              ) : (
                <div className="flex items-center mb-4 sm:mb-6">
                  <span className="text-md font-semibold text-gray-600 mr-4">
                    Quantity
                  </span>
                  <button
                    className="border px-2 py-1 text-gray-600 hover:bg-gray-200"
                    onClick={() => handleCountChange(false)}
                  >
                    -
                  </button>
                  <span className="mx-4">{count}</span>
                  <button
                    className="border px-2 py-1 text-gray-600 hover:bg-gray-200"
                    onClick={() => handleCountChange(true)}
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            {/* Recipe Tabs */}
            <div className="flex flex-wrap mt-6 space-x-3 text-sm font-medium text-gray-600">
              <span>See Recipe for</span>
              {buttonData.map((button) => (
                <span
                  className="cursor-pointer hover:text-black"
                  key={button.id}
                  onClick={() => openPopup(button)}
                >
                  {button.name}
                </span>
              ))}

              {istoggle && popupContent && (
                <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50">
                  <div className="relative bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-lg sm:max-w-xl mt-16">
                    <h2 className="text-lg font-bold mb-2">
                      {popupContent.name}
                    </h2>
                    <ul className="list-disc list-inside text-gray-600">
                      {popupContent.description.map((point, index) => (
                        <li key={index} className="mb-1">
                          {point}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={closePopup}
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProdDetails;
