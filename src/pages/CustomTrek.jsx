import React, { useState } from "react";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import DatePicker from "../components/Common/DatePicker";
import InputField from "../components/Common/InputField";
import { LuPencil } from "react-icons/lu";
import useAuth from "../services/useAuth";
import { toast } from "sonner";

const CustomTrek = () => {
  // Initialize dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(tomorrow);
  const [guests, setGuests] = useState(1);
  const [trekName, setTrekName] = useState("");
  const [features, setFeatures] = useState([]);

  const {api} = useAuth();

  // Format date for API
  const formatDateForAPI = (date) => {
    try {
      const d = new Date(date);
      return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    } catch (error) {
      console.error("Date formatting error:", error);
      return null;
    }
  };

  // Handle date changes from DatePicker
  const handleDateChange = (date, type) => {
    // Create a new date object from the input
    const selectedDate = new Date(date);
    
    // Set time to midnight to ensure consistent date comparison
    selectedDate.setHours(0, 0, 0, 0);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (type === 'checkIn') {
      // For check-in date
      if (selectedDate < currentDate) {
        toast.error("Check-in date cannot be in the past");
        return;
      }
      setCheckInDate(selectedDate);
      
      // If check-out date is before new check-in date, update it
      if (checkOutDate <= selectedDate) {
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setCheckOutDate(nextDay);
      }
    } else {
      // For check-out date
      if (selectedDate <= checkInDate) {
        toast.error("Check-out date must be after check-in date");
        return;
      }
      setCheckOutDate(selectedDate);
    }
  };

  const validateForm = () => {
    if (!trekName.trim()) {
      toast.error("Please enter a trek name");
      return false;
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (checkInDate < currentDate) {
      toast.error("Check-in date cannot be in the past");
      return false;
    }

    if (checkOutDate <= checkInDate) {
      toast.error("Check-out date must be after check-in date");
      return false;
    }

    return true;
  };

  const handleFeaturesChange = (e) => {
    if (e.key === "Enter" && e.target.value) {
      const newFeature = e.target.value.trim();
      if (!features.includes(newFeature)) {
        setFeatures([...features, newFeature]);
        e.target.value = "";
      }
    }
  };

  const removeFeature = (feature) => {
    setFeatures(features.filter((f) => f !== feature));
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      const formattedCheckIn = formatDateForAPI(checkInDate);
      const formattedCheckOut = formatDateForAPI(checkOutDate);

      if (!formattedCheckIn || !formattedCheckOut) {
        toast.error("Invalid date format");
        return;
      }

      const trekData = {
        location: trekName.trim(),
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        guests,
        features,
      };

      const response = await api.post(
        "/api/customeTrek/create",
        trekData
      );

      // Reset form on success
      setCheckInDate(new Date());
      setCheckOutDate(tomorrow);
      setGuests(1);
      setTrekName("");
      setFeatures([]);
      toast.success("Trek requested successfully");
    } catch (error) {
      const statusMessage = error.response?.data?.status || "Something went wrong!";
      toast.error(
        statusMessage === "Access denied."
          ? "Please login to request a trek"
          : statusMessage
      );
    }
  };

  // UI remains exactly the same
  return (
    <>
      <div className="w-full flex flex-col items-center">
        <Navbar />
        <div className="w-full mt-[150px] mb-[150px] px-8 flex xl:w-10/12 items-center flex-col">
          <h1 className="text-4xl font-bold osw uppercase mt-10">
            Custom Trek
          </h1>
          <p className="text-lg text-center mt-5 lg:px-20">
            Create your own trekking package with us. Choose your destination,
            duration, and activities you want to do. We will make sure to
            provide you with the best experience.
          </p>

          <div className="w-full lg:w-4/5 mt-10 flex py-4 flex-col items-center">
            <InputField
              icon={LuPencil}
              name={"name"}
              type={"text"}
              title={"Trek Name"}
              value={trekName}
              handleChange={(e) => setTrekName(e.target.value)}
            />
            <div className="w-full flex my-5 flex-col lg:flex-row gap-4">
              <div className="flex items-center gap-5 pt-4 justify-between w-full">
                <div className="w-full flex flex-col items-start gap-1">
                  <label className="text-sm font-semibold popp">Check-in</label>
                  <DatePicker
                    formData={checkInDate}
                    setFormData={(date) => handleDateChange(date, 'checkIn')}
                  />
                </div>
                <div className="w-full flex flex-col items-start gap-1">
                  <label className="text-sm font-semibold popp">
                    Check-out
                  </label>
                  <DatePicker
                    formData={checkOutDate}
                    setFormData={(date) => handleDateChange(date, 'checkOut')}
                  />
                </div>
              </div>

              <div className="w-full flex justify-end flex-col items-start gap-1">
                <label className="text-sm font-semibold popp">Guests</label>
                <select
                  name="guests"
                  id="guests"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full text-sm p-2 mt-2 border-b popp border-gray-300"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} Guest{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full">
              <label className="block mb-1">Features</label>
              <div className="mb-2 flex flex-wrap gap-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-zinc-200 rounded-[10px] px-3 py-1.5"
                  >
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(feature)}
                      className="ml-2 text-red-500"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add feature and press Enter"
                onKeyDown={handleFeaturesChange}
                className="w-full p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="btn mt-5 bg-[#70B4E8] text-white popp p-2 w-full rounded-[10px]"
            >
              Submit
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default CustomTrek;