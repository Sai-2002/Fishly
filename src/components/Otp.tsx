import React from "react";

const Otp: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Logo */}
      <div className="mb-6">
        <img
          src="./images/logo.png"
          alt="Logo"
          className="h-16 w-auto" // Adjust size as needed
        />
      </div>

      {/* OTP Form */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">
          Please enter the OTP sent to your WhatsApp
        </h2>
        <form>
          {/* OTP Input */}
          <div className="mb-4">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              OTP
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              placeholder="Enter OTP"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otp;
