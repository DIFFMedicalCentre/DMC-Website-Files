import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ConsultantsCardProps {
  name?: string;
  specialty?: string;
  position?: string;
  user_image?: string;
  id?: number;
}

const ConsultantsCard: React.FC<ConsultantsCardProps> = ({
  name = "Unknown Consultant",
  specialty = "Specialty not available",
  position = "Position not specified",
  user_image = "/default-user.png", // <-- make sure to add this image in your public/ folder
  id = 0,
}) => {
  return (
    <motion.div
      className="w-full sm:w-60 lg:w-72 h-[19rem] border rounded-lg shadow-md p-4 flex flex-col items-center text-center bg-white overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Image */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3">
        <img
          className="w-full h-full object-contain rounded-2px border"
          src={user_image}
          alt={name}
        />
      </div>

      {/* Name */}
      <h2 className="text-base sm:text-lg font-semibold font-serif">
        <Link className="hover:text-sky-700" to={`/consultant/${id}`}>
          {name}
        </Link>
      </h2>

      {/* Specialty */}
      <h3 className="text-sm text-gray-600 mt-1">{specialty}</h3>

      {/* Position */}
      <p className="text-xs sm:text-sm text-gray-500 mt-1">{position}</p>

      {/* Spacer to push button down */}
      <div className="flex-grow" />

      {/* Action Button */}
      <Link
        to={`/consultant/${id}`}
        className="mt-3 px-3 py-2 text-xs sm:text-sm bg-blue-500 text-white rounded-lg hover:bg-sky-700 transition"
      >
        View Profile
      </Link>
    </motion.div>
  );
};

export default ConsultantsCard;
