import React, { useEffect, useState } from "react";
import axios from "axios";
import HomePageBanner from "./HomePageBanner";

export default function Logoshow() {
  const [approvedBrands, setApprovedBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch brands from the API
  const getBrands = async () => {
    try {
      const response = await axios.get("/inventory/brand/getallbrands");
      setApprovedBrands(response.data);
    } catch (error) {
      console.error("Can't get approved brands:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component loads
  useEffect(() => {
    getBrands();
  }, []);

  return (
    <div className="pb-6 mt-[-70px] border  w-screen">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-950">Explore Popular Brands</h2>
      </div>
      <div>
        <HomePageBanner/>
      </div>
      <div className="flex items-center justify-center gap-6 px-4 py-4 overflow-x-auto  bg-[#19191a] bg-opacity-25">
        {loading ? (
          <div className="flex justify-center w-full">
            <div className="w-5 h-5 border-4 border-orange-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : approvedBrands.length > 0 ? (
          approvedBrands.map((brand) => (
            <div
              key={brand._id}
              className="relative flex-shrink-0 h-[70px] transition-transform duration-200 rounded-full w-[70px] hover:scale-110"
            >
              {brand.brandlogo ? (
                <img
                  src={brand.brandlogo}
                  alt={brand.brandname}
                  className="object-cover w-full h-full border-2 border-orange-500 rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-300 border-2 border-orange-500 rounded-full">
                  <span className="text-xs text-gray-500">No Logo</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white bg-[#19191A] rounded-full opacity-0 bg-opacity-80 hover:opacity-100">
                {brand.brandname}
              </div>
            </div>
          ))
        ) : (
          <h3 className="text-gray-500">No brands available</h3>
        )}
      </div>
    </div>
  );
}
