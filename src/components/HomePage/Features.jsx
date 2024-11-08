import React, { useRef, useEffect, useState } from "react";
import compass from "../../assets/compass.png";
import clock from "../../assets/clock.png";
import heart from "../../assets/heart.png";
import flag from "../../assets/flag.png";
import backdropimage from "../../assets/backdropimage.jpeg";

// Features Data
const featuresData = [
  {
    icon: heart,
    title: "Customer Delight",
    description: "We deliver the best service and experience for our customers.",
  },
  {
    icon: compass,
    title: "Authentic Adventures",
    description: "We deliver real adventure experiences for our customers.",
  },
  {
    icon: flag,
    title: "Expert Guides",
    description: "We provide only expert tour guides for our customers.",
  },
  {
    icon: clock,
    title: "Time Flexibility",
    description: "We offer flexible travel times for our customers.",
  },
];

const Features = () => {
  const carouselRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    let scrollInterval;

    if (isMobile) {
      scrollInterval = setInterval(() => {
        if (carouselRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
          // Adjust the scroll step to a smaller value for smoother scrolling
          const scrollStep = 200; // Scroll by 200px instead of the full clientWidth
          
          if (scrollLeft + clientWidth >= scrollWidth) {
            carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            carouselRef.current.scrollBy({ left: scrollStep, behavior: "smooth" });
          }
        }
      }, 3000); // Scroll every 3 seconds
    }
    return () => {
      clearInterval(scrollInterval);
      window.removeEventListener("resize", checkIfMobile);
    };
  }, [isMobile]);

  return (
    <div
      className="w-full relative"
      style={{
        backgroundImage: `url(${backdropimage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "400px",
      }}
    >
      <div
        ref={carouselRef}
        className="absolute overflow-hidden px-6 md:px-20 gap-4 bg-transparent backdrop-blur-sm w-full h-full top-0 left-0 flex no-scrollbar overflow-x-auto scroll-smooth xl:overflow-x-visible"
        style={{ scrollBehavior: "smooth" }}
        onMouseEnter={() => clearInterval(carouselRef.current)}
        onTouchStart={() => clearInterval(carouselRef.current)} 
      >
        {featuresData.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center min-w-[250px] md:min-w-[200px] lg:min-w-[250px] justify-center text-white mx-4 md:mx-8"
          >
            <img src={feature.icon} alt={feature.title} className="w-[40px] md:w-[60px] mb-4" />
            <h1 className="text-lg md:text-xl text-center text-black popp font-semibold">{feature.title}</h1>
            <p className="text-center text-black popp px-4 md:px-6 lg:px-8 text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
