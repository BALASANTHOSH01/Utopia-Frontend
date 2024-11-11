import React, { useEffect, useState } from "react";
import useAuth from "../../services/useAuth";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const { api} = useAuth();
  

  useEffect(() => {
    const getBookings = async () => {
      try {
        const response = await api.get(
          "/api/bookings/getallbooking"
        );
        setBookings(response?.data?.data?.bookings);
      } catch (error) {
        console.log(error);
      }
    };

    getBookings();
  }, []);
  
  console.log(bookings);
  return (
    <div className="w-full max-w-3xl p-4">
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>
      {bookings &&
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="border rounded-[16px] hover:bg-zinc-100 cursor-pointer items-start transition-all p-4 flex flex-col gap-4 my-4"
          >
            <h1 className="text-xl font-bold">{booking?.trek?.name}
              <span className="text-sm font-light"> ({booking?.trek?.location})</span>
            </h1>
            <p className="text-sm border px-4 border-yellow-500 py-1 bg-yellow-300 rounded-2xl capitalize">{booking?.status}</p>
            <p className="text-md">
              Total Price: {booking?.amount }
            </p>
            <div className="flex items-center">
              <p className="font-semibold">
                Check in:{" "}
                <span className="font-light">{new Date(booking?.checkIn).toLocaleDateString()}</span>
              </p>
              <p className="font-semibold ml-4">
                Check out:{" "}
                <span className="font-light">{new Date(booking?.checkOut).toLocaleDateString()}</span>
              </p>
            </div>
          </div>
        ))}
      {bookings.length === 0 && <h1>No Bookings</h1>}
    </div>
  );
};

export default Bookings;
