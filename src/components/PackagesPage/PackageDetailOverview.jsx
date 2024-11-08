import React from "react";
import { BsHouse } from "react-icons/bs";
import { FaBed, FaSkiing, FaUtensils, FaWifi, FaSwimmer, FaSpa, FaParachuteBox } from "react-icons/fa"; 
import { FaSailboat } from "react-icons/fa6";
import { PiCampfireBold } from "react-icons/pi";


const featureIcons = {
  "skiing": <FaSkiing className="mr-1" />,
  "bed": <FaBed className="mr-1" />,
  "restaurant": <FaUtensils className="mr-1" />,
  "wiFi": <FaWifi className="mr-1" />,
  "swimming Pool": <FaSwimmer className="mr-1" />,
  "spa": <FaSpa className="mr-1" />,
  "paragliding": <FaParachuteBox className="mr-1" />,
  "boating" : <FaSailboat className="mr-1" />,
  "rafting" : <FaSailboat className="mr-1" />,
  "bonfire" : <PiCampfireBold className="mr-1" />
};

const PackageDetailOverview = ({ details }) => {
  return (
    <>
      <div className="w-full lg:w-2/3 flex flex-col items-start justify-start">
        <h1 className="text-2xl popp">Overview</h1>
        <div className="flex popp items-center gap-1">
          <BsHouse className="text-blue-500 text-lg" />
          {details?.guests} guests • &nbsp;
          {details?.noOfDay} days • &nbsp;
          {details?.noOfNight} nights
        </div>
        <p className="text-start popp text-sm py-4 ">{details?.description}</p>
        <div className="text-sm mt-2 pb-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla porro
          ipsam temporibus alias? Alias incidunt quidem repellendus consequuntur
          fugit vel sed error ipsam expedita, magnam voluptatum quam magni, eum,
          dicta hic at rerum. Quia quas vel dignissimos, voluptatum officiis
          nesciunt.
        </div>
        <hr className="w-full border-1 border-gray-200" />
        <h1 className="text-2xl popp py-8">This package offers</h1>
        <div className="flex flex-wrap gap-4">
          {details?.features.map((feature, index) => (
            <div
              key={index}
              className="w-[35%] capitalize lg:w-1/3 flex items-center popp gap-2 p-2 rounded-lg"
            >
              {featureIcons[feature] || <FaSkiing className="mr-1" />} {/* Default icon */}
              {feature}
            </div>
          ))}
        </div>
        <button className="bg-[#70B4E8] text-white popp px-5 p-2 mt-8 rounded-[10px]">
          Show All Amenities
        </button>
      </div>
    </>
  );
};

export default PackageDetailOverview;
