import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { motion } from "framer-motion";
import useAuth from "../../services/useAuth";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState(null);
  const {api} = useAuth();

  const handleSubscribe = async () => {
    if (!email) return;

    try {
      // const response = await fetch("http://localhost:5000/api/newsletter/subscribe", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // });

      const response = await api.post("/api/newsletter/subscribe",{email});
      
      const data = await response.json();
      
      if (data.status === "success") {
        setSubscribed(true);
      } else {
        setError("Subscription failed. Please try again.");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center relative">
      <div className="w-full overflow-hidden relative flex items-center">
        <img src={'https://ik.imagekit.io/vsn/footermain.png'} alt="footer" className="z-10 w-full object-cover" />
        
        <motion.img
          src={"https://ik.imagekit.io/vsn/cloud1.png"}
          alt="cloud-left"
          className="absolute top-0 -z-50 left-0 w-1/3 md:w-1/4 object-cover"
          initial={{ x: -100 }}
          animate={{ x: 100 }}
          transition={{ repeat: Infinity, duration: 10, repeatType: "reverse" }}
        />
        
        <motion.img
          src={"https://ik.imagekit.io/vsn/cloud2.png"}
          alt="cloud-right"
          className="absolute top-0 z-20 right-0 w-1/3 md:w-1/4 object-cover"
          initial={{ x: 100 }}
          animate={{ x: -100 }}
          transition={{ repeat: Infinity, duration: 10, repeatType: "reverse" }}
        />

        <div className="absolute hidden z-50 top-0 left-0 w-full h-full md:flex flex-col items-center justify-center gap-4 px-4 md:px-0">
          <h1 className="text-3xl osw md:text-6xl font-semibold text-black text-center">
            START YOUR ADVENTURE
          </h1>
          <p className="text-xs md:text-sm text-center max-w-md md:max-w-xl popp">
            Sign up for our newsletter and receive exclusive travel deals, insider tips, and destination inspiration. Don't miss out on the adventure - join our mailing list today!
          </p>

          {subscribed ? (
            <p className="text-lg text-green-600 popp">Subscribed successfully!</p>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-1/2 lg:w-1/3">
              <input
                type="text"
                value={email}
                placeholder="Enter your email address here"
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 w-full xl:w-3/4 popp placeholder:text-black focus:outline-none bg-transparent border-b border-black"
              />
              <button
                onClick={handleSubscribe}
                className="bg-[#222222] hover:bg-[#51acf2] transition-all popp rounded-[5px] text-white px-6 py-2 w-full md:w-1/3"
              >
                Subscribe
              </button>
            </div>
          )}

          {error && <p className="text-red-600 popp">{error}</p>}
        </div>
      </div>

      {/* Footer Content */}
      <div className="w-full flex items-center justify-center bg-[#222222] p-6 md:p-8">
        <div className="w-full lg:w-4/5">
          <div className="w-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 pb-10">
            {/* Logo */}
            <img src={logo} alt="logo" className="w-24 md:w-32" />

            {/* Navigation Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-center">
              <a href="/packages" className="popp text-white">Destinations</a>
              <a href="/packages" className="popp text-white">Tours</a>
              <a href="#" className="popp text-white">About</a>
              <a href="#" className="popp text-white">Support</a>
              <a href="#" className="popp text-white">Contact</a>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-6 md:gap-8">
              <FaLinkedin className="text-white text-xl md:text-2xl" />
              <FaSquareInstagram className="text-white text-xl md:text-2xl" />
            </div>
          </div>

          {/* Divider */}
          <hr className="border-t border-[#ababab]" />

          {/* Footer Bottom Section */}
          <div className="w-full flex flex-col md:flex-row items-center justify-between py-6 text-center md:text-left">
            <p className="text-white popp text-sm">
              Copyright © 2024 Himalayan Utopia. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 md:mt-0">
              <a href="#" className="popp text-sm text-white border-r px-4">Privacy Policy</a>
              <a href="#" className="popp text-sm text-white px-2">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
