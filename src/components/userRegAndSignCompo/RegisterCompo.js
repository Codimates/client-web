import React, { useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaAddressCard,
  FaUserPlus,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import User from "../../images/user.jpg"; // Default image path
import io from "socket.io-client";

export default function RegisterCompo() {
  const socket = io("http://localhost:4004");

  const navigate = useNavigate();
  const [data, setData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    address: "",
    image: User, // Default image
  });

  const registerUser = async (e) => {
    e.preventDefault();
    const {
      fname,
      lname,
      email,
      phone_number,
      password,
      confirmPassword,
      address,
      image,
    } = data;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    socket.emit("register", {
      fname,
      lname,
      email,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString(),
    });

    socket.on("registerSuccess", ({ message }) => {
      window.alert(message);
    });

    try {
      const response = await axios.post("/user/createuser", {
        fname,
        lname,
        email,
        phone_number,
        password,
        address,
        image, // Send default image
      });

      const { message } = response.data;
      if (response.status === 201) {
        toast.success(message);
        navigate("/signin"); // Redirect to login after successful registration
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
      console.error("Error registering user:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full max-w-lg p-8 space-y-6 bg-[#19191A] bg-opacity-50 rounded-lg shadow-md border border-orange-500">
        <h2 className="text-2xl font-semibold text-center text-white">
          Register
        </h2>
        <form className="space-y-4" onSubmit={registerUser}>
          {/* First Name */}
          <div>
            <div className="flex justify-between ">
              <div className="mr-1">
                <label
                  htmlFor="fname"
                  className="block text-sm font-medium text-white text-start"
                >
                  First Name
                </label>
                <div className="relative mt-1">
                  <FaUser className="absolute text-orange-500 transform -translate-y-1/2 top-1/2 left-3" />
                  <input
                    type="text"
                    name="fname"
                    id="fname"
                    placeholder="Enter your first name"
                    className="w-full pl-10 pr-4 py-2 text-sm text-white bg-[#19191A] border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 h-12"
                    value={data.fname}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <div>
                  <label
                    htmlFor="lname"
                    className="block text-sm font-medium text-white text-start"
                  >
                    Last Name
                  </label>
                  <div className="relative mt-1">
                    <FaUser className="absolute text-orange-500 transform -translate-y-1/2 top-1/2 left-3" />
                    <input
                      type="text"
                      name="lname"
                      id="lname"
                      placeholder="Enter your last name"
                      className="w-full pl-10 pr-4 py-2 text-sm text-white bg-[#19191A] border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 h-12"
                      value={data.lname}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Last Name */}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white text-start"
            >
              Email
            </label>
            <div className="relative mt-1">
              <FaEnvelope className="absolute text-orange-500 transform -translate-y-1/2 top-1/2 left-3" />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2 text-sm text-white bg-[#19191A] border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 h-12"
                value={data.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium text-white text-start"
            >
              Phone Number
            </label>
            <div className="relative mt-1">
              <FaPhone className="absolute text-orange-500 transform -translate-y-1/2 top-1/2 left-3" />
              <input
                type="text"
                name="phone_number"
                id="phone_number"
                placeholder="Enter your phone number"
                className="w-full pl-10 pr-4 py-2 text-sm text-white bg-[#19191A] border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 h-12"
                value={data.phone_number}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white text-start"
            >
              Password
            </label>
            <div className="relative mt-1">
              <FaLock className="absolute text-orange-500 transform -translate-y-1/2 top-1/2 left-3" />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2 text-sm text-white bg-[#19191A] border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 h-12"
                value={data.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white text-start"
            >
              Confirm Password
            </label>
            <div className="relative mt-1">
              <FaLock className="absolute text-orange-500 transform -translate-y-1/2 top-1/2 left-3" />
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm your password"
                className="w-full pl-10 pr-4 py-2 text-sm text-white bg-[#19191A] border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 h-12"
                value={data.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-white text-start"
            >
              Address
            </label>
            <div className="relative mt-1">
              <FaAddressCard className="absolute text-orange-500 transform -translate-y-1/2 top-1/2 left-3" />
              <input
                type="text"
                name="address"
                id="address"
                placeholder="Enter your address"
                className="w-full pl-10 pr-4 py-2 text-sm text-white bg-[#19191A] border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 h-12"
                value={data.address}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Register Button */}
          <div>
            <button
              type="submit"
              className="flex items-center justify-center w-full h-12 px-4 py-2 space-x-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
            >
              <FaUserPlus />
              <span>Register</span>
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-white">
            Already have an account?{" "}
            <button
              type="button"
              className="text-yellow-500 hover:underline"
              onClick={() => navigate("/signin")}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
