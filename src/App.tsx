// src/App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ProdDetails from "./components/ProdDetails";
import Cart from "./components/Cart";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import Checkout from "./components/Checkout";
import { CartProvider } from "./components/CartContext";
import Products from "./components/Products";
import { Product } from "./types/Product"; // Import Product type

import axios from "axios";

const App: React.FC = () => {
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.fishly.co.in/getAll");

        setProducts(response.data);

        console.log(products);

        // const result = await response.json();
        // setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loading when data is fetched
      }
    };
    fetchData();
  }, []);

  const updateTotalCount = (counts: number[]) => {
    const total = counts.reduce((acc, count) => acc + count, 0);
    setTotalCount(total);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                totalCount={totalCount}
                onSearchChange={handleSearchChange}
                updateTotalCount={updateTotalCount}
                searchTerm={searchTerm}
                products={products} // Pass products to Home
              />
            }
          />
          <Route
            path="/product-details"
            element={<ProdDetails products={products} />} // Pass products directly to ProdDetails
          />
          <Route
            path="/cart"
            element={
              <Cart
                updateTotalCount={updateTotalCount}
                searchTerm={searchTerm}
              />
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/products"
            element={
              <Products
                updateTotalCount={updateTotalCount}
                searchTerm={searchTerm}
                products={products} // Pass products to Products component
                onProductClick={(_product: Product) => {
                  // Optionally implement the product click functionality here
                }}
              />
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
