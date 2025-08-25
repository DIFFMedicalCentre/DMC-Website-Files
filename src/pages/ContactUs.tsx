import Navbar from "../components/Navbar";
// Import social media icons from react-icons

import { SiGooglemaps } from "react-icons/si";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const ContactUs = () => {
  return (
    <>
      <Navbar />

      <section
        className="relative bg-cover bg-center h-screen"
        style={{ backgroundImage: "url('/10.jpg')", height: "350px" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="text-center text-white px-5">
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-4"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              DIFF MEDICAL CENTRE
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl font-semibold mb-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              ...Committed To Excellence
            </motion.p>
          </div>
        </div>
      </section>

      <div className="flex flex-col sm:flex-col lg:flex-row p-4  max-w-7xl mx-auto justify-center items-center gap-4">
        <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg ">
          <h1 className="text-2xl font-bold text-center mb-6">Contact Us</h1>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
            >
              Send Message
            </button>
          </form>
        </div>
        <div className="shadow-lg rounded-lg w-full  p-2 sm:p-4">
          <h1 className="text-3xl font-bold mb-6 text-center text-red-500">
            Locate Us - On Map
            <SiGooglemaps />{" "}
          </h1>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-6 pl-4 text-pink-800 text-align:center"></h2>
            <p className="text-lg mb-4 text-center">
              No. 10 DIFF Road, Off Oladipo Diya Road, Gudu District, Abuja,
              Nigeria
            </p>
          </div>
          <iframe
            className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            style={{ border: 0 }} // Use an object for styles in React
            allowFullScreen // camelCase in React
            loading="lazy"
            src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=No.%2010%20DIFF%20Road,%20Off%20Oladipo%20Diya%20Road,%20Gudu%20District%20Abuja+(DIFF%20Medical%20Centre)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          >
            <a href="https://www.gps.ie/">gps vehicle tracker</a>
          </iframe>
        </div>
      </div>

      {/* Contact Info Section */}
      <section className="py-16 bg-white ">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <motion.h2
            className="text-4xl font-bold text-center mb-12 text-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Emergency Contacts
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
            {/* Emergency Contacts */}
            <motion.div
              className="bg-gray-50 hover:shadow-lg rounded-lg p-6 text-center border-t-4 border-blue-500"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-2 text-red-700">
                Emergency
              </h3>
              <p className="text-lg">(+234) 08150871300</p>
            </motion.div>

            <motion.div
              className="bg-gray-50 hover:shadow-lg rounded-lg p-6 text-center border-t-4 border-blue-500"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-2 text-red-700">
                Front Desk
              </h3>
              <p className="text-lg">(+234) 08150871200</p>
            </motion.div>

            <motion.div
              className="bg-gray-50 hover:shadow-lg rounded-lg p-6 text-center border-t-4 border-blue-500"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-2 text-red-700">
                Secretary
              </h3>
              <p className="text-lg">(+234) 07025857235</p>
            </motion.div>

            <motion.div
              className="bg-gray-50 hover:shadow-lg rounded-lg p-6 text-center border-t-4 border-blue-500"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-2 text-red-700">
                Complaints & Corporate Relations
              </h3>
              <p className="text-lg">(+234) 07025463182</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Email & Address Section */}
      <section className="py-16 bg-gray-100 flex justify-center items-center text-center">
        <div className="flex flex-col md:flex-row gap-12 justify-center items-center text-center max-w-5xl w-full px-6 sm:px-12">
          <div className="md:w-1/2">
            <motion.h3
              className="text-3xl font-bold text-gray-800 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              Get In Touch
            </motion.h3>
            <p className="text-lg mb-4">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:info@diffmedicalcentre.com"
                className="text-blue-600 underline"
              >
                info@diffmedicalcentre.com
              </a>
            </p>
            <p className="text-lg">
              <strong>Address:</strong> No. 10, DIFF Road, Off Oladipo Diya
              Road, Gudu District, Abuja, Nigeria.
            </p>
          </div>

          <div className="md:w-1/2 flex flex-col items-center text-lg text-blue-600">
            <p className="mb-4">How Have We Impacted You?</p>
            <a
              href="/feedbackform.html"
              className="py-2 px-4 bg-blue-950 text-white font-semibold rounded-lg
        focus:ring-2 focus:ring-blue-500
        focus:ring-offset-2 transition"
            >
              Give Us a Feedback
            </a>
          </div>
        </div>
      </section>

      <div className="w-full bg-gradient-to-r from-blue-100 to-blue-300 p-10">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-4xl font-bold text-blue-950 mb-6 animate-fadeIn">
            Our Working Hours
          </h2>
          <p className="text-lg text-gray-700 md:text-xl mb-8 animate-slideUp">
            Monday - Sunday:{" "}
            <span className="font-semibold">Open 24 Hours</span>
          </p>
          <p className="text-lg text-gray-700 md:text-xl mb-4 animate-slideUp">
            Book an Appointment Today!
          </p>
          <Link
            to="/Appointment"
            className="inline-block bg-blue-950 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-900 transition-all duration-300 ease-in-out animate-bounce"
          >
            Click Here to Book an Appointment
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;
