import React from "react";

const Articles = () => {
  const articles = [
    {
      title: "ADVENTURE PATH FOR YOUR TRIP",
      description: "TRAVEL",
      image: "https://ik.imagekit.io/vsn/article1.jpeg",
    },
    {
      title: "THINGS TO DO FROM HOME",
      description: "ONLINE",
      image: "https://ik.imagekit.io/vsn/article2.jpeg",
    },
  ]
  return (
    <>
      <div className="w-full items-center flex justify-center mt-[150px] mb-[150px] px-8 md:px-20 py-12">
        <div className="w-full xl:w-4/5 flex items-center flex-col gap-5">
          <h1 className="text-[16px] md:text-lg popp tracking-widest w-full text-center md:text-start text-[#4997D3]">
            HIMALAYAN UTOPIA
          </h1>
          <div className="flex items-start justify-center md:justify-between w-full">
            <h1 className="text-[32px] osw md:text-5xl font-semibold">BOOK YOUR ADVENTURE</h1>
            <p className="hidden md:flex popp text-blue-400 underline">See More Articles</p>
          </div>

          <div className="w-full flex items-center justify-between flex-wrap gap-6 lg;gap-0">
            {articles && articles.map((article, index) => (
            <div key={index} className="w-full lg:w-[48%] xl:w-[48%] h-[400px] rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 gap-2 bg-gradient-to-b from-black/0 to-black/50 bg-opacity-50 rounded-3xl flex flex-col justify-end items-start p-8">
                <span className="text-white tracking-[0.5rem] text-start text-sm popp">{article.description}</span>
                <h1 className="text-3xl font-semibold osw text-white mb-2">
                  {article.title}
                </h1>
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
      </div>
    </>
  );
};

export default Articles;
