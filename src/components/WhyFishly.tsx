import React, { useState } from "react";

const features = [
  {
    id: 1,
    title: "Alive at your Doorstep",
    imgSrc: "./images/alive_fish.jpg",
    altText: "Alive at your Doorstep",
    description: "We deliver real freshness, alive fishes at your doorstep.",
  },
  {
    id: 2,
    title: "24x7 Alive fishes",
    imgSrc: "./images/24x7_fish.jpg",
    altText: "24x7 Alive fishes",
    description: "Skip the morning rush, we deliver 24/7.",
  },
  {
    id: 3,
    title: "No preservatives or frozen",
    imgSrc: "./images/no_preservatives.jpg",
    altText: "No preservatives or frozen",
    description:
      "You get fish as fresh as nature intended with no freezing or preservatives.",
  },
  {
    id: 4,
    title: "QC by customer",
    imgSrc: "./images/qc_customer.jpg",
    altText: "QC by customer",
    description:
      "You can personally inspect your fish at delivery to guarantee it's freshness.",
  },
  {
    id: 5,
    title: "On-site cut at your place",
    imgSrc: "./images/on_site_cut.jpg",
    altText: "On-site cut in your kitchen",
    description:
      "On site cleaning and cutting at customer's choosen location with no mess or hassle.",
  },
  {
    id: 6,
    title: "Pre cut with personalised video",
    imgSrc: "./images/pre_cut_video.jpg",
    altText: "Pre cut with personalised video",
    description: "Personalized video of your fish was freshly caught and cut.",
  },
];

const WhyFishly: React.FC = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const handleHover = (id: number) => {
    setHoveredFeature(id);
  };

  const handleMouseLeave = () => {
    setHoveredFeature(null);
  };

  return (
    <div className="my-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-6">Why Fishly?</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 justify-items-center mx-auto">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="relative flex flex-col items-center justify-center p-4 border rounded-lg shadow-lg w-full max-w-[240px] h-36 cursor-pointer group"
            onMouseEnter={() => handleHover(feature.id)}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleHover(feature.id)}
            onTouchEnd={handleMouseLeave}
          >
            {/* Image initially visible, will hide on hover */}
            <img
              src={feature.imgSrc}
              alt={feature.altText}
              className={`w-20 h-20 object-cover mb-2 transition-opacity duration-300 ${
                hoveredFeature === feature.id ? "opacity-0" : "opacity-100"
              }`}
            />

            {/* Title always visible */}
            <h3 className="text-md font-semibold text-center">
              {feature.title}
            </h3>

            {/* Description centered and visible on hover */}
            <div
              className={`absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out`}
            >
              <p className="text-md font-semibold text-center">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyFishly;
