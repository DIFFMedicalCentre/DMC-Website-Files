import Navbar from "../components/Navbar";
import { consultantsData } from "../components/consultants/ConsultantsData";
import ConsultantsCard from "../components/consultants/ConsultantsCard";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const ConsultantsList = () => {
  return (
    <div>
      <Navbar />

      {/* Header */}
      <div className="header--bg h-[400px] bg-cover bg-center grid place-items-center">
        <h1 className="text-white text-5xl font-serif">CONSULTANTS</h1>
      </div>

      {/* Intro Section */}
      <div className="my-10 px-4 sm:px-6">
        <h2 className="font-semibold text-xl grid place-items-center font-serif">
          YOU ARE IN GOOD HANDS
        </h2>
        <p className="grid place-items-center max-w-[700px] text-center mx-auto mt-4">
          The Consultants at DIFF Medical Centre are committed to ensuring the
          safety and well being of all patients.
        </p>
      </div>

      {/* Consultants Cards */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {consultantsData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
          >
            <ConsultantsCard {...item} />
          </motion.div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default ConsultantsList;
