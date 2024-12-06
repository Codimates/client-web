import React from 'react';
import SignCompo from '../../components/userRegAndSignCompo/SignCompo';

export default function SignModal({ closeModal }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeModal} // Close the modal when clicking outside
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-[1000px] h-[800px] rounded-lg shadow-lg">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute text-gray-500 top-3 right-3 hover:text-gray-700"
        >
          ✖
        </button>

        {/* Sign-In Content */}
        <div className="p-6">
          <SignCompo />
        </div>
      </div>
    </div>
  );
}
