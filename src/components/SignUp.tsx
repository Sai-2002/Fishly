// src/components/SignUp.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpDetails: React.FC = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to toggle password visibility
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Validate mobile number (must be exactly 10 digits)
    if (!/^\d{10}$/.test(mobile)) {
      setErrorMessage("Mobile number must be a 10-digit number.");
      return;
    }

    setErrorMessage("");

    const formData = new FormData();
    formData.append("username", name);
    formData.append("mobile", mobile);

    console.log(name);
    console.log(error);

    try {
      const response = await axios.post(
        "https://api.fishly.co.in/signUp",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      localStorage.setItem("uid", response.data.id);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/");
    } catch (error) {
      setError("Invalid username number or password");
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }

    alert("Sign-up successful!");
  };

  return (
    <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md w-80 mt-2">
      <h2 className="text-3xl font-bold mb-8">SIGN UP</h2>
      <form onSubmit={handleSignUp} className="w-full">
        {/* Input for Name */}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-6 p-3 border border-gray-300 rounded w-full"
        />

        {/* Input for Mobile Number */}
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="mb-6 p-3 border border-gray-300 rounded w-full"
        />

        {/* Input for Password with toggle visibility */}

        {/* Display error message if validation fails */}
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        {/* Sign Up Button */}
        <button
          type="submit"
          className="flex items-center justify-center bg-gradient-to-r from-[#81f8bb] to-[#22ccdd] text-black py-3 px-4 rounded w-full text-lg"
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <div className="flex space-x-2 animate-pulse">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            </div>
          ) : (
            "SignUp"
          )}
        </button>
      </form>
    </div>
  );
};

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/"); // Navigate to the Home page when the logo is clicked
  };

  const handleLoginClick = () => {
    navigate("/login"); // Navigate to the Sign Up page when "Sign In" is clicked
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="absolute top-6">
        <img
          src="./images/logo.png" // Adjust the logo path accordingly
          alt="Logo"
          className="h-16 w-auto cursor-pointer"
          onClick={handleLogoClick} // Handle click event to navigate to Home
        />
      </div>

      {/* The SignUpDetails box starts immediately below the logo */}
      <SignUpDetails />
      <div className="mt-4 text-center">
        <span className="text-gray-600">Registered User?</span>
        <span
          className="text-blue-600 ml-2 cursor-pointer hover:underline"
          onClick={handleLoginClick} // Handle click event to navigate to Sign Up
        >
          Login
        </span>
      </div>
    </div>
  );
};

export default SignUp;
