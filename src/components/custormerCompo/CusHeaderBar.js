import React, { useContext, useState } from 'react';
import { FaGripLines, FaCartPlus, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { UserContext } from '../../context/UserContext';
import Logo from '../../images/logo.png';
import CartModal from './CartModel'; // Import the CartModal component

const CusHeaderBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownmobileOpen, setIsDropdownmobileOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false); // State for controlling cart modal

  const { user, loading, logout } = useContext(UserContext);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleDropdownmobile = () => setIsDropdownmobileOpen((prev) => !prev);
  const toggleMobileDropdown = () => setIsMobileDropdownOpen((prev) => !prev);

  const toggleCartModal = () => setIsCartModalOpen((prev) => !prev); // Toggle function for cart modal

  const renderUserSection = () => {
    if (loading) {
      return <span>Loading...</span>;
    }
    if (user) {
      return <span>{user.fname}</span>;
    }
    return <span>Sign In</span>;
  };

  return (
    <header className="bg-[#1A1A1D] shadow-md relative">
      <div className="flex items-center justify-between px-6 py-3 md:px-10">
        {/* Logo */}
        <img 
          src={Logo}
          alt="Logo" 
          className="h-[40px] sm:h-[50px] md:h-[60px] lg:h-[70px] xl:h-[80px]" 
        />

        {/* Desktop Menu */}
        <div className="items-center hidden space-x-8 md:flex">
          <button className="text-white transition-colors duration-300 hover:text-gray-300">
            About us
          </button>
          <button className="text-white transition-colors duration-300 hover:text-gray-300">
            Contact us
          </button>

          {/* User Profile Button */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center px-4 py-2 text-white transition-all duration-300 border border-gray-500 rounded-lg hover:bg-gray-700 hover:shadow-lg"
            >
              <img src={user.image} alt="user" className="w-10 h-10 mr-3 rounded-full" />
              {renderUserSection()}
            </button>

            {/* Desktop Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 z-50 mt-2 bg-[#2A2A2D] text-white shadow-md rounded-lg py-2 w-40">
                <button className="flex items-center w-full px-4 py-2 text-left text-white transition-colors duration-300 hover:text-gray-300">
                  <FaCog className="mr-2" size={18} />
                  Settings
                </button>
                <button className="flex items-center w-full px-4 py-2 text-left text-white transition-colors duration-300 hover:text-gray-300" onClick={logout}>
                  <FaSignOutAlt className="mr-2" size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Cart Button */}
          <button
            onClick={toggleCartModal} // Open modal on cart button click
            className="flex items-center justify-center h-12 px-4 py-2 text-center text-white transition-colors duration-300 bg-orange-500 rounded hover:text-gray-300 hover:bg-orange-700"
          >
            <FaCartPlus size={30} />
            <span className="pl-2">Add Cart</span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center justify-center md:hidden ">
          {/* Mobile User Profile */}
          <div className="relative">
            <button 
              onClick={toggleDropdownmobile} 
              className="mt-2 mr-3 "
            >
              <img src={user.image} alt="user" className="w-8 h-8 rounded-full" />
            </button>
            
            {/* Mobile User Dropdown */}
            {isDropdownmobileOpen && (
              <div className="absolute right-0 z-3 mt-2 bg-[#2A2A2D] text-white shadow-md rounded-lg py-2 w-40">
                <button className="flex items-center w-full px-4 py-2 text-left text-white transition-colors duration-300 hover:text-gray-300">
                  <FaCog className="mr-2" size={18} />
                  Settings
                </button>
                <button className="flex items-center w-full px-4 py-2 text-left text-white transition-colors duration-300 hover:text-gray-300" onClick={logout}>
                  <FaSignOutAlt className="mr-2" size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Cart Button */}
          <button
            onClick={toggleCartModal} // Open modal on mobile cart button click
            className="flex items-center justify-center mr-3 text-orange-500 rounded-full"
          >
            <FaCartPlus size={25} />
          </button>

          {/* Mobile Menu Toggle */}
          <button onClick={toggleMobileDropdown} className="text-white">
            <FaGripLines size={25} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileDropdownOpen && (
        <div className="absolute left-0 right-0 z-1 flex flex-col items-start px-6 py-3 bg-[#2A2A2D] md:hidden">
          <button className="w-full py-2 text-left text-white transition-colors duration-300 hover:text-gray-300">
            About us
          </button>
          <button className="w-full py-2 text-left text-white transition-colors duration-300 hover:text-gray-300">
            Contact us
          </button>
        </div>
      )}

      {/* Cart Modal */}
      <CartModal isOpen={isCartModalOpen} onClose={toggleCartModal} />
    </header>
  );
};

export default CusHeaderBar;
