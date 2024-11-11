import React, { useState, useEffect, useContext } from "react";
import { IoIosStar } from "react-icons/io";
import axios from "axios";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "../Common/DatePicker";
import PaymentModalWrapper from "../PaymentModalWrapper";
import useAuth from "../../services/useAuth";
import { UserContext } from "../../context/UserContext";

const PackageDetailForm = ({ details, clientSecret, setClientSecret, setPayment, setBookingData }) => {
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [guests, setGuests] = useState(1);
  const [includeMeals, setIncludeMeals] = useState(false);
  const [includePorter, setIncludePorter] = useState(false);
  const [nights, setNights] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const { user } = useContext(UserContext);

  // const userdetails = JSON.parse(localStorage.getItem("user"));

  const userId = user?.id || null;
  const trekId = useLocation().pathname.split("/")[2];
  const navigate = useNavigate();
  const { api } = useAuth();

  // Update nights and total price when check-in or check-out changes
  useEffect(() => {
    const differenceInDays = Math.max(
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 3600 * 24),
      1
    );
    setNights(differenceInDays);
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    if (details?.price) {
      let price = details.price * nights;
      const discount = 40;
      const serviceFee = 10;
      if (includeMeals) price += 20 * nights;
      if (includePorter) price += 10 * nights;
      setTotalPrice(price - discount + serviceFee);
    }
  }, [nights, includeMeals, includePorter, details?.price]);

  const handleSubmit = async () => {
    if (!userId ) {
      toast.error("Please log in to create a booking.");
      return;
    }

    const bookingData = {
      userId,
      trekId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      amount: totalPrice.toString(),
    };

    try {
      const response = await api.post("/api/bookings/", bookingData);
      toast.success("Reservation successful!");
      setClientSecret(response.data?.data?.clientSecret);
      setBookingId(response.data?.data?.booking?._id);
      setBookingData(response.data);
      setPayment(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong.";
      if (errorMessage.includes("Refresh token not found")) {
        toast.error("Please log in. Your session expired.");
        return;
      } 
      toast.error(errorMessage);
    }
  };

  const handlePaymentSuccess = () => {
    setIsModalOpen(false);
    navigate("/booking-success");
  };

  return (
    <div className="w-full lg:w-1/3 flex flex-col gap-1.5">
      {!userId  ? (
        <p className="text-sm text-red-500 py-2">Please log in to create a booking.</p>
      ) : null}
      <div className="w-full flex items-center justify-between">
        <h1 className="text-xl font-semibold popp">$ {details?.price} / night</h1>
        <div className="flex items-center gap-1">
          <IoIosStar className="text-yellow-500" />
          <span className="text-md font-semibold popp">{details?.reviews}</span>
        </div>
      </div>

      <div className="flex items-center gap-5 pt-4 justify-between w-full">
        <div className="w-full flex flex-col items-start gap-1">
          <label className="text-sm font-semibold popp">Check-in</label>
          <DatePicker formData={checkInDate} setFormData={setCheckInDate} />
        </div>
        <div className="w-full flex flex-col items-start gap-1">
          <label className="text-sm font-semibold popp">Check-out</label>
          <DatePicker formData={checkOutDate} setFormData={setCheckOutDate} />
        </div>
      </div>

      <div className="w-full flex flex-col py-4 items-start gap-1">
        <label className="text-sm font-semibold popp">Guests</label>
        <select
          name="guests"
          id="guests"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full text-sm p-1 border-b popp border-gray-300"
        >
          {[...Array(6)].map((_, i) => (
            <option key={i} value={i + 1}>{i + 1} Guest{i > 0 ? 's' : ''}</option>
          ))}
        </select>
      </div>

      <div className="w-full flex items-center gap-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="meals"
            id="meals"
            checked={includeMeals}
            onChange={() => setIncludeMeals(!includeMeals)}
            className="mr-2"
          />
          <label htmlFor="meals" className="popp text-sm">Include Meals</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="porter"
            id="porter"
            checked={includePorter}
            onChange={() => setIncludePorter(!includePorter)}
            className="mr-2"
          />
          <label htmlFor="porter" className="popp text-sm">Include Porter</label>
        </div>
      </div>

      <div className="pricing flex py-4 flex-col items-center w-full">
        <div className="w-full flex py-2 items-center justify-between">
          <p className="text-sm popp">$ {details?.price} * {nights} nights</p>
          <p className="text-sm popp">$ {details?.price * nights}</p>
        </div>
        <div className="w-full flex py-2 items-center justify-between">
          <p className="text-sm popp">New user Discount</p>
          <p className="text-sm font-semibold popp">-$ 40</p>
        </div>
        <div className="w-full flex py-2 items-center justify-between">
          <p className="text-sm popp">Service fee</p>
          <p className="text-sm popp">$ 10</p>
        </div>
        <hr className="w-full border-1 border-gray-200" />
        <div className="w-full flex py-2 items-center justify-between">
          <p className="text-lg font-semibold popp">Total (INR)</p>
          <p className="text-lg font-semibold popp">$ {totalPrice}</p>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!userId }
        className={`popp px-5 p-2 rounded-[10px] ${
          !userId ? "bg-gray-400 cursor-not-allowed" : "bg-[#70B4E8] text-white"
        }`}
      >
        Reserve
      </button>
      <p className="text-sm popp p-2 text-center">You won't be charged yet</p>

      {isModalOpen && clientSecret && (
        <PaymentModalWrapper
          clientSecret={clientSecret}
          onSuccess={handlePaymentSuccess}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PackageDetailForm;
