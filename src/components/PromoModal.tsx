import { useState, useEffect } from "react";

const PromoModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Set a timer to open the modal after 5 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000); // 5000ms = 5 seconds

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative w-96 p-6 bg-white bg-opacity-90 rounded-lg shadow-lg mt-12 animate-fade-in-up animate-float">
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-600 hover:text-black"
          >
            ✕
          </button>
          <div className="text-center">
            <img src="COUNT YOUR BLESSINGS.jpg" alt="Promo" />
            <h2 className="text-3xl font-bold text-red-700">
              Count Your Blessings
            </h2>
            <p className="text-2xl text-black mt-2">
              A Discounted IVF Program aimed at wiping tears away from your eyes
            </p>
            <p className="mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-white bg-black rounded-lg hover:bg-blue-950"
              >
                Continue
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default PromoModal;
