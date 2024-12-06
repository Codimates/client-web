import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LOGO from '../../images/logo.png';
import { FaRegUser, FaGripLines } from "react-icons/fa";

export default function Headbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle the dropdown
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Navigate to /sign
  const handleSignInClick = () => navigate('/signin');

  return (
    <div className='bg-[#1A1A1D] shadow-md bg-opacity '>
      <div className='flex items-center justify-between px-6 py-3 md:px-10'>

        {/* Logo */}
        <img src={LOGO} alt='Logo' className='h-[60px]' />

        {/* Desktop Menu */}
        <div className='items-center hidden space-x-8 md:flex'>
          <button className='text-white transition-colors duration-300 hover:text-gray-300'>
            About us
          </button>
          <button className='text-white transition-colors duration-300 hover:text-gray-300'>
            Contact us
          </button>
          <button
            onClick={handleSignInClick}
            className='flex items-center px-4 py-2 text-white transition-all duration-300 border border-gray-500 rounded-lg hover:bg-gray-700 hover:shadow-lg'
          >
            <FaRegUser className='mr-2' />
            <span>Sign in</span>
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <div className='flex md:hidden'>
          <button onClick={toggleDropdown} className='text-white'>
            <FaGripLines size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isDropdownOpen && (
        <div className='flex flex-col items-start px-6 py-3 bg-[#2A2A2D] md:hidden'>
          <button className='w-full py-2 text-left text-white transition-colors duration-300 hover:text-gray-300'>
            About us
          </button>
          <button className='w-full py-2 text-left text-white transition-colors duration-300 hover:text-gray-300'>
            Contact us
          </button>
          <button
            onClick={handleSignInClick}
            className='flex items-center px-4 py-2 mt-2 text-white transition-all duration-300 border border-gray-500 rounded-lg hover:bg-gray-700 hover:shadow-lg'
          >
            <FaRegUser className='mr-2' />
            <span>Sign in</span>
          </button>
        </div>
      )}
    </div>
  );
}
