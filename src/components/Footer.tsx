import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* About the website */}
          <div>
            <h3 className="text-xl font-semibold mb-4">About Us</h3>
            <p className="text-gray-300">
              Welcome to Fishly, where we bring the freshest Alive fish
              experience directly to your doorstep. At Fishly, we specialize in
              delivering Alive fish and providing on-site cutting services,
              ensuring that you receive the highest quality fish just the way
              you like it. Our innovative approach combines convenience with
              freshness, allowing customers to enjoy a premium Alive fish
              experience without leaving their homes. With Fishly, you’re not
              just buying fish—you’re experiencing an Absolute freshness on your
              plate, all in one seamless service.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Services</h3>
            <p className="text-gray-300">
              On-Site Cutting: Experience the freshest fish delivered right to
              your kitchen! Our trained executive will arrive at your doorstep
              to cut the live fish in front of you, ensuring the highest quality
              and freshness. <br /> <br />
              Pre-Cut Delivery: Prefer convenience? Choose our pre-cut service!
              You’ll receive fish that’s already been expertly prepared. Within
              7 minutes of your order, you'll receive a QR code to scan. Enjoy a
              personalized video showcasing the fish-catching process, giving
              you peace of mind that your fish was freshly sourced.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-300">
              Address: Plot no 63, Ishwaraiyam nagar, Kundrathur, Chennai-69.
            </p>
            <p className="text-gray-300">Phone: +91 7358952118</p>
            <p className="text-gray-300">Email: fishlylive@gmail.com</p>
          </div>
        </div>
        <hr className="my-8 border-gray-700" />
        <div className="text-center text-gray-500 text-sm">
          &copy; 2024 Fishly. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
