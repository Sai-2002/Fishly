// src/components/Profile.tsx
import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
// import { useCart } from "./CartContext";
import axios from "axios"; // Adjust path based on your folder structure


interface Order {
  _id: string,
  customer_id: string;
  address: string;
  order: string;
  cuttingMethod: string;
  paymentMethod: string;
  cost: string;
  transaction_id: string,
  status: string;
}
interface User {
  username:string,
  _id:string,
  address:string,
  mobile:string
}



const Profile: React.FC = () => {
  const navigate = useNavigate();
  // const { cartItems } = useCart(); // Access cartItems from CartContext

  const [orders, setOrders] = useState<Order[] | null>(null);
  const [userCred, setUserCred] = useState<User | null>(null);

  const handleBackToHome = () => {
    navigate("/");
  };

  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.fishly.co.in/getUserDetails/${uid}`
        );

        setUserCred(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const getAllOrder = async () => {
      try {
        const response = await axios.get(
          `https://api.fishly.co.in/getOrders/${uid}`
        );

        setOrders(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    getAllOrder();
  }, []);

  // const updateAddress = async () => {
  //   try {
  //     const response = await axios.post("https")
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Back to Home */}
      <div
        className="p-4 flex items-center cursor-pointer lg:justify-start justify-center"
        onClick={handleBackToHome}
      >
        <FaArrowLeft className="mr-2" />
        <span className="text-lg font-semibold">HOME</span>
      </div>

      {/* Profile Content */}
      <div className="flex-grow flex flex-col items-center px-4 lg:px-8">
        {/* Greeting */}
        <h1 className="text-xl lg:text-2xl font-bold mt-4 text-center">
          Hello, {userCred ? userCred.username : "Guest"}!
        </h1>

        {/* Address Compartment */}
        <div className="w-full max-w-md flex items-center justify-between mt-4 p-3 bg-gray-100 rounded-lg lg:justify-center">
          <p className="text-gray-600 text-sm lg:text-base">
            {userCred?.address || "No address available"}
          </p>
          <button className="ml-2 text-gray-500 hover:text-gray-700">
            <FaEdit className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </div>

        {/* Divider Line */}
        <hr className="w-full max-w-md border-t border-gray-300 mt-4" />

        {/* Order Summary */}
        <div className="w-full max-w-md mt-6">
          <h2 className="text-lg lg:text-xl font-semibold mb-4 text-center lg:text-left">
            Order Summary
          </h2>
          {orders ? (
            <ul className="space-y-4">
              {orders.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-semibold text-sm lg:text-base">
                      {item.order}
                    </p>
                    <p className="text-gray-600 text-xs lg:text-sm">
                      Status: {item.status}
                    </p>
                  </div>
                  <p className="font-semibold text-sm lg:text-base">
                    Rs.{item.cost}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center lg:text-left">No orders.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Profile;