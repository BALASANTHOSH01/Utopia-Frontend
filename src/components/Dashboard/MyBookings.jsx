import axios from "axios";
import React, { useState, useEffect } from "react";
import useAuth from "../../services/useAuth";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user?.id;
  const {api} = useAuth();
  // console.log(token);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // console.log(token)
        const response = await api.get(
          "/api/bookings/my-bookings",
        );

        setBookings(response.data.data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings. Please try again.");
      }
    };

    fetchBookings();
  }, [token, userId]);

  return (
    <div>
      <h2>My Bookings</h2>
      {error && <p>{error}</p>}
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              <p>Trek: {booking.trek.name}</p>
              <p>Date: {new Date(booking.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default MyBookings;
