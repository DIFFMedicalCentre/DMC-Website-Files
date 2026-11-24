import Navbar from "../components/Navbar";
import { consultantsData } from "../components/consultants/ConsultantsData";
import ConsultantsCard from "../components/consultants/ConsultantsCard";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { ArrowDown, HeartPulse, ShieldCheck, Stethoscope } from "lucide-react";

const highlights = [
  { icon: Stethoscope, title: "Experienced specialists", text: "Skilled consultants across a range of medical disciplines." },
  { icon: HeartPulse, title: "Patient-centred care", text: "Thoughtful care shaped around each patient's needs." },
  { icon: ShieldCheck, title: "Care you can trust", text: "A team committed to safety, professionalism and wellbeing." },
];

const ConsultantsList = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-800">
      <Navbar />

      <section className="relative isolate flex min-h-[420px] items-center overflow-hidden bg-[#082957] px-5 pb-16 pt-28 sm:min-h-[480px] sm:px-8 lg:min-h-[520px]">
        <div className="absolute inset-0 -z-20 bg-[url('/DMC%20compound.jpg')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#061b3a]/95 via-[#092957]/90 to-[#087eaa]/75" />
        <div className="pointer-events-none absolute -right-24 -top-28 -z-10 h-80 w-80 rounded-full border border-white/10 sm:h-[28rem] sm:w-[28rem]" />
        <div className="pointer-events-none absolute -right-8 -top-12 -z-10 h-64 w-64 rounded-full border border-white/10 sm:h-[22rem] sm:w-[22rem]" />
        <motion.div
          className="mx-auto w-full max-w-6xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
        
          <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Meet the people <span className="text-cyan-200">behind your care.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-blue-50/90 sm:text-lg sm:leading-8">
            Our consultants bring knowledge, experience and compassion together to support your health at every stage.
          </p>
          <a href="#our-consultants" className="mt-9 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#092957] shadow-lg shadow-slate-950/20 transition duration-300 hover:-translate-y-1 hover:bg-cyan-100 focus:outline-none focus:ring-4 focus:ring-cyan-200/50">
            Explore our consultants <ArrowDown size={17} />
          </a>
        </motion.div>
      </section>

      <section className="relative z-10 -mt-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-900/5 sm:grid-cols-3 sm:gap-5 sm:p-6">
          {highlights.map(({ icon: Icon, title, text }, index) => (
            <motion.div
              key={title}
              className="flex items-start gap-4 rounded-xl p-3 sm:p-2"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cyan-50 text-[#087eaa]">
                <Icon size={23} strokeWidth={1.8} />
              </span>
              <div>
                <h2 className="font-semibold text-slate-900">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="our-consultants" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mx-auto mb-10 max-w-2xl text-center sm:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-700 sm:text-sm">Our medical team</span>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#092957] sm:text-4xl md:text-5xl">Expertise with a human touch</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Get to know the specialists dedicated to delivering thoughtful, high-quality care to our patients.
            </p>
            <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-[#092957] to-cyan-500" />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.075 } } }}
          >
            {consultantsData.map((item) => (
              <motion.div
                key={item.id}
                variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } } }}
              >
                <ConsultantsCard {...item} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default ConsultantsList;
