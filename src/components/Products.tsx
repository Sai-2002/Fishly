import React, { useState, useEffect } from "react";
import { FaBalanceScale, FaUtensils } from "react-icons/fa";
import { BiDish } from "react-icons/bi";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { Product } from "../types/Product";

interface ProductsProps {
  products: Product[];
  updateTotalCount: (counts: number[]) => void;
  searchTerm: string;
  onProductClick: (product: Product) => void;
}

const Products: React.FC<ProductsProps> = ({
  products,
  updateTotalCount,
  searchTerm,
  onProductClick,
}) => {
  const { updateCartItem, removeFromCart, cartItems } = useCart();
  const [counts, setCounts] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (products.length === 0) return;

    const initialCounts = products.map((product) => {
      const storedCount = sessionStorage.getItem(`count_${product._id}`);
      const count = storedCount ? parseInt(storedCount, 10) : 0;
      return isNaN(count) ? 0 : count;
    });
    setCounts(initialCounts);
  }, [products]);

  useEffect(() => {
    const updatedCounts = products.map((product) => {
      const cartItem = cartItems.find((item) => item._id === product._id);
      return cartItem ? cartItem.count : 0;
    });
    setCounts(updatedCounts);
  }, [cartItems, products]);

  const handleCountChange = (
    product: Product,
    index: number,
    increment: boolean
  ) => {
    if (index < 0 || index >= counts.length) return;

    setCounts((prev) => {
      const newCounts = [...prev];
      if (increment) {
        newCounts[index] += 1;
      } else if (newCounts[index] > 0) {
        newCounts[index] -= 1;
      }

      updateTotalCount(newCounts);
      const currentCount = newCounts[index];

      sessionStorage.setItem(`count_${product._id}`, currentCount.toString());

      if (currentCount > 0) {
        updateCartItem({ ...product, count: currentCount }, currentCount);
      } else {
        removeFromCart(product._id);
      }

      return newCounts;
    });
  };

  const handleProductClick = (product: Product) => {
    if (product.name.toLowerCase() === "murrel / viraal") {
      onProductClick(product);
      navigate("/product-details", { state: product, replace: true });
    }
  };

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
              className={`border bg-gradient-to-r from-[#81f8bb] to-[#22ccdd] rounded-lg shadow-md overflow-hidden flex flex-col h-64 w-80 relative ${
                product.name === "Murrel / Viraal"
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-70"
              }`}
              onClick={() => {
                if (product.name === "Murrel / Viraal")
                  handleProductClick(product);
              }}
            >
              <img
                src={"data:image/jpeg;base64," + product.image}
                alt={product.name}
                className="w-full h-1/2 object-cover"
              />
              <div className="p-4 w-full flex justify-between items-start">
                <div className="text-left">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-sm flex items-center">
                    <FaBalanceScale className="mr-2" /> {product.weight} g
                  </p>
                  <p className="text-sm flex items-center">
                    <FaUtensils className="mr-2" /> {product.pieces}
                  </p>
                  <p className="text-sm flex items-center">
                    <BiDish className="mr-2" /> {product.servings} person
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold mb-2">₹{product.price}</p>
                  <div className="flex items-center">
                    {product.name === "Murrel / Viraal" ? (
                      counts[index] === 0 ? (
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
                            className="text-black font-bold w-8 h-8 flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCountChange(product, index, false);
                            }}
                          >
                            -
                          </button>
                          <span className="mx-2 font-bold">
                            {counts[index]}
                          </span>
                          <button
                            className="text-black font-bold w-8 h-8 flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCountChange(product, index, true);
                            }}
                          >
                            +
                          </button>
                        </div>
                      )
                    ) : (
                      <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                        <span className="text-black text-2xl font-bold">
                          Out of Stock
                        </span>
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
