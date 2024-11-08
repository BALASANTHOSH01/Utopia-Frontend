import React from "react";

const Carousel = ({ images }) => {
  return (
    <div className="w-full overflow-hidden relative">
      <div className="flex gap-5 animate-carousel">
        {images.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt="gallery"
            className="w-full md:w-[400px] h-[250px] object-cover rounded-[16px]"
          />
        ))}
        {images.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt="gallery"
            className="w-full md:w-[400px] h-[250px] object-cover rounded-[16px]"
          />
        ))}
        {images.map((photo, index) => (
          <img
            key={index + images.length} 
            src={photo}
            alt="gallery"
            className="w-full md:w-[400px] h-[250px] object-cover rounded-[16px]"
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
