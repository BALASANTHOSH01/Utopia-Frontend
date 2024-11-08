import React, { useState, useEffect } from "react";
import { IoIosStar } from "react-icons/io";
import axios from "axios";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import DatePicker from "../Common/DatePicker";
import PaymentModalWrapper from "../PaymentModalWrapper";
import { useNavigate } from "react-router-dom";

const PackageDetailForm = (props) => {
  const { details } = props;
  const { clientSecret, setClientSecret } = props;
  const { setPayment, setBookingData } = props;
  const [checkInDate, setCheckInDate] = useState(
    new Date()
  );
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );
  const [guests, setGuests] = useState(1);
  const [includeMeals, setIncludeMeals] = useState(false);
  const [includePorter, setIncludePorter] = useState(false);
  const [nights, setNights] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).user.id : null;
  const trekId = useLocation().pathname.split("/")[2];
  const token = localStorage.getItem("token");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const navigate = useNavigate();
  // const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    const checkIn = new Date(checkInDate.date);
    const checkOut = new Date(checkOutDate.date);
    const differenceInTime = checkOut.getTime() - checkIn.getTime();
    const differenceInDays = Math.max(differenceInTime / (1000 * 3600 * 24), 1);
    setNights(differenceInDays);
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    let price = details?.price * nights;
    const discount = 40;
    const serviceFee = 10;

    if (includeMeals) price += 20 * nights;
    if (includePorter) price += 10 * nights;

    setTotalPrice(price - discount + serviceFee);
  }, [nights, includeMeals, includePorter, details.price]);

  const handleSubmit = async () => {
    const bookingData = {
      userId: userId,
      trekId: trekId,
      checkIn: checkInDate.date,
      checkOut: checkOutDate.date,
      amount: totalPrice.toString(),
    };

    try {
      console.log("Booking data:", bookingData);
      const response = await axios.post(
        "https://tic-himalayan-utopia-backend-v1.onrender.com/api/bookings/",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Reservation successful!");
      console.log(response.data);
      setClientSecret(response.data?.data?.clientSecret);
      setBookingId(response.data?.data?.booking?._id);
      setBookingData(response.data);
      // Handle success response if needed
      // setBookingId(data.bookingId);
      setPayment(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response.data.message === "Refresh token not found. Please log in again.") {
        toast.error("Please login your session expired.");
        return;
      } else { 
        toast.error(error.response.data.message);
      }
    }
  };
  // console.log("Client secret:", clientSecret);

  const handlePaymentSuccess = () => {
    setIsModalOpen(false);
    navigate("/booking-success");
  };

  return (
    <div className="w-full lg:w-1/3 flex flex-col gap-1.5">
      {!userId || !token ? (
        <p className="text-sm text-red-500 py-2">
          Please log in to create a booking.
        </p>
      ) : null}
      <div className="w-full flex items-center justify-between">
        <h1 className="text-xl font-semibold popp">
          $ {details?.price} / night
        </h1>
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
          <option value="1">1 Guest</option>
          <option value="2">2 Guests</option>
          <option value="3">3 Guests</option>
          <option value="4">4 Guests</option>
          <option value="5">5 Guests</option>
          <option value="6">6 Guests</option>
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
          <label htmlFor="meals" className="popp text-sm">
            Include Meals
          </label>
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
          <label htmlFor="porter" className="popp text-sm">
            Include Porter
          </label>
        </div>
      </div>

      <div className="pricing flex py-4 flex-col items-center w-full">
        <div className="w-full flex py-2 items-center justify-between">
          <p className="text-sm popp">
            $ {details?.price} * {
              nights > 1 ? nights : 0
            } nights
          </p>
          {nights > 1 && (
            <p className="text-sm popp">$ {details?.price * nights}</p>
          )}
          {/* <p className="text-sm popp">$ {details?.price * nights}</p> */}
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
        {totalPrice > 0 && (
        <div className="w-full flex py-2 items-center justify-between">
          <p className="text-lg font-semibold popp">Total (INR)</p>
          <p className="text-lg font-semibold popp">$ {totalPrice}</p>
        </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!userId || !token}
        className={`popp px-5 p-2 rounded-[10px] ${
          !userId || !token
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#70B4E8] text-white"
            
        }`}
      >
        Reserve
      </button>
      <p className="text-sm popp p-2 text-center">You won't be charged yet</p>
      {/* {isModalOpen && clientSecret && (
        <PaymentModalWrapper
          clientSecret={clientSecret}
          onSuccess={handlePaymentSuccess}
          onClose={() => setIsModalOpen(false)}
        />
      )} */}
    </div>
  );
};

export default PackageDetailForm;
