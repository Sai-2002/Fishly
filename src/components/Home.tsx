// src/components/Home.tsx
import React, { useRef, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import Slideshow from "./Slideshow";
import WhyFishly from "./WhyFishly";
import Footer from "./Footer";
import Products from "./Products";
import { Product } from "../types/Product";
import { CartContext } from "./CartContext"; // Import CartContext

interface HomeProps {
  onSearchChange: (term: string) => void;
  updateTotalCount: (counts: number[]) => void;
  searchTerm: string;
  products: Product[];
}

const Home: React.FC<HomeProps> = ({
  onSearchChange,
  updateTotalCount,
  searchTerm,
  products,
}) => {
  const navigate = useNavigate();
  const productsRef = useRef<HTMLDivElement>(null);
  const cartContext = useContext(CartContext); // Access CartContext
  const [totalCount, setTotalCount] = useState<number>(0);

  if (!cartContext) {
    return <div>Error: Cart context is unavailable.</div>;
  }

  const { cartItems } = cartContext;

  // Update totalCount based on cartItems
  useEffect(() => {
    const counts = cartItems.reduce((acc, item) => acc + item.count, 0);
    setTotalCount(counts);
  }, [cartItems]);

  const handleProductClick = (product: Product) => {
    navigate("/product-details", { state: { product, products } });
  };

  const handleSearchBoxClick = () => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <Navbar
        totalCount={totalCount} // Use totalCount from CartContext
        onSearchChange={onSearchChange}
        onSearchBoxClick={handleSearchBoxClick}
        searchTerm={searchTerm}
      />
      <Slideshow />
      <WhyFishly />
      <div ref={productsRef}>
        <Products
          products={products}
          updateTotalCount={updateTotalCount}
          searchTerm={searchTerm}
          onProductClick={handleProductClick}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
