import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import axios from "axios";

const Checkout: React.FC = () => {
  const uid = sessionStorage.getItem("uid");

  const navigate = useNavigate();
  const cartContext = useContext(CartContext);

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
  const [prebookingDate, setPrebookingDate] = useState<Date|null>(null);

  const minDate = new Date(2024, 10, 24);

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
  }, );

  useEffect(() => {
    const formatted = `${address.street} ${address.area} ${address.city} ${address.pincode} ${address.landmark}`;
    setFormattedAddress(formatted.trim());
    
    console.log(formattedAddress)

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
    const forData = `${address.street} ${address.area} ${address.city} ${address.pincode} ${address.landmark}`.trim();
    


    try{
      const resp = await axios.post(
        `https://api.fishly.co.in/updateAddress/${uid}`,
        {"address": forData},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(resp.data);
      if(resp.data.Result != "No user found."){
        setIsAddress(true)
      }

      // setIsAddress(resp.data.Address)
    }
    catch(error) {
      console.error(error);
    }
  }

  const buttonText =
    paymentMethod === "Cash on Delivery" ? "Place Order" : "Coming Soon";


  const placeOrder = async() => {
    const data = {
      customer_id: uid,
      address: formattedAddress,
      order: productsSummary,
      cuttingMethod: cuttingMethod,
      paymentMethod: paymentMethod,
      cost: totalPrice/2,
      transaction_id: "",
      status: "Order Placed",
    }

    try {
      const response = await axios.post("https://api.fishly.co.in/addOrder", data, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      alert(response.data.Success);
      navigate("/")
    } catch (error) {
      
    }

    console.log(data);
  }

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
              <p className="text-lg font-semibold mr-2 line-through">
                Total Price: Rs.
                <span className="">{totalPrice.toFixed(2)}</span>
              </p>
              <span className="text-blue-400">50% off</span>
            </div>
            <p className="text-lg">
              <span className="font-bold">Discounted Price: </span> Rs.
              {(totalPrice / 2).toFixed(2)}
            </p>
          </div>
        </div>
        <button
          onClick={handleEditCart}
          className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors w-full"
        >
          Edit Cart
        </button>
      </div>

      {/* Service Options Section */}
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Service Option for Pre-Booking
        </h2>

        <div className="flex items-center mb-4">
          <input
            type="radio"
            id="onsiteCut"
            name="serviceOption"
            value="Onsite cut"
            checked={selectedService === "Onsite cut"}
            onChange={() => setSelectedService("Onsite cut")}
            className="mr-2"
          />
          <label htmlFor="onsiteCut">Onsite cut</label>
        </div>

        {selectedService === "Onsite cut" && (
          <div className="mt-4 space-y-2">
            <div className="flex space-x-4">
              <DatePicker
                selected={prebookingDate}
                onChange={(date) => setPrebookingDate(date)}
                minDate={minDate} // Disable dates before Nov 24, 2024
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15} // Set time intervals to 15 minutes
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select a date"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        )}

        <div className="flex items-center mb-4 pt-4">
          <input
            type="radio"
            id="precut"
            name="serviceOption"
            value="Precut"
            checked={selectedService === "Precut"}
            onChange={() => setSelectedService("Precut")}
            className="mr-2"
          />
          <label htmlFor="precut">Precut</label>
        </div>

        {selectedService === "Precut" && (
          <div className="mt-4 space-y-2">
            <div className="flex space-x-4">
              <DatePicker
                selected={prebookingDate}
                onChange={(date) => setPrebookingDate(date)}
                minDate={minDate} // Disable dates before Nov 24, 2024
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15} // Set time intervals to 15 minutes
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select a date"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
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
