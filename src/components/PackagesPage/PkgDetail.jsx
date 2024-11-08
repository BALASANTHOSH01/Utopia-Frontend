import React, { useState } from "react";
import manaliimg from "../../assets/manaliimg.jpeg";
import packages2 from "../../assets/packages2.jpeg";
import hero1 from "../../assets/hero1.jpeg";
import quality1 from "../../assets/quality1.jpeg";
import liveroute from "../../assets/liveroute.png";

import { IoIosStar } from "react-icons/io";

import PackageDetailOverview from "./PackageDetailOverview";
import PackageDetailHero from "./PackageDetailHero";
import PackageDetailForm from "./PackageDetailForm";
import Carousel from "./Carousel";
import MapView from "../MapView";
import PaymentPage from "../PaymentPage";

const tripDetails = {
  name: "Manali",
  bannerImage: manaliimg,
  description: "c",
  tagline: "Gateway for Skiing",
  price: 80,
  guests: 6,
  days: 5,
  nights: 4,
  rating: 4.5,
  reviews: 100,
  location: "Manali, Himachal Pradesh",
  mainimage: packages2,
  features: [
    "Skiing",
    "Paragliding",
    "Trekking",
    "Camping",
    "Rafting",
    "Kit 2",
    "Bonfire",
    "Cultural",
  ],
  secondaryImages: [
    hero1,
    "https://s3-alpha-sig.figma.com/img/8886/42e0/6a33c33e2cf4dd2e9c49c45915e86d6d?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=O6-AKHBjypGPQNGPqu9-ecHQPSKg-BpzEQpSUZT07gjjhwJBEUAW5-yBDOJG0u7R0czpp4ge88KpVtiuLh8~bZ7DvpnOJoOuDrvmchPttgvZCQ7UWoQRHi056mphCWQ10HDlNByuwOlkP6ymwtWUFSxsyPLPf-SH75tctH-SLe4rQp0KXEVMfLabdp-d4bw5mIhArXk7BxECsZFuMAUFoMcO67P5RGobZKwnP6v6mVtqYBW3FhGB2SLjDcBfzreIR~sr5-k-IY~cQixlWyYyEx8K-tsS9QsbtStJzOQG74CoFwRdX4SQOiYSoJptJPWrRTn7Kc0gTQJzhPZCuD8h1w__",
    quality1,
    "https://s3-alpha-sig.figma.com/img/f2c9/c395/9e037e431ab900558192d5ef30b9d329?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=AhjFajnlqRVowhLVm8Iqkkfb3zCNW0C1gde0XdzlLMk4F6VyqkBeS9EtjSSfx5cOFniIkrgb7pXGBSy2~mI2jw0S01WInX4r9Fm1Zf5UxDLoDzhW4TgEAxzEChNfJcBNFsWLm6IgDArUVOJUcygks-55lhcW4MmYp2msEwjirFjqdZZCWcxW5Rg6WDRYfeTtv3Pq9LzQhfCEpt~h-zqxILe6m6XRymQ39JTxGRZfTu6ikCzli1vPn7NoVlgHuTgq5Xqlm~VQq4Gs-CPzdNepuTAuSU0l79elzoqyiasQZWQaq3PTT95mnAIE~u6MH1ATiIxzbUsZ9R41F0sMhPM7bw__",
  ],
};

const PkgDetail = (props) => {
  // const details = tripDetails;
  const details = props.data;
  const [payment, setPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [ bookingData, setBookingData ] = useState(null);
  return (
    <>
      <div className="w-full flex flex-col items-center">
        {payment && clientSecret ? (
          <>
            <PaymentPage details={details} clientSecret={clientSecret} bookingData={bookingData}/>
          </>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div
              className="h-screen w-full"
              style={{
                backgroundImage: `url(${details?.bannerImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="flex flex-col lg:pb-24 justify-center items-center h-full">
                <h1 className="text-md osw lg:text-2xl uppercase font-bold text-white">
                  {details?.tagline && details?.tagline}
                </h1>
                <h1 className="text-7xl osw uppercase lg:text-9xl font-bold text-white">
                  {details?.name && details?.name}
                </h1>
                <h1 className="text-[16px] lg:text-lg popp text-white text-center max-w-2xl">
                  {details?.description && details?.description}
                </h1>
              </div>
            </div>

            <div className="w-full md:w-10/12 px-8 xl:px-20 py-32 flex items-center justify-center flex-col">
              <PackageDetailHero details={details} />

              <div className="overview flex-col lg:flex-row flex gap-20 py-8 items-start ">
                <PackageDetailOverview details={details} />
                <PackageDetailForm details={details} setBookingData={setBookingData} setPayment={setPayment} clientSecret={clientSecret} setClientSecret={setClientSecret} />
              </div>
            </div>
            {details?.coordinates && (
              <div className="w-full md:w-10/12 px-8 xl:px-20 pb-[150px] flex items-center justify-center flex-col gap-5">
                <h1 className="text-4xl osw uppercase font-bold text-center">
                  LIVE ROUTE SELECTION{" "}
                </h1>
                {/* <img src={liveroute} alt="live route" className="w-full rounded-[10px]" /> */}
                <MapView
                  latitude={details?.coordinates?.latitude}
                  longitude={details?.coordinates?.longitude}
                />
              </div>
            )}
          </div>
        )}
        {/* <div className="reviews w-full py-8 pb-32">
          <div className="flex gap-2 overflow-hidden justify-center items-center">
          {details.secondaryImages && <Carousel images={details.secondaryImages} />}
          </div>
        </div> */}
      </div>
    </>
  );
};

export default PkgDetail;
