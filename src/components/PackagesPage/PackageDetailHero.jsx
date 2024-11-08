import React, { useState } from "react";
import { IoShareSocial } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosStar } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const PackageDetailHero = ({ details }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <h1 className="items-center text-sm md:text-md flex gap-1 popp">
          &nbsp; {details?.reviews} reviews &nbsp;- {details?.location}
        </h1>
        <div className="flex gap-2 items-center">
          <span className="flex gap-1.5 items-center" onClick={toggleModal}>
            <IoShareSocial className="text-blue-500 text-lg cursor-pointer" />
            <span className="text-md popp cursor-pointer">Share</span>
          </span>
          <span className="flex gap-1.5 items-center">
            <IoMdHeartEmpty className="text-blue-500 text-lg" />
            <span className="text-md popp">Save</span>
          </span>
        </div>
      </div>

      <div className="gallery py-6 w-full">
        <div className="w-full relative">
          <img
            src={details?.bannerImage}
            alt="main"
            className="w-full h-[600px] object-cover rounded-[20px]"
          />
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center p-20 justify-between">
            <div className="flex flex-col">

            <p className="text-blue-400 text-center uppercase tracking-wider">
              GALLERY
            </p>
            <h1 className="text-6xl osw lg:text-7xl text-center uppercase font-semibold text-black">
              OUR {details?.name}
            </h1>
            </div>

            <button className="border float-end flex items-center gap-2 tracking-wide text-white px-6 py-4 rounded-[5px] mt-4">
              <FaInstagram /> FOLLOW US ON @UTOPIAINDIA
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-around gap-2 mt-4">
          {details.secondaryImages.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt="gallery"
              className="w-[48%] lg:w-[24%] h-[150px] object-cover rounded-[16px]"
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50  backdrop-blur-sm flex items-center justify-center"
          >
            <div className="bg-white rounded-[10px] p-6 w-11/12 md:w-2/5">
              <h2 className="text-lg font-semibold mb-4">Share this Package</h2>
              <div className="flex flex-col gap-4">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white p-2 font-semibold w-full rounded-[10px] flex items-center justify-center gap-1 hover:underline"
                >
                  <FaWhatsapp className="text-white text-lg mr-1" />
                  Share on WhatsApp
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white p-2 font-semibold rounded-[10px] flex items-center justify-center gap-1 hover:underline"
                >
                  <FaFacebook className="text-white text-lg mr-1" />
                  Share on Facebook
                </a>

                {/* Copy Link */}
                <div className="flex items-center">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="border border-gray-300 rounded-l-[10px] px-2 py-2 w-full focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 bg-blue-500 border border-blue-500 text-white rounded-r-[10px] transition-all ${
                      copied ? "bg-green-500" : ""
                    }`}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              <button
                onClick={toggleModal}
                className="mt-6 py-2 px-4 float-right bg-gray-700 text-white rounded-[10px] hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PackageDetailHero;
