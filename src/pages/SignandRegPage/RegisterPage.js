import React from 'react';
import RegisterCompo from '../../components/userRegAndSignCompo/RegisterCompo';
import BG from '../../images/BGG1.jpeg';
//import Lg from '../../images/logo.png'; // Correct import for the logo
import LogHeader from '../../components/userRegAndSignCompo/LogHeader';

const RegisterPage = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${BG})`, // Correctly passing the image URL
        }}
      ></div>

      {/* Overlay with blur effect */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>

      {/* Content Container */}
      <div className="relative ">
        {/* Logo */}
        <div className="">
          <LogHeader/>
        </div>
        <div className='mx-2 my-4'>
           {/* Registration Component */}
          <RegisterCompo />
        </div>

       
      </div>
    </div>
  );
};

export default RegisterPage;
