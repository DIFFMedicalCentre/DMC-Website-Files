import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const IndexPage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    {
      src: "https://img.freepik.com/premium-vector/medical-consultation-white-background_186616-1704.jpg",
      label: "In-Person Consultation",
    },
    {
      src: "https://img.freepik.com/free-vector/organic-flat-customer-support-illustrated_23-2148923865.jpg",
      label: "Virtual Consultation",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === 0 ? 1 : 0)); // Toggle between 0 and 1
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <>
      <Navbar />

      <div className="flex flex-col justify-center items-center text-black p-2 ">
        <h1 className="text-[40px] font-bold flex justify-center items-center text-center">
          Avoid Hassles & Delays.
        </h1>
        <p className="text-[22px]">
          How is your health today? Sounds like not good!
        </p>
        <p className="text-[22px]">
          Do not worry, Find your doctor online. Book as you wish with DIFF
          Medical Centre.
        </p>

        {/* Image Animation Section */}
        <div className="mt-10 relative w-full max-w-7xl h-[30rem] md:h-[40rem] overflow-hidden">
          {images.map((image, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: currentImage === index ? 1 : 0 }}
            >
              <img
                src={image.src}
                alt="Consultation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl font-bold">
                {image.label}
              </div>
            </div>
          ))}
        </div>

        {/* Animated Cards Section */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-7xl">
          {/* In-person Consultation Card */}
          <div className="bg-white text-black rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
            <h2 className="text-xl font-bold mb-2">In-person Consultation</h2>
            <p className="mb-4">
              Schedule a visit to our facility for a face-to-face consultation
              with our qualified doctors.
            </p>
            <a
              className="bg-blue-950 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              href="/InPersonBookNow"
            >
              Book Now
            </a>
          </div>

          {/* Virtual Consultation Card */}
          <div className="bg-white text-black rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
            <h2 className="text-xl font-bold mb-2">Virtual Consultation</h2>
            <p className="mb-4">
              Connect with our healthcare professionals from the comfort of your
              home through a virtual consultation.
            </p>
            <a
              className="bg-blue-950 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              href="VirtualBookNow"
            >
              Book Now
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default IndexPage;
