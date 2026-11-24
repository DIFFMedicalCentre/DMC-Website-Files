import { useEffect, useState } from "react";
import NavbarHome from "../components/NavbarHome";
import Footer from "../components/Footer";
import Counter from "../components/Counter";
import { Link } from "react-router-dom";
import PromoModal from "../components/PromoModal";


interface SlideItem {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  url?: string;
}

const slideImages: SlideItem[] = [
  {
    image: "/1.jpg",
    eyebrow: "COMPASSIONATE • PROFESSIONAL • TRUSTED",
    title: "Quality Healthcare You Can Trust",
    description:
      "Comprehensive medical care delivered by experienced professionals in a modern healthcare environment.",
  },
  {
    image: "/2.jpg",
    eyebrow: "20+ YEARS OF HEALTHCARE EXCELLENCE",
    title: "Your Health Is Our Priority",
    description:
      "From preventive care to specialist treatment, we are committed to putting patients at the heart of everything we do.",
  },
  {
    image: "/3.jpg",
    eyebrow: "STATE-OF-THE-ART MEDICAL FACILITY",
    title: "Modern Medicine. Personal Care.",
    description:
      "Experience advanced healthcare services in a comfortable, safe and patient-focused environment.",
  },
  {
    image: "/4.jpg",
    eyebrow: "SPECIALIST MEDICAL SERVICES",
    title: "Expert Care Across Multiple Specialties",
    description:
      "Access a wide range of medical, surgical, diagnostic and therapeutic services under one roof.",
  },
  {
    image: "/5.jpg",
    eyebrow: "PATIENT-CENTRED HEALTHCARE",
    title: "Here For You, Every Step Of The Way",
    description:
      "Our team works with you to provide personalized care and support throughout your healthcare journey.",
  },
  {
    image: "/6.jpg",
    eyebrow: "QUALITY HEALTHCARE",
    title: "Committed To Excellence In Healthcare",
    description:
      "Our healthcare professionals combine experience, compassion and modern medical practice to serve you better.",
  },
];

