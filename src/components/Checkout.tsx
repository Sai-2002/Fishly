import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

interface User {
  username: string;
  _id: string;
  address: string;
  mobile: string;
}

const Checkout: React.FC = () => {
  const uid = localStorage.getItem("uid");

  const navigate = useNavigate();
  const cartContext = useContext(CartContext);

  const [userCred, setUserCred] = useState<User | null>(null);

  const [isAddress, setIsAddress] = useState<boolean>(false);
  const [address, setAddress] = useState({
    street: "",
    area: "",
    city: "",
    pincode: "",
    landmark: "",
  });
  const [formattedAddress, setFormattedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [productsSummary, setProductsSummary] = useState<string>("");
  const [selectedService, setSelectedService] = useState("Onsite cut");
  const [prebookingDate, setPrebookingDate] = useState<Date | null>(null);
  const [dateError, setDateError] = useState<string>("");

  const currentTime = new Date();
  const minDateTime = new Date(currentTime.getTime() + 90 * 60 * 1000); // 45 minutes from now
  const maxTime = new Date();
  maxTime.setHours(23, 59, 59, 999); // End of the day

  const validateDate = (): boolean => {
    if (!prebookingDate) {
      setDateError("Please select a date and time for the service.");
      return false;
    }
    setDateError("");
    return true;
  };

  const getMinTime = (date: Date | null) => {
    if (!date) return minDateTime; // Default case
    const isToday = date.toDateString() === currentTime.toDateString();
    return isToday
      ? minDateTime
      : new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          0,
          0,
          0,
          0
        ); // Start of the day
  };

  if (!cartContext) {
    return <div>Error: Cart context is unavailable.</div>;
  }

  const { cartItems } = cartContext;

  const handleLogoClick = () => {
    navigate("/"); // Navigate to Home page on logo click
  };

  const handleEditCart = () => {
    navigate("/cart"); // Navigate to the Cart page on edit cart button click
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + item.price * item.count;
  }, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.fishly.co.in/getUserDetails/${uid}`
        );
        console.log(response.data);
        // return response.data;

        setUserCred(response.data);
        // if(userCred?.address != ""){

        // }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.fishly.co.in/getAddress/${uid}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data != "") {
          setIsAddress(response.data.Address);
          setFormattedAddress(response.data.Address);
        }
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData();
  });

  useEffect(() => {
    const formatted = `${address.street} ${address.area} ${address.city} ${address.pincode} ${address.landmark}`;
    setFormattedAddress(formatted.trim());

    console.log(formattedAddress);
  }, [address]);

  useEffect(() => {
    const summary = cartItems
      .map((item) => `${item.name} x ${item.count}`)
      .join(", ");
    setProductsSummary(summary);
  }, [cartItems]);

  // const Adddata = {
  //   address: formattedAddress
  // }

  const handleAddress = async () => {
    // console.log(Adddata)
    const forData =
      `${address.street} ${address.area} ${address.city} ${address.pincode} ${address.landmark}`.trim();

    try {
      const resp = await axios.post(
        `https://api.fishly.co.in/updateAddress/${uid}`,
        { address: forData },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(resp.data);
      if (resp.data.Result != "No user found.") {
        setIsAddress(true);
      }

      // setIsAddress(resp.data.Address)
    } catch (error) {
      console.error(error);
    }
  };

  const buttonText =
    paymentMethod === "Cash on Delivery" ? "Place Order" : "Coming Soon";

  const placeOrder = async () => {
    if (!validateDate()) return;
    const { clearCart } = cartContext;
    const data = {
      customer_id: uid,
      address: formattedAddress,
      order: productsSummary,
      cuttingMethod: cuttingMethod,
      paymentMethod: paymentMethod,
      cost: totalPrice,
      transaction_id: "",
      status: "Order Placed",
    };

    try {
      const response = await axios.post(
        "https://api.fishly.co.in/addOrder",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert(response.data.Success);
      clearCart();
      sendMessage(userCred?.username, userCred?.mobile);
      const emailMessage = `
Hello,

We have received an order successfully! Here are the details:

- CUSTOMER ID: ${uid}
- CUSTOMER NAME: ${userCred?.username}
- PHONE NUMBER: ${userCred?.mobile}
- DELIVERY ADDRESS: ${formattedAddress}
- ORDER SUMMARY: ${productsSummary}
- CUTTING METHOD: ${cuttingMethod}
- PAYMENT METHOD: ${paymentMethod}
- TOTAL COST: ₹${totalPrice.toFixed(2)}

This is your new order!
`;
      const jsonData = {
        SUBJECT: `Recieved Order from ${userCred?.username}`,
        BODY: emailMessage,
      };
      navigate("/");
      try {
        const response = await axios.post(
          "https://api.fishly.co.in/getNotification",
          jsonData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data != null) {
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {}
  };

  const sendMessage = async (
    name: string | undefined,
    mobile: string | undefined
  ) => {
    const data = {
      from_phone_number_id: "461924427012283",
      phone_number: `${mobile}`,
      template_name: "ordercx",
      template_language: "en",
      field_1: `${name}`,
      contact: {
        first_name: `${name}`,
        // "last_name" : "naath",
        // "email" : "",
        country: "india",
        language_code: "en",
        // "groups" : ""
      },
    };

    try {
      const response = await axios.post(
        "https://app.salegrowy.com/api/1e626700-a6a9-4c88-a72a-2d878fad4b8b/contact/send-template-message",
        data,
        {
          headers: {
            Authorization: `Bearer NJ1jTV4ekZZz6MkxymqkIuRyanyZio8PXdu8vtkPRItiOcM7yHSIbYG7Sz2KMive`,
          },
        }
      );

      if (response.status == 200) {
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const isAddressComplete =
  //   address.street.trim() &&
  //   address.area.trim() &&
  //   address.city.trim() &&
  //   address.pincode.trim();

  // Cutting method display logic
  const cuttingMethod =
    selectedService === "Onsite cut" || selectedService === "Precut"
      ? `${selectedService} (Date: ${prebookingDate},`
      : selectedService;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
      <div className="mb-6 cursor-pointer" onClick={handleLogoClick}>
        <img src="./images/logo.png" alt="Logo" className="h-16 w-auto" />
      </div>

      {/* Order Summary Section */}
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="bg-gradient-to-r from-[#81f8bb] to-[#22ccdd] pt-4 pb-1 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Order Summary
          </h2>
        </div>
        {cartItems.length === 0 ? (
          <p className="text-center">Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li
                key={item._id}
                className="mb-4 border-b pb-4 flex items-start"
              >
                <img
                  src={"data:image/jpeg;base64," + item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover mr-4"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p>Quantity: {item.count}</p>
                  <p>Price: Rs.{(item.price * item.count).toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="max-w-lg mx-auto">
          <div className="flex flex-col items-end mb-4">
            <div className="flex items-center">
              <p className="text-lg font-semibold mr-2">
                Total Price: Rs.
                <span className="">{totalPrice.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleEditCart}
          className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors w-full"
        >
          Edit Cart
        </button>
      </div>

      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Service Option for Pre-Booking
        </h2>

        {/* Onsite Cut Option */}
        <div className="flex items-start mb-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="onsiteCut"
              name="serviceOption"
              value="Onsite cut"
              checked={selectedService === "Onsite cut"}
              onChange={() => setSelectedService("Onsite cut")}
              className="mr-2"
            />
            <label htmlFor="onsiteCut" className="font-medium min-w-[80px]">
              Onsite cut
            </label>
          </div>
          {selectedService === "Onsite cut" && (
            <p className="text-[10px] text-gray-500 ml-4">
              Our executive will deliver live fish and clean them at your home.
              Kindly provide space for our team.
            </p>
          )}
        </div>
        {selectedService === "Onsite cut" && (
          <div className="mt-2">
            <DatePicker
              selected={prebookingDate}
              onChange={(date) => setPrebookingDate(date)}
              showTimeSelect
              minDate={new Date()}
              minTime={getMinTime(prebookingDate)}
              maxTime={maxTime}
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select a date"
              className="w-full p-2 border border-gray-300 rounded"
            />
            {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
          </div>
        )}

        {/* Precut Option */}
        <div className="flex items-start mb-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="precut"
              name="serviceOption"
              value="Precut"
              checked={selectedService === "Precut"}
              onChange={() => setSelectedService("Precut")}
              className="mr-2"
            />
            <label htmlFor="precut" className="font-medium min-w-[80px]">
              Precut
            </label>
          </div>
          {selectedService === "Precut" && (
            <p className="text-xs text-gray-500 ml-4">
              In minutes, you'll receive a personalized video of your fish being
              caught, filleted, and cleaned.
            </p>
          )}
        </div>
        {selectedService === "Precut" && (
          <div className="mt-2">
            <DatePicker
              selected={prebookingDate}
              onChange={(date) => setPrebookingDate(date)}
              showTimeSelect
              minDate={new Date()}
              minTime={getMinTime(prebookingDate)}
              maxTime={maxTime}
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select a date"
              className="w-full p-2 border border-gray-300 rounded"
            />
            {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
          </div>
        )}
      </div>

      {/* Address Section */}
      {isAddress ? (
        <div></div>
      ) : (
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
          <input
            type="text"
            placeholder="No. and Street"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            className="w-full p-3 mb-3 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="Area and Town"
            value={address.area}
            onChange={(e) => setAddress({ ...address, area: e.target.value })}
            className="w-full p-3 mb-3 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className="w-full p-3 mb-3 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="Pincode"
            value={address.pincode}
            onChange={(e) =>
              setAddress({ ...address, pincode: e.target.value })
            }
            className="w-full p-3 mb-3 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="Landmark"
            value={address.landmark}
            onChange={(e) =>
              setAddress({ ...address, landmark: e.target.value })
            }
            className="w-full p-3 mb-3 border border-gray-300 rounded"
          />

          <button
            onClick={handleAddress}
            className="mt-4 w-full py-2 rounded bg-gradient-to-r from-[#81f8bb] to-[#22ccdd] text-white font-semibold"
          >
            Save Address
          </button>
        </div>
      )}

      {/* Payment Method Section */}
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
        <div className="flex items-center mb-4">
          <input
            type="radio"
            id="cashOnDelivery"
            name="paymentMethod"
            value="Cash on Delivery"
            checked={paymentMethod === "Cash on Delivery"}
            onChange={() => setPaymentMethod("Cash on Delivery")}
            className="mr-2"
          />
          <label htmlFor="cashOnDelivery">Cash on Delivery</label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="payOnline"
            name="paymentMethod"
            value="Pay Online"
            checked={paymentMethod === "Pay Online"}
            onChange={() => setPaymentMethod("Pay Online")}
            className="mr-2"
          />
          <label htmlFor="payOnline">Pay Online</label>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={placeOrder}
        disabled={!isAddress}
        className={`w-full max-w-lg py-2 rounded ${
          isAddress && paymentMethod != "Pay Online"
            ? "bg-gradient-to-r from-[#81f8bb] to-[#22ccdd] text-white font-semibold"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {buttonText}
      </button>
      {/* Summary Section */}
    </div>
  );
};

export default Checkout;
