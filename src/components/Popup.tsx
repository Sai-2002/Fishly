import React from "react";

interface PopupProps {
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          Welcome to Fishly! Get a discount on your order.
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Thank you for visiting Fishly. We are excited to serve you with the
          freshest fish and seafood. Explore our products and enjoy flat 10%
          offer!
        </p>
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-[#81f8bb] to-[#22ccdd]  text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default Popup;
