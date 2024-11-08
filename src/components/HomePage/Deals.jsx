import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import deals1 from "../../assets/deals1.jpeg";
import deals2 from "../../assets/deals2.jpeg";
import deals3 from "../../assets/deals3.jpeg";

const Deals = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center px-8 md:px-20 py-16 mt-[150px] pb-[150px]">
      <h1 className="text-center font-bold osw text-[32px] md:text-3xl mb-2">
        JACKPOT DEALS ON{" "}
        <span className="text-[#4997D3] uppercase">Manali</span> PACKAGES
      </h1>
      <p className="hidden md:flex text-md popp pb-8">
        Explore our top destinations right from our beloved top spots.
      </p>
      <div className="w-full xl:w-3/4 flex flex-col md:flex-row gap-6 items-start">
        {/* Left Side Card */}
        <div className="w-full md:w-1/4 hidden md:flex flex-col items-start gap-2">
          <img
            src={"https://ik.imagekit.io/vsn/deals1.jpeg"}
            alt="Manali"
            className="w-full h-80 object-cover rounded-3xl"
          />
          <h1 className="text-[32px] osw font-semibold">Manali</h1>
          <p className="flex items-center">
            <FaLocationDot className="mr-2 text-[#4997D3]" />
            <span className="popp">20 packages</span>
          </p>
        </div>

        {/* Active Middle Card */}
        <div className="w-full md:w-2/4 h-[420px] rounded-3xl relative overflow-hidden">
          <div className="absolute  inset-0 bg-gradient-to-b from-black/0 to-black/80 bg-opacity-50 rounded-3xl flex flex-col justify-end items-start p-8">
            <div className="flex flex-row gap-5 md:gap-0 md:flex-col mb-2 md:mb-0 items-center md:items-start justify-end">
              <h1 className="text-[32px] osw text-white mb-0 md:mb-2">
                Gangtok
              </h1>
              <p className="flex items-center text-white mb-0 md:mb-[15px]">
                <FaLocationDot className="mr-2 text-[#4997D3]" />
                <span className="popp">20 packages</span>
              </p>
            </div>
            <p className="text-[12px] md:text-sm popp mb-[20px] text-white">
              Experience the thrill of exploring the world's most fascinating
              destinations with our expertly curated travel packages.
            </p>

            <div className="flex text-sm gap-4">
              <button
                onClick={() =>
                  window.location.replace("/package/671ce6f5e38be32fd4b2634c")
                }
                className="bg-white popp text-black px-4 py-2 rounded-[5px]"
              >
                Book Now
              </button>
              <button
                onClick={() =>
                  window.location.replace("/package/671ce6f5e38be32fd4b2634c")
                }
                className="hidden md:flex bg-transparent popp hover:bg-white text-white border border-white hover:text-black px-4 py-2 rounded-[5px] transition-all"
              >
                Learn More
              </button>
            </div>
          </div>
          <img
            src={"https://ik.imagekit.io/vsn/deals2.jpeg"}
            alt="image"
            className="w-full h-full object-cover rounded-3xl"
            style={{ backgroundSize: "cover", backgroundPosition: "center" }}
          />
        </div>

        <div className="w-full  flex md:hidden md:w-2/4 h-[420px] rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/80 bg-opacity-50 rounded-3xl flex flex-col justify-end items-start p-8">
            <div className="flex flex-row gap-5 md:gap-0 md:flex-col mb-2 md:mb-0 items-center justify-end">
              <h1 className="text-[32px] osw text-white md:mb-2">Manali</h1>
              <p className="flex items-center text-white mb-0 md:mb-[15px]">
                <FaLocationDot className="mr-2 text-[#4997D3]" />
                <span className="popp">20 packages</span>
              </p>
            </div>
            <p className="text-[12px] md:text-sm popp mb-[20px] text-white">
              Experience the thrill of exploring the world's most fascinating
              destinations with our expertly curated travel packages.
            </p>

            <div className="flex text-sm gap-4">
              <button
                onClick={() =>
                  window.location.replace("/package/671ce6f5e38be32fd4b2634c")
                }
                className="bg-white popp text-black px-4 py-2 rounded-[5px]"
              >
                Book Now
              </button>
              <button
                onClick={() =>
                  window.location.replace("/package/671ce6f5e38be32fd4b2634c")
                }
                className="hidden md:flex bg-transparent popp hover:bg-white text-white border border-white hover:text-black px-4 py-2 rounded-[5px] transition-all"
              >
                Learn More
              </button>
            </div>
          </div>
          <img
            src={"https://ik.imagekit.io/vsn/deals1.jpeg"}
            alt="image"
            className="w-full h-full object-cover rounded-3xl"
            style={{ backgroundSize: "cover", backgroundPosition: "center" }}
          />
        </div>

        {/* Right Side Card */}
        <div className="w-1/4 hidden md:flex flex-col items-start gap-2">
          <img
            src={"https://ik.imagekit.io/vsn/deals3.jpeg"}
            alt="Kalimpog"
            className="w-full h-80 object-cover rounded-3xl"
          />
          <h1 className="text-[32px] osw font-semibold">Kalimpog</h1>
          <p className="flex items-center">
            <FaLocationDot className="mr-2 text-[#4997D3]" />
            <span className="popp">20 packages</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Deals;
