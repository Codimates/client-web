import React from 'react';
import SignCompo from '../../components/userRegAndSignCompo/SignCompo';
import BG1 from '../../images/bg1.jpg';
import LogHeader from '../../components/userRegAndSignCompo/LogHeader';

export default function SignPage() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${BG1})`, // Correctly passing the image URL
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
          <SignCompo/>
        </div>

       
      </div>
    </div>
  );
};
