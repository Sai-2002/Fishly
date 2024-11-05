import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./NavBar";
import { useCart } from "./CartContext";
import { Product } from "../types/Product";

interface ProdDetailsProps {
  products: Product[];
}

const ProdDetails: React.FC<ProdDetailsProps> = () => {
  const location = useLocation();
  const product = location.state;
  const { totalCount, updateCartItem, removeFromCart } = useCart();
  const [count, setCount] = useState(0);
  const [istoggle, setIsToggle] = useState(false);

  const buttonData = [
    { id: 1, name: "Gravy", description: product.gravy },
    { id: 2, name: "Fry", description: product.fry },
    { id: 3, name: "Barbeque", description: product.barbeque },
  ];

  const [popupContent, setPopupContent] = useState<{
    name: string;
    description: string;
  } | null>(null);

  const openPopup = (content: { name: string; description: string }) => {
    setPopupContent(content);
    setIsToggle(true);
  };

  const closePopup = () => {
    setIsToggle(false);
    setPopupContent(null);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCountChange = (increment: boolean) => {
    setCount((prevCount) => {
      const newCount = increment ? prevCount + 1 : Math.max(prevCount - 1, 0);
      if (newCount > 0) {
        updateCartItem(product, newCount);
      } else {
        removeFromCart(product.id);
      }
      return newCount;
    });
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
                  Add to Bag
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

            {/* Tabs for Details, Features, Shipping */}
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

              {/* Popup Content */}
              {istoggle && popupContent && (
                <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50">
                  {" "}
                  {/* Increased z-index */}
                  <div className="relative bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-lg sm:max-w-xl mt-16">
                    {" "}
                    {/* Adjusted mt value */}
                    <h2 className="text-lg font-bold mb-2">
                      {popupContent.name}
                    </h2>
                    <p className="text-gray-600">{popupContent.description}</p>
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
