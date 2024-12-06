import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LOGO from '../../images/logo.png';
import {  FaGripLines } from "react-icons/fa";

export default function LogHeader() {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
  
    // Toggle the dropdown
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  
    // Navigate to /sign
    const handleSignInClick = () => navigate('/');
  
    return (
        <div className='bg-[#1A1A1D] bg-opacity-25'>
          <div className='flex items-center justify-between px-6 py-3 md:px-10'>
    
            {/* Logo */}
            <img src={LOGO} alt='Logo' className="h-[40px] sm:h-[40px] md:h-[40px] lg:h-[50px] xl:h-[60px]" onClick={handleSignInClick} />
    
            {/* Desktop Menu */}
            <div className='items-center hidden space-x-8 md:flex'>
              <button className='text-white transition-colors duration-300 hover:text-gray-300'>
                About us
              </button>
              <button className='text-white transition-colors duration-300 hover:text-gray-300'>
                Contact us
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
              
            </div>
          )}
        </div>
      );
    }
    