import React, { useState, useEffect, useRef } from "react";
import Headbar from "../components/HomePage/Headbar";
import ShowLaptop from "../components/comonCompo/ShowLaptop";
import BG from "../images/background.jpg";
import BGhome from "../images/BGHome.jpg";
import { motion, AnimatePresence } from "framer-motion";
import AboutandContact from "../components/HomePage/AboutandContact";
import { FaLaptop, FaTools, FaWrench } from "react-icons/fa";

export default function HomePage() {
  // Array of phrases to cycle through
  const phrases = [
    "Island Wide Delivery",
    "Fast & Reliable Service",
    "Nationwide Coverage",
    "Connecting Every Corner",
    "Your Trusted Delivery Partner",
  ];

  const [currentPhrase, setCurrentPhrase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 3000); // Change phrase every 3 seconds

    return () => clearInterval(interval);
  }, [phrases.length]);

  const scrollRef = useRef(null);

  return (
    <div
      className="absolute inset-0 bg-center bg-no-repeat bg-cover"
      style={{
        backgroundImage: `url(${BG})`,
      }}
    >
      {/* Fixed Headbar */}
      <div className="fixed top-0 left-0 z-50 w-full">
        <Headbar />
      </div>

      {/* Scrollable Content */}
      <div className="pt-[80px] overflow-y-auto h-screen">
        {/* Section with BGHome background */}
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] bg-cover bg-center flex items-center justify-center text-white">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{
              backgroundImage: `url(${BGhome})`,
              opacity: 0.6,
            }}
          ></div>

          {/* Text Overlay with Animation */}
          <div className="relative items-center text-center">
            <motion.div
              className="text-orange-500 text-[60px] sm:text-[100px] md:text-[150px] font-bold"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="flex justify-center">
                LapLanka<span className="text-[#19191A]">.lk</span>
              </div>
            </motion.div>

            {/* Animated Phrase */}
            <AnimatePresence mode="wait">
              <motion.div
                key={phrases[currentPhrase]} // Dynamic key for animation
                className="text-[#19191A] text-xl sm:text-3xl md:text-6xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {phrases[currentPhrase]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-[#19191a] py-16 scrollbar-hide">
          <h2 className="text-4xl font-bold text-center text-white md:text-5xl">
            Our Services
          </h2>
          <div className="relative mt-10">
            {/* Scrollable Services Div */}
            <div
              ref={scrollRef}
              className="flex gap-8 px-8 overflow-x-auto no-scrollbar"
            >
              {/* Laptop Sale */}
              <motion.div
                className="min-w-[300px] p-6 text-center bg-white rounded-lg shadow-lg hover:shadow-xl transform transition-transform hover:scale-110 hover:-translate-y-3"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <FaLaptop className="w-16 h-16 mx-auto text-orange-500" />
                <h3 className="mt-4 text-2xl font-bold">Laptop Sale</h3>
                <p className="mt-2 text-lg text-gray-600">
                  Explore a wide range of laptops with the latest features and unbeatable prices.
                </p>
              </motion.div>

              {/* Laptop Repair */}
              <motion.div
                className="min-w-[300px] p-6 text-center bg-white rounded-lg shadow-lg hover:shadow-xl transform transition-transform hover:scale-110 hover:-translate-y-3"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <FaTools className="w-16 h-16 mx-auto text-orange-500" />
                <h3 className="mt-4 text-2xl font-bold">Laptop Repair</h3>
                <p className="mt-2 text-lg text-gray-600">
                  Reliable and affordable laptop repair services with expert technicians.
                </p>
              </motion.div>

              {/* Software Installation */}
              <motion.div
                className="min-w-[300px] p-6 text-center bg-white rounded-lg shadow-lg hover:shadow-xl transform transition-transform hover:scale-110 hover:-translate-y-3"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <FaWrench className="w-16 h-16 mx-auto text-orange-500" />
                <h3 className="mt-4 text-2xl font-bold">Software Installation</h3>
                <p className="mt-2 text-lg text-gray-600">
                  Professional software installation services to set up your devices efficiently.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-20">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <ShowLaptop />
          </motion.div>
        </div>
        <div>
          <AboutandContact />
        </div>
      </div>
    </div>
  );
}