const servicesData: Service[] = [
  {
    id: 1,
    title: "In-vitro Fertilization (IVF)",
    image: "/2.jpg",
    description:
      "Specialized fertility and reproductive healthcare services.",
  },
  {
    id: 2,
    title: "Obstetrics & Gynecology",
    image: "/6.jpg",
    description:
      "Comprehensive women's health, pregnancy and maternity care.",
    url: "/obstetrics-gynecology",
  },
  {
    id: 3,
    title: "Paediatrics",
    image: "/5.jpg",
    description:
      "Dedicated healthcare services for infants, children and adolescents.",
  },
  {
    id: 4,
    title: "Family Medicine & Therapy",
    image: "/14.jpg",
    description:
      "Holistic healthcare for individuals and families.",
  },
  {
    id: 5,
    title: "Dental Clinic",
    image: "/16.jpg",
    description:
      "Professional dental care and oral health services.",
  },
  {
    id: 6,
    title: "Endocrinology",
    image: "/15.jpg",
    description:
      "Specialist care for hormonal and metabolic conditions.",
  },
  {
    id: 7,
    title: "Physiotherapy & Rehabilitation",
    image: "/23.jpg",
    description:
      "Rehabilitation and physical therapy designed to restore mobility.",
  },
  {
    id: 8,
    title: "Laboratory Services",
    image: "/8.jpg",
    description:
      "Reliable diagnostic testing supported by modern laboratory facilities.",
  },
  {
    id: 9,
    title: "Orthopaedics & Trauma",
    image: "/24.jpg",
    description:
      "Specialist treatment for bones, joints, muscles and injuries.",
  },
  {
    id: 10,
    title: "Rapid Response",
    image: "/21.jpg",
    description:
      "Prompt medical attention for urgent healthcare needs.",
  },
  {
    id: 11,
    title: "Surgery",
    image: "/22.jpg",
    description:
      "Surgical services supported by experienced medical professionals.",
  },
  {
    id: 12,
    title: "Radiology",
    image: "/20.jpg",
    description:
      "Diagnostic imaging services supporting accurate clinical care.",
  },
  {
    id: 13,
    title: "Eye Clinic",
    image: "/18.jpg",
    description:
      "Comprehensive eye examinations and ophthalmic services.",
  },
  {
    id: 14,
    title: "Anaesthesia & Intensive Care",
    image: "/17.jpg",
    description:
      "Specialized anaesthesia and critical care services.",
  },
  {
    id: 15,
    title: "E.N.T Clinic",
    image: "/19.jpg",
    description:
      "Specialist care for ear, nose and throat conditions.",
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  /*
   * Automatically move the hero slider every 6 seconds.
   */
  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setCurrentSlide((previous) =>
        previous === slideImages.length - 1 ? 0 : previous + 1
      );
    }, 6000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((previous) =>
      previous === slideImages.length - 1 ? 0 : previous + 1
    );
  };

  const previousSlide = () => {
    setCurrentSlide((previous) =>
      previous === 0 ? slideImages.length - 1 : previous - 1
    );
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-800">

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <NavbarHome />

      <PromoModal />

      {/* =====================================================
          HERO SLIDER
      ====================================================== */}

      <section
        className="relative h-[680px] min-h-[650px] w-full overflow-hidden bg-slate-950 sm:h-[720px] lg:h-[calc(100vh-70px)] lg:min-h-[680px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides */}
        {slideImages.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${
              index === currentSlide
                ? "visible scale-100 opacity-100"
                : "invisible scale-[1.06] opacity-0"
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Dark professional hospital overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/65 to-slate-900/20" />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

            {/* Hero Content */}
            <div className="relative z-10 mx-auto flex h-full w-[92%] max-w-[1200px] items-center">
              <div
                className={`max-w-[700px] text-white transition-all delay-300 duration-1000 ${
                  index === currentSlide
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                {/* Eyebrow */}
<div className="mb-5">
  <span className="text-[10px] font-bold tracking-[0.22em] text-cyan-300 sm:text-xs">
    {slide.eyebrow}
  </span>
</div>

                {/* Heading */}
                <h1 className="max-w-[750px] text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-[5rem]">
                  {slide.title}
                </h1>

                {/* Description */}
                <p className="mt-6 max-w-[620px] text-sm leading-7 text-white/80 sm:text-base sm:leading-8 lg:text-lg">
                  {slide.description}
                </p>

                {/* Buttons */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/appointment"
                    className="group inline-flex min-h-[52px] items-center justify-center gap-3 bg-cyan-600 px-7 text-sm font-bold text-white shadow-lg shadow-cyan-950/20 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-700"
                  >
                    Book An Appointment
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>

                  <Link
                    to="/contact"
                    className="inline-flex min-h-[52px] items-center justify-center border border-white/50 bg-white/5 px-7 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white hover:text-slate-900"
                  >
                    Contact Us
                  </Link>
                </div>

                {/* Trust Statistics */}
                <div className="mt-10 flex items-center gap-4 sm:mt-14 sm:gap-7">
                  <div>
                    <div className="text-xl font-bold sm:text-2xl">
                      20+
                    </div>

                    <div className="mt-1 text-[9px] uppercase tracking-wider text-white/60 sm:text-[10px]">
                      Years Experience
                    </div>
                  </div>

                  <div className="h-9 w-px bg-white/25" />

                  <div>
                    <div className="text-xl font-bold sm:text-2xl">
                      24/7
                    </div>

                    <div className="mt-1 text-[9px] uppercase tracking-wider text-white/60 sm:text-[10px]">
                      Healthcare Support
                    </div>
                  </div>

                  <div className="h-9 w-px bg-white/25" />

                  <div>
                    <div className="text-xl font-bold sm:text-2xl">
                      15+
                    </div>

                    <div className="mt-1 text-[9px] uppercase tracking-wider text-white/60 sm:text-[10px]">
                      Medical Services
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ===================================================
            SLIDER ARROWS
        ==================================================== */}

        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/10 text-3xl text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white hover:text-slate-900 md:flex"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/10 text-3xl text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white hover:text-slate-900 md:flex"
        >
          ›
        </button>

        {/* ===================================================
            SLIDE INDICATORS
        ==================================================== */}

        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {slideImages.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-[3px] transition-all duration-500 ${
                index === currentSlide
                  ? "w-12 bg-white"
                  : "w-6 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* ===================================================
            SLIDE NUMBER
        ==================================================== */}

        <div className="absolute bottom-7 right-6 z-20 hidden items-center gap-3 text-white/70 md:flex">
          <span className="text-2xl font-light">
            {String(currentSlide + 1).padStart(2, "0")}
          </span>

          <span className="h-px w-8 bg-white/30" />

          <span className="text-xs">
            {String(slideImages.length).padStart(2, "0")}
          </span>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-7 left-7 z-20 hidden items-center gap-3 text-white/50 lg:flex">
          <div className="h-10 w-px bg-white/40" />

          <span className="text-[9px] font-semibold tracking-[0.2em]">
            SCROLL TO EXPLORE
          </span>
        </div>
      </section>

      {/* =====================================================
          INTRODUCTION
      ====================================================== */}

      <section className="bg-white py-20 sm:py-24 lg:py-32">
        <div className="mx-auto w-[92%] max-w-[1200px]">

          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">

            {/* Heading */}
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-cyan-600">
                WELCOME TO DIFF MEDICAL CENTRE
              </span>

              <h2 className="mt-5 text-4xl font-bold leading-tight tracking-[-0.04em] text-slate-800 sm:text-5xl lg:text-6xl">
                Healthcare built around{" "}
                <span className="text-cyan-600">you.</span>
              </h2>

              <div className="mt-7 h-1 w-16 bg-cyan-600" />
            </div>

            {/* Description */}
            <div>
              <p className="text-base leading-8 text-slate-600 sm:text-lg">
                DIFF Medical Centre is a renowned state-of-the-art medical
                facility committed to providing comprehensive and quality
                healthcare services.
              </p>

              <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
                With over 13 years of healthcare, training and professional
                experience, we have grown to provide a world-class facility
                offering a broad range of medical services and specialist
                care.
              </p>

              <Link
                to="/about-us"
                className="group mt-7 inline-flex items-center gap-3 font-bold text-cyan-700 transition-all hover:text-cyan-900"
              >
                Discover More About Us
                <span className="transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Feature cards */}
          <div className="mt-20 grid border-t border-slate-200 pt-10 md:grid-cols-3">
            <div className="flex gap-5 border-b border-slate-200 py-7 md:border-b-0 md:border-r md:px-8 md:py-0 md:first:pl-0">
              <span className="text-sm font-bold text-cyan-600">01</span>

              <div>
                <h3 className="font-bold text-slate-800">
                  Experienced Professionals
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Dedicated healthcare professionals committed to quality
                  patient care.
                </p>
              </div>
            </div>

            <div className="flex gap-5 border-b border-slate-200 py-7 md:border-b-0 md:border-r md:px-8 md:py-0">
              <span className="text-sm font-bold text-cyan-600">02</span>

              <div>
                <h3 className="font-bold text-slate-800">
                  Modern Healthcare
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  A modern facility designed to support efficient healthcare
                  delivery.
                </p>
              </div>
            </div>

            <div className="flex gap-5 py-7 md:px-8 md:py-0 md:last:pr-0">
              <span className="text-sm font-bold text-cyan-600">03</span>

              <div>
                <h3 className="font-bold text-slate-800">
                  Patient Focused
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Your comfort, safety and wellbeing remain at the centre of
                  our care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES
      ====================================================== */}

      <section className="bg-slate-50 py-20 sm:py-24 lg:py-32">
        <div className="mx-auto w-[92%] max-w-[1200px]">

          {/* Heading */}
          <div className="mx-auto mb-14 max-w-3xl text-center lg:mb-16">
            <span className="text-xs font-bold tracking-[0.2em] text-cyan-600">
              OUR MEDICAL SERVICES
            </span>

            <h2 className="mt-4 text-4xl font-bold leading-tight tracking-[-0.04em] text-slate-800 sm:text-5xl">
              Comprehensive care,{" "}
              <span className="text-cyan-600">all in one place.</span>
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-500 sm:text-lg sm:leading-8">
              Explore our range of medical, diagnostic, surgical and
              therapeutic services designed to meet the diverse healthcare
              needs of our patients.
            </p>
          </div>

          {/* Service cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicesData.map((service, index) => (
              <Link
                key={service.id}
                to={service.url || "#"}
                className="group overflow-hidden border border-slate-200 bg-white transition-all duration-500 hover:-translate-y-2 hover:border-cyan-200 hover:shadow-[0_25px_60px_rgba(15,60,75,0.12)]"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />

                  {/* Number */}
                  <span className="absolute left-5 top-5 text-xs font-bold tracking-widest text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Arrow */}
                  <span className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-black/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:border-cyan-600 group-hover:bg-cyan-600">
                    ↗
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-cyan-700">
                    {service.title}
                  </h3>

                  <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-500">
                    {service.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs font-bold text-cyan-700">
                    Learn More

                    <span className="transition-transform duration-300 group-hover:translate-x-2">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* All services button */}
          <div className="mt-14 flex justify-center">
            <Link
              to="/services"
              className="group inline-flex min-h-[52px] items-center gap-4 border border-slate-300 bg-white px-7 text-sm font-bold text-slate-800 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-600 hover:bg-cyan-600 hover:text-white"
            >
              View All Medical Services

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUALITY HEALTHCARE CTA
      ====================================================== */}

      <section className="relative overflow-hidden bg-slate-900 py-20 text-white sm:py-24 lg:py-32">

        {/* Background */}
        <img
          src="/6.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />

        <div className="absolute inset-0 bg-slate-950/85" />

        <div className="relative mx-auto flex w-[92%] max-w-[1200px] flex-col justify-between gap-10 lg:flex-row lg:items-center">

          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-[0.2em] text-cyan-300">
              QUALITY HEALTHCARE
            </span>

            <h2 className="mt-5 text-4xl font-bold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Your health deserves{" "}
              <span className="text-cyan-300">
                exceptional care.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
              Whether you need a consultation, diagnostic service,
              specialist care or an appointment, our team is ready to help.
            </p>
          </div>

          <div className="flex w-full max-w-sm flex-col gap-3">
            <Link
              to="/appointment"
              className="group inline-flex min-h-[55px] items-center justify-center gap-3 bg-white px-7 text-sm font-bold text-slate-900 transition-all duration-300 hover:bg-cyan-600 hover:text-white"
            >
              Book An Appointment

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              to="/contact"
              className="inline-flex min-h-[55px] items-center justify-center border border-white/30 bg-white/5 px-7 text-sm font-bold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/10"
            >
              Contact DIFF Medical Centre
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          ACHIEVEMENTS
      ====================================================== */}

      <section className="bg-white py-20 sm:py-24 lg:py-32">
        <div className="mx-auto w-[92%] max-w-[1200px]">

          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="text-xs font-bold tracking-[0.2em] text-cyan-600">
              OUR EXPERIENCE
            </span>

            <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-slate-800 sm:text-5xl">
              Experience you can{" "}
              <span className="text-cyan-600">count on.</span>
            </h2>
          </div>

          <div className="grid border-y border-slate-200 md:grid-cols-3">

            <div className="border-b border-slate-200 px-5 py-12 text-center md:border-b-0 md:border-r">
              <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-cyan-100 text-sm font-bold text-cyan-600">
                +
              </div>

              <Counter
                end={20}
                title="Years of Experience"
              />

              <p className="mt-3 text-sm text-slate-400">
                Dedicated to quality healthcare
              </p>
            </div>

            <div className="border-b border-slate-200 px-5 py-12 text-center md:border-b-0 md:border-r">
              <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-cyan-100 text-sm font-bold text-cyan-600">
                +
              </div>

              <Counter
                end={10000}
                title="Happy Clients"
              />

              <p className="mt-3 text-sm text-slate-400">
                Patients and families served
              </p>
            </div>

            <div className="px-5 py-12 text-center">
              <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-cyan-100 text-sm font-bold text-cyan-600">
                +
              </div>

              <Counter
                end={15}
                title="Medical Services"
              />

              <p className="mt-3 text-sm text-slate-400">
                Specialized healthcare services
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          APPOINTMENT CTA
      ====================================================== */}

      <section className="bg-white pb-20 sm:pb-24">
        <div className="mx-auto flex w-[92%] max-w-[1100px] flex-col gap-8 bg-cyan-50 px-7 py-10 sm:px-12 sm:py-14 lg:flex-row lg:items-center lg:justify-between lg:px-16">

          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-cyan-600">
              TAKE THE NEXT STEP
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-800 sm:text-4xl">
              Ready to prioritize your health?
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Schedule an appointment with DIFF Medical Centre and take
              the next step towards quality healthcare.
            </p>
          </div>

          <Link
            to="/appointment"
            className="group inline-flex min-h-[55px] shrink-0 items-center justify-center gap-3 bg-slate-900 px-7 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-600"
          >
            Book An Appointment

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>

     

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <Footer />
    </div>
  );
};

export default Home;