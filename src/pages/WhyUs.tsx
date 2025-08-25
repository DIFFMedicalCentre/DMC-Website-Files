import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const WhyUs = () => {
  const container = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delayChildren: 0.3, staggerChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Navbar />
      <div className=" section-offset bg-gradient-to-br from-sky-950 to-sky-900 min-h-screen text-white flex flex-col items-center">
        {/* Header Section */}
        <header className="bg-[url('/Bg2.jpg')] bg-cover w-full bg-center shadow-lg text-center h-[14rem] p-2">
          <motion.h1
            className="text-4xl font-bold tracking-wide "
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Why Choose Us?
          </motion.h1>
          <p className="font-normal text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[1.4rem] max-w-4xl flex p-4 justify-center items-center m-auto">
            At DIFF Medical Centre, we set the standard for exceptional
            healthcare delivery, combining unparalleled expertise, innovative
            technology, and compassionate patient care. Discover why we're the
            trusted choice for individuals seeking top-tier medical treatment.
          </p>
        </header>

        {/* Main Content Section */}
        <div className="bg-[url('/Whyus.jpg')] bg-cover w-full bg-center">
          <motion.div
            className="flex flex-col items-center justify-center mt-1 max-w-4xl p-6 text-center m-auto"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {/* Feature 1 */}
            <motion.div
              className="my-6 p-6 bg-white text-sky-950 rounded-lg shadow-xl w-full"
              variants={item}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-semibold">Top-Notch Expertise</h2>
              <p className="mt-4">
                Our team of board-certified physicians and specialists are
                renowned for their exceptional skills and unwavering commitment
                to excellence.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="my-6 p-6 bg-white text-sky-950 rounded-lg shadow-xl w-full"
              variants={item}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-semibold">
                Cutting-Edge Technology
              </h2>
              <p className="mt-4">
                Staying at the forefront of medical innovation, we invest in
                advanced technologies to enhance diagnostic accuracy...
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="my-6 p-6 bg-white text-sky-950 rounded-lg shadow-xl w-full"
              variants={item}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-semibold">
                Customer-Centric Approach
              </h2>
              <p className="mt-4">Your well-being is our top priority...</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Call to Action Section */}
        <motion.div
          className="mt-16 mb-10 p-6 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <motion.button
            className="bg-blue-600 px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-800"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            Contact Us
          </motion.button>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default WhyUs;
