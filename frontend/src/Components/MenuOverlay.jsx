import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function MenuOverlay({ menuList, handleClose }) {
  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-sky-100 bg-opacity-10 backdrop-blur-lg overflow-auto z-50"
      data-aos="slide-left"
      data-aos-duration="500"
      data-aos-easing="ease-out"
    >
      {/* Cross Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleClose}
          className="text-orange-500 bg-transparent hover:border-0 text-3xl font-bold hover:scale-125 transition-all ease-in-out duration-300"
        >
          &times;
        </button>
      </div>

      <div className="flex flex-col items-center justify-center min-h-full mt-0">
        {menuList.map((item) => (
          <h1
            key={item.id}
            onClick={handleClose}
            className="text-orange-500 text-[24px] mb-10 hover:scale-125 transition-all ease-in-out duration-300 cursor-pointer"
          >
            {item.title}
          </h1>
        ))}
      </div>
    </div>
  );
}

export default MenuOverlay;
