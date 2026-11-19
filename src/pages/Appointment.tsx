import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const consultationOptions = [
  {
    title: "Physical Consultation",
    subtitle: "Visit us in person",
    description:
      "Schedule an appointment at DIFF Medical Centre and receive personalised, face-to-face care from our qualified healthcare professionals.",
    image:
      "https://img.freepik.com/premium-vector/medical-consultation-white-background_186616-1704.jpg",
    imageAlt: "Illustration of an in-person medical consultation",
    href: "/InPersonBookNow",
    buttonText: "Book Physical Appointment",
    tag: "In-person care",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-7 w-7"
      >
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5M9 9h.01M15 9h.01M9 12h.01M15 12h.01" />
      </svg>
    ),
  },
  {
    title: "Virtual Consultation",
    subtitle: "Healthcare from anywhere",
    description:
      "Connect with our healthcare professionals remotely, discuss your health concerns and attend your scheduled consultation online.",
    image:
      "https://img.freepik.com/free-vector/organic-flat-customer-support-illustrated_23-2148923865.jpg",
    imageAlt: "Illustration representing a virtual consultation",
    href: "/VirtualBookNow",
    buttonText: "Book Virtual Appointment",
    tag: "Online consultation",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-7 w-7"
      >
        <rect x="3" y="5" width="13" height="14" rx="2" />
        <path d="m16 10 5-3v10l-5-3M7 9h5M7 13h3" />
      </svg>
    ),
  },
];

const IndexPage = () => {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 text-slate-900">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-cyan-950 via-slate-900 to-blue-950 px-5 py-16 md:py-24">
          {/* Decorative Background Elements */}
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

          <div className="relative mx-auto max-w-6xl text-center">
            
            <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
              Quality Healthcare,
              <span className="block text-cyan-300">
                Your Way.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Your health deserves the best attention. Choose how you would
              like to consult with our healthcare professionals and book an
              appointment that works for you.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-5 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m5 12 4 4L19 6" />
                </svg>
                Professional Medical Care
              </span>

              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                Patient-centred Service
              </span>
            </div>
          </div>
        </section>

        {/* Consultation Selection */}
        <section className="px-5 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">
                Appointment Options
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
                How Would You Like to Consult?
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500">
                Select your preferred consultation method below to get
                started with your appointment booking.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {consultationOptions.map((option) => (
                <article
                  key={option.title}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-cyan-200 hover:shadow-2xl"
                >
                  {/* Image */}
                  <div className="relative h-60 overflow-hidden bg-cyan-50 md:h-72">
                    <img
                      src={option.image}
                      alt={option.imageAlt}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                    <span className="absolute bottom-5 left-5 rounded-full border border-white/30 bg-white/90 px-4 py-2 text-xs font-bold text-cyan-950 shadow-sm">
                      {option.tag}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-7 md:p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-800 transition-colors duration-300 group-hover:bg-cyan-900 group-hover:text-white">
                        {option.icon}
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {option.title}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-cyan-700">
                          {option.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="mt-6 min-h-[84px] text-base leading-7 text-slate-600">
                      {option.description}
                    </p>

                    <Link
                      to={option.href}
                      className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-cyan-950 px-6 py-4 text-center text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-cyan-800 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-cyan-200"
                    >
                      {option.buttonText}

                      <svg
                        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Assistance Section */}
            <div className="mt-12 rounded-2xl border border-cyan-100 bg-cyan-50/70 px-6 py-7 text-center md:px-10">
              <h3 className="text-lg font-bold text-cyan-950">
                Need Assistance with Your Booking?
              </h3>

              <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Our team is available to guide you through the appointment
                process and help you choose the appropriate consultation
                option.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default IndexPage;