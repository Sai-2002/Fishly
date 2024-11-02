// src/components/Login.tsx
import React, { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const LoginDetails: React.FC = () => {
  const [username, setusername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("mobile", username);
    formData.append("password", password);

    try {
      const response = await axios.post(
        "https://api.fishly.co.in/login",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      sessionStorage.setItem("uid", response.data.id);
      sessionStorage.setItem("token", response.data.token);

      // localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      setError("Invalid username number or password");
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  return (
    <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md w-80 mt-2">
      <h2 className="text-3xl font-bold mb-8">LOGIN</h2>
      <form onSubmit={handleLogin} className="w-full">
        <input
          type="text"
          placeholder="Mobile Number"
          value={username}
          onChange={(e) => setusername(e.target.value)}
          className="mb-6 p-3 border border-gray-300 rounded w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 p-3 border border-gray-300 rounded w-full"
        />

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
            "Login"
          )}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/"); // Navigate to the Home page when the logo is clicked
  };

  const handleSignUpClick = () => {
    navigate("/sign-up"); // Navigate to the Sign Up page when "Sign In" is clicked
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

      {/* The LoginDetails box starts immediately below the logo with reduced margin */}
      <LoginDetails />

      {/* Additional text and hyperlink below the LoginDetails component */}
      <div className="mt-4 text-center">
        <span className="text-gray-600">New to Fishly?</span>
        <span
          className="text-blue-600 ml-2 cursor-pointer hover:underline"
          onClick={handleSignUpClick} // Handle click event to navigate to Sign Up
        >
          Sign In
        </span>
      </div>
    </div>
  );
};

export default Login;
