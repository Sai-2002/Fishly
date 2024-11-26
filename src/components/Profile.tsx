import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import axios from "axios";

interface Order {
  _id: string;
  customer_id: string;
  address: string;
  order: string;
  cuttingMethod: string;
  paymentMethod: string;
  cost: string;
  transaction_id: string;
  status: string;
}

interface User {
  username: string;
  _id: string;
  address: string;
  mobile: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [userCred, setUserCred] = useState<User | null>(null);
  const [addressFields, setAddressFields] = useState({
    street: "",
    area: "",
    city: "",
    pincode: "",
    landmark: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleEditAddressClick = () => {
    setIsEditPopupVisible(true);
  };

  const uid = sessionStorage.getItem("uid");

  // sessionStorage.setItem("address", )

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.fishly.co.in/getUserDetails/${uid}`
      );
      setUserCred(response.data);
      // if(userCred?.address != ""){

      // }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
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
  }, [uid]);

  const updateAdd = async (address: string) => {
    try {
      const resp = await axios.post(
        `https://api.fishly.co.in/updateAddress/${uid}`,
        { address: address },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.data.Result != "No user found.") {
        fetchData();
      }

      // setIsAddress(resp.data.Address)
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressFields((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Validate form (all fields except landmark are required)
    const { street, area, city, pincode } = addressFields;
    const isValid =
      street.trim() !== "" &&
      area.trim() !== "" &&
      city.trim() !== "" &&
      pincode.trim() !== "";
    setIsFormValid(isValid);
  }, [addressFields]);

  const handleSaveAddress = () => {
    // Concatenate address fields into a single string
    const { street, area, city, pincode, landmark } = addressFields;
    const concatenatedAddress =
      `${street} ${area} ${city} ${pincode} ${landmark}`.trim();
    updateAdd(concatenatedAddress);
    setIsEditPopupVisible(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      {/* Back to Home */}
      <div
        className="w-full p-4 flex items-center cursor-pointer"
        onClick={handleBackToHome}
      >
        <FaArrowLeft className="mr-2" />
        <span className="text-lg font-semibold">HOME</span>
      </div>

      {/* Profile Content */}
      <div className="flex-grow flex flex-col items-center px-4 lg:px-8 bg-white rounded-md">
        {/* Greeting */}
        <h1 className="text-xl lg:text-2xl font-bold mt-4 text-center">
          Hello, {userCred ? userCred.username : "Guest"}!
        </h1>

        {/* Address Compartment */}
        <div className="w-full max-w-md flex items-center justify-between mt-4 p-3 bg-gray-100 rounded-lg lg:justify-center">
          <p className="text-gray-700 text-sm lg:text-base">
            {userCred?.address || "No address available"}
          </p>
          <button
            className="ml-2 text-gray-500 hover:text-gray-700"
            onClick={handleEditAddressClick}
          >
            <FaEdit className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </div>

        {/* Divider Line */}
        <hr className="w-full max-w-md border-t border-gray-300 mt-4" />

        {/* Order Summary */}
        <div className="w-full max-w-md mt-6 mb-4 pb-2">
          <h2 className="text-lg lg:text-xl font-semibold mb-4 text-center">
            Order Summary
          </h2>
          {orders && orders.length > 0 ? (
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
            <div className="flex flex-col items-center">
              <p className="text-gray-600 text-center pb-3">No orders yet.</p>
              <button className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors w-full">
                Shop now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Address Edit Popup */}
      {isEditPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Edit Address</h2>
            <input
              type="text"
              name="street"
              value={addressFields.street}
              onChange={handleInputChange}
              placeholder="No. and Street"
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="text"
              name="area"
              value={addressFields.area}
              onChange={handleInputChange}
              placeholder="Area and Town"
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="text"
              name="city"
              value={addressFields.city}
              onChange={handleInputChange}
              placeholder="City"
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="text"
              name="pincode"
              value={addressFields.pincode}
              onChange={handleInputChange}
              placeholder="Pincode"
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="text"
              name="landmark"
              value={addressFields.landmark}
              onChange={handleInputChange}
              placeholder="Landmark (optional)"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                className="mr-2 bg-gray-300 text-gray-700 py-1 px-3 rounded hover:bg-gray-400"
                onClick={() => setIsEditPopupVisible(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                disabled={!isFormValid}
                className={`${
                  isFormValid
                    ? "bg-gradient-to-r from-[#81f8bb] to-[#22ccdd]"
                    : "bg-gray-300"
                } text-white py-1 px-3 rounded transition-all`}
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Profile;
