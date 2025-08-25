import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { consultantsData } from "./ConsultantsData";
import { motion } from "framer-motion";

// Define Consultant Type
interface Consultant {
  id: number;
  name: string;
  email: string;
  specialty: string;
  position: string;
  user_image: string;
  bioData: { title: string; details: string[] }[];
}

const ConsultantDetails = () => {
  const { id } = useParams<{ id?: string }>();
  const [consultantInfo, setConsultantInfo] = useState<Consultant | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const consultantId = Number(id);
      if (!isNaN(consultantId)) {
        const consultant = consultantsData.find(
          (consultant) => consultant.id === consultantId
        );
        setConsultantInfo(consultant || null);
      }
    }
  }, [id]);

  if (!consultantInfo) {
    return (
      <div className="grid h-screen place-items-center px-4 text-center">
        {id ? "Consultant not found." : "Loading info..."}
      </div>
    );
  }

  // Animation variants
  const bioVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <>
      <Navbar />
      <section className="flex flex-col items-center my-10 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
        {/* Consultant Image */}
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-2xl object-cover shadow-md"
          src={consultantInfo.user_image}
          alt={`${consultantInfo.name}'s profile`}
        />

        {/* Name & Email */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 text-xl sm:text-2xl md:text-3xl font-semibold font-mono text-center"
        >
          {consultantInfo.name}
        </motion.h1>
        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-sky-500 text-sm sm:text-base break-words text-center"
          href={`mailto:${consultantInfo.email}`}
        >
          {consultantInfo.email}
        </motion.a>

        {/* BioData Section */}
        <div className="grid gap-6 py-6 w-full">
          {consultantInfo.bioData.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={bioVariants}
              className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold border-b-2 border-sky-700 mb-3 pb-2 text-center">
                {item.title}
              </h2>
              <div className="space-y-2 text-sm sm:text-base leading-relaxed">
                {item.details.map((value, i) => (
                  <p key={i}>{value}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Go Back Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          onClick={() => navigate("/consultants")}
          className="mt-6 w-full sm:w-auto px-6 py-3 text-white text-sm sm:text-base font-medium bg-blue-500 rounded-lg hover:bg-sky-950 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Go back to Previous
        </motion.button>
      </section>
      <Footer />
    </>
  );
};

export default ConsultantDetails;
