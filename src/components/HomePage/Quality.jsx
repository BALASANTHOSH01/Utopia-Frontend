import React, { useEffect, useState, useRef } from "react";
import CountUp from "react-countup";
import quality1 from "../../assets/quality1.jpeg";

const Quality = () => {
  const [startCounting, setStartCounting] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const sectionTop = sectionRef.current.getBoundingClientRect().top;
        const triggerPoint = window.innerHeight * 0.8; // 80% of the viewport height
        if (sectionTop < triggerPoint) {
          setStartCounting(true);
          window.removeEventListener("scroll", handleScroll); // Remove listener after triggering
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={sectionRef} className="w-full flex items-center justify-center mt-[150px] py-12 md:p-12 md:px-20">
      <div
        className="w-full xl:w-4/5 relative md:rounded-3xl"
        style={{
          backgroundImage: `url(${'https://ik.imagekit.io/vsn/quality1.jpeg'})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "600px",
        }}
      >
        <div className="absolute w-full h-full bg-black/40 top-0 left-0 md:px-20 py-20 md:rounded-3xl">
          <h1 className="text-center md:text-start text-[24px] text-3xl font-semibold text-white">
            ONLY THE BEST QUALITY FOR YOU
          </h1>
          <div className="w-full flex md:h-[80%] md:py-8 text-white justify-center items-center">
            <div className="w-[100%] md:w-1/2 h-full flex items-start justify-start">
              <h1 className="w-full text-center md:text-start text-[14px] md:text-lg">
                You deserve the ultimate best quality <br /> for your memorable
                experiences.
              </h1>
            </div>
            <div className="w-1/2 h-full hidden md:flex items-end justify-end">
              <h1 className="text-lg">
                Take a look at our numbers for our <br /> credibility. Let’s
                have an adventure!
              </h1>
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row items-center py-8 md:py-0 text-white gap-6 md:gap-1">
            {startCounting && (
              <>
                <div className="w-full md:w-1/4 md:border-r border-white flex flex-col items-center justify-center gap-2">
                  <h1 className="text-2xl">
                    <CountUp start={0} end={20} duration={4} suffix=" +" />
                  </h1>
                  <p>years of experience</p>
                </div>
                <div className="w-full md:w-1/4 md:border-r border-white flex flex-col items-center justify-center gap-2">
                  <h1 className="text-2xl">
                    <CountUp start={0} end={100} duration={4} suffix=" +" />
                  </h1>
                  <p>destination locations</p>
                </div>
                <div className="w-full md:w-1/4 md:border-r border-white flex flex-col items-center justify-center gap-2">
                  <h1 className="text-2xl">
                    <CountUp start={0} end={10} duration={6} suffix=" +" />
                  </h1>
                  <p>tour & travel awards</p>
                </div>
                <div className="w-full md:w-1/4 md:border-white flex flex-col items-center justify-center gap-2">
                  <h1 className="text-2xl">
                    <CountUp start={0} end={2237216} duration={3} />
                  </h1>
                  <p>delightened clients</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quality;
