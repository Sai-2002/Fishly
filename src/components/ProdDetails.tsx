// src/components/ProdDetails.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./NavBar";
import { useCart } from "./CartContext";
import { Product } from "../types/Product";

interface ProdDetailsProps {
  products: Product[]; // List of all products
}

const ProdDetails: React.FC<ProdDetailsProps> = ({ products }) => {
  const location = useLocation();
  const product = location.state; // Accessing product directly from location state
  const { totalCount, updateCartItem, removeFromCart } = useCart();
  const [count, setCount] = useState(0);
  const [istoggle, setIsToggle] = useState(false)
  const buttonData = [
    {
      id: 1,
      name: "Gravy",
      description: product.gravy,
    },
    {
      id: 2,
      name: "Fry",
      description: product.fry,
    },
    {
      id: 3,
      name: "Barbeque",
      description: product.barbeque,
    },
  ];

  const [popupContent, setPopupContent] = useState<{
    name: string;
    description: string;
  } | null>(null);

  const openPopup = (content: { name: string; description: string }) => {
    setPopupContent(content);
    setIsToggle(true);
  };

  // Function to close the popup
  const closePopup = () => {
    setIsToggle(false);
    setPopupContent(null);
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Quantity update handler
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

  // const togglePopup=()=>{
  //   setIsToggle(!istoggle)
  // }

  if (!product) return <div>Error: Product details are unavailable.</div>;


  // Recipe toggle functionality
  const [isRecipeVisible, setRecipeVisible] = useState(false);
  const toggleRecipe = () => setRecipeVisible(!isRecipeVisible);

  // Filter out the selected product to display other products
  const otherProducts = products.filter((p) => p.id !== product.id);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar
        totalCount={totalCount}
        onSearchChange={() => {}}
        searchTerm={""}
        onSearchBoxClick={() => {}}
      />

      <div className="flex-grow flex justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="w-full md:w-1/2 flex justify-center mb-4 md:mb-0 relative">
              <img
                src={"data:image/jpeg;base64," + product.image}
                alt={product.name}
                className="w-48 h-48 object-cover rounded-lg"
              />
              {/* <button
                onClick={handlePrevImage}
                className="left-arrow absolute left-2 top-1/2 transform -translate-y-1/2"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={handleNextImage}
                className="right-arrow absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <FaChevronRight />
              </button> */}
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-center font-sans">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg mb-1">
                <span className="font-semibold">Weight:</span> {product.weight} g
              </p>
              <p className="text-lg mb-1">
                <span className="font-semibold">Pieces:</span> {product.pieces}
              </p>
              <p className="text-lg mb-1">
                <span className="font-semibold">Servings:</span>{" "}
                {product.servings} person
              </p>

              <p className="text-lg mb-4">
                <span className="font-semibold">Description:</span> This is a
                detailed description of {product.name}.
              </p>
              <p className="text-2xl font-semibold mb-2 text-[#22ccdd]">
                <span className="font-semibold">Price:</span> ₹{product.price}
              </p>
              <p
                className="text-blue-500 cursor-pointer"
                onClick={toggleRecipe}
              >
                {isRecipeVisible ? "Hide Recipe" : "Show Recipe"}
              </p>
              {isRecipeVisible && (
                <div className="pt-4">
                  <div className="flex space-x-4">
                    {buttonData.map((button) => (
                      <button
                        key={button.id}
                        onClick={() =>
                          openPopup({
                            name: button.name,
                            description: button.description,
                          })
                        }
                        className="px-4 py-2 bg-gradient-to-r from-[#81f8bb] to-[#22ccdd] text-black focus:outline-none rounded-lg"
                      >
                        {button.name}
                      </button>
                    ))}
                  </div>

                  {/* Popup overlay */}
                  {istoggle && popupContent && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="relative p-6 bg-white rounded-lg shadow-lg w-80">
                        <h2 className="text-lg font-bold">
                          {popupContent.name}
                        </h2>
                        <p className="mt-2 text-gray-600">
                          {popupContent.description}
                        </p>
                        <button
                          onClick={closePopup}
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            {count === 0 ? (
              <button
                className="bg-white text-black font-bold rounded-md px-4 py-2 w-32"
                onClick={() => handleCountChange(true)}
              >
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center border bg-white rounded-md px-1 py-1 w-32">
                <button
                  className="text-black font-bold rounded-md w-8 h-8 flex items-center justify-center"
                  onClick={() => handleCountChange(false)}
                >
                  -
                </button>
                <span className="flex-1 text-center font-bold">{count}</span>
                <button
                  className="text-black font-bold rounded-md w-8 h-8 flex items-center justify-center"
                  onClick={() => handleCountChange(true)}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="other-products mt-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">More Products</h2>
        {otherProducts.length > 0 ? (
          otherProducts.map((prod) => (
            <div key={prod._id} className="mb-4">
              <h3 className="text-lg font-bold">{prod.name}</h3>
              <img
                src={prod.image}
                alt={prod.name}
                className="w-32 h-32 object-cover rounded"
              />
              <p className="text-sm">{prod.description}</p>
              {/* Add a button or link to view details of this product */}
            </div>
          ))
        ) : (
          <p>No other products available.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProdDetails;
