import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Importing icons

const Slideshow: React.FC = () => {
  // Sample images for the slideshow
  const images = [
    "./images/image1.jpg",
    "./images/image2.jpg",
    "./images/image3.jpg",
  ];

  // State to track the current slide
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slider settings
  const settings = {
    dots: false, // Disable default dots
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000, // Set to 4 seconds
    cssEase: "ease-in-out", // Smooth transition
    beforeChange: (_current: number, next: number) => {
      setCurrentSlide(next); // Update the current slide state
    },
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

  return (
    <div className="relative w-full mx-auto px-4">
      {/* Aspect Ratio Wrapper */}
      <div className="relative w-full pb-[25%]">
        {" "}
        {/* 4:1 aspect ratio */}
        <Slider
          ref={sliderRef}
          {...settings}
          className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-lg"
        >
          {images.map((image, index) => (
            <div key={index} className="h-full">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover rounded-lg transition-all duration-700 ease-in-out" // Smooth image transition
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

      {/* Bullet Points */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full bg-gray-300 transition-all duration-300 ${
              currentSlide === index ? "w-6 h-6 bg-black" : ""
            }`} // Enlarges and changes color to black when active
          />
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
