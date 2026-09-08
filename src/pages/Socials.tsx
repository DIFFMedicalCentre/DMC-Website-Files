import { motion } from "framer-motion";
import {
  FaWhatsapp,
  FaCalendarCheck,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaGlobe,
  FaBaby,
  FaHeart,
  FaUserMd,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import Navbar from "../components/Navbar";

const Socials = () => {
  const whatsappNumber = "2348150871300";

  const whatsappMessage = encodeURIComponent(
    "Hi, My name is ... I would like to enquire about IVF treatment at DIFF Medical Centre."
  );

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="fixed top-0 left-0 right-0 z-[9999]">
        <Navbar />
      </div>

      {/* =====================================================
        HERO SECTION
    ===================================================== */}

      <section className="relative min-h-screen overflow-hidden bg-[#eef9fc] pt-[80px]">
        {/* Background decoration */}
        <div className="absolute -top-10 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-200/30 blur-3xl" />

        {/* =====================================================
            NAVIGATION
        ===================================================== */}
        <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex min-w-0 flex-1 items-center p-2 sm:p-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-cyan-700 shadow-sm sm:px-4 sm:text-base lg:text-lg">
              <FaHeart className="shrink-0" />

              <span className="whitespace-nowrap">
                Your journey to parenthood starts here
              </span>
            </div>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-full bg-[#092957] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-cyan-700 sm:px-6"
          >
            <FaWhatsapp />
            <span className="hidden sm:inline">Talk to Us</span>
          </a>
        </nav>

        {/* =====================================================
            HERO CONTENT
        ===================================================== */}
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-6 pb-16 pt-0 lg:grid-cols-2 lg:px-10 lg:pb-24">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h2 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-[#092957] sm:text-6xl lg:text-7xl">
              Hope.
              <br />
              <span className="text-cyan-600">Care.</span>
              <br />
              Parenthood.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600 lg:mx-0">
              Nigeria's premier IVF and paediatric care facility, providing
              world-class fertility solutions with caring, professional support.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 rounded-full bg-cyan-600 px-7 py-4 font-bold text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-cyan-700"
              >
                Claim 10% IVF Offer
                <FaArrowRight className="transition group-hover:translate-x-1" />
              </a>

              <a
                href="tel:+2348150871300"
                className="flex items-center justify-center gap-3 rounded-full border-2 border-[#092957] px-7 py-4 font-bold text-[#092957] transition hover:bg-[#092957] hover:text-white"
              >
                <FaPhoneAlt />
                Call Us
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap justify-center gap-6 lg:justify-start">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-cyan-600" />
                <span className="text-sm font-semibold text-slate-600">
                  Professional Care
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-cyan-600" />
                <span className="text-sm font-semibold text-slate-600">
                  Patient Focused
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-cyan-600" />
                <span className="text-sm font-semibold text-slate-600">
                  24/7 Care
                </span>
              </div>
            </div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative mx-auto w-full max-w-xl"
          >
            {/* Decorative circle */}
            <div className="absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[35px] border-cyan-500/20" />

            <div className="relative overflow-hidden rounded-[3rem] shadow-2xl">
              <img
                src="/diff-medical-centre.jpg"
                alt="DIFF Medical Centre"
                className="h-[520px] w-full object-cover sm:h-[600px]"
              />

              {/* Image overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#092957] via-[#092957]/70 to-transparent p-6 pt-32 text-white">
                <p className="text-sm font-medium uppercase tracking-widest text-cyan-200">
                  DIFF Medical Centre
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  Committed To Excellence
                </h3>
              </div>
            </div>

            {/* Floating card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-5 -left-3 rounded-2xl bg-white p-4 shadow-2xl sm:-left-8 sm:p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-xl text-cyan-700">
                  <FaBaby />
                </div>

                <div>
                  <p className="text-xs text-slate-500">Your dream</p>

                  <p className="font-bold text-[#092957]">Our commitment</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          IVF OFFER
      ===================================================== */}
      <section className="relative overflow-hidden bg-[#092957] px-6 py-16 text-white lg:py-20">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-cyan-600/10" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
          <div>
            <p className="mb-2 font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Special Offer
            </p>

            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Start Your IVF Journey With Us
            </h2>

            <p className="mt-3 max-w-2xl text-slate-300">
              Get <strong className="text-cyan-300">10% off</strong> your first
              IVF consultation package at DIFF Medical Centre.
            </p>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-3 rounded-full bg-cyan-500 px-8 py-4 font-bold text-white shadow-xl transition hover:scale-105 hover:bg-cyan-400"
          >
            <FaWhatsapp className="text-xl" />
            Claim Offer Now
          </a>
        </div>
      </section>

      {/* =====================================================
          WHY CHOOSE US
      ===================================================== */}
      <section className="bg-white px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mx-auto mb-14 max-w-3xl text-center"
          >
            <p className="font-semibold uppercase tracking-[0.2em] text-cyan-600">
              Why Choose Us?
            </p>

            <h2 className="mt-3 text-4xl font-extrabold text-[#092957] sm:text-5xl">
              Care you can trust.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              At DIFF Medical Centre, we combine medical expertise, advanced
              technology and compassionate care to give every patient the
              support they deserve.
            </p>
          </motion.div>

          <div className="grid gap-7 md:grid-cols-3">
            {/* IVF */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-slate-100 bg-gradient-to-b from-cyan-50 to-white p-8 shadow-lg"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-600 text-2xl text-white shadow-lg">
                <FaHeart />
              </div>

              <h3 className="text-2xl font-bold text-[#092957]">IVF Experts</h3>

              <p className="mt-4 leading-7 text-slate-600">
                Africa's leading centre for fertility solutions with
                professional expertise and a patient-centred approach.
              </p>

              <div className="mt-6 flex items-center gap-2 font-semibold text-cyan-700">
                Fertility Solutions
                <FaArrowRight />
              </div>
            </motion.div>

            {/* Paediatric */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-slate-100 bg-gradient-to-b from-blue-50 to-white p-8 shadow-lg"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#092957] text-2xl text-white shadow-lg">
                <FaBaby />
              </div>

              <h3 className="text-2xl font-bold text-[#092957]">
                Paediatric Care
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Dedicated, compassionate care for newborns, infants and children
                in a safe and supportive environment.
              </p>

              <div className="mt-6 flex items-center gap-2 font-semibold text-[#092957]">
                Child Healthcare
                <FaArrowRight />
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-slate-100 bg-gradient-to-b from-emerald-50 to-white p-8 shadow-lg"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-2xl text-white shadow-lg">
                <FaUserMd />
              </div>

              <h3 className="text-2xl font-bold text-[#092957]">
                Proven Results
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Transforming dreams into reality through professional expertise,
                modern care and a commitment to excellence.
              </p>

              <div className="mt-6 flex items-center gap-2 font-semibold text-emerald-700">
                Excellence in Care
                <FaArrowRight />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURE SECTION
      ===================================================== */}
      <section className="overflow-hidden bg-[#f2fbfd] px-6 py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-semibold uppercase tracking-[0.2em] text-cyan-600">
              Your Journey Matters
            </p>

            <h2 className="mt-4 text-4xl font-extrabold leading-tight text-[#092957] sm:text-5xl">
              Compassionate care for every step of your journey.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Whether you are beginning your fertility journey, preparing for
              parenthood or seeking specialised paediatric care, DIFF Medical
              Centre is here to provide professional medical support in a caring
              environment.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Professional and compassionate healthcare",
                "Advanced fertility solutions",
                "Dedicated paediatric services",
                "Patient-centred treatment",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <FaCheckCircle className="shrink-0 text-cyan-600" />
                  <span className="font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-5 rounded-[3rem] bg-cyan-200/30 blur-2xl" />

            <img
              src="/diff-family.jpg"
              alt="DIFF Medical Centre patient care"
              className="relative h-[450px] w-full rounded-[2.5rem] object-cover shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          TESTIMONIALS
      ===================================================== */}
      <section className="bg-white px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="font-semibold uppercase tracking-[0.2em] text-cyan-600">
              Patient Stories
            </p>

            <h2 className="mt-3 text-4xl font-extrabold text-[#092957] sm:text-5xl">
              What Our Patients Say
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                text: "The team at DIFF Medical Centre made us feel supported throughout our journey. Their professionalism and compassion meant so much to us.",
                name: "A DIFF Patient",
              },
              {
                text: "From our first consultation, we experienced excellent service and genuine care. We are grateful for the support we received.",
                name: "A DIFF Patient",
              },
              {
                text: "The staff were professional, welcoming and attentive. DIFF Medical Centre truly puts patients first.",
                name: "A DIFF Patient",
              },
            ].map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-3xl border border-slate-100 bg-slate-50 p-7 shadow-sm"
              >
                <div className="mb-5 flex gap-1 text-lg text-yellow-400">
                  ★★★★★
                </div>

                <p className="leading-7 text-slate-600">"{review.text}"</p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                    <FaHeart />
                  </div>

                  <span className="font-semibold text-[#092957]">
                    {review.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          APPOINTMENT CTA
      ===================================================== */}
      <section className="px-6 py-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#092957] px-7 py-14 text-center text-white shadow-2xl sm:px-12 lg:py-20">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/20" />

          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/10" />

          <div className="relative">
            <FaCalendarCheck className="mx-auto mb-5 text-5xl text-cyan-400" />

            <h2 className="text-4xl font-extrabold sm:text-5xl">
              Ready to take the next step?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Speak with our team today and begin your journey with DIFF Medical
              Centre.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 rounded-full bg-cyan-500 px-8 py-4 font-bold transition hover:bg-cyan-400"
              >
                <FaWhatsapp />
                Chat With Us
              </a>

              <a
                href="tel:+2348150871300"
                className="flex items-center justify-center gap-3 rounded-full border border-white/40 px-8 py-4 font-bold transition hover:bg-white hover:text-[#092957]"
              >
                <FaPhoneAlt />
                Call +234 815 087 1300
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT
      ===================================================== */}
      <section className="bg-[#f5fafb] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="font-semibold uppercase tracking-[0.2em] text-cyan-600">
              Contact Us
            </p>

            <h2 className="mt-3 text-4xl font-extrabold text-[#092957]">
              We're here for you.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Phone */}
            <a
              href="tel:+2348150871300"
              className="group rounded-3xl bg-white p-7 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100 text-xl text-cyan-700">
                <FaPhoneAlt />
              </div>

              <h3 className="mt-5 font-bold text-[#092957]">Call Us</h3>

              <p className="mt-2 text-slate-600">+234 815 087 1300</p>
            </a>

            {/* Location */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=DIFF+Medical+Centre+Abuja"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-3xl bg-white p-7 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100 text-xl text-cyan-700">
                <FaMapMarkerAlt />
              </div>

              <h3 className="mt-5 font-bold text-[#092957]">Visit Us</h3>

              <p className="mt-2 text-slate-600">
                No. 10 DIFF Road, Off Oladipo Diya Road, Gudu District, Abuja,
                Nigeria
              </p>
            </a>

            {/* Website */}
            <a
              href="https://diffmedicalcentre.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-3xl bg-white p-7 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100 text-xl text-cyan-700">
                <FaGlobe />
              </div>

              <h3 className="mt-5 font-bold text-[#092957]">Website</h3>

              <p className="mt-2 text-slate-600">diffmedicalcentre.com</p>
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          SOCIAL MEDIA
      ===================================================== */}
      <section className="bg-white px-6 py-16 text-center">
        <h2 className="text-3xl font-extrabold text-[#092957]">
          Follow Us on Social Media
        </h2>

        <p className="mt-3 text-slate-500">
          Stay connected with DIFF Medical Centre.
        </p>

        <div className="mt-7 flex justify-center gap-4">
          <a
            href="https://www.instagram.com/diffmedicalcentre_ng/"
            aria-label="Instagram"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#092957] text-white transition hover:-translate-y-1 hover:bg-cyan-600"
          >
            <FaInstagram />
          </a>

          <a
            href="https://web.facebook.com/diffmc?_rdc=1&_rdr#"
            aria-label="Facebook"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#092957] text-white transition hover:-translate-y-1 hover:bg-cyan-600"
          >
            <FaFacebookF />
          </a>

          <a
            href="#"
            aria-label="Twitter"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#092957] text-white transition hover:-translate-y-1 hover:bg-cyan-600"
          >
            <FaTwitter />
          </a>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="bg-[#061d3e] px-6 py-10 text-center text-white">
        <h2 className="text-xl font-extrabold">
          DIFF <span className="text-cyan-400">MEDICAL CENTRE</span>
        </h2>

        <p className="mt-2 text-sm text-slate-400">Committed To Excellence</p>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-6 text-slate-400">
          Nigeria's premier IVF and paediatric care facility. Providing
          fertility solutions and compassionate healthcare with professional
          support.
        </p>

        <div className="mt-7 border-t border-white/10 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} DIFF Medical Centre. All rights reserved.
        </div>
      </footer>

      {/* =====================================================
          FLOATING WHATSAPP
      ===================================================== */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        aria-label="Chat with DIFF Medical Centre on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-3xl text-white shadow-2xl transition hover:bg-green-600"
      >
        <FaWhatsapp />
      </motion.a>
    </div>
  );
};

export default Socials;
