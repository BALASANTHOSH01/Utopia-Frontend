import React from "react";
import packages1 from "../../assets/packages1.jpeg";
import packages2 from "../../assets/packages2.jpeg";

const Packages = () => {
  return (
    <>
      <div className="w-full flex items-center flex-col justify-center mt-[150px] pb-[80px] px-8 md:px-20 py-12">
        <div className="w-full xl:w-4/5 flex flex-col items-center">
          <div className="flex items-end justify-center md:justify-between w-full">
            <h1 className="text-center md:text-start osw text-3xl font-semibold"><span className="text-[#4997D3] md:text-black">SPECIAL</span> PACKAGES</h1>
            <p className="hidden md:flex popp text-end text-blue-400 underline">
              See more packages
            </p>
          </div>
          <p className="text-center md:text-start popp md:px-0 pb-8 md:pb-0 px-16 w-full text-sm py-3">
            Get special travel packages made tailored for your needs.
          </p>
          <div className="w-full mt-2 flex flex-col md:flex-row items-start gap-5">
            <div className="w-full md:w-1/3 h-[350px] md:h-[500px] rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/80 bg-opacity-50 rounded-3xl flex flex-col justify-end items-start p-8">
                <h1 className="text-[28px] md:text-3xl popp text-white mb-2">Outdoor Gateways</h1>
                <p className="flex items-center text-white mb-2">
                  {/* <FaLocationDot className="mr-2 text-[#4997D3]" /> */}
                  <span className="popp">131 stays</span>
                </p>
              </div>
              <div className="absolute top-5 right-5">
                  <h1 className="text-3xl osw text-white md:text-black font-semibold">01</h1>
                </div>
              <img
                src={packages1}
                alt="image"
                className="w-full h-full object-cover rounded-3xl"
                style={{
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
            <div className="w-full md:w-2/3 flex flex-col items-center gap-5">
              <div className="w-full h-[350px] rounded-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20 bg-opacity-50 rounded-3xl flex flex-col justify-end items-start md:items-end p-8">
                <div className="flex flex-col items-start">
                  <h1 className="text-3xl popp text-white mb-2">Unique <br/> Destinations</h1>
                    {/* <FaLocationDot className="mr-2 text-[#4997D3]" /> */}
                  <span className="text-white text-start popp">131 stays</span>
                </div>
                </div>
                <div className="absolute top-5 right-5">
                  <h1 className="text-3xl osw text-white md:tet-black font-semibold">02</h1>
                </div>
                <img
                  src={packages2}
                  alt="image"
                  className="w-full h-full object-cover rounded-3xl"
                  style={{
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </div>
              <div className="w-full hidden md:flex items-center gap-5">
                <div className="w-1/2">
                  <h1 className="text-6xl osw font-bold">WALK TO PARADISE</h1>
                </div>
                <div className="w-1/2 flex h-full justify-between flex-col items-start">
                  <p className="text-sm text-zinc-500 popp">Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC but not right.</p>
                  <button className="rounded-lg popp text-white font-semibold bg-[#70B4E8] mt-4 px-6 py-2">BOOK NOW</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Packages;
