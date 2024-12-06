import React, { useState, useEffect } from "react";
import Banner from "../../images/spider.png";
import Banner1 from "../../images/Msi.png";
import Banner3 from "../../images/Rog.png";

const HomePageBanner = () => {
  const banners = [Banner, Banner1, Banner3];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle automatic slide change
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        setIsTransitioning(false);
      }, 800); // Transition duration
    }, 5000); // Slide change interval
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="relative w-full max-w-screen-xl px-2 mx-auto sm:px-4">
      <div className="relative">
        <div
          className={`flex items-center justify-center h-[250px] sm:h-[400px] md:h-[500px] py-2 sm:py-4 transition-all duration-1000 ease-in-out ${
            isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <img
            src={banners[currentIndex]}
            alt={`Banner ${currentIndex + 1}`}
            className="object-contain w-full h-full max-h-full rounded-lg"
          />
        </div>

        {/* Dots Indicators */}
        <div className="absolute z-10 flex space-x-2 transform -translate-x-1/2 bottom-4 left-1/2">
          {banners.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 border-2 ${
                currentIndex === index
                  ? "bg-orange-500 border-orange-500 scale-110"
                  : "bg-gray-300 border-gray-300"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePageBanner;
