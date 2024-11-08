import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import DateRangePicker from "../Common/DateRangePicker";
import axios from "axios";
import { motion } from "framer-motion";

const HeroSection = ({ image, title, description, tagline }) => {
  const [formData, setFormData] = useState({
    destination: "",
    dates: { from: "", to: "" },
    price: "",
  });
  const [treks, setTreks] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const response = await axios.get(
          "https://tic-himalayan-utopia-backend-v1.onrender.com/api/treks/getall"
        );
        // console.log("Treks:", response.data.data);
        setTreks(response.data.data.treks);
        // console.log(treks);
      } catch (error) {
        console.error("Error fetching treks:", error);
      }
    };
    fetchTreks();
  }, []);

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleDestinationChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({ ...prevData, destination: value }));

    debounce(() => {
      const filtered = treks.filter((trek) =>
        trek?.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDestinations(filtered.map((trek) => trek?.name));
    }, 500)();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { destination, dates, price } = formData;
    const queryParams = new URLSearchParams({
      destination,
      from: dates.from,
      to: dates.to,
      min: price,
      max: parseInt(price) + 1000,
    }).toString();

    navigate(`/packages?${queryParams}`);
  };

  return (
    <>
      <div className="w-full flex flex-col items-center h-full">
        {/* Hero Section */}
        <div
          className="h-screen w-full"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col justify-center items-center h-full">
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            className="text-md osw tracking-widest uppercase lg:text-2xl font-bold text-white">
              {tagline}
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            className="text-7xl osw lg:text-9xl font-bold text-white">
              {title}
            </motion.h1>
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            className="text-md md:text-[16px] lg:text-lg popp text-white text-center max-w-sm md:max-w-2xl">
              {description}
            </motion.h1>
          </div>
        </div>

        {/* Input Section */}
        <div className="inputs px-4 md:px-0 flex w-full items-center justify-center">
          <form
            className="w-full xl:w-[70%] flex flex-col md:flex-row items-center text-white px-6 md:px-12 bg-inherit/40 backdrop-blur-2xl border border-zinc-50/20 -mt-48 md:-mt-20 rounded-[25px] py-8"
            onSubmit={handleSubmit}
          >
            <div className="w-full relative md:w-1/4 flex flex-col border-white/50 xl:px-2 xl:border-r">
              <label
                htmlFor="destination"
                className="text-sm popp px-2 font-semibold"
              >
                Destination
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleDestinationChange}
                className="mt-2 p-2 popp rounded-lg bg-transparent placeholder:text-zinc-50 focus:outline-none"
                placeholder="Enter destination"
              />
              <ul className="absolute w-full top-16 left-0 mt-2 bg-white text-black rounded-lg overflow-y-auto max-h-40">
                {filteredDestinations.map((dest, index) => (
                  <li
                    key={index}
                    className="cursor-pointer border px-4 py-2 hover:bg-gray-200"
                    onClick={() => {
                      setFormData((prevData) => ({
                        ...prevData,
                        destination: dest,
                      }));
                      setFilteredDestinations([]);
                    }}
                  >
                    {dest}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full md:w-1/3 flex flex-col border-white/50 xl:px-6 xl:border-r">
              <label htmlFor="date" className="text-sm popp px-2 font-semibold">
                Date
              </label>
              <DateRangePicker formData={formData} setFormData={setFormData} />
            </div>

            <div className="w-full md:w-1/4 flex flex-col items-start md:ml-4">
              <label
                htmlFor="price"
                className="px-2 text-sm popp font-semibold"
              >
                Price
              </label>
              <select
                name="price"
                id="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    price: e.target.value,
                  }))
                }
                className="py-2 px-2 popp w-full rounded-lg bg-transparent text-white focus:outline-none"
              >
                <option value="1000" className="text-black">
                  $1,000 - $2,000
                </option>
                <option value="2000" className="text-black">
                  $2,000 - $3,000
                </option>
                <option value="3000" className="text-black">
                  $3,000 - $4,000
                </option>
              </select>
            </div>

            <div className="w-full md:w-1/5 flex items-center justify-center lg:justify-end h-full mt-2 md:mt-0 md:ml-4">
              <button
                type="submit"
                className="bg-[#70B4E8] popp hover:bg-[#51acf2] transition-all text-white py-2 px-10 rounded-lg"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
