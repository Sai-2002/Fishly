import React from "react";

const WhyFishly: React.FC = () => {
  return (
    <div className="my-12 px-4">
      {" "}
      {/* Added horizontal padding */}
      <h2 className="text-3xl font-bold text-center mb-6">Why Fishly?</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 justify-items-center mx-auto">
        {/* Alive at your Doorstep */}
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-lg w-full max-w-[240px] h-36">
          <img
            src="./images/alive_fish.jpg" // Replace with the path to your image
            alt="Alive at your Doorstep"
            className="w-20 h-20 object-cover mb-2" // Adjusted image size
          />
          <h3 className="text-md font-semibold text-center">
            Alive at your Doorstep
          </h3>{" "}
          {/* Text centered inside the box */}
        </div>
        {/* 24x7 Alive fishes */}
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-lg w-full max-w-[240px] h-36">
          <img
            src="./images/24x7_fish.jpg" // Replace with the path to your image
            alt="24x7 Alive fishes"
            className="w-20 h-20 object-cover mb-2" // Adjusted image size
          />
          <h3 className="text-md font-semibold text-center">
            24x7 Alive fishes
          </h3>
        </div>
        {/* No preservatives or frozen */}
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-lg w-full max-w-[240px] h-36">
          <img
            src="./images/no_preservatives.jpg" // Replace with the path to your image
            alt="No preservatives or frozen"
            className="w-20 h-20 object-cover mb-2" // Adjusted image size
          />
          <h3 className="text-md font-semibold text-center">
            No preservatives or frozen
          </h3>
        </div>
        {/* QC by customer */}
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-lg w-full max-w-[240px] h-36">
          <img
            src="./images/qc_customer.jpg" // Replace with the path to your image
            alt="QC by customer"
            className="w-20 h-20 object-cover mb-2" // Adjusted image size
          />
          <h3 className="text-md font-semibold text-center">QC by customer</h3>
        </div>
        {/* On-site cut in your kitchen */}
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-lg w-full max-w-[240px] h-36">
          <img
            src="./images/on_site_cut.jpg" // Replace with the path to your image
            alt="On-site cut in your kitchen"
            className="w-20 h-20 object-cover mb-2" // Adjusted image size
          />
          <h3 className="text-md font-semibold text-center">
            On-site cut in your kitchen
          </h3>
        </div>
        {/* Pre cut with personalised video */}
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-lg w-full max-w-[240px] h-36">
          <img
            src="./images/pre_cut_video.jpg" // Replace with the path to your image
            alt="Pre cut with personalised video"
            className="w-20 h-20 object-cover mb-2" // Adjusted image size
          />
          <h3 className="text-md font-semibold text-center">
            Pre cut with personalised video
          </h3>
        </div>
      </div>
    </div>
  );
};

export default WhyFishly;
