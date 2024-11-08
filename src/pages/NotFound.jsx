import React from "react";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";

const NotFound = () => {
  return (
    <>
      <div className="flex items-center flex-col justify-center w-full">
        <Navbar />
        <div className="flex items-center flex-col gap-5 justify-center w-full h-[80vh]">
          <h1 className="text-6xl font-semibold popp">404: Page Not Found</h1>
          <button
            onClick={() => window.location.replace("/packages")}
            className="mt-4 bg-[#70B4E8] text-white popp px-4 py-2 rounded-[10px]"
          >
            Discover Packages
          </button>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default NotFound;
