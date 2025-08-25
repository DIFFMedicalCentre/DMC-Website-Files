import { Link } from "react-router-dom"; // Ensure you use React Router for navigation
import { motion } from "framer-motion"; // Import motion from framer-motion for animations
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const testimonials = [
  {
    id: 1,
    name: "Cancer/Oncology Services",
    image: "https://via.placeholder.com/300x200", // Replace with actual images
    link: "/oncology-services",
  },
  {
    id: 2,
    name: "Cardiac/Heart Services",
    image: "https://via.placeholder.com/300x200", // Replace with actual images
    link: "/cardiac-services",
  },
  {
    id: 3,
    name: "ER/Emergency Services",
    image: "https://via.placeholder.com/300x200", // Replace with actual images
    link: "/emergency-services",
  },
  {
    id: 4,
    name: "Imaging/X-Ray Services",
    image: "https://via.placeholder.com/300x200", // Replace with actual images
    link: "/imaging-services",
  },
  {
    id: 5,
    name: "General Services",
    image: "https://via.placeholder.com/300x200", // Replace with actual images
    link: "/general-services",
  },
  {
    id: 6,
    name: "Exceptional Care Comments",
    image: "https://via.placeholder.com/300x200", // Replace with actual images
    link: "/exceptional-care-comments",
  },
];

const Testimonials = () => {
  return (
    <div>
      <Navbar />
      {/* Heading Section */}
      <div className="section-offset bg-white text-sky-950 flex flex-col items-center">
        <motion.div className="w-full p-6 text-center">
          <h2 className="text-4xl font-bold">Testimonials</h2>
        </motion.div>
      </div>

      {/* Testimonials Grid */}
      <div className="bg-gray-100 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-sky-950">
          Here is what our Patients have to say:
        </h2>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Link
                to={testimonial.link}
                key={testimonial.id}
                className="block bg-white rounded-lg shadow-lg hover:shadow-xl hover:bg-sky-950 hover:text-white transform hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-800 hover:text-white">
                    {testimonial.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Testimonials;
