import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Importing icons

const Slideshow: React.FC = () => {
  // State to track the screen width for responsive image selection
  const [isMobile, setIsMobile] = useState(false);

  // Sample images for the mobile and desktop layouts
  const mobileImages = [
    "./images/desktop_image1.jpg",
    "./images/desktop_image3.jpg",
    "./images/desktop_image2.jpg",
    "./images/desktop_image5.jpg",
  ];

  const desktopImages = [
    "./images/mobile_image3.jpg",
    "./images/mobile_image1.jpg",
    "./images/mobile_image2.jpg",
    "./images/mobile_image5.jpg",
  ];

  // Slider settings
  const settings = {
    dots: false, // Disable default dots
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Set to 3 seconds
    cssEase: "ease-in-out", // Smooth transition
  };

  // Create a reference to the slider
  const sliderRef = useRef<Slider | null>(null);

  // Function to navigate to the previous slide
  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  // Function to navigate to the next slide
  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  // Set up a listener to detect screen width changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set to true for mobile (or adjust based on your breakpoints)
    };

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Check initial window size
    handleResize();

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-full mx-auto px-4 pt-6">
      {/* Aspect Ratio Wrapper */}
      <div className={`relative ${isMobile ? "aspect-[2/1]" : "aspect-[4/1]"}`}>
        {/* 2:1 for mobile, 4:1 for desktop */}
        <Slider
          ref={sliderRef}
          {...settings}
          className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-lg"
        >
          {(isMobile ? mobileImages : desktopImages).map((image, index) => (
            <div key={index} className="h-full">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Previous and Next buttons */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200"
        onClick={handlePrev}
      >
        <FaChevronLeft className="text-lg" />
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200"
        onClick={handleNext}
      >
        <FaChevronRight className="text-lg" />
      </button>
    </div>
  );
};

export default Slideshow;
