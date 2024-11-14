// src/components/Navbar.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { isUserLoggedIn } from "../utils/sessionUtils";

interface NavbarProps {
  totalCount: number;
  onSearchChange: (term: string) => void;
  searchTerm: string;
  onSearchBoxClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  totalCount,
  onSearchChange,
  searchTerm,
  onSearchBoxClick,
}) => {
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleAccountClick = () => {
    if (isUserLoggedIn()) {
      navigate("/profile"); // If logged in, navigate to the profile page
    } else {
      navigate("/login"); // If not logged in, navigate to the login page
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#81f8bb] to-[#22ccdd] border-b border-gray-200 shadow-sm sticky top-0 z-50 py-2 md:py-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex-shrink-0 mb-2 md:mb-0 md:order-1">
            <a href="/">
              <img
                src="./images/logo.png"
                alt="Logo"
                className="h-12 w-auto md:h-16"
              />
            </a>
          </div>

          <div className="relative flex-grow mx-2 max-w-sm mb-2 md:mb-0 md:mx-4 md:flex md:order-2">
            <input
              type="text"
              className="w-full py-1.5 pl-4 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Search for your favourite delicacy"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onClick={onSearchBoxClick}
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-300 text-gray-600 px-2 py-1 rounded-full hover:bg-[#22ccdd] transition-colors duration-300 flex items-center justify-center">
              <FaSearch className="w-4 h-4" />
            </button>
          </div>

          <div className="flex space-x-8 md:space-x-12 mb-2 md:mb-0 md:order-3">
            <button
              onClick={handleCartClick}
              className="text-gray-700 hover:text-white text-xs md:text-sm font-medium relative"
            >
              <div className="flex flex-col items-center">
                <FaShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                <span>Cart</span>
              </div>
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-gray-700 rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>

            <button
              onClick={handleAccountClick}
              className="text-gray-700 hover:text-white text-xs md:text-sm font-medium"
            >
              <div className="flex flex-col items-center">
                <FaUser className="w-5 h-5 md:w-6 md:h-6" />
                <span>Account</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
