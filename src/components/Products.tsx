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
      let currentCount = newCounts[index];

      if (increment) {
        currentCount = currentCount === 0 ? 1 : currentCount + 0.5;
      } else if (currentCount === 1) {
        currentCount = 0;
      } else if (currentCount > 0) {
        currentCount -= 0.5;
      }

      if (currentCount < 0) currentCount = 0;

      newCounts[index] = currentCount;
      updateTotalCount(newCounts);
      sessionStorage.setItem(`count_${product._id}`, currentCount.toString());

      if (currentCount > 0) {
        updateCartItem({ ...product, count: currentCount }, currentCount);
      } else {
        removeFromCart(product._id);
      }

      return newCounts;
    });
  };
  console.log(handleCountChange);

  const handleProductClick = async (product: Product) => {
    await onProductClick(product);
    navigate("/product-details", { state: product, replace: true });
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
          filteredProducts.map((product, _index) => {
            const isOutOfStock =
              product.name === "Rohu" || product.name === "Catla";
            return (
              <div
                key={product._id}
                className={`border rounded-lg shadow-md overflow-hidden flex flex-col h-64 w-80 relative ${
                  isOutOfStock
                    ? "cursor-not-allowed bg-gray-100"
                    : "cursor-pointer bg-gradient-to-r from-[#81f8bb] to-[#22ccdd]"
                }`}
                onClick={() => !isOutOfStock && handleProductClick(product)}
              >
                <img
                  src={"data:image/jpeg;base64," + product.image}
                  alt={product.name}
                  className={`w-full h-1/2 object-cover ${
                    isOutOfStock && "opacity-50"
                  }`}
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
                    <p className="text-lg font-semibold mb-2">
                      ₹{product.price}
                    </p>
                  </div>
                </div>
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-gray-200 bg-opacity-75 flex justify-center items-center">
                    <p className="text-red-500 font-bold text-xl">
                      Out of stock
                    </p>
                  </div>
                )}
              </div>
            );
          })
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
