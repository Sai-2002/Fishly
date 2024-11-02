// src/components/Home.tsx
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import Slideshow from "./Slideshow";
import WhyFishly from "./WhyFishly";
import Footer from "./Footer";
import Products from "./Products";
import { Product } from "../types/Product";

interface HomeProps {
  totalCount: number;
  onSearchChange: (term: string) => void;
  updateTotalCount: (counts: number[]) => void;
  searchTerm: string;
  products: Product[]; // Keep the products prop
}

const Home: React.FC<HomeProps> = ({
  totalCount,
  onSearchChange,
  updateTotalCount,
  searchTerm,
  products,
}) => {
  const navigate = useNavigate(); // Use navigate for routing
  const productsRef = useRef<HTMLDivElement>(null); // Create a ref for Products component

  const handleProductClick = (product: Product) => {
    navigate("/product-details", { state: { product, products } }); // Navigate to ProdDetails with state
  };

  const handleSearchBoxClick = () => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll to Products component
    }
  };

  return (
    <div>
      <Navbar
        totalCount={totalCount}
        onSearchChange={onSearchChange}
        onSearchBoxClick={handleSearchBoxClick}
        searchTerm={searchTerm}
        // products={products} // Pass the products to the Navbar
        // onAccountClick={() => {
        //   /* Handle account click */
        // }}
      />
      <Slideshow />
      <WhyFishly />
      <div ref={productsRef}>
        <Products
          products={products}
          updateTotalCount={updateTotalCount}
          searchTerm={searchTerm} // Keep searchTerm prop for filtering
          onProductClick={handleProductClick} // Pass product click handler
        />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
