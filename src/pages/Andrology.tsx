import { motion } from "framer-motion";
import {
  Stethoscope,
  HeartPulse,
  Syringe,
  TestTube,
  ActivitySquare,
  Dna,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Andrology = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-10 px-6 bg-white shadow-sm">
        <motion.h1
          className="text-2xl md:text-4xl font-bold text-gray-800 font-serif"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Introducing Our New Andrology Service Unit
        </motion.h1>
        <motion.p
          className="mt-4 text-sm md:text-xl text-gray-600 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          At DIFF Medical Centre, we are redefining reproductive health with
          world-class fertility and men’s healthcare solutions.
        </motion.p>
      </section>

      {/* About Section */}
      <section className="py-8 px-4 sm:py-16 sm:px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-3 sm:mb-4 font-serif">
            Introducing the Andrology Service Unit (ASU)
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6">
            As part of our ongoing commitment to providing holistic and
            world-class fertility solutions, DIFF Medical Centre is proud to
            announce the establishment of the{" "}
            <span className="font-semibold">Andrology Service Unit (ASU)</span>.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6">
            The ASU is designed to complement our existing female fertility
            services, offering specialized care for male fertility and sexual
            health.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6">
            Under the leadership of{" "}
            <span className="font-semibold">
              Dr. Abubakar Abdullahi (MB,BS, PhD(Urol), FICS)
            </span>{" "}
            – a Chief Consultant Urologist with decades of experience in
            andrology and reconstructive surgery – the unit provides a
            comprehensive range of services.
          </p>
        </motion.div>
      </section>

      {/* Comprehensive Range of Services */}
      <section className="py-5 px-6 bg-white">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-10 font-serif">
          Our Core Services
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              icon: <Stethoscope className="w-10 h-10 text-gray-800" />,
              title: "Fertility Evaluation",
              desc: "Comprehensive assessment of male fertility health.",
            },
            {
              icon: <TestTube className="w-10 h-10 text-gray-800" />,
              title: "Semen Analysis & Preservation",
              desc: "Advanced semen testing and storage for future use.",
            },
            {
              icon: <HeartPulse className="w-10 h-10 text-gray-800" />,
              title: "Erectile Dysfunction Treatment",
              desc: "Personalized solutions to restore men’s sexual health.",
            },
            {
              icon: <ActivitySquare className="w-10 h-10 text-gray-800" />,
              title: "Hormonal Imbalance Therapy",
              desc: "Diagnosis and treatment for hormonal health.",
            },
            {
              icon: <Syringe className="w-10 h-10 text-gray-800" />,
              title: "Surgical Sperm Retrieval & Biopsy",
              desc: "Procedures including testicular biopsy for fertility.",
            },
            {
              icon: <Dna className="w-10 h-10 text-gray-800" />,
              title: "Varicocele & Genital Reconstruction",
              desc: "Specialized treatment and reconstructive surgery.",
            },
          ].map((service, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-lg bg-white shadow-md border border-gray-200 hover:shadow-xl hover:border-blue-950 transition-all p-6 flex flex-col items-center text-center space-y-4"
            >
              {service.icon}
              <h3 className="text-xl font-semibold text-gray-800">
                {service.title}
              </h3>
              <p className="text-gray-600">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-10 px-6 bg-gray-50">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-10 font-serif">
          Pioneer Leaders of the Andrology Unit
        </h2>
        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* CMD */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition"
          >
            <img
              src="/CMD.jpg"
              alt="CMD"
              className="w-40 h-40 object-cover rounded-full shadow-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">
              DR. JOHN O. IDAHOSA
            </h3>
            <p className="text-gray-600 mt-2">
              Chief Medical Director, providing visionary leadership for the
              Andrology Service Unit.
            </p>
          </motion.div>

          {/* Dr. Abubakar */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition"
          >
            <img
              src="/abubakar.png"
              alt="Dr. Abubakar Abdullahi"
              className="w-40 h-40 object-cover rounded-full shadow-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">
              DR. ABUBAKAR ABDULLAHI
            </h3>
            <p className="text-gray-600 mt-2">
              MB,BS, PhD(Urol), FICS – Chief Consultant Urologist with decades
              of experience in Andrology & Reconstructive Surgery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-5 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 font-serif">
            Why Choose Our Andrology Unit?
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our department combines advanced diagnostic technologies,
            compassionate care, and research-driven solutions to improve men’s
            reproductive and urological health. We prioritize confidentiality,
            empathy, and long-term wellness for every patient.
          </p>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-8 px-6 bg-gray-100 text-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6 font-serif">
            Contact Us Today
          </h2>
          <p className="mb-4">
            📍 <strong>Location:</strong> 10 DIFF Road, Off Oladipo Diya, Gudu,
            Abuja, Nigeria
          </p>
          <p className="mb-4">
            📞 <strong>Phone:</strong> (+234) 815 087 1200 | (+234) 815 087 1300
            | (+234) 704 025 7410
          </p>
          <p className="mb-4">
            🌐 <strong>Website:</strong> www.diffmedicalcentre.com
          </p>
          <p className="mb-4">
            📧 <strong>Email:</strong> Info@diffmedicalcentre.com
          </p>
          <p className="mt-6 font-semibold">
            DIFF Medical Centre – Redefining Reproductive Health
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 bg-gray-800 text-white text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
            Take the First Step Towards Better Health
          </h2>
          <p className="mb-8 text-lg">
            Book an appointment with our specialists today and let’s work
            together for your wellbeing.
          </p>
          <a
            href="/appointment"
            className="bg-white text-gray-800 font-semibold px-6 py-3 rounded-md shadow-md hover:bg-gray-100 border-2 border-gray-800 transition"
          >
            Book Appointment
          </a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Andrology;
