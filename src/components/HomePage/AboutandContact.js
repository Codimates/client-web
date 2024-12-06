import React from "react";
import { motion } from "framer-motion";

export default function AboutandContact() {
  return (
    <div>
      <div className="bg-[#19191a] text-white py-10 px-5 md:px-20">
        {/* About Section */}
        <div className="mb-10">
          <motion.h2
            className="text-3xl font-bold text-center md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About Us
          </motion.h2>
          <motion.p
            className="max-w-4xl mx-auto mt-5 text-lg leading-relaxed text-center md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            At LapLanka.lk, we specialize in providing top-notch delivery services across Sri Lanka. 
            With a commitment to reliability, speed, and customer satisfaction, we strive to connect every corner of the island. 
            Whether you're looking to deliver essentials or gifts, we are your trusted delivery partner.
          </motion.p>
        </div>

        {/* Contact Section */}
        <div>
          <motion.h2
            className="text-3xl font-bold text-center md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Contact Us
          </motion.h2>
          <div className="grid max-w-4xl grid-cols-1 gap-8 mx-auto mt-5 md:mt-10 md:grid-cols-2">
            {/* Contact Info */}
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-xl font-semibold">Get in Touch</h3>
              <p className="mt-2 text-lg">
                Phone: <span className="text-orange-500">+94 123 456 789</span>
              </p>
              <p className="mt-1 text-lg">
                Email: <span className="text-orange-500">support@laplanka.lk</span>
              </p>
              <p className="mt-1 text-lg">
                Address: 123 Main Street, Colombo, Sri Lanka
              </p>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="p-6 text-black bg-white rounded-lg shadow-lg"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="mb-4 text-xl font-semibold">Send Us a Message</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-500"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-500"
                />
                <textarea
                  placeholder="Your Message"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-500"
                  rows="4"
                ></textarea>
                <button
                  type="submit"
                  className="w-full p-3 font-bold text-white bg-orange-500 rounded-md hover:bg-orange-600"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
