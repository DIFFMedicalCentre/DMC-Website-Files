import Navbar from "../components/Navbar";
import Footer from "../components/Footer";



const Renal = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* =========================================================
          NAVBAR
      ========================================================= */}
      <Navbar />

      {/* =========================================================
          HERO / VIDEO SECTION
      ========================================================= */}
      <section className="relative h-[320px] overflow-hidden sm:h-[380px] lg:h-[450px]">
        {/* Video */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/renal-dialysis-spa.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-950/45" />

        {/* Gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-950/20 to-slate-950/40" />

        {/* Hero content */}
        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
          <div>
            

            <h1 className="text-4xl font-extrabold uppercase tracking-wide text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
              Renal Dialysis Centre
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/90 sm:text-base">
              Comprehensive kidney care, dialysis services and compassionate
              support for patients living with renal conditions.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <main className="bg-slate-50 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_420px] xl:gap-14">

            {/* =====================================================
                LEFT CONTENT
            ===================================================== */}
            <section className="min-w-0">

              {/* Heading */}
              <div className="mb-8">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-600">
                  Kidney & Renal Care
                </p>

                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  DIFF Medical Centre
                  <span className="block text-cyan-600">
                    Renal Dialysis Centre
                  </span>
                </h2>

                <div className="mt-4 h-1 w-16 rounded-full bg-cyan-500" />
              </div>

              {/* Introductory text */}
              <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
                <p className="text-base leading-8 text-slate-600">
                  Our Renal Dialysis Centre provides comprehensive care for
                  patients with kidney disease, with a focus on safe dialysis,
                  professional clinical management and compassionate
                  patient-centred care.
                </p>

                <p className="mt-5 text-base leading-8 text-slate-600">
                  We provide appropriate evaluation, treatment and ongoing
                  monitoring for patients requiring renal care and dialysis
                  services.
                </p>
              </div>

              {/* =================================================
                  SERVICES
              ================================================= */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-slate-900">
                  Our Renal Services
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  Our services are designed to support patients through
                  assessment, treatment and ongoing management of kidney
                  conditions.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  {[
                    "Diagnosis & Management of Kidney Diseases",
                    "Out-Patient Nephrology Consultations",
                    "In-Patient Care",
                    "Haemodialysis",
                    "Preventive Care for Kidney Diseases",
                    "On-site Screening and Laboratory Tests",
                    "Tele-medicine Consultations",
                    "Long-Term Renal Care & Monitoring",
                  ].map((service, index) => (
                    <div
                      key={service}
                      className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-md"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-sm font-bold text-cyan-600 transition group-hover:bg-cyan-600 group-hover:text-white">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <p className="pt-1 text-sm font-semibold leading-6 text-slate-700">
                        {service}
                      </p>
                    </div>
                  ))}

                </div>
              </div>

              {/* =================================================
                  CONDITIONS
              ================================================= */}
              <div className="mt-10 rounded-3xl bg-slate-900 p-6 text-white sm:p-8">

                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  Comprehensive Care
                </p>

                <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                  Conditions We Manage
                </h3>

                <p className="mt-4 leading-7 text-slate-300">
                  Our renal care team provides assessment and management for a
                  range of kidney-related conditions.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">

                  {[
                    "Chronic Kidney Disease",
                    "Acute Kidney Injury",
                    "Hypertension",
                    "Diabetic Kidney Disease",
                    "Kidney Failure",
                    "Kidney Infections",
                    "Electrolyte Abnormalities",
                    "Fluid & Acid-Base Disorders",
                  ].map((condition) => (
                    <div
                      key={condition}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <span className="flex h-2 w-2 shrink-0 rounded-full bg-cyan-400" />

                      <span className="text-sm text-slate-200">
                        {condition}
                      </span>
                    </div>
                  ))}

                </div>
              </div>

              {/* =================================================
                  CALL TO ACTION
              ================================================= */}
              <div className="mt-8 rounded-3xl bg-cyan-600 p-6 text-white sm:p-8">
                <h3 className="text-2xl font-extrabold">
                  Need Renal Dialysis Care?
                </h3>

                <p className="mt-3 max-w-2xl leading-7 text-cyan-50">
                  Request an appointment with our renal care team and take the
                  next step towards appropriate kidney care and management.
                </p>

                <a
                  href="#appointment"
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-bold text-cyan-700 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-slate-50"
                >
                  Request Appointment
                </a>
              </div>
            </section>

            {/* =====================================================
                APPOINTMENT FORM
            ===================================================== */}
            <aside
              id="appointment"
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-100">

                {/* Form heading */}
                <div className="bg-slate-900 px-6 py-7 text-white sm:px-7">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                    Book a Visit
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold">
                    Dialysis Request
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Complete the form below and our team will get in touch with
                    you.
                  </p>
                </div>

                {/* Form */}
                <form className="space-y-5 p-6 sm:p-7">

                  {/* Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="fullName"
                      type="text"
                      placeholder="Your full name"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      Gender <span className="text-red-500">*</span>
                    </p>

                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          className="accent-cyan-600"
                        />
                        Male
                      </label>

                      <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          className="accent-cyan-600"
                        />
                        Female
                      </label>
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label
                      htmlFor="dob"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Date of Birth
                    </label>

                    <input
                      id="dob"
                      type="date"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      placeholder="+234 00 0000 0000"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label
                      htmlFor="state"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      State of Residence
                    </label>

                    <input
                      id="state"
                      type="text"
                      placeholder="State"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                    />
                  </div>

                  {/* Consultation */}
                  <div>
                    <label
                      htmlFor="consultation"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Consultation Type{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <select
                      id="consultation"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                    >
                       

                      <option>
                        Select
                      </option>
                      <option value="">
                        
                    Inperson Consultation
                
                      </option>

                      <option>
                        Virtual Consultation
                      </option>

                      
                    </select>
                  </div>

                  {/* Preferred date */}
                  <div>
                    <label
                      htmlFor="preferredDate"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Preferred Consultation Date
                    </label>

                    <input
                      id="preferredDate"
                      type="date"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                    />
                  </div>

                  

                  {/* Risk factors */}
                  <div>
                    <label
                      htmlFor="risk"
                      className="mb-2 block text-sm font-semibold leading-5 text-slate-700"
                    >
                      Do you have any known kidney disease or risk factors?
                    </label>

                    <select
                      id="risk"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                    >
                      <option value="">
                        Select an option
                      </option>

                      <option>
                        Yes
                      </option>

                      <option>
                        No
                      </option>

                      <option>
                        Not Sure
                      </option>
                    </select>
                  </div>

                  {/* How did you hear */}
                  <div>
                    <p className="mb-3 text-sm font-semibold text-slate-700">
                      How did you hear about us?
                    </p>

                    <div className="grid grid-cols-2 gap-2">

                      {[
                        "Google Search",
                        "Facebook",
                        "Instagram",
                        "WhatsApp",
                        "YouTube",
                        "Email",
                        "Friend",
                        "Other",
                      ].map((source) => (
                        <label
                          key={source}
                          className="flex items-center gap-2 text-xs text-slate-600"
                        >
                          <input
                            type="radio"
                            name="source"
                            value={source}
                            className="accent-cyan-600"
                          />

                          {source}
                        </label>
                      ))}

                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Additional Information
                    </label>

                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Tell us anything else we should know..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                    />
                  </div>

                  {/* Newsletter */}
                  <label className="flex items-start gap-3 text-xs leading-5 text-slate-500">
                    <input
                      type="checkbox"
                      className="mt-0.5 accent-cyan-600"
                    />

                    <span>
                      I would like to receive relevant health information and
                      updates.
                    </span>
                  </label>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-cyan-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-cyan-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-700 hover:shadow-xl"
                  >
                    Submit Appointment Request
                  </button>

                  <p className="text-center text-xs leading-5 text-slate-400">
                    Our team will contact you regarding your request.
                  </p>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <Footer />
    </div>
  );
};

export default Renal;