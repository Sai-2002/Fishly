import React, { useState, useEffect } from "react";
import { FaBalanceScale, FaUtensils } from "react-icons/fa";
import { BiDish } from "react-icons/bi";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { Product } from "../types/Product";

interface ProductsProps {
  products: Product[]; // Include products as a prop
  updateTotalCount: (counts: number[]) => void;
  searchTerm: string;
  onProductClick: (product: Product) => void; // Add onProductClick prop
}

const Products: React.FC<ProductsProps> = ({
  products,
  updateTotalCount,
  searchTerm,
  onProductClick,
}) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [counts, setCounts] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize counts when products change
    setCounts(Array(products.length).fill(0));
  }, [products]);

  const handleCountChange = (
    product: Product,
    index: number,
    increment: boolean
  ) => {
    setCounts((prev) => {
      const newCounts = [...prev];
      if (increment) {
        newCounts[index] += 1;
      } else if (newCounts[index] > 0) {
        newCounts[index] -= 1;
      }

      updateTotalCount(newCounts);
      const currentCount = newCounts[index];

      if (currentCount > 0) {
        updateCartItem({ ...product, count: currentCount }, currentCount);
      } else {
        removeFromCart(product._id);
      }

      return newCounts;
    });
  };

  const handleProductClick = (product: Product) => {
    navigate("/product-details", { state: product });
    onProductClick(product); // Call the onProductClick prop to handle click
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    searchTerm
      ? product.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      : true
  );

  return (
    <div className="my-8 relative">
      <h2 className="text-2xl font-bold text-center mb-6">Our Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center mx-auto max-w-6xl">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div
              key={product._id}
              className="border bg-gradient-to-r from-[#81f8bb] to-[#22ccdd] rounded-lg shadow-md overflow-hidden flex flex-col h-64 w-80 relative cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <img
                src={"data:image/jpeg;base64," + product.image}
                alt={product.name}
                className="w-full h-1/2 object-cover"
              />
              <div className="p-4 w-full flex justify-between items-start">
                <div className="text-left">
                  <h3 className="text-lg text-black font-medium">
                    {product.name}
                  </h3>
                  <p className="text-sm text-black flex items-center">
                    <FaBalanceScale className="mr-2" />
                    {product.quantity}
                  </p>
                  <p className="text-sm text-black flex items-center">
                    <FaUtensils className="mr-2" />
                    {product.pieces}
                  </p>
                  <p className="text-sm text-black flex items-center">
                    <BiDish className="mr-2" />
                    {product.servings}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg text-black font-semibold mb-2">
                    ₹{product.price}
                  </p>
                  <div className="flex items-center">
                    {counts[index] === 0 ? (
                      <button
                        className="bg-white text-black font-bold rounded-md px-4 py-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCountChange(product, index, true);
                        }}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center border bg-white rounded-md px-2 py-1">
                        <button
                          className="text-black font-bold rounded-md w-8 h-8 flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCountChange(product, index, false);
                          }}
                        >
                          -
                        </button>
                        <span className="mx-2 font-bold">{counts[index]}</span>
                        <button
                          className="text-black font-bold rounded-md w-8 h-8 flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCountChange(product, index, true);
                          }}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-gray-600">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Products;
