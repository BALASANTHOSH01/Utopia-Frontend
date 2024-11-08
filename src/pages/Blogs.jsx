import React from "react";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import article1 from "../assets/article1.jpeg";
import article2 from "../assets/article2.jpeg";

const articles = [
  {
    title: "Exploring the Majestic Alps",
    description: "TRAVEL",
    image: article1,
    text: "Dive into Japan's rich history, traditions, and iconic landmarks, from the vibrant cities to the tranquil temples.",
  },
  {
    title: "A Journey Through the Himalayas.",
    description: "ONLINE",
    image: article2,
    text: "Discover the beauty of the Swiss Alps with breathtaking views, thrilling adventures, and serene landscapes that leave you wanting",
  },
  {
    title: "Cultural Riches of Japan",
    description: "TRAVEL",
    image:
      "https://att-japan.net/wp-content/uploads/2023/06/pixta_97309535_M.webp",
    text: "Dive into Japan's rich history, traditions, and iconic landmarks, from the vibrant cities to tranquil temples.",
  },
  {
    title: "A Journey Through the Sahara Desert",
    description: "ONLINE",
    image:
      "https://cdn.britannica.com/10/152310-050-5A09D74A/Sand-dunes-Sahara-Morocco-Merzouga.jpg",
    text: "Experience the vastness of the Sahara Desert, with its endless sand dunes, and unforgettable sunsets.",
  },
];

const Blogs = () => {
  return (
    <>
      <div className="w-full flex items-center flex-col">
        <Navbar />
        <div className=" mt-[100px] mb-[150px] w-full xl:w-10/12 justify-center flex flex-col items-center p-4 md:p-10 ">
          <h1 className="text-5xl uppercase osw md:text-6xl font-bold text-center">
            Blogs
          </h1>
          <p className="text-center text-[#4997D3] mt-2 popp mb-8 text-lg md:text-base">
            Explore our latest articles and travel guides to inspire your next
            adventure.
          </p>
          <div className="w-full flex items-center justify-between flex-wrap gap-6 lg:gap-6">
            {articles &&
              articles.map((article, index) => (
                <div
                  key={index}
                  className="w-full cursor-pointer transition-all group lg:w-[48%] xl:w-[48%] mb-4 h-[400px] rounded-3xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 gap-2 bg-gradient-to-b from-black/0 transition-all to-black/50 bg-opacity-50 rounded-3xl flex flex-col justify-end items-start p-8">
                    <span className="text-white tracking-[0.5rem] text-start text-sm popp">
                      {article.description}
                    </span>
                    <h1 className="text-3xl uppercase font-semibold osw text-white mb-2">
                      {article.title}
                    </h1>
                    <p
                      className="text-white w-3/4 text-sm
                        line-clamp-2
                    "
                    >
                      {article.text}
                    </p>
                  </div>
                  <img
                    src={article.image}
                    alt="image"
                    className="w-full h-full object-cover rounded-3xl"
                    style={{
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </div>
              ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Blogs;
