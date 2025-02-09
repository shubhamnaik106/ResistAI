import React, { useEffect } from 'react';

//import AOS from "aos";
//import "aos/dist/aos.css";

function Hero() {

  //useEffect(() => {
  //  AOS.init({duration:1200})
  //})
  
  return (
    <div  className='grid grid-cols-1 md:grid-cols-2  items-center gap-6 px-4 md:px-10 backdrop-blur-sm bg-white bg-opacity-10  rounded-3xl  bg-clip-padding    mt-4' data-aos="fade-down"
    data-aos-easing="ease-out"
    data-aos-duration="1000">
      <div className='mb-10 text-center md:text-left pt-10'  data-aos="zoom-out" data-aos-delay="1000">
        
        <div className='mt-4 flex justify-center md:justify-start gap-4'>
          LEFT DIV
        </div>

      </div>
      <div className='flex justify-center' data-aos="zoom-out" data-aos-delay="1000">
        RIGHT DIV
      </div>
    </div>
  );
}

export default Hero;

